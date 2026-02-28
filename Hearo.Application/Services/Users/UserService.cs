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
        return _mapper.Map<UserDto>(user);
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
}