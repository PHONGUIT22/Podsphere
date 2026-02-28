using Hearo.Application.Common.Models.Meditations;

namespace Hearo.Application.Common.Interfaces.Services;

public interface IMeditationService
{
    Task<List<MeditationDto>> GetMeditationsByTarget(string target);
    Task<List<MeditationDto>> GetAllMeditations();
}