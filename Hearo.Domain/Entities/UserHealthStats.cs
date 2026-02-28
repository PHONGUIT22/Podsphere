using Hearo.Domain.Common;
namespace Hearo.Domain.Entities;

public class UserHealthStats : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int MoodScore { get; set; } // Thang điểm 1-10 (1: Rất tệ, 10: Tuyệt vời)
    public string StressLevel { get; set; } = "Low"; // Low, Medium, High
    public double SleepHours { get; set; } // Số giờ ngủ trung bình
    public string? Note { get; set; } // Ghi chú cảm xúc của mày
    
    public DateTime UpdatedAt { get; set; }
}