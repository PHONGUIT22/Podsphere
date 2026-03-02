using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Podcasts;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
}