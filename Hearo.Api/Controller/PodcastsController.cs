using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Podcasts;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Hearo.Application.Common.Models.Comments;
using Hearo.Application.Common.Models.Episodes;
using Hearo.Api.Models;

namespace Hearo.Api.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Phải đăng nhập mới được xài
public class PodcastsController : ControllerBase
{
    private readonly IPodcastService _podcastService;

    public PodcastsController(IPodcastService podcastService)
    {
        _podcastService = podcastService;
    }

    [HttpGet("recommended")]
    public async Task<IActionResult> GetRecommended() 
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _podcastService.GetRecommendedPodcasts(userId));
    }
    [Authorize] // Bắt buộc đăng nhập mới được cào phím
    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(Guid episodeId, [FromBody] CreateCommentDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _podcastService.AddComment(userId, episodeId, dto.Content, dto.Timestamp);

        if (!result) return BadRequest("Lỗi rồi , check lại cái PodcastId xem.");
        return Ok("Đã đăng bình luận thành công!");
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(Guid id) => Ok(await _podcastService.GetPodcastDetail(id));

    [HttpPost]
    public async Task<IActionResult> Create(PodcastDto dto) => Ok(await _podcastService.CreatePodcast(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, PodcastDto dto) => Ok(await _podcastService.UpdatePodcast(id, dto));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) => Ok(await _podcastService.DeletePodcast(id));

    [HttpGet("{id}/episodes")]
    public async Task<IActionResult> GetEpisodes(Guid id) => Ok(await _podcastService.GetEpisodesByPodcastId(id));

    [HttpGet("episodes/{episodeId}/comments")]
    public async Task<IActionResult> GetComments(Guid episodeId) => Ok(await _podcastService.GetCommentsByEpisodeId(episodeId));
    [HttpGet("categories")]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _podcastService.GetAllCategories();
        return Ok(categories);
    }
   [HttpPost("{id}/episodes")]
    public async Task<IActionResult> CreateEpisode(Guid id, [FromForm] CreateEpisodeRequest request)
    {
        if (request.File == null) return BadRequest("Chưa up file lên kìa bạn ơi.");
        
        var episodeDto = new EpisodeDto { Title = request.Title, Order = request.Order, IsExclusive = request.IsExclusive };
        using var stream = request.File.OpenReadStream();
        var resultId = await _podcastService.CreateEpisodeWithFile(id, episodeDto, stream, request.File.ContentType);
        
        return Ok(resultId);
    }
}