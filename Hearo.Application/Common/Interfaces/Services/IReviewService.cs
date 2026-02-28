using Hearo.Application.Common.Models.Reviews;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IReviewService
{
    Task<List<ReviewDto>> GetReviewsByPodcastId(Guid podcastId);
    Task<List<ReviewDto>> GetReviewsByCourseId(Guid courseId);
    Task<bool> AddReview(Guid userId, int rating, string comment, Guid? podcastId, Guid? courseId);
}