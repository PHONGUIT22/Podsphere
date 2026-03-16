namespace Hearo.Domain.Entities;

public class UserFavoriteEpisode
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid EpisodeId { get; set; }
    public Episode Episode { get; set; } = null!;
}