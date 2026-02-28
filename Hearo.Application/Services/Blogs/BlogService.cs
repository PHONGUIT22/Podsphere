using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Blogs;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Blogs;

public class BlogService : IBlogService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public BlogService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BlogDto>> GetAllBlogs()
    {
        var blogs = await _context.Blogs.Include(b => b.Author).ToListAsync();
        return _mapper.Map<List<BlogDto>>(blogs);
    }

    public async Task<BlogDto> GetBlogBySlug(string slug)
    {
        var blog = await _context.Blogs.Include(b => b.Author).FirstOrDefaultAsync(x => x.Slug == slug);
        return _mapper.Map<BlogDto>(blog);
    }
}