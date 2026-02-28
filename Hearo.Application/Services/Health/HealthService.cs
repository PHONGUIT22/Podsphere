using Hearo.Application.Common.Interfaces.Persistence; // Để dùng IApplicationDbContext
using Hearo.Application.Common.Models.Health; // Để dùng HealthRecommendationDto
using Hearo.Application.Common.Models.Journals;
using Hearo.Domain.Entities; // Để dùng UserHealthStats
using Microsoft.EntityFrameworkCore; // Để dùng được các hàm Async như FirstOrDefaultAsync
using System;
using AutoMapper;
public class HealthService : IHealthService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    public HealthService(IApplicationDbContext context, IMapper mapper) 
    {
        _context = context;
        _mapper = mapper; // 3. Gán giá trị vào biến private
    }

    public async Task<HealthRecommendationDto> GetHealthAnalysis(Guid userId)
{
    var stats = await _context.UserHealthStats
        .OrderByDescending(x => x.UpdatedAt)
        .FirstOrDefaultAsync(x => x.UserId == userId);

    if (stats == null) throw new Exception("Chưa có dữ liệu tinh thần mày ơi!");

    string status = stats.MoodScore <= 4 ? "Tâm trạng đang xuống dốc" : "Tinh thần ổn định";
    string stressWarning = stats.StressLevel == "High" ? "Cảnh báo: Stress quá cao, dễ gãy đổ sự nghiệp!" : "Mọi thứ vẫn trong tầm kiểm soát";
    
    var tags = new List<string>();
    string advice = "Tiếp tục duy trì năng lượng tích cực!";

    // Logic gợi ý cho "Senior" tương lai
    if (stats.MoodScore <= 4)
    {
        tags.Add("ChuaLanh");
        tags.Add("DongLuc");
        advice = "Mày đang buồn à? Nghe thử mấy bài Podcast về tư duy tích cực xem.";
    }

    if (stats.StressLevel == "High")
    {
        tags.Add("ThienDinh");
        tags.Add("GiamStress");
        advice = "Học UIT áp lực quá thì nghỉ tay tí, nghe thiền cho tĩnh tâm mày ơi.";
    }

    return new HealthRecommendationDto(
        stats.MoodScore,
        status,
        stressWarning,
        tags,
        advice
    );
}
// Thêm các hàm này vào Class HealthService của mày
public async Task<bool> UpdateHealthStats(Guid userId, int moodScore, string stressLevel, double sleepHours, string? note)
{
    var stats = await _context.UserHealthStats.FirstOrDefaultAsync(s => s.UserId == userId);
    if (stats == null) return false;

    stats.MoodScore = moodScore;
    stats.StressLevel = stressLevel;
    stats.SleepHours = sleepHours;
    stats.Note = note;
    stats.UpdatedAt = DateTime.UtcNow;

    return await _context.SaveChangesAsync() > 0;
}

public async Task<List<UserJournalDto>> GetUserJournals(Guid userId)
{
    var journals = await _context.UserJournals.Where(j => j.UserId == userId)
        .OrderByDescending(j => j.CreatedAt).ToListAsync();
    return _mapper.Map<List<UserJournalDto>>(journals);
}

public async Task<bool> AddJournal(Guid userId, string title, string content, string? mood)
{
    var journal = new UserJournal { UserId = userId, Title = title, Content = content, Mood = mood };
    _context.UserJournals.Add(journal);
    return await _context.SaveChangesAsync() > 0;
}
}