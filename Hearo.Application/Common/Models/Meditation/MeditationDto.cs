using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Meditations;

public record MeditationDto : IMapFrom<Meditation>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string AudioUrl { get; init; } = string.Empty;
    public int Duration { get; init; }
    public string Target { get; init; } = string.Empty; // Ví dụ: "Dễ ngủ", "Giảm stress"
}