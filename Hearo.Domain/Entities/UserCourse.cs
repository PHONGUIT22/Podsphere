using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class UserCourse
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    public int ProgressPercent { get; set; } = 0;
}