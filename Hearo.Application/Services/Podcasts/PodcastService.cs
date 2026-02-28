using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Podcasts;
using Microsoft.EntityFrameworkCore;
using Hearo.Domain.Entities;
namespace Hearo.Application.Services.Podcasts; // THÊM DÒNG NÀY
public class PodcastService : IPodcastService
{
    private readonly IApplicationDbContext _context;
    private readonly IHealthService _healthService;

    public PodcastService(IApplicationDbContext context, IHealthService healthService)
    {
        _context = context;
        _healthService = healthService;
    }

    public async Task<List<PodcastDto>> GetRecommendedPodcasts(Guid userId)
    {
        // 1. Gọi bộ não sức khỏe để lấy các "Tag" gợi ý (ChuaLanh, ThienDinh...)
        var analysis = await _healthService.GetHealthAnalysis(userId);
        var suggestedTags = analysis.SuggestedPodcastTags;

        // 2. Query trong DB những Podcast có chứa các Tag này
        var podcasts = await _context.Podcasts
            .Where(p => suggestedTags.Any(tag => p.Tags != null && p.Tags.Contains(tag)))
            .Select(p => new PodcastDto(p.Id, p.Title, p.Description, p.Tags, p.IsPremium))
            .ToListAsync();

        return podcasts;
    }
}