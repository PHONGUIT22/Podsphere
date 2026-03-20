using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class IChingDivination : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Question { get; set; } = string.Empty; // Việc muốn hỏi (VD: "Có nên đổi ngành IT không?")
    public string Method { get; set; } = "MaiHoa"; // MaiHoa (Lấy giờ hiện tại), GieoXu (Lắc điện thoại 6 lần)

    // Lưu ID của Quẻ (Từ 1 đến 64) hoặc Tên Quẻ
    public string OriginalHexagram { get; set; } = string.Empty; // Quẻ Chủ (Cốt lõi vấn đề)
    public string MutatedHexagram { get; set; } = string.Empty;  // Quẻ Biến (Kết quả tương lai)
    public string NuclearHexagram { get; set; } = string.Empty;  // Quẻ Hổ (Nguyên nhân ẩn giấu)

    public string AIAnalysis { get; set; } = string.Empty; // Lời khuyên do AI dịch từ Quẻ + Câu hỏi
}