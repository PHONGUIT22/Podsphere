using Hearo.Application.Common.Models.Podcasts;

public interface IFavoriteService
{
    // Toggle: Nếu chưa thích thì thêm, thích rồi thì xóa
    Task<string> TogglePodcastFavorite(Guid userId, Guid podcastId);
    Task<List<PodcastDto>> GetMyFavoritePodcasts(Guid userId);
}