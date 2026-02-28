using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Review : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public int Rating { get; set; } // 1-5 sao
    public string Comment { get; set; } = string.Empty;
    
    // Review có thể dành cho Podcast hoặc Course
    public Guid? PodcastId { get; set; }
    public Podcast? Podcast { get; set; }
    public Guid? CourseId { get; set; }
    public Course? Course { get; set; }
}