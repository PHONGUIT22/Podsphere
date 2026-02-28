using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Provider { get; set; } = string.Empty; // MoMo, VNPay
    public string TransactionId { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
}