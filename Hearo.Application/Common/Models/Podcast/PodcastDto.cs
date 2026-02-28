using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Podcasts;

public record PodcastDto : IMapFrom<Podcast>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Thumbnail { get; init; }
    public bool IsPremium { get; init; }
    public string? Tags { get; init; }
    
    public Guid CategoryId { get; init; }
    public string? CategoryName { get; init; } // Tự động map từ Category.Name
}