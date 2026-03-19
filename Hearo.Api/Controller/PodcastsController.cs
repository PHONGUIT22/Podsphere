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
    [AllowAnonymous] // Cho phép xem danh sách mà không cần đăng nhập (để test cho dễ)
    [HttpGet]
    public async Task<IActionResult> GetAll() 
    {
        // Giả sử service của mày có hàm GetAllPodcasts
        var result = await _podcastService.GetAllPodcasts(); 
        return Ok(result);
}
    [HttpGet("recommended")]
    public async Task<IActionResult> GetRecommended() 
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _podcastService.GetRecommendedPodcasts(userId));
    }
    [Authorize]
    [HttpPost("episodes/{id}/comments")] // Đổi route cho rõ ràng là comment của Episode
    public async Task<IActionResult> AddComment(Guid id, [FromBody] CreateCommentDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Truyền id (là episodeId) vào service
        var result = await _podcastService.AddComment(userId, id, dto.Content, dto.Timestamp);

        if (!result) return BadRequest("Lỗi rồi, check lại ID xem.");
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
    [AllowAnonymous] // QUAN TRỌNG: Cho phép ai cũng gọi được API này
    public async Task<IActionResult> GetEpisodes(Guid id)
    {
        Guid? userId = null;

        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }
        }

        var result = await _podcastService.GetEpisodesByPodcastId(id, userId);
        return Ok(result);
    }
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