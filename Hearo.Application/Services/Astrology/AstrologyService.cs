using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
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
        int gender = isMale ? 1 : 0;

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
        return string.Empty; 
    }

    public async Task<string> GetBaziDataAsync(DateTime birthDate, int hour, bool isMale)
    {
        var client = _httpClientFactory.CreateClient("AstrologyClient");
        int gender = isMale ? 1 : 0;

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

    // ĐÃ SỬA: Hàm này giờ gửi Year, Month, Day, Hour sang Node.js
    public async Task<string> CastIChingHexagramAsync(int year, int month, int day, int hour, string topic)
    {
        var client = _httpClientFactory.CreateClient("AstrologyClient");

        var requestBody = new
        {
            year = year,
            month = month,
            day = day,
            hour = hour,
            topic = topic
        };

        var jsonContent = new StringContent(
            JsonSerializer.Serialize(requestBody), 
            Encoding.UTF8, 
            "application/json"
        );

        var response = await client.PostAsync("api/iching/cast", jsonContent);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }

        return string.Empty;
    }
}