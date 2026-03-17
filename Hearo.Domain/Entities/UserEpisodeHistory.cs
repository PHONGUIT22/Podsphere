namespace Hearo.Domain.Entities;

public class UserEpisodeHistory
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid EpisodeId { get; set; }
    public Episode Episode { get; set; } = null!;

    public DateTime PlayedAt { get; set; } // Ngày giờ nghe gần nhất
}