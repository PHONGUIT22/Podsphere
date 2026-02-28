using Hearo.Application.Common.Interfaces.Persistence; // Để dùng IApplicationDbContext
using Hearo.Application.Common.Models.Health; // Để dùng HealthRecommendationDto
using Hearo.Domain.Entities; // Để dùng UserHealthStats
using Microsoft.EntityFrameworkCore; // Để dùng được các hàm Async như FirstOrDefaultAsync
using System;
public class HealthService : IHealthService
{
    private readonly IApplicationDbContext _context;

    public HealthService(IApplicationDbContext context) => _context = context;

    public async Task<HealthRecommendationDto> GetHealthAnalysis(Guid userId)
    {
        // 1. Lấy chỉ số mới nhất của mày
        var stats = await _context.UserHealthStats
            .OrderByDescending(x => x.UpdatedAt)
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (stats == null) throw new Exception("Chưa có dữ liệu sức khỏe mày ơi!");

        // 2. Tính BMI dựa trên 86kg và 1m68 của mày
        double bmi = stats.Weight / Math.Pow(stats.Height, 2);
        string bmiStatus = bmi >= 30 ? "Béo phì độ 1" : "Cần cố gắng";

        var tags = new List<string>();
        string liverWarning = "Bình thường";
        string advice = "Tiếp tục phát huy!";

        // 3. Logic "Chữa lành" cho cái bụng 105cm và gan NASH độ 2
        if (stats.WaistSize > 100) // Vòng bụng mày 105cm
        {
            tags.Add("GiamMoNoiTang");
            tags.Add("CardioTaiNha");
            advice = "Bụng to quá rồi, đứng dậy Squat ngay!";
        }

        if (stats.LiverStatus == "NASH Grade 2") // Tình trạng gan của mày
        {
            tags.Add("GanNhiemMo");
            tags.Add("EatClean");
            liverWarning = "Cảnh báo: Gan NASH độ 2 cần kiêng tuyệt đối dầu mỡ!";
        }

        return new HealthRecommendationDto(
            Math.Round(bmi, 2),
            bmiStatus,
            liverWarning,
            tags,
            advice
        );
    }
}