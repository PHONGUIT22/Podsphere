using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Podcasts;
using Microsoft.EntityFrameworkCore;
using Hearo.Domain.Entities;

// THÊM 3 DÒNG NÀY VÀO:
using Hearo.Application.Common.Models.Episodes;
using Hearo.Application.Common.Models.Categories;
using Hearo.Application.Common.Models.Comments;
using AutoMapper;
namespace Hearo.Application.Services.Podcasts; // THÊM DÒNG NÀY
public class PodcastService : IPodcastService
{
    private readonly IApplicationDbContext _context;
    private readonly IHealthService _healthService;
    private readonly IFileStorageService _fileStorage;
    private readonly IMapper _mapper;

    public PodcastService(IApplicationDbContext context, IFileStorageService fileStorage, IHealthService healthService, IMapper mapper)
    {
        _context = context;
        _fileStorage = fileStorage;
        _healthService = healthService;
        _mapper = mapper;
    }

    public async Task<List<PodcastDto>> GetRecommendedPodcasts(Guid userId)
    {
        var analysis = await _healthService.GetHealthAnalysis(userId);
        var suggestedTags = analysis.SuggestedPodcastTags;

        var podcasts = await _context.Podcasts
            .Where(p => suggestedTags.Any(tag => p.Tags != null && p.Tags.Contains(tag)))
            .ToListAsync();

        // Senior chỉ dùng đúng 1 dòng này để trả về dữ liệu
        return _mapper.Map<List<PodcastDto>>(podcasts);
    }
    // Thêm vào trong class PodcastService
    public async Task<List<CategoryDto>> GetAllCategories()
    {
        var categories = await _context.Categories.ToListAsync();
        return _mapper.Map<List<CategoryDto>>(categories);
    }

    public async Task<List<EpisodeDto>> GetEpisodesByPodcastId(Guid podcastId)
    {
        var episodes = await _context.Episodes.Where(e => e.PodcastId == podcastId).ToListAsync();
        return _mapper.Map<List<EpisodeDto>>(episodes);
    }

    public async Task<bool> AddComment(Guid userId, Guid episodeId, string content, double timestamp)
    {
        var comment = new Comment { 
            UserId = userId, 
            EpisodeId = episodeId, 
            Content = content, 
            Timestamp = timestamp 
        };
        _context.Comments.Add(comment);
        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<PodcastDto?> GetPodcastDetail(Guid podcastId)
    {
        var podcast = await _context.Podcasts
            .Include(p => p.Episodes)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == podcastId);
            
        return _mapper.Map<PodcastDto>(podcast);
    }
    // Thêm các hàm này vào trong class PodcastService
    public async Task<Guid> CreatePodcast(PodcastDto podcastDto)
    {
        var podcast = _mapper.Map<Podcast>(podcastDto);
        _context.Podcasts.Add(podcast);
        await _context.SaveChangesAsync(default);
        return podcast.Id;
    }

    public async Task<bool> UpdatePodcast(Guid id, PodcastDto podcastDto)
    {
        var podcast = await _context.Podcasts.FindAsync(id);
        if (podcast == null) return false;

        // Map dữ liệu mới đè lên cái cũ
        _mapper.Map(podcastDto, podcast);
        return await _context.SaveChangesAsync(default) > 0;
    }

    public async Task<bool> DeletePodcast(Guid id)
    {
        var podcast = await _context.Podcasts.FindAsync(id);
        if (podcast == null) return false;

        _context.Podcasts.Remove(podcast);
        return await _context.SaveChangesAsync(default) > 0;
    }

    public async Task<List<CommentDto>> GetCommentsByEpisodeId(Guid episodeId)
    {
        var comments = await _context.Comments
            .Include(c => c.User) // Để biết ai comment
            .Where(c => c.EpisodeId == episodeId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return _mapper.Map<List<CommentDto>>(comments);
    }
    public async Task<Guid> CreateEpisodeWithFile(Guid podcastId, EpisodeDto episodeDto, Stream fileStream, string contentType)
        {
            // 1. Tạo tên file duy nhất để không bị đè trên S3
            var fileName = $"episodes/{podcastId}/{Guid.NewGuid()}_{episodeDto.Title}.mp3";

            // 2. Gọi con S3 đã dki ở Program.cs để upload
            var audioUrl = await _fileStorage.UploadFileAsync(fileStream, fileName, contentType);

            // 3. Map DTO sang Entity và gán cái URL "xịn" vừa lấy được
            var episode = _mapper.Map<Episode>(episodeDto);
            episode.PodcastId = podcastId;
            episode.AudioUrl = audioUrl; // Ghi đè cái URL từ S3 vào đây

            _context.Episodes.Add(episode);
            await _context.SaveChangesAsync();
            
            return episode.Id;
        }
    }