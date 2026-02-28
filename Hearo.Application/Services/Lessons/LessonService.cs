using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Lessons;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Lessons;

public class LessonService : ILessonService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public LessonService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<LessonDto>> GetLessonsByCourseId(Guid courseId)
    {
        var lessons = await _context.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .ToListAsync();
        return _mapper.Map<List<LessonDto>>(lessons);
    }

    public async Task<LessonDto?> GetLessonById(Guid id)
    {
        var lesson = await _context.Lessons.FindAsync(id);
        return _mapper.Map<LessonDto>(lesson);
    }
}