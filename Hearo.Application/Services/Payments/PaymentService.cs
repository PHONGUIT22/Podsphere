using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Payments;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Payments;

public class PaymentService : IPaymentService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PaymentService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<PaymentDto>> GetUserPaymentHistory(Guid userId)
    {
        var payments = await _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        return _mapper.Map<List<PaymentDto>>(payments);
    }
}