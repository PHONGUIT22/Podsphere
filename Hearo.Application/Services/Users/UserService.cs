using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Users;
using Hearo.Application.Common.Models.Subscriptions;
using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Users;

public class UserService : IUserService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UserService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetUserProfile(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        var dto = _mapper.Map<UserDto>(user);

        // Sử dụng 'with' để tạo bản sao mới với Role đã thay đổi
        if (user.IsPremium && user.PremiumExpiryDate > DateTime.UtcNow)
        {
            dto = dto with { Role = "Premium" };
        }
        else
        {
            dto = dto with { Role = "User" };
        }

        return dto;
    }
    public async Task<SubscriptionDto?> GetActiveSubscription(Guid userId)
    {
        var sub = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "Active" && s.EndDate > DateTime.UtcNow);
        return _mapper.Map<SubscriptionDto>(sub);
    }

    public async Task<bool> UpgradeToPremium(Guid userId, string planType)
    {
        var endDate = planType == "Monthly" ? DateTime.UtcNow.AddMonths(1) : DateTime.UtcNow.AddYears(1);
        var sub = new Subscription { UserId = userId, PlanType = planType, StartDate = DateTime.UtcNow, EndDate = endDate, Status = "Active" };
        _context.Subscriptions.Add(sub);
        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> UpdateProfile(Guid userId, UserDto userDto)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null) return false;

        if (user.Username != userDto.Username)
        {
            var isUsernameTaken = await _context.Users
                .AnyAsync(u => u.Username == userDto.Username && u.Id != userId);
                
            if (isUsernameTaken) return false; 
            
            user.Username = userDto.Username;
        }

        user.FullName = userDto.FullName;
        user.Avatar = userDto.Avatar;

        _context.Users.Update(user);
        return await _context.SaveChangesAsync() > 0;
    }
}