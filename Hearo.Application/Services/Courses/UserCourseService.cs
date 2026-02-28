using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.UserCourses;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Courses;

public class UserCourseService : IUserCourseService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UserCourseService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<UserCourseDto>> GetUserCourses(Guid userId)
    {
        var userCourses = await _context.UserCourses.Include(uc => uc.Course)
            .Where(uc => uc.UserId == userId).ToListAsync();
        return _mapper.Map<List<UserCourseDto>>(userCourses);
    }

    public async Task<bool> UpdateProgress(Guid userId, Guid courseId, int progress)
    {
        var uc = await _context.UserCourses.FirstOrDefaultAsync(x => x.UserId == userId && x.CourseId == courseId);
        if (uc == null) return false;
        uc.ProgressPercent = progress;
        return await _context.SaveChangesAsync() > 0;
    }
}