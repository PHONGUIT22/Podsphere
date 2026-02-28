using Hearo.Application.Common.Models.Users;
using Hearo.Application.Common.Models.Subscriptions;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IUserService
{
    Task<UserDto?> GetUserProfile(Guid userId);
    Task<SubscriptionDto?> GetActiveSubscription(Guid userId);
    Task<bool> UpgradeToPremium(Guid userId, string planType); // Free, Monthly, Yearly
}