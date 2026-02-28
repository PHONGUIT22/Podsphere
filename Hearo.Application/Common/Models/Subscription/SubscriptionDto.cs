using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Subscriptions;

public record SubscriptionDto : IMapFrom<Subscription>
{
    public Guid Id { get; init; }
    public string PlanType { get; init; } = "Free";
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public string Status { get; init; } = "Active";
    
    public Guid UserId { get; init; }
    public string? UserUsername { get; init; }
}