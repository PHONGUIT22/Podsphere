using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Meditation : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string AudioUrl { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string Target { get; set; } = string.Empty; // Dễ ngủ, Giảm stress
}