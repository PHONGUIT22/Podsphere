using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Blog : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Chứa HTML hoặc Markdown
    public string? Thumbnail { get; set; }
    public string Slug { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;
}