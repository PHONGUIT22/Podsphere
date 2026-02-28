using Hearo.Application.Common.Models.UserCourses;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IUserCourseService
{
    Task<List<UserCourseDto>> GetUserCourses(Guid userId);
    Task<bool> UpdateProgress(Guid userId, Guid courseId, int progress);
}