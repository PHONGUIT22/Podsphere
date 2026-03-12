using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;

namespace Hearo.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class MeditationController : ControllerBase
{
    private readonly IMeditationService _meditationService;

    public MeditationController(IMeditationService meditationService)
    {
        _meditationService = meditationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _meditationService.GetAllMeditations());

    [HttpGet("search")]
    public async Task<IActionResult> GetByTarget([FromQuery] string target) 
    {
        return Ok(await _meditationService.GetMeditationsByTarget(target));
    }
}