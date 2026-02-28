using Hearo.Application.Common.Models.Podcasts;
using Hearo.Application.Common.Models.Episodes;
using Hearo.Application.Common.Models.Categories;
using Hearo.Application.Common.Models.Comments;

public interface IPodcastService
{
    Task<PodcastDto?> GetPodcastDetail(Guid podcastId);
    Task<List<PodcastDto>> GetRecommendedPodcasts(Guid userId);
    Task<List<CategoryDto>> GetAllCategories();
    Task<List<EpisodeDto>> GetEpisodesByPodcastId(Guid podcastId);
    Task<bool> AddComment(Guid userId, Guid episodeId, string content, double timestamp);
}