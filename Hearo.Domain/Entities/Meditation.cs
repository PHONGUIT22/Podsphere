using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Meditation : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string AudioUrl { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty; // Cần ảnh nền đẹp
    public int Duration { get; set; } // Giây
    public string Target { get; set; } = string.Empty; // "Ngủ ngon", "Tập trung", "Giảm stress"
    public string Description { get; set; } = string.Empty; // Mô tả ngắn để user biết bài này làm gì
}