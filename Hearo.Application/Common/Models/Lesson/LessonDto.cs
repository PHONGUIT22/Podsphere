using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Lessons;

public record LessonDto : IMapFrom<Lesson>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? VideoUrl { get; init; }
    public string? AudioUrl { get; init; }
    public string? WorkbookUrl { get; init; }
    public int Order { get; init; }
    
    public Guid CourseId { get; init; }
    public string? CourseTitle { get; init; } // Tự động map từ Course.Title
}