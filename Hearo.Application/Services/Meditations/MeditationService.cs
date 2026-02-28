using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Meditations;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Meditations;

public class MeditationService : IMeditationService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public MeditationService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<MeditationDto>> GetMeditationsByTarget(string target)
    {
        var meditations = await _context.Meditations
            .Where(m => m.Target.Contains(target))
            .ToListAsync();
        return _mapper.Map<List<MeditationDto>>(meditations);
    }

    public async Task<List<MeditationDto>> GetAllMeditations()
    {
        var meditations = await _context.Meditations.ToListAsync();
        return _mapper.Map<List<MeditationDto>>(meditations);
    }
}