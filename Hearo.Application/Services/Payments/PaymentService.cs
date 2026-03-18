using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;           // Để nhận diện các class cơ bản của Stripe
using Stripe.Checkout;  // Để nhận diện SessionService và các Options mày đang bị lỗi
namespace Hearo.Application.Services.Payments;

public class PaymentService : IPaymentService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _config;

    public PaymentService(IApplicationDbContext context, IMapper mapper, IConfiguration config)
    {
        _context = context;
        _mapper = mapper;
        _config = config;
    }

    public async Task<List<PaymentDto>> GetUserPaymentHistory(Guid userId)
    {
        var payments = await _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        return _mapper.Map<List<PaymentDto>>(payments);
    }
public async Task<string> CreateCheckoutSession(Guid userId)
{
    var options = new SessionCreateOptions
    {
        LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = 50000, // 50 cành (VNĐ)
                    Currency = "vnd",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = "PodSphere Premium - 1 Tháng",
                        Description = "Mở khóa tập Podcast độc quyền cho SV UIT"
                    },
                },
                Quantity = 1,
            },
        },
        Mode = "payment",
        // Địa chỉ để Stripe nó quay về sau khi thanh toán xong
        SuccessUrl = "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
        CancelUrl = "http://localhost:3000/payment-failed",
        ClientReferenceId = userId.ToString(), // Lưu lại ID để tí nữa biết thằng nào vừa trả tiền
    };

    var service = new SessionService();
    var session = await service.CreateAsync(options);

    return session.Url; 
}
public async Task HandlePaymentSuccess(Guid userId)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    if (user != null)
    {
        // 1. Cập nhật trạng thái Premium cho User
        user.IsPremium = true; 
        user.PremiumExpiryDate = DateTime.UtcNow.AddMonths(1);
        
        // 2. TẠO HÓA ĐƠN VÀ LƯU VÀO BẢNG PAYMENTS (THÊM ĐOẠN NÀY)
        var payment = new Hearo.Domain.Entities.Payment // Thay bằng đúng namespace Entity 
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = 50000, // 
            Status = "Success",
            CreatedAt = DateTime.UtcNow,
        };

        _context.Payments.Add(payment);

        // 3. Lưu tất cả thay đổi
        await _context.SaveChangesAsync();
    }
}
}