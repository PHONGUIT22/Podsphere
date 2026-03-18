using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;
using AutoMapper;

namespace Hearo.Application.Common.Models.Payments;

public record PaymentDto : IMapFrom<Payment>
{
    public Guid Id { get; init; }
    public decimal Amount { get; init; }
    public string Provider { get; init; } = string.Empty; // MoMo, VNPay...
    public string Status { get; init; } = "Pending";
    public string TransactionId { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
     public void Mapping(Profile profile)
    {
        profile.CreateMap<Payment, PaymentDto>(); // Chiều Entity -> DTO (Lấy ra)
        profile.CreateMap<PaymentDto, Payment>(); // Chiều DTO -> Entity (Lưu vào) - FIX LỖI 500
    }
}