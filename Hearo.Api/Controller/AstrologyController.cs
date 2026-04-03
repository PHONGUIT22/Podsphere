using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Domain.Entities;
using System.Text.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

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
        var jsonData = await _astrologyService.GetAstrologyDataAsync(
            request.BirthDate, request.Hour, request.IsMale, request.ViewYear);

        if (string.IsNullOrEmpty(jsonData)) 
            return BadRequest(new { message = "Lỗi tính toán lá số từ Server xử lý." });

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

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
            data = JsonSerializer.Deserialize<object>(jsonData),
            viewYear = request.ViewYear 
        });
    }

    [HttpPost("get-bazi-with-ai-reading")]
    public async Task<IActionResult> GetBaziWithAiReading([FromBody] BaziRequest request)
    {
        try 
        {
            var baziJson = await _astrologyService.GetBaziDataAsync(request.BirthDate, request.Hour, request.IsMale);
            if (string.IsNullOrEmpty(baziJson)) 
                return BadRequest(new { status = "error", message = "Không lấy được dữ liệu Bát Tự." });

            string persona = string.IsNullOrEmpty(request.Persona) ? "traditional" : request.Persona;
            var aiReadingText = await _geminiService.AnalyzeBaziChartAsync(baziJson, persona);
            
            return Ok(new {
                status = "success",
                chartData = JsonSerializer.Deserialize<object>(baziJson),
                aiReading = aiReadingText,
                personaUsed = persona
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = $"Lỗi hệ thống: {ex.Message}" });
        }
    }

    [HttpPost("generate-ai-reading")]
    public async Task<IActionResult> GenerateAiReading([FromBody] AiReadingRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.BaziJsonData))
                return BadRequest(new { message = "Dữ liệu Bát Tự không được để trống." });

            var aiReadingText = await _geminiService.AnalyzeBaziChartAsync(request.BaziJsonData, request.Persona);
            
            return Ok(new { status = "success", aiReading = aiReadingText, persona = request.Persona });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("cast-iching")]
    public async Task<IActionResult> CastIChing([FromBody] CastIChingRequest request)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
            var userId = Guid.Parse(userIdString);

            // 1. Gọi Node.js Engine để lấy Quẻ Dịch (Truyền Năm, Tháng, Ngày, Giờ)
            var hexagramResultJson = await _astrologyService.CastIChingHexagramAsync(
                request.Year, 
                request.Month, 
                request.Day, 
                request.Hour, 
                request.Topic
            );

            if (string.IsNullOrEmpty(hexagramResultJson))
                return BadRequest(new { message = "Không thể lập quẻ lúc này. Server thuật số có thể đang bận." });

            // 2. Gọi AI Gemini luận giải Quẻ
            string aiAnalysis = await _geminiService.AnalyzeIChingAsync(hexagramResultJson, request.Question);

            // 3. Trích xuất tên Quẻ Chủ & Quẻ Biến để lưu Database
            string primaryHexName = "Quẻ Dịch";
            string mutatedHexName = "";
            
            using (JsonDocument doc = JsonDocument.Parse(hexagramResultJson))
            {
                if (doc.RootElement.TryGetProperty("data", out var dataNode))
                {
                    if (dataNode.TryGetProperty("primary", out var primaryNode) && 
                        primaryNode.TryGetProperty("hexagram", out var p_hex) && 
                        p_hex.TryGetProperty("name", out var p_name))
                    {
                        primaryHexName = p_name.GetString() ?? "Quẻ Chủ";
                    }

                    if (dataNode.TryGetProperty("mutated", out var mutNode) && 
                        mutNode.TryGetProperty("hexagram", out var m_hex) && 
                        m_hex.TryGetProperty("name", out var m_name))
                    {
                        mutatedHexName = m_name.GetString() ?? "Quẻ Biến";
                    }
                }
            }

            // 4. Lưu Database
            var divinationHistory = new IChingDivination
            {
                UserId = userId,
                Question = request.Question,
                Method = request.Method,
                OriginalHexagram = primaryHexName,
                MutatedHexagram = mutatedHexName, 
                AIAnalysis = aiAnalysis
            };

            _context.IChingDivinations.Add(divinationHistory);
            await _context.SaveChangesAsync();

            // 5. Trả kết quả về Frontend
            return Ok(new {
                status = "success",
                hexagramData = JsonSerializer.Deserialize<object>(hexagramResultJson),
                aiReading = aiAnalysis
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = $"Lỗi Gieo Quẻ: {ex.Message}" });
        }
    }
    [Authorize] // Bắt buộc user phải đăng nhập mới được lưu lá số
    [HttpPost("save-bazi")]
    public async Task<IActionResult> SaveBaziProfile([FromBody] CreateProfileRequest request)
    {
        try
        {
            // 1. Lấy ID của User đang đăng nhập
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            // 2. Gọi sang Node.js để tính toán Bát Tự
            var baziJson = await _astrologyService.GetBaziDataAsync(request.BirthDate, request.Hour, request.IsMale);
            if (string.IsNullOrEmpty(baziJson)) 
                return BadRequest(new { message = "Lỗi tính toán lá số từ Server thuật số." });

            // 3. Tạo Hồ sơ mới (Profile)
            var profile = new AstrologyProfile
            {
                UserId = Guid.Parse(userIdString),
                FullName = request.FullName,
                SolarBirthDate = request.BirthDate,
                BirthTime = new TimeSpan(request.Hour, 0, 0),
                IsMale = request.IsMale,
                IsPrimaryProfile = false, // Có thể cho user chọn đây là lá số của bản thân hay người thân
            };

            // 4. Tạo Bảng Bát Tự đính kèm vào Hồ sơ
            profile.BaziChart = new BaziChart 
            { 
                ChartDataJson = baziJson, // Cực kỳ quan trọng: Lưu toàn bộ JSON lá số để sau này vẽ lại UI
                
                // Bạn có thể parse baziJson ở đây để bóc tách YearPillar, DayMaster... lưu vào các cột tương ứng nếu muốn sau này dùng LINQ query tìm kiếm người cùng ngày sinh.
                // Ví dụ tạm để trống hoặc gán giá trị mặc định.
                YearPillar = "", 
                DayMasterStrength = "" 
            };

            // 5. Lưu vào SQL Server Database
            _context.AstrologyProfiles.Add(profile);
            await _context.SaveChangesAsync();

            // 6. Trả dữ liệu về cho React hiển thị
            return Ok(new { 
                status = "success",
                message = "Lập và lưu lá số thành công!", 
                data = JsonSerializer.Deserialize<object>(baziJson)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = $"Lỗi hệ thống: {ex.Message}" });
        }
    }
}

// --- DTO RECORDS (Nằm ngoài class) ---

public record BaziRequest(DateTime BirthDate, int Hour, bool IsMale, string Persona = "traditional");
public record CreateProfileRequest(string FullName, DateTime BirthDate, int Hour, bool IsMale, int ViewYear);
public record AiReadingRequest(string BaziJsonData, string Persona);

// ĐÃ SỬA: Đổi TimeGan/TimeZhi thành Year/Month/Day/Hour
public record CastIChingRequest(
    string Question, 
    string Topic, 
    int Year, 
    int Month, 
    int Day, 
    int Hour, 
    string Method = "MaiHoa");