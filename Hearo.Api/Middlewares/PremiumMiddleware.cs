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

            // Nếu là Admin thì cho qua luôn, Admin là trùm mà
            if (userRole == "Admin")
            {
                await _next(context);
                return;
            }

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                context.Response.StatusCode = 401; // Chua dang nhap
                return;
            }

            // CHECK TRONG DB: Co goi Subscription nao dang Active va con han khong?
            var hasActiveSubscription = await dbContext.Subscriptions
                .AnyAsync(s => s.UserId == userId 
                               && s.Status == "Active" 
                               && s.EndDate > DateTime.Now);

            if (!hasActiveSubscription)
            {
                context.Response.StatusCode = 403; // Cam cua
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { 
                    message = "May chua nap tien Monthly/Yearly nen khong nghe duoc dau!",
                    weight_reminder = "Lo ma di tap the duc di, 86kg roi do!" // Nhắc nhở sức khỏe
                });
                return;
            }
        }

        await _next(context);
    }
}