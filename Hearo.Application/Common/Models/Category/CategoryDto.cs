using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Categories;

public record CategoryDto : IMapFrom<Category>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}