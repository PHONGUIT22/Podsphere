using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Domain.Entities;
using System.Text.Json;
using System    .Text;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;

namespace Hearo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AstrologyController : ControllerBase
{
    private readonly IAstrologyService _astrologyService;
    private readonly IApplicationDbContext _context;
    // Thay đổi: Sử dụng IHttpClientFactory để gọi CrewAI thay vì IGeminiService trực tiếp
    private readonly IHttpClientFactory _httpClientFactory;

    public AstrologyController(
        IAstrologyService astrologyService, 
        IApplicationDbContext context, 
        IHttpClientFactory httpClientFactory)
    {
        _astrologyService = astrologyService;
        _context = context;
        _httpClientFactory = httpClientFactory;
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
            // 1. Lấy dữ liệu Bát Tự từ Node.js
            var baziJson = await _astrologyService.GetBaziDataAsync(request.BirthDate, request.Hour, request.IsMale);
            if (string.IsNullOrEmpty(baziJson)) 
                return BadRequest(new { status = "error", message = "Không lấy được dữ liệu Bát Tự." });

            string persona = string.IsNullOrEmpty(request.Persona) ? "podcast_host" : request.Persona;

            // 2. GỌI SANG PYTHON CREW-AI SERVICE
            var aiReadingText = await CallCrewAiService(baziJson, persona, "NASH stage 2");
            
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

            // GỌI SANG PYTHON CREW-AI SERVICE
            var aiReadingText = await CallCrewAiService(request.BaziJsonData, request.Persona, "NASH stage 2");
            
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

            // 1. Gọi Node.js Engine để lấy Quẻ Dịch
            var hexagramResultJson = await _astrologyService.CastIChingHexagramAsync(
                request.Year, request.Month, request.Day, request.Hour, request.Topic
            );

            if (string.IsNullOrEmpty(hexagramResultJson))
                return BadRequest(new { message = "Không thể lập quẻ lúc này." });

            // 2. Gọi AI luận giải (Sử dụng service AI tập trung)
            string aiAnalysis = await CallCrewAiIChingService(hexagramResultJson, request.Question);

            // 3. Trích xuất tên Quẻ
            string primaryHexName = "Quẻ Dịch";
            string mutatedHexName = "";
            using (JsonDocument doc = JsonDocument.Parse(hexagramResultJson))
            {
                if (doc.RootElement.TryGetProperty("data", out var dataNode))
                {
                    if (dataNode.TryGetProperty("primary", out var p) && p.TryGetProperty("hexagram", out var ph) && ph.TryGetProperty("name", out var pn))
                        primaryHexName = pn.GetString() ?? "Quẻ Chủ";

                    if (dataNode.TryGetProperty("mutated", out var m) && m.TryGetProperty("hexagram", out var mh) && mh.TryGetProperty("name", out var mn))
                        mutatedHexName = mn.GetString() ?? "Quẻ Biến";
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

    [Authorize]
    [HttpPost("save-bazi")]
    public async Task<IActionResult> SaveBaziProfile([FromBody] CreateProfileRequest request)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var baziJson = await _astrologyService.GetBaziDataAsync(request.BirthDate, request.Hour, request.IsMale);
            if (string.IsNullOrEmpty(baziJson)) 
                return BadRequest(new { message = "Lỗi tính toán lá số." });

            var profile = new AstrologyProfile
            {
                UserId = Guid.Parse(userIdString),
                FullName = request.FullName,
                SolarBirthDate = request.BirthDate,
                BirthTime = new TimeSpan(request.Hour, 0, 0),
                IsMale = request.IsMale,
                IsPrimaryProfile = false,
                BaziChart = new BaziChart { ChartDataJson = baziJson, YearPillar = "", DayMasterStrength = "" }
            };

            _context.AstrologyProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return Ok(new { status = "success", message = "Lưu thành công!", data = JsonSerializer.Deserialize<object>(baziJson) });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }

    // --- HÀM HELPER GỌI PYTHON FASTAPI ---

    private async Task<string> CallCrewAiService(string baziJson, string persona, string healthCondition)
{
    var client = _httpClientFactory.CreateClient("CrewAIClient");
    
    var payload = new {
        bazi_json = baziJson,
        persona = persona,
        health_condition = healthCondition
    };

    var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await client.PostAsync("/api/ai-reading", content);
    
    // Đọc string trước để debug nếu cần
    var responseString = await response.Content.ReadAsStringAsync();
    
    if (!response.IsSuccessStatusCode)
    {
        return $"Lỗi kết nối AI (Http {response.StatusCode}): {responseString}";
    }

    try 
    {
        using var doc = JsonDocument.Parse(responseString);
        var root = doc.RootElement;

        // CÁCH FIX LỖI Dictionary: Kiểm tra xem có key ai_reading không
        if (root.TryGetProperty("ai_reading", out var aiReading))
        {
            return aiReading.GetString() ?? "Không có nội dung trả về.";
        }
        else if (root.TryGetProperty("message", out var message))
        {
            return $"Lỗi từ Python: {message.GetString()}";
        }
        
        return "Lỗi: Cấu trúc JSON trả về không đúng.";
    }
    catch (Exception ex)
    {
        return $"Lỗi Parse JSON: {ex.Message}. Nội dung gốc: {responseString}";
    }
}

    private async Task<string> CallCrewAiIChingService(string hexagramJson, string question)
    {
        var client = _httpClientFactory.CreateClient("CrewAIClient");
        var payload = new { hexagram_data = hexagramJson, question = question };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        
        var response = await client.PostAsync("/api/iching-reading", content);
        if (!response.IsSuccessStatusCode) return "AI hiện đang bận, vui lòng thử lại sau.";

        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);
        return doc.RootElement.GetProperty("ai_reading").GetString() ?? "Không thể luận giải.";
    }
}

// --- DTO RECORDS ---
public record BaziRequest(DateTime BirthDate, int Hour, bool IsMale, string Persona = "traditional");
public record CreateProfileRequest(string FullName, DateTime BirthDate, int Hour, bool IsMale, int ViewYear);
public record AiReadingRequest(string BaziJsonData, string Persona);
public record CastIChingRequest(string Question, string Topic, int Year, int Month, int Day, int Hour, string Method = "MaiHoa");