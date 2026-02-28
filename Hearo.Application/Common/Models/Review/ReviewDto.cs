using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Reviews;

public record ReviewDto : IMapFrom<Review>
{
    public Guid Id { get; init; }
    public int Rating { get; init; }
    public string Comment { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }

    public Guid UserId { get; init; }
    public string? UserUsername { get; init; } // Map từ User.Username
    
    public Guid? PodcastId { get; init; }
    public string? PodcastTitle { get; init; } // Map từ Podcast.Title
    
    public Guid? CourseId { get; init; }
    public string? CourseTitle { get; init; } // Map từ Course.Title
}