namespace Hearo.Application.Common.Models.Health;
public record HealthRecommendationDto(
    double Bmi,
    string BmiStatus,
    string LiverWarning,
    List<string> SuggestedPodcastTags,
    string Advice
);