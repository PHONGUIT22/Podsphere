using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
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

    public async Task<List<PodcastDto>> GetMyFavoritePodcasts(Guid userId)
    {
        var list = await _context.UserFavoritePodcasts
            .Where(x => x.UserId == userId)
            .Select(x => x.Podcast)
            .ToListAsync();
        return _mapper.Map<List<PodcastDto>>(list);
    }
}