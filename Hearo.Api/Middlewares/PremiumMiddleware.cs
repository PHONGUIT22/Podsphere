using Hearo.Application.Common.Interfaces.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Routing;

namespace Hearo.Api.Middlewares;

public class PremiumMiddleware
{
    private readonly RequestDelegate _next;

    public PremiumMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, IApplicationDbContext dbContext)
    {
        var path = context.Request.Path.Value?.ToLower();

        // CHÚ Ý: ĐỔI SANG CANH CỬA API CỦA EPISODE
        // Giả sử API nghe/lấy chi tiết tập của mày là: GET /api/episodes/{id}
        // TUYỆT ĐỐI KHÔNG CHẶN /api/podcasts/{id}/episodes nữa!
        if (path != null && path.StartsWith("/api/episodes/"))
        {
            var routeId = context.GetRouteValue("id")?.ToString() 
                       ?? context.GetRouteValue("episodeId")?.ToString();

            if (Guid.TryParse(routeId, out var episodeId))
            {
                // 1. Check xem TẬP (EPISODE) này có exclusive = 1 (Premium) không
                var isExclusive = await dbContext.Episodes // Đổi qua bảng Episodes
                    .Where(e => e.Id == episodeId)
                    .Select(e => e.IsExclusive) // Thay bằng tên cột thực tế của mày (Exclusive hoặc IsPremium)
                    .FirstOrDefaultAsync();

                // Nếu là tập Premium thì mới soi xem nó có tiền không
                if (isExclusive)
                {
                    var userRole = context.User.FindFirst(ClaimTypes.Role)?.Value;

                    if (userRole == "Admin") 
                    { 
                        await _next(context); 
                        return; 
                    }

                    var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsJsonAsync(new { message = "Chưa đăng nhập mà đòi nghe đồ xịn à?" });
                        return;
                    }

                    var user = await dbContext.Users
                        .Select(u => new { u.Id, u.IsPremium, u.PremiumExpiryDate })
                        .FirstOrDefaultAsync(u => u.Id == userId);

                    bool isValidPremium = user != null 
                                       && user.IsPremium 
                                       && user.PremiumExpiryDate > DateTime.UtcNow;

                    if (!isValidPremium)
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        
                        await context.Response.WriteAsJsonAsync(new { 
                            message = "Tập này exclusive = 1, chỉ dành cho dân VIP thôi!",
                            remind = "Béo 86kg rồi, bụng 105cm, bớt nạp game nạp Premium mà tập gym đi!" 
                        });
                        
                        return; // CHẶN KHÔNG CHO NGHE/XEM TẬP NÀY
                    }
                }
            }
        }

        // Nếu là tập exclusive = 0, hoặc đường dẫn khác (như lấy danh sách podcast), thì cho qua hết
        await _next(context);
    }
}