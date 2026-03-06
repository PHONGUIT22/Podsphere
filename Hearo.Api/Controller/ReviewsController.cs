using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hearo.Api.Controller;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [Authorize]
    [HttpPost("podcast")]
    public async Task<IActionResult> ReviewPodcast([FromBody] CreateReviewDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _reviewService.AddReview(userId, dto.Rating, dto.Comment, dto.TargetId, null);

        if (!result) return BadRequest("Review Podcast hụt rồi.");
        return Ok("Cảm ơn đã đánh giá Podcast!");
    }

    [Authorize]
    [HttpPost("course")]
    public async Task<IActionResult> ReviewCourse([FromBody] CreateReviewDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Review khóa học thì podcastId để null
        var result = await _reviewService.AddReview(userId, dto.Rating, dto.Comment, null, dto.TargetId);

        if (!result) return BadRequest("Review khóa học thất bại.");
        return Ok("Review khóa học thành công!");
    }
}