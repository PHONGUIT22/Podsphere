using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Subscription : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string PlanType { get; set; } = "Free"; // Free, Monthly, Yearly
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Active"; // Active, Expired
}