using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Podcast : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public bool IsPremium { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string? Tags { get; set; }
    public ICollection<Episode> Episodes { get; set; } = new List<Episode>();
    // Thêm dòng này để Podcast biết nó có nhiều Review
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}