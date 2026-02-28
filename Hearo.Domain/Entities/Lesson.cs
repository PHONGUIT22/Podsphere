using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Lesson : BaseEntity
{
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string? VideoUrl { get; set; }
    public string? AudioUrl { get; set; }
    public string? WorkbookUrl { get; set; }
    public int Order { get; set; }
}