namespace Hearo.Application.Common.Interfaces.Services;

public interface IGeminiService
{
    Task<string> AnalyzeBaziChartAsync(string baziJsonData, string persona = "traditional");
    Task<string> AnalyzeIChingAsync(string hexagramJson, string question);
}