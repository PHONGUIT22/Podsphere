using Hearo.Application.Common.Models.Lessons;

namespace Hearo.Application.Common.Interfaces.Services;

public interface ILessonService
{
    Task<List<LessonDto>> GetLessonsByCourseId(Guid courseId);
    Task<LessonDto?> GetLessonById(Guid id);
}