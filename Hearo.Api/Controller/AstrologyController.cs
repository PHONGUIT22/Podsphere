
using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Domain.Entities;

namespace Hearo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AstrologyController : ControllerBase
{
    private readonly IAstrologyService _astrologyService;
    private readonly IApplicationDbContext _context; // Để lưu vào DB luôn

    public AstrologyController(IAstrologyService astrologyService, IApplicationDbContext context)
    {
        _astrologyService = astrologyService;
        _context = context;
    }
    [Authorize]
    [HttpPost("create-profile")]
    public async Task<IActionResult> CreateProfile([FromBody] CreateProfileRequest request)
    {
        // 1. Gọi sang NodeJS lấy dữ liệu Bát tự/Tử vi
        var jsonData = await _astrologyService.GetAstrologyDataAsync(request.BirthDate, request.Hour);

        if (string.IsNullOrEmpty(jsonData)) return BadRequest("Lỗi tính toán rồi mậy!");

        // 2. Tạo Entity để lưu vào SQL Server (Dựa trên mấy cái bảng tao chỉ m làm ở Giai đoạn 1)
        var profile = new AstrologyProfile
        {
            UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!), // ID thằng đang đăng nhập
            FullName = request.FullName,
            SolarBirthDate = request.BirthDate,
            BirthTime = new TimeSpan(request.Hour, 0, 0),
            IsMale = request.IsMale,
            // Quan trọng nhất: Lưu cục JSON khổng lồ vào đây
            BaziChart = new BaziChart { ChartDataJson = jsonData } 
        };

        _context.AstrologyProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Lập lá số thành công!", data = jsonData });
    }
}

public record CreateProfileRequest(string FullName, DateTime BirthDate, int Hour, bool IsMale);