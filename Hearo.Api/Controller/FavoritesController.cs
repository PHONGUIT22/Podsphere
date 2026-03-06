using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;
    public FavoritesController(IFavoriteService favoriteService) => _favoriteService = favoriteService;

    [HttpPost("podcast/{id}")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        // Lấy UserId từ JWT Token đã được xác thực
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var result = await _favoriteService.TogglePodcastFavorite(userId, id);
        return Ok(new { message = result });
    }
}