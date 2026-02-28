using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Notifications;

public record NotificationDto : IMapFrom<Notification>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public bool IsRead { get; init; }
    public string Type { get; init; } = "System"; // System, Reminder...
    public DateTime CreatedAt { get; init; }
}