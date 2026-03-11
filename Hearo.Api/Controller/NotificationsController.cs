using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hearo.Application.Common.Interfaces.Services;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notiService;

    public NotificationsController(INotificationService notiService)
    {
        _notiService = notiService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _notiService.GetUserNotifications(userId));
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var result = await _notiService.MarkAsRead(id);
        return result ? Ok() : NotFound();
    }
}