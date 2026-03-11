using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly IUserCourseService _userCourseService;
    private readonly ILessonService _lessonService;

    public CoursesController(ICourseService courseService, IUserCourseService userCourseService, ILessonService lessonService)
    {
        _courseService = courseService;
        _userCourseService = userCourseService;
        _lessonService = lessonService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _courseService.GetAllCourses());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(Guid id) => Ok(await _courseService.GetCourseDetail(id));

    [HttpGet("{id}/lessons")]
    public async Task<IActionResult> GetLessons(Guid id) => Ok(await _lessonService.GetLessonsByCourseId(id));

    [Authorize]
    [HttpGet("my-courses")]
    public async Task<IActionResult> GetMyCourses()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _userCourseService.GetUserCourses(userId));
    }

    [Authorize]
    [HttpPatch("{id}/progress")]
    public async Task<IActionResult> UpdateProgress(Guid id, [FromBody] int progress)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _userCourseService.UpdateProgress(userId, id, progress);
        return result ? Ok() : BadRequest();
    }
}