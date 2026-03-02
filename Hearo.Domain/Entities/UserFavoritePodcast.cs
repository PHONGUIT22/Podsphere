namespace Hearo.Domain.Entities;

public class UserFavoritePodcast
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid PodcastId { get; set; }
    public Podcast Podcast { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}