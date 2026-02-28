using Hearo.Application.Common.Models.Notifications;

namespace Hearo.Application.Common.Interfaces.Services;

public interface INotificationService
{
    Task<List<NotificationDto>> GetUserNotifications(Guid userId);
    Task<bool> MarkAsRead(Guid notificationId);
}