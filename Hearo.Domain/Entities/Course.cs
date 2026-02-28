using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Course : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public decimal Price { get; set; }
    public decimal SalePrice { get; set; }
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}