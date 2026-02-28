namespace Hearo.Application.Common.Interfaces.Services; // THÊM DÒNG NÀY

using Hearo.Application.Common.Models.Podcasts;
public interface IPodcastService
{
    Task<List<PodcastDto>> GetRecommendedPodcasts(Guid userId);
}