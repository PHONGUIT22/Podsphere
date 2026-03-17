using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hearo.Application.Common.Interfaces.Services;
using System.Security.Claims;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;

    public HistoryController(IHistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpPost("{episodeId}")]
    public async Task<IActionResult> Add(Guid episodeId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _historyService.AddToHistory(userId, episodeId);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var result = await _historyService.GetRecentHistory(userId);
        return Ok(result);
    }
}