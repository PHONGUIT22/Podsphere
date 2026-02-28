using Hearo.Application.Common.Interfaces.Authentication;
using Hearo.Application.Common.Models.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace Hearo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _authService.Login(request);
        return Ok(response);
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        return Ok(await _authService.Register(request));
    }
    // TEST PHÂN QUYỀN ADMIN
    [Authorize(Roles = "Admin")]
    [HttpGet("admin-only")]
    public IActionResult GetAdminSecret()
    {
        return Ok("Chao Admin UIT! May da vao duoc vung cam.");
        
    }
    [Authorize(Roles = "Admin")] // CHỈ ADMIN MỚI ĐƯỢC NÂNG CẤP ROLE
    [HttpPut("update-role")]
    public async Task<IActionResult> UpdateRole(Guid userId, string newRole)
    {
        var result = await _authService.UpdateUserRole(userId, newRole);
        return result ? Ok("Da nang cap Role thanh cong!") : BadRequest("Khong tim thay thang User nay.");
    }
}