using Hearo.Application.Common.Models.Courses;

namespace Hearo.Application.Common.Interfaces.Services;

public interface ICourseService
{
    Task<List<CourseDto>> GetAllCourses();
    Task<CourseDto> GetCourseDetail(Guid courseId);
}