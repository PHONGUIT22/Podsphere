using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty; // Burnout, Lo âu...
    public string Slug { get; set; } = string.Empty;
    public ICollection<Podcast> Podcasts { get; set; } = new List<Podcast>();
}