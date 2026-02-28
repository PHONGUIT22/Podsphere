using Hearo.Application.Common.Models.Journals;
using Hearo.Application.Common.Models.Health;

public interface IHealthService
{
    Task<HealthRecommendationDto> GetHealthAnalysis(Guid userId); // Đã có
    Task<bool> UpdateHealthStats(Guid userId, int moodScore, string stressLevel, double sleepHours, string? note);
    Task<List<UserJournalDto>> GetUserJournals(Guid userId);
    Task<bool> AddJournal(Guid userId, string title, string content, string? mood);
}