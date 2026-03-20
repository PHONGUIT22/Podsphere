using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hearo.Application.Common.Interfaces.Persistence;

public interface IApplicationDbContext
{
    // Nhóm User & Core
    DbSet<User> Users { get; set; }
    DbSet<Subscription> Subscriptions { get; set; }
    DbSet<Notification> Notifications { get; set; }
    DbSet<Payment> Payments { get; set; }

    // Nhóm Sức khỏe (Health & Journal)
    DbSet<UserHealthStats> UserHealthStats { get; set; }
    DbSet<UserJournal> UserJournals { get; set; }

    // Nhóm Nội dung (Podcast, Course, Blog)
    DbSet<Category> Categories { get; set; }
    DbSet<Podcast> Podcasts { get; set; }
    DbSet<Episode> Episodes { get; set; }
    DbSet<Meditation> Meditations { get; set; }
    DbSet<Course> Courses { get; set; }
    DbSet<Lesson> Lessons { get; set; }
    DbSet<UserCourse> UserCourses { get; set; }
    DbSet<Blog> Blogs { get; set; }

    // Nhóm Tương tác xã hội
    DbSet<Review> Reviews { get; set; }
    DbSet<Comment> Comments { get; set; }

    // Nhóm Thư viện & Lịch sử
    DbSet<UserFavoritePodcast> UserFavoritePodcasts { get; set; }
    DbSet<UserFavoriteMeditation> UserFavoriteMeditations { get; set; }
    DbSet<UserFavoriteEpisode> UserFavoriteEpisodes { get; set; }
    DbSet<UserEpisodeHistory> UserEpisodeHistories { get; set; }

    // Nhóm Huyền Học (Astrology & IChing)
    DbSet<AstrologyProfile> AstrologyProfiles { get; set; }
    DbSet<BaziChart> BaziCharts { get; set; }
    DbSet<TuViChart> TuViCharts { get; set; }
    DbSet<IChingDivination> IChingDivinations { get; set; }
    DbSet<DailyAstrologyInsight> DailyAstrologyInsights { get; set; }

    // Phương thức lưu dữ liệu
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}