using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class UserHealthStats : BaseEntity
{
    public Guid UserId { get; set; }
    public double Weight { get; set; }
    public double Height { get; set; }
    public double WaistCircumference { get; set; }
    public double WaistSize { get; set; } // Thêm cái này để lưu 105cm

    public string LiverStatus { get; set; } = "Normal"; // Thêm cái này để lưu "NASH Grade 2"
    public User User { get; set; } = null!;
}