using Hearo.Application.Common.Models.Podcasts;
using Hearo.Application.Common.Models.Episodes;
using Hearo.Application.Common.Models.Categories;
using Hearo.Application.Common.Models.Comments;

public interface IPodcastService
{
    Task<Guid> CreatePodcast(PodcastDto podcastDto);
    Task<bool> UpdatePodcast(Guid id, PodcastDto podcastDto);
    Task<bool> DeletePodcast(Guid id);
    Task<List<CommentDto>> GetCommentsByEpisodeId(Guid episodeId);
    Task<PodcastDto?> GetPodcastDetail(Guid podcastId);
    Task<List<PodcastDto>> GetRecommendedPodcasts(Guid userId);
    Task<List<CategoryDto>> GetAllCategories();
    Task<List<EpisodeDto>> GetEpisodesByPodcastId(Guid podcastId);
// Hearo.Application/Common/Interfaces/Services/IPodcastService.cs
    // Hearo.Application/Common/Interfaces/Services/IPodcastService.cs

    Task<bool> AddComment(Guid userId, Guid episodeId, string content, double timestamp);
    Task<Guid> CreateEpisodeWithFile(Guid podcastId, EpisodeDto episodeDto, Stream fileStream, string contentType);
    // Thêm dòng này vào IPodcastService.cs
    Task<IEnumerable<PodcastDto>> GetAllPodcasts();
}