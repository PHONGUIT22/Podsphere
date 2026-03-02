namespace Hearo.Application.Common.Models.Reviews;

public record CreateReviewDto
{
    public Guid TargetId { get; init; } // Có thể là PodcastId hoặc CourseId
    public int Rating { get; init; }    // Từ 1-5
    public string Comment { get; init; } = string.Empty;
}