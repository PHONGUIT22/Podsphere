using System.Text;
using System.Text.Json;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace Hearo.Infrastructure.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] 
                  ?? throw new ArgumentNullException("Thiếu Gemini API Key trong cấu hình.");
    }

    public async Task<string> AnalyzeBaziChartAsync(string baziJsonData)
    {
        // ĐÂY LÀ LINH HỒN CỦA TÍNH NĂNG: Lời nhắc (Prompt)
        string prompt = $@"
Bạn là một bậc thầy về Bát Tự (Tứ Trụ) của phương Đông, có nhiều năm kinh nghiệm luận giải lá số.
Tôi sẽ cung cấp cho bạn dữ liệu Bát Tự của một người dưới dạng JSON. 
Dựa vào dữ liệu này, hãy viết một bài luận giải chi tiết, dễ hiểu, sử dụng ngôn ngữ mạch lạc, có tâm và mang tính chất định hướng tích cực.

Yêu cầu định dạng đầu ra (Dùng Markdown):
1. Phân tích Nhật Chủ (Thân Vượng hay Nhược).
2. Tính cách đặc trưng dựa trên Thập Thần.
3. Sự nghiệp và Tài lộc.
4. Tình duyên và Gia đạo.
5. Lời khuyên tổng quan và Vận hạn sắp tới (Đại vận hiện tại).

Tuyệt đối KHÔNG bịa đặt dữ liệu, chỉ phân tích dựa trên thông tin tôi cung cấp.

DỮ LIỆU BÁT TỰ CỦA ĐƯƠNG SỐ:
{baziJsonData}
";

// Sửa URL trong GeminiService.cs thành:
var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={_apiKey}";
        // Format request body chuẩn của Google Gemini
        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            },
            generationConfig = new
            {
                temperature = 0.7, // Nhiệt độ 0.7 giúp AI sáng tạo nhưng vẫn chuẩn xác
                topK = 40,
                topP = 0.95,
                maxOutputTokens = 2048
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(url, content);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Lỗi gọi Gemini API: {error}");
        }

        var responseString = await response.Content.ReadAsStringAsync();
        
        // Parse JSON trả về để lấy phần Text luận giải
        using var jsonDoc = JsonDocument.Parse(responseString);
        var textContent = jsonDoc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text").GetString();

        return textContent ?? "Không thể phân tích lá số lúc này.";
    }
}