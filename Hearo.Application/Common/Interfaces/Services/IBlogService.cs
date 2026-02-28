using Hearo.Application.Common.Models.Blogs;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IBlogService
{
    Task<List<BlogDto>> GetAllBlogs();
    Task<BlogDto> GetBlogBySlug(string slug);
}