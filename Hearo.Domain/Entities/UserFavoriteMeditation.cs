namespace Hearo.Domain.Entities;

public class UserFavoriteMeditation
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid MeditationId { get; set; }
    public Meditation Meditation { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}