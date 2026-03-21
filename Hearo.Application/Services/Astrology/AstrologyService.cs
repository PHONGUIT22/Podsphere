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

    public async Task<string> GetAstrologyDataAsync(DateTime birthDate, int hour)
    {
        var client = _httpClientFactory.CreateClient("AstrologyClient");
        
        var url = $"api/astrology/info?year={birthDate.Year}&month={birthDate.Month}&day={birthDate.Day}&hour={hour}";

        var response = await client.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }

        return string.Empty; // Trả về chuỗi rỗng thay vì null cho an toàn
    }
}