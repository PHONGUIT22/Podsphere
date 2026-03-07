using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Hearo.Application.Common.Interfaces.Services;
using Stripe;
using Stripe.Checkout;  // Chứa Events và EventUtility
namespace Hearo.Api.Controllers;

[Authorize] // Phải đăng nhập mới được nạp tiền!
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IConfiguration _config;

    public PaymentsController(IPaymentService paymentService, IConfiguration config)
    {
        _paymentService = paymentService;
        _config = config;
    }

    /// <summary>
    /// Tạo phiên thanh toán Stripe và trả về URL để đi trả tiền
    /// </summary>
    [HttpPost("create-checkout")]
    public async Task<IActionResult> CreateCheckout()
    {
        // 1. Lấy UserId từ cái Token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "Không tìm thấy định danh người dùng.Check lại Token đi!" });
        }

        try
        {
            // 2. Gọi Service để xin cái link thanh toán từ Stripe
            var checkoutUrl = await _paymentService.CreateCheckoutSession(userId);
            
            return Ok(new { url = checkoutUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Lỗi khi gọi Stripe ", detail = ex.Message });
        }
    }
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            // 1. Xác minh chữ ký Webhook
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _config["Stripe:WebhookSecret"]
            );

            // 2. Sửa lỗi 'Events' bằng cách dùng Stripe.Events (tránh xung đột)
            // Dùng thêm toán tử ?. để tránh lỗi null reference (CS8602)
            if (stripeEvent?.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data?.Object as Stripe.Checkout.Session;
                
                // 3. Kiểm tra session và ClientReferenceId trước khi xử lý
                if (session != null && !string.IsNullOrEmpty(session.ClientReferenceId))
                {
                    if (Guid.TryParse(session.ClientReferenceId, out Guid userId))
                    {
                        await _paymentService.HandlePaymentSuccess(userId);
                    }
                }
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest(new { error = e.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Lỗi hệ thống", detail = ex.Message });
        }
    }
    /// <summary>
    /// Lấy lịch sử nạp tiền của thằng đang đăng nhập
    /// </summary>
    [HttpGet("history")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var history = await _paymentService.GetUserPaymentHistory(userId);
        return Ok(history);
    }
    
}