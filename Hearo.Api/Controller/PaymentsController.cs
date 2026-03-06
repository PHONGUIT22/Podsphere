using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Hearo.Application.Common.Interfaces.Services;

namespace Hearo.Api.Controllers;

[Authorize] // Phải đăng nhập mới được nạp tiền!
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    /// <summary>
    /// Tạo phiên thanh toán Stripe và trả về URL để đi trả tiền
    /// </summary>
    [HttpPost("create-checkout")]
    public async Task<IActionResult> CreateCheckout()
    {
        // 1. Lấy UserId từ cái Token JWT mà mày đã dán vào Swagger
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