using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hearo.Application.Common.Interfaces.Services;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IHealthService _healthService;

    public HealthController(IHealthService healthService)
    {
        _healthService = healthService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetMyStats()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var analysis = await _healthService.GetHealthAnalysis(userId);
        return Ok(analysis);
    }

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _healthService.GetHealthAnalysis(userId);
        return Ok(result);
    }

    [HttpPost("stats")]
    public async Task<IActionResult> UpdateStats([FromBody] UpdateStatsRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _healthService.UpdateHealthStats(
            userId, request.MoodScore, request.StressLevel, request.SleepHours, request.Note);
        return result ? Ok() : BadRequest("Không cập nhật được chỉ số mày ơi");
    }

    [HttpGet("journals")]
    public async Task<IActionResult> GetMyJournals()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _healthService.GetUserJournals(userId);
        return Ok(result);
    }

    [HttpPost("journals")]
    public async Task<IActionResult> CreateJournal([FromBody] CreateJournalRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _healthService.AddJournal(userId, request.Title, request.Content, request.Mood);
        return result ? Ok() : BadRequest("Lỗi lưu nhật ký rồi");
    }
    [HttpDelete("journals/{id}")]
    public async Task<IActionResult> DeleteJournal(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _healthService.DeleteJournal(userId, id);
        return result ? Ok("Đã xóa xong!") : NotFound("Không tìm thấy nhật ký mậy ơi");
    }
}

public record UpdateStatsRequest(int MoodScore, string StressLevel, double SleepHours, string? Note);
public record CreateJournalRequest(string Title, string Content, string? Mood);