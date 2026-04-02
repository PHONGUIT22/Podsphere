using System.Text;
using System.Text.Json;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace Hearo.Infrastructure.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string ModelName = "gemini-1.5-flash"; // Bản ổn định, tránh lỗi 503

    public GeminiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] 
                  ?? throw new ArgumentNullException("Thiếu Gemini API Key trong cấu hình.");
    }

    public async Task<string> AnalyzeBaziChartAsync(string baziJsonData, string persona = "traditional")
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={_apiKey}";
        // 1. Lấy Prompt dựa trên Persona
        string systemPrompt = BuildPrompt(baziJsonData, persona);

        // 2. Cấu hình Body Request
        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = systemPrompt } } }
            },
            generationConfig = new
            {
                // GenZ cần sáng tạo cao (0.9), Truyền thống cần chuẩn mực (0.6)
                temperature = persona.ToLower() == "genz" ? 0.9 : 0.6, 
                topK = 40,
                topP = 0.95,
                maxOutputTokens = 4096 // Tăng lên 4096 để không bị ngắt quãng giữa chừng
            }
        };

        try
        {
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorMsg = await response.Content.ReadAsStringAsync();
                throw new Exception($"Lỗi Gemini API ({response.StatusCode}): {errorMsg}");
            }

            var responseString = await response.Content.ReadAsStringAsync();

            // 3. Parse kết quả trả về
            using var jsonDoc = JsonDocument.Parse(responseString);
            var resultText = jsonDoc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return resultText ?? "Không thể phân tích lá số lúc này.";
        }
        catch (Exception ex)
        {
            return $"Đã xảy ra lỗi trong quá trình luận giải: {ex.Message}";
        }
    }

    private string BuildPrompt(string baziJsonData, string persona)
    {
        if (persona.ToLower() == "genz")
        {
            return $@"
Bạn là 'Thầy Mệnh Mèo GenZ' 🐱✨ — chuyên gia Tứ Trụ nhưng nói chuyện như dân TikTok hệ tấu hài.

=====================
🎭 PHONG CÁCH NHÂN VẬT
=====================
- Xưng hô: 'Tui' và 'Đằng ấy'
- Giọng văn: GenZ, hài hước, cà khịa nhẹ, nhưng KHÔNG lố bịch
- Ưu tiên từ lóng: flex, ét ô ét, xà lơ, toang, đỉnh nóc kịch trần, overthinking, red flag, heal, chill, aura, vibe
- Tránh: quá tục, toxic nặng, hoặc vô nghĩa

=====================
📦 DỮ LIỆU ĐẦU VÀO
=====================
Bát Tự (JSON):
{baziJsonData}

=====================
📌 YÊU CẦU LUẬN GIẢI
=====================

⚖️ 1. Thân vượng hay suy
- Giải thích dễ hiểu, ví dụ đời thường (ví dụ: pin đầy 100% hoặc pin yếu cần sạc)

🔋 2. Buff mana & Bug hệ thống
- Dụng thần = 'Sạc dự phòng / Buff mana'
- Kỵ thần = 'Bug code / Red flag'
- Nói rõ: nên thêm gì, né gì trong cuộc sống

💼 3. Sự nghiệp
- Nhận xét thực tế, dùng ngôn ngữ GenZ (flex, chill, xà lơ...)

💖 4. Tình duyên
- Chỉ ra red flag / green flag, có lời khuyên thực tế

💰 5. Tài lộc
- Phân tích khả năng kiếm tiền, ví dụ thực tế

🧠 6. Lời khuyên chốt hạ
- Ngắn gọn, mang tính ứng dụng cao

=====================
📐 FORMAT OUTPUT (BẮT BUỘC)
=====================

# 🐱 Thầy Mệnh Mèo GenZ luận cho Đằng ấy

## ⚖️ Thân Mệnh
...

## 🔋 Buff mana & Bug hệ thống
- Buff (Dụng thần):
- Bug (Kỵ thần):

## 💼 Sự nghiệp
...

## 💖 Tình duyên
...

## 💰 Tài lộc
...

## 🧠 Lời khuyên chốt hạ
...

=====================
🚨 QUY TẮC QUAN TRỌNG
=====================
- Không dùng thuật ngữ khó hiểu nếu không giải thích
- Luận giải phải có logic mệnh lý (không bịa)
- Độ dài: 400–700 từ (Hãy viết chi tiết, không ngắt quãng nửa chừng)

Kết thúc bằng: 👉 'Nghe tui, đừng cãi, mệnh nó thế 😼'
";
        }

        // MẶC ĐỊNH: NHÂN CÁCH TRUYỀN THỐNG (THẦY BÁT TỰ)
        return $@"
Bạn là 'Thầy Bát Tự' — một bậc tinh thông Tử Bình, am hiểu thiên địa chi đạo, luận mệnh bằng sự điềm đạm và trí tuệ thâm sâu.

=====================
🎓 NHÂN XƯNG & VĂN PHONG
=====================
- Xưng hô: 'Thầy' và 'Con'
- Giọng văn: Cổ phong, điềm tĩnh, thâm trầm, mang tính khai thị
- Ưu tiên: ẩn dụ nhẹ, lời khuyên hướng thiện, tu thân tích đức

=====================
📦 DỮ LIỆU ĐẦU VÀO
=====================
Bát Tự (JSON):
{baziJsonData}

=====================
📜 TRÌNH TỰ LUẬN GIẢI (BẮT BUỘC)
=====================

🔹 1. Nhật Chủ & Ngũ hành
- Xác định Nhật Chủ, phân tích độ vượng/suy dựa trên tháng sinh, địa chi và thiên can.

🔹 2. Cách cục
- Xác định Cách cục chính hoặc bình cục. Giải thích rõ vì sao.

🔹 3. Dụng Thần - Hỷ Thần - Kỵ Thần
- Xác định và giải thích logic lựa chọn Dụng - Hỷ - Kỵ.

🔹 4. Luận giải vận mệnh
- Tính cách (Ưu/Nhược điểm)
- Sự nghiệp (Ngành nghề phù hợp, xu hướng phát triển)
- Gia đạo (Hôn nhân, quan hệ gia đình)
- Vận hạn (Giai đoạn thuận lợi / thử thách)

🔹 5. Lời khuyên tu dưỡng
- Định hướng sống cân bằng, khuyến khích tu tâm tích đức.

=====================
📐 FORMAT OUTPUT (BẮT BUỘC)
=====================

# 📜 Thầy luận mệnh cho Con

## 🔹 Nhật Chủ & Ngũ hành
...

## 🔹 Cách cục
...

## 🔹 Dụng Thần - Hỷ Thần - Kỵ Thần
...

## 🔹 Luận giải vận mệnh

### 📌 Tính cách
...

### 📌 Sự nghiệp
...

### 📌 Gia đạo
...

### 📌 Vận hạn
...

## 🔹 Lời khuyên tu dưỡng
...

=====================
🚨 QUY TẮC QUAN TRỌNG
=====================
- Phải có lập luận mệnh lý rõ ràng.
- Giữ văn phong cổ phong xuyên suốt.
- Độ dài: 500–900 từ (Hãy viết chi tiết, sâu sắc, không ngắt quãng nửa chừng).

Kết lại bằng: 👉 'Mệnh do thiên định, nhưng đức do tâm sinh.'
";
    }
public async Task<string> AnalyzeIChingAsync(string hexagramJson, string question)
    {
        // 1. Dựng Prompt gửi cho AI
        string prompt = $@"
Bạn là một chuyên gia về Kinh Dịch và Bát Tự (Huyền Cơ Tôn Giả).
Người dùng muốn xin quẻ với câu hỏi/vấn đề: '{question}'.

Dưới đây là dữ liệu Quẻ Dịch đã được lập dựa trên Bát Tự và Thời gian hiện tại:
{hexagramJson}

Hãy phân tích quẻ này và đưa ra lời khuyên cho người dùng. 
Yêu cầu:
1. Giải thích ngắn gọn tên quẻ và ý nghĩa cốt lõi.
2. Trả lời trực tiếp vào câu hỏi của người dùng.
3. Đưa ra lời khuyên hành động (Nên làm gì, tránh làm gì).
Giọng văn: Uyên bác, sâu sắc, nhưng dễ hiểu và mang tính động viên.
";

        // 2. Tùy thuộc vào cách bạn đang gọi Gemini ở các hàm khác, hãy gọi tương tự ở đây
        // Ví dụ (chỉ mang tính minh họa, hãy copy logic gọi Gemini từ hàm AnalyzeBaziChartAsync của bạn xuống):
        
        // var response = await CallGeminiApi(prompt);
        // return response;
        
        return "Lời giải AI đang được cập nhật..."; // Thay dòng này bằng logic gọi API Gemini thực tế của bạn
    }
}