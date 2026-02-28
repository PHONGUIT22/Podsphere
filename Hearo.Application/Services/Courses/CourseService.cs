using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Courses;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Courses;

public class CourseService : ICourseService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CourseService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<CourseDto>> GetAllCourses()
    {
        var courses = await _context.Courses.ToListAsync();
        return _mapper.Map<List<CourseDto>>(courses);
    }

    public async Task<CourseDto> GetCourseDetail(Guid courseId)
    {
        var course = await _context.Courses
            .Include(c => c.Lessons)
            .Include(c => c.Reviews)
            .FirstOrDefaultAsync(c => c.Id == courseId);
            
        return _mapper.Map<CourseDto>(course);
    }
}