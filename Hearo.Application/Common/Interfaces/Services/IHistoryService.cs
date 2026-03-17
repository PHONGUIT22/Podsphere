using Hearo.Application.Common.Models.Episodes;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IHistoryService
{
    // Lưu hoặc cập nhật lịch sử nghe
    Task AddToHistory(Guid userId, Guid episodeId);
    
    // Lấy danh sách 20 tập đã nghe gần nhất
    Task<List<EpisodeDto>> GetRecentHistory(Guid userId);
}