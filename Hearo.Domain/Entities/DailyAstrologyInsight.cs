using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class DailyAstrologyInsight : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime TargetDate { get; set; } // Lời khuyên cho ngày nào
    public string DailyEnergy { get; set; } = string.Empty; // Can Chi ngày (VD: Bính Ngọ - Lửa phừng phực)

    // Lời khuyên mix từ: Lá số User + Can chi ngày hôm nay + Stress hiện tại của user
    public string InsightMessage { get; set; } = string.Empty; 

    // Gắn liền với 1 Podcast hoặc 1 bài Thiền để User bấm "Nghe giải hạn ngay"
    public Guid? RecommendedPodcastId { get; set; }
    public Podcast? RecommendedPodcast { get; set; }

    public Guid? RecommendedMeditationId { get; set; }
    public Meditation? RecommendedMeditation { get; set; }

    public bool IsRead { get; set; } = false;
}