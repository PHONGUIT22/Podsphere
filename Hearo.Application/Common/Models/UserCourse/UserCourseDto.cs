using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.UserCourses;

public record UserCourseDto : IMapFrom<UserCourse>
{
    public Guid UserId { get; init; }
    public Guid CourseId { get; init; }
    public string? CourseTitle { get; init; } // Map từ Course.Title
    public DateTime PurchaseDate { get; init; }
    public int ProgressPercent { get; init; }
}