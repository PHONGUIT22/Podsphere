using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class BaziChart : BaseEntity
{
    public Guid ProfileId { get; set; }
    public AstrologyProfile Profile { get; set; } = null!;

    // Tứ trụ (Ví dụ: Năm Canh Tý, Tháng Nhâm Tuất...)
    public string YearPillar { get; set; } = string.Empty;
    public string MonthPillar { get; set; } = string.Empty;
    public string DayPillar { get; set; } = string.Empty;
    public string HourPillar { get; set; } = string.Empty;

    // CÁC CỘT CORE PHỤC VỤ AI GỢI Ý (Rất quan trọng)
    public string FavorableElements { get; set; } = string.Empty; // Dụng thần (Ví dụ: "Thủy, Mộc")
    public string MissingElements { get; set; } = string.Empty;   // Khuyết hành (Ví dụ: "Hỏa")
    public string DayMasterStrength { get; set; } = string.Empty; // Thân Nhược / Thân Vượng

    // Cột lưu trữ toàn bộ data chi tiết (Thần sát, Đại vận) để Frontend vẽ UI
    public string ChartDataJson { get; set; } = string.Empty; 
}