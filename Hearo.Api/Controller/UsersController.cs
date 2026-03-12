using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hearo.Application.Common.Interfaces.Services;
using System.Security.Claims;

namespace Hearo.Api.Controller;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await _userService.GetUserProfile(userId);
        return profile != null ? Ok(profile) : NotFound("Không tìm thấy thông tin mày ơi.");
    }

    [HttpGet("subscription")]
    public async Task<IActionResult> GetSubscription()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var sub = await _userService.GetActiveSubscription(userId);
        return Ok(sub);
    }

    [HttpPost("upgrade")]
    public async Task<IActionResult> Upgrade([FromBody] UpgradeRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _userService.UpgradeToPremium(userId, request.PlanType);
        return result ? Ok("Lên đời Premium thành công rồi nhé!") : BadRequest("Lỗi khi nâng cấp rồi.");
    }
}

public record UpgradeRequest(string PlanType);