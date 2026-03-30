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
    private readonly IGeminiService _geminiService;

    public AstrologyController(IAstrologyService astrologyService, IApplicationDbContext context, IGeminiService geminiService)
    {
        _astrologyService = astrologyService;
        _context = context;
        _geminiService = geminiService;
    }

    [Authorize]
    [HttpPost("create-profile")]
    public async Task<IActionResult> CreateProfile([FromBody] CreateProfileRequest request)
    {
        // 1. Gọi sang NodeJS/Python lấy dữ liệu lá số
        var jsonData = await _astrologyService.GetAstrologyDataAsync(
            request.BirthDate, 
            request.Hour, 
            request.IsMale, 
            request.ViewYear);

        if (string.IsNullOrEmpty(jsonData)) 
            return BadRequest(new { message = "Lỗi tính toán lá số từ Server xử lý." });

        // 2. Lấy UserId từ Token
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

        // 3. Tạo Entity để lưu vào Database
        var profile = new AstrologyProfile
        {
            UserId = Guid.Parse(userIdString),
            FullName = request.FullName,
            SolarBirthDate = request.BirthDate,
            BirthTime = new TimeSpan(request.Hour, 0, 0),
            IsMale = request.IsMale,
            BaziChart = new BaziChart { ChartDataJson = jsonData } 
        };

        _context.AstrologyProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return Ok(new { 
            message = "Lập lá số thành công!", 
            data = jsonData,
            viewYear = request.ViewYear 
        });
    }

    /// <summary>
    /// Lấy dữ liệu Bát Tự kèm theo lời luận giải của AI (Tùy chọn Persona)
    /// </summary>
    [HttpPost("get-bazi-with-ai-reading")]
    public async Task<IActionResult> GetBaziWithAiReading([FromBody] BaziRequest request)
    {
        try 
        {
            // 1. Lấy dữ liệu thô từ Core Engine
            var baziJson = await _astrologyService.GetBaziDataAsync(request.BirthDate, request.Hour, request.IsMale);
            
            if (string.IsNullOrEmpty(baziJson)) 
                return BadRequest(new { status = "error", message = "Không lấy được dữ liệu Bát Tự." });

            // 2. Gọi AI luận giải với Persona (Mặc định là traditional nếu không truyền)
            string persona = string.IsNullOrEmpty(request.Persona) ? "traditional" : request.Persona;
            var aiReadingText = await _geminiService.AnalyzeBaziChartAsync(baziJson, persona);
            
            var baziDataObject = System.Text.Json.JsonSerializer.Deserialize<object>(baziJson);

            return Ok(new {
                status = "success",
                chartData = baziDataObject,
                aiReading = aiReadingText,
                personaUsed = persona
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                status = "error", 
                message = $"Lỗi hệ thống: {ex.Message}" 
            });
        }
    }

    /// <summary>
    /// Chỉ luận giải AI dựa trên dữ liệu JSON có sẵn (Dùng khi đổi Persona mà không muốn gọi lại Core Engine)
    /// </summary>
    [HttpPost("generate-ai-reading")]
    public async Task<IActionResult> GenerateAiReading([FromBody] AiReadingRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.BaziJsonData))
                return BadRequest(new { message = "Dữ liệu Bát Tự không được để trống." });

            var aiReadingText = await _geminiService.AnalyzeBaziChartAsync(request.BaziJsonData, request.Persona);
            
            return Ok(new { 
                status = "success", 
                aiReading = aiReadingText,
                persona = request.Persona 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }
}

// --- DTO RECORDS ---

public record BaziRequest(
    DateTime BirthDate, 
    int Hour, 
    bool IsMale, 
    string Persona = "traditional"); // Thêm Persona vào request này

public record CreateProfileRequest(
    string FullName, 
    DateTime BirthDate, 
    int Hour, 
    bool IsMale, 
    int ViewYear);

public record AiReadingRequest(
    string BaziJsonData, 
    string Persona);