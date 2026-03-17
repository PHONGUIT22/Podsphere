using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Models.Episodes;
using Hearo.Application.Common.Models.Podcasts;
using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class FavoriteService : IFavoriteService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public FavoriteService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // 1. Thả tim nguyên cái Podcast
    public async Task<string> TogglePodcastFavorite(Guid userId, Guid podcastId)
    {
        var favorite = await _context.UserFavoritePodcasts
            .FirstOrDefaultAsync(f => f.UserId == userId && f.PodcastId == podcastId);

        if (favorite != null) {
            _context.UserFavoritePodcasts.Remove(favorite);
            await _context.SaveChangesAsync(default);
            return "Đã xóa khỏi danh sách yêu thích";
        }

        _context.UserFavoritePodcasts.Add(new UserFavoritePodcast { UserId = userId, PodcastId = podcastId });
        await _context.SaveChangesAsync(default);
        return "Đã thêm vào danh sách yêu thích";
    }

    // 2. Thả tim từng tập Episode (Lưu trữ)
    public async Task<string> ToggleEpisodeFavorite(Guid userId, Guid episodeId)
    {
        var favorite = await _context.UserFavoriteEpisodes
            .FirstOrDefaultAsync(f => f.UserId == userId && f.EpisodeId == episodeId);

        if (favorite != null) {
            _context.UserFavoriteEpisodes.Remove(favorite);
            await _context.SaveChangesAsync(default);
            return "Đã xóa tập này khỏi kho lưu trữ";
        }

        // Dùng AddAsync cho nó chuẩn bài async
        await _context.UserFavoriteEpisodes.AddAsync(new UserFavoriteEpisode 
        { 
            UserId = userId, 
            EpisodeId = episodeId 
        });
        
        await _context.SaveChangesAsync(default);
        return "Đã lưu tập này vào thư viện";
    }

    // 3. Lấy danh sách Podcast đã thích
    public async Task<List<PodcastDto>> GetMyFavoritePodcasts(Guid userId)
    {
        var list = await _context.UserFavoritePodcasts
            .Where(x => x.UserId == userId)
            .Select(x => x.Podcast)
            .ToListAsync();
            
        return _mapper.Map<List<PodcastDto>>(list);
    }
    // 4. Lấy danh sách Tập (Episode) đã lưu
    public async Task<List<EpisodeDto>> GetMySavedEpisodes(Guid userId)
    {
        // Nhớ .Include(x => x.Episode) để nó join bảng lấy thông tin chi tiết của tập đó ra nhé
        var list = await _context.UserFavoriteEpisodes
            .Where(x => x.UserId == userId)
            .Include(x => x.Episode) // Bắt buộc phải có Include nếu không data Episode sẽ bị null
            .Select(x => x.Episode)
            .ToListAsync();
            
        return _mapper.Map<List<EpisodeDto>>(list);
    }
}