namespace Hearo.Application.Common.Models.Health;

public record HealthRecommendationDto(
    int MoodScore,
    string MentalStatus, // Ví dụ: "Đang bất ổn", "Cần thư giãn"
    string StressWarning,
    List<string> SuggestedPodcastTags,
    string Advice
);