using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Comment : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public Episode Episode { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public double Timestamp { get; set; } // Mốc thời gian trong audio (giây)
}