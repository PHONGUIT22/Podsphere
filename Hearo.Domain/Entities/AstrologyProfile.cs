using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class AstrologyProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string FullName { get; set; } = string.Empty;
    
    // Giới tính cực kỳ quan trọng trong Tử vi (Âm Nam, Dương Nữ an sao ngược nhau)
    public bool IsMale { get; set; } 
    
    // Lưu ngày giờ sinh Dương lịch (Hệ thống sẽ tự convert sang Âm lịch sau)
    public DateTime SolarBirthDate { get; set; } 
    public TimeSpan BirthTime { get; set; } 

    // Đánh dấu đây là hồ sơ của "Chính mình" hay "Người khác"
    public bool IsPrimaryProfile { get; set; } = false;

    // 1 Profile sẽ có 1 lá số Tử Vi và 1 lá số Bát Tự đi kèm
    public TuViChart? TuViChart { get; set; }
    public BaziChart? BaziChart { get; set; }
}