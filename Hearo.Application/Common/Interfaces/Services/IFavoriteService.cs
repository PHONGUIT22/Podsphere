using Hearo.Application.Common.Models.Episodes;
using Hearo.Application.Common.Models.Podcasts;

public interface IFavoriteService
{
    // Toggle Podcast
    Task<string> TogglePodcastFavorite(Guid userId, Guid podcastId);
    Task<List<PodcastDto>> GetMyFavoritePodcasts(Guid userId);

    // Toggle Episode - Chỉ giữ lại 1 cái này thôi mậy!
    Task<string> ToggleEpisodeFavorite(Guid userId, Guid episodeId);
    Task<List<EpisodeDto>> GetMySavedEpisodes(Guid userId);
}