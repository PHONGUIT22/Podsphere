using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class UserJournal : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Nội dung nhật ký
    public string? Mood { get; set; } // Cảm xúc hôm đó: Vui, buồn, lo âu...
}