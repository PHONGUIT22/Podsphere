using Microsoft.EntityFrameworkCore;
using Hearo.Domain.Entities;
using Hearo.Application.Common.Interfaces.Persistence;

namespace Hearo.Infrastructure.Persistence;

public class HearoDbContext : DbContext, IApplicationDbContext
{
    public HearoDbContext(DbContextOptions<HearoDbContext> options) : base(options) { }

    // Đăng ký tất cả các bảng (Entities) vào đây
    public DbSet<User> Users { get; set; }
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

   protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // 1. Cấu hình N-N cho UserCourse (Quan trọng nhất)
    modelBuilder.Entity<UserCourse>()
        .HasKey(uc => new { uc.UserId, uc.CourseId }); // Khóa chính gồm 2 cột

    modelBuilder.Entity<UserCourse>()
        .HasOne(uc => uc.User)
        .WithMany() // Nếu User.cs không có ICollection<UserCourse> thì để trống
        .HasForeignKey(uc => uc.UserId);

    modelBuilder.Entity<UserCourse>()
        .HasOne(uc => uc.Course)
        .WithMany() 
        .HasForeignKey(uc => uc.CourseId);

    // 2. Cấu hình 1-1 cho User và HealthStats (Bụng 105cm của mày nè)
    modelBuilder.Entity<User>()
        .HasOne(u => u.HealthStats)
        .WithOne(h => h.User)
        .HasForeignKey<UserHealthStats>(h => h.UserId);

    // 3. Cấu hình Review (Vì nó trỏ về 2 bảng khác nhau nên dễ bị lỗi Cascade Delete)
    modelBuilder.Entity<Review>()
        .HasOne(r => r.Podcast)
        .WithMany(p => p.Reviews)
        .HasForeignKey(r => r.PodcastId) // Thêm dòng này vào
        .OnDelete(DeleteBehavior.Restrict); // Tránh lỗi xóa dây chuyền trong SQL Server
    
    modelBuilder.Entity<Review>()
        .HasOne(r => r.Course)
        .WithMany(c => c.Reviews)
        .HasForeignKey(r => r.CourseId) // Chỉ định đích danh để không đẻ ra CourseId1
        .OnDelete(DeleteBehavior.Restrict);
    
    // 4. Cấu hình độ chính xác cho Tiền tệ (Tránh Warning Decimal)
    modelBuilder.Entity<Course>(entity => {
        entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
        entity.Property(e => e.SalePrice).HasColumnType("decimal(18,2)");
    });

    modelBuilder.Entity<Payment>(entity => {
        entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
    });
}
}