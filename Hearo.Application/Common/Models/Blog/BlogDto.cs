using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Blogs;

public record BlogDto : IMapFrom<Blog>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Thumbnail { get; init; }
    public string Slug { get; init; } = string.Empty;
    public Guid AuthorId { get; init; }
    
    // AutoMapper sẽ tự hiểu lấy Author.FullName gán vào đây
    public string? AuthorFullName { get; init; } 
}