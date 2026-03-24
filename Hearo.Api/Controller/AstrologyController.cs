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
    private readonly IApplicationDbContext _context;

    public AstrologyController(IAstrologyService astrologyService, IApplicationDbContext context)
    {
        _astrologyService = astrologyService;
        _context = context;
    }

    [Authorize]
    [HttpPost("create-profile")]
    public async Task<IActionResult> CreateProfile([FromBody] CreateProfileRequest request)
    {
        // 1. Gọi sang NodeJS lấy dữ liệu Tử vi
        // TRUYỀN THÊM: request.ViewYear để NodeJS/Python biết năm nào mà an Sao Lưu
        var jsonData = await _astrologyService.GetAstrologyDataAsync(
            request.BirthDate, 
            request.Hour, 
            request.IsMale, 
            request.ViewYear); // Đã sửa tham số cuối

        if (string.IsNullOrEmpty(jsonData)) 
            return BadRequest("Lỗi tính toán lá số rồi mậy, check lại Server Python/NodeJS!");

        // 2. Tạo Entity để lưu vào SQL Server
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

        var profile = new AstrologyProfile
        {
            UserId = Guid.Parse(userIdString),
            FullName = request.FullName,
            SolarBirthDate = request.BirthDate,
            BirthTime = new TimeSpan(request.Hour, 0, 0),
            IsMale = request.IsMale,
            // Lưu ý: ViewYear này dùng để tính toán sao lưu lúc này, 
            // cục JSON trả về đã bao gồm các sao lưu của năm đó.
            BaziChart = new BaziChart { ChartDataJson = jsonData } 
        };

        _context.AstrologyProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return Ok(new { 
            message = "Lập lá số thành công!", 
            data = jsonData,
            viewYear = request.ViewYear // Trả về để Frontend biết đang xem năm nào
        });
    }
    [HttpPost("get-bazi-only")]
    public async Task<IActionResult> GetBaziOnly([FromBody] BaziRequest request)
    {
        var jsonData = await _astrologyService.GetBaziDataAsync(request.BirthDate, request.Hour, request.IsMale);
        
        if (string.IsNullOrEmpty(jsonData)) return BadRequest("Không lấy được dữ liệu Bát Tự");

        return Ok(jsonData); // Trả về JSON từ Node.js
    }

}
public record BaziRequest(DateTime BirthDate, int Hour, bool IsMale);

public record CreateProfileRequest(
    string FullName, 
    DateTime BirthDate, 
    int Hour, 
    bool IsMale, 
    int ViewYear);