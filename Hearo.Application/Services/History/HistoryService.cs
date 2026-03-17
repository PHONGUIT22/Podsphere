using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Episodes;
using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.History;

public class HistoryService : IHistoryService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public HistoryService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task AddToHistory(Guid userId, Guid episodeId)
    {
        var history = await _context.UserEpisodeHistories
            .FirstOrDefaultAsync(h => h.UserId == userId && h.EpisodeId == episodeId);

        if (history != null)
        {
            // Nếu nghe lại thì chỉ cập nhật thời gian
            history.PlayedAt = DateTime.UtcNow;
        }
        else
        {
            // Lần đầu nghe thì thêm mới
            _context.UserEpisodeHistories.Add(new UserEpisodeHistory
            {
                UserId = userId,
                EpisodeId = episodeId,
                PlayedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync(default);
    }

    public async Task<List<EpisodeDto>> GetRecentHistory(Guid userId)
    {
        var historyList = await _context.UserEpisodeHistories
            .Include(h => h.Episode) // Eager load thông tin tập podcast
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.PlayedAt)
            .Take(20)
            .Select(h => h.Episode) // Bốc lấy thông tin tập podcast
            .ToListAsync();

        return _mapper.Map<List<EpisodeDto>>(historyList);
    }
}