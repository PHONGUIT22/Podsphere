using Microsoft.AspNetCore.Mvc;
using Hearo.Application.Common.Interfaces.Services;

[ApiController]
[Route("api/[controller]")]
public class BlogsController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogsController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _blogService.GetAllBlogs());

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug) => Ok(await _blogService.GetBlogBySlug(slug));
}