using System.Net.Http;
using Microsoft.Extensions.Http;
using Hearo.Application.Common.Interfaces.Services; // Nhớ trỏ về Interface của nó
using System.Threading.Tasks;

namespace Hearo.Infrastructure.Services; // Hoặc namespace của mày

public class AstrologyService : IAstrologyService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public AstrologyService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string> GetAstrologyDataAsync(DateTime birthDate, int hour, bool isMale)
    {
        var client = _httpClientFactory.CreateClient("AstrologyClient");
        
        // Đổi bool sang số 1 (Nam) hoặc 0 (Nữ) để NodeJS dễ đọc
        int gender = isMale ? 1 : 0;

        // Cập nhật URL: Thêm tham số &gender vào cuối
        var url = $"api/astrology/info?year={birthDate.Year}&month={birthDate.Month}&day={birthDate.Day}&hour={hour}&gender={(isMale ? 1 : 0)}";

        var response = await client.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }

        return string.Empty; 
    }
}