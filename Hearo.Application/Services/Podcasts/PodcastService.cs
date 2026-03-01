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
    private readonly IMapper _mapper;

    public PodcastService(IApplicationDbContext context, IHealthService healthService, IMapper mapper)
    {
        _context = context;
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
}