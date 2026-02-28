
namespace Hearo.Application.Common.Models.Podcasts; // THÊM DÒNG NÀY
public record PodcastDto(
    Guid Id, 
    string Title, 
    string Description, 
    string? Tags, // Tham số thứ 4: string
    bool IsPremium // Tham số thứ 5: bool
);