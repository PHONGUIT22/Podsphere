using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Courses;

public record CourseDto : IMapFrom<Course>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Thumbnail { get; init; }
    public decimal Price { get; init; }
    public decimal SalePrice { get; init; }
}