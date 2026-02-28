using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Journals;

public record UserJournalDto : IMapFrom<UserJournal>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Mood { get; init; }
    public DateTime CreatedAt { get; init; }
}