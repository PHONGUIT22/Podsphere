using Hearo.Application.Common.Models.Payments;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IPaymentService
{
    Task<List<PaymentDto>> GetUserPaymentHistory(Guid userId);
}