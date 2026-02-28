using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Episodes;

public record EpisodeDto : IMapFrom<Episode>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string AudioUrl { get; init; } = string.Empty;
    public int Duration { get; init; }
    public int Order { get; init; }
    public bool IsExclusive { get; init; }
    public Guid PodcastId { get; init; }
}