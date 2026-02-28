using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Notifications;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public NotificationService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<NotificationDto>> GetUserNotifications(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
        return _mapper.Map<List<NotificationDto>>(notifications);
    }

    public async Task<bool> MarkAsRead(Guid notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification == null) return false;

        notification.IsRead = true;
        return await _context.SaveChangesAsync() > 0;
    }
}