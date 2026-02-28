using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Episode : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string AudioUrl { get; set; } = string.Empty;
    public int Duration { get; set; } // Giây
    public int Order { get; set; }
    public bool IsExclusive { get; set; }
    public Guid PodcastId { get; set; }
    public Podcast Podcast { get; set; } = null!;
}