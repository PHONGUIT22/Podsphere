using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Common.Interfaces.Persistence;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; set; }
    // Thêm các DbSet khác của mày vào đây...
    public DbSet<UserHealthStats> UserHealthStats { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<UserJournal> UserJournals { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Podcast> Podcasts { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Meditation> Meditations { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<UserCourse> UserCourses { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Payment> Payments { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}