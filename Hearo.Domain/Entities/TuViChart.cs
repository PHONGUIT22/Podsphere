using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class TuViChart : BaseEntity
{
    public Guid ProfileId { get; set; }
    public AstrologyProfile Profile { get; set; } = null!;

    // Bản mệnh và Cục (VD: Đại Lâm Mộc, Thủy Nhị Cục)
    public string DestinyElement { get; set; } = string.Empty; 
    public string LifePalacePosition { get; set; } = string.Empty; // Mệnh đóng tại cung nào (VD: "Tý", "Ngọ")

    // Các sao thủ Mệnh (Để AI đọc nhanh tính cách. VD: "Tử Vi, Thiên Phủ")
    public string MainStarsInDestiny { get; set; } = string.Empty; 

    // Cột này chứa CỰC KỲ NHIỀU DATA: Mảng 12 cung, mỗi cung chứa List các sao đắc/hãm.
    // Bắt buộc phải lưu JSON string. Frontend gọi cục này ra rồi map vào Grid CSS.
    public string TwelvePalacesJson { get; set; } = string.Empty; 
}