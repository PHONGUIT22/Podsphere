using AutoMapper;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Models.Reviews;
using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Services.Reviews;

public class ReviewService : IReviewService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ReviewService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<ReviewDto>> GetReviewsByPodcastId(Guid podcastId)
    {
        var reviews = await _context.Reviews.Include(r => r.User)
            .Where(r => r.PodcastId == podcastId).ToListAsync();
        return _mapper.Map<List<ReviewDto>>(reviews);
    }

    public async Task<List<ReviewDto>> GetReviewsByCourseId(Guid courseId)
    {
        var reviews = await _context.Reviews.Include(r => r.User)
            .Where(r => r.CourseId == courseId).ToListAsync();
        return _mapper.Map<List<ReviewDto>>(reviews);
    }

    public async Task<bool> AddReview(Guid userId, int rating, string comment, Guid? podcastId, Guid? courseId)
    {
        var review = new Review { UserId = userId, Rating = rating, Comment = comment, PodcastId = podcastId, CourseId = courseId };
        _context.Reviews.Add(review);
        return await _context.SaveChangesAsync() > 0;
    }
}