using System.Net.Http;
using System.Threading.Tasks;
using Hearo.Application.Common.Interfaces.Services;

namespace Hearo.Infrastructure.Services;

public class AstrologyService : IAstrologyService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public AstrologyService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string> GetAstrologyDataAsync(DateTime birthDate, int hour, bool isMale, int viewYear)
    {
        var client = _httpClientFactory.CreateClient("AstrologyClient");
        
        // Chuyển đổi giới tính: Nam = 1, Nữ = 0
        int gender = isMale ? 1 : 0;

        // Cập nhật URL: Thêm tham số &viewYear vào cuối để Node.js/Python xử lý an sao Lưu
        var url = $"api/astrology/info?year={birthDate.Year}" +
                  $"&month={birthDate.Month}" +
                  $"&day={birthDate.Day}" +
                  $"&hour={hour}" +
                  $"&gender={gender}" +
                  $"&viewYear={viewYear}";

        var response = await client.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }

        // Nếu lỗi, bạn có thể log lỗi ở đây hoặc trả về chuỗi rỗng
        return string.Empty; 
    }
    // Thêm vào IAstrologyService.cs trước nếu có interface
    public async Task<string> GetBaziDataAsync(DateTime birthDate, int hour, bool isMale)
    {
        var client = _httpClientFactory.CreateClient("AstrologyClient");
        int gender = isMale ? 1 : 0;

        // Gọi tới endpoint /api/astrology/bazi của Node.js
        var url = $"api/astrology/bazi?year={birthDate.Year}" +
                $"&month={birthDate.Month}" +
                $"&day={birthDate.Day}" +
                $"&hour={hour}" +
                $"&gender={gender}";

        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        return string.Empty;
    }
}