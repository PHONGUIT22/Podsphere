using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Health;

public record UserHealthStatsDto : IMapFrom<UserHealthStats>
{
    public int MoodScore { get; init; }
    public string StressLevel { get; init; } = "Low";
    public double SleepHours { get; init; }
    public string? Note { get; init; }
    public DateTime UpdatedAt { get; init; }
}