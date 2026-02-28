using Hearo.Application.Common.Models.Health;
public interface IHealthService
{
    Task<HealthRecommendationDto> GetHealthAnalysis(Guid userId);
}