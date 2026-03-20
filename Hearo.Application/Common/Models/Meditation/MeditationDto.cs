using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;
using AutoMapper;

namespace Hearo.Application.Common.Models.Meditations;

// 1. Khai báo record với các tham số
// 2. Kế thừa IMapFrom<Meditation> để AutoMapper tự bốc dữ liệu
public record MeditationDto : IMapFrom<Meditation>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string AudioUrl { get; init; } = string.Empty;
    public string Thumbnail { get; init; } = string.Empty;
    public int Duration { get; init; }
    public string Target { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;

    // Hàm Mapping này phải nằm TRONG thân của record { ... }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<Meditation, MeditationDto>();
        profile.CreateMap<MeditationDto, Meditation>();
    }
}