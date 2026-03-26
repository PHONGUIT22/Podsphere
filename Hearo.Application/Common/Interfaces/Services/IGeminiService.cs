namespace Hearo.Application.Common.Interfaces.Services;

public interface IGeminiService
{
    Task<string> AnalyzeBaziChartAsync(string baziJsonData);
}