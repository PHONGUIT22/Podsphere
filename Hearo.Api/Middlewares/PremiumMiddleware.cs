using Hearo.Application.Common.Interfaces.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
public class PremiumMiddleware
{
    private readonly RequestDelegate _next;
    public PremiumMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, IApplicationDbContext dbContext)
    {
        // Kiểm tra nếu User đang truy cập vào các Podcast đặc quyền
        if (context.Request.Path.StartsWithSegments("/api/premium-podcasts"))
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = context.User.FindFirst(ClaimTypes.Role)?.Value;

            // Nếu là Admin thì cho qua luôn
            if (userRole == "Admin")
            {
                await _next(context);
                return;
            }

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                context.Response.StatusCode = 401; 
                return;
            }

            var user = await dbContext.Users
                .Select(u => new { u.Id, u.IsPremium, u.PremiumExpiryDate })
                .FirstOrDefaultAsync(u => u.Id == userId);

            // Kiểm tra điều kiện: Phải là Premium VÀ còn hạn dùng
            bool isValidPremium = user != null 
                                && user.IsPremium 
                                && user.PremiumExpiryDate > DateTime.UtcNow;

            if (!isValidPremium)
            {
                context.Response.StatusCode = 403; 
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { 
                    message = "Nạp tiền đi mậy, không nạp không nghe được Podcast độc quyền đâu!",
                    health_status = "Bụng 105cm rồi, gan NASH độ 2 nữa, lo tập đi đừng có nghe hoài!", 
                    weight_reminder = "Cân nặng 86kg rồi đó, code ít thôi, hít đất đi!" 
                });
                return;
            }
        }

        await _next(context);
    }
}