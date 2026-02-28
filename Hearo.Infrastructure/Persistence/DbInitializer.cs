using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
namespace Hearo.Infrastructure.Persistence;

public static class DbInitializer
{
    public static void Seed(HearoDbContext context)
    {
        // Đảm bảo DB đã được tạo
        context.Database.EnsureCreated();

        // 1. Kiểm tra nếu đã có User thì thôi không Seed nữa
        if (context.Users.Any()) return;

        // 2. Tạo Category mẫu
        var category = new Category { Name = "Sức khỏe tâm thần", Slug = "suc-khoe-tam-than" };
        context.Categories.Add(category);

        // 3. Tạo Admin (Chính là mày)
        var admin = new User
        {
            Username = "hearo_admin",
            Email = "admin@hearo.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), // Sau này dùng BCrypt sau
            FullName = "Admin PodSphere",
            Role = "Admin"
        };
        context.Users.Add(admin);
  
            // 4. Tạo chỉ số sức khỏe tinh thần mẫu (Thay cho đống Weight/Height cũ)
        var healthStats = new UserHealthStats
        {
            UserId = admin.Id,
            MoodScore = 8, // Tinh thần đang rất "hào sảng"
            StressLevel = "Low",
            SleepHours = 8.0,
            UpdatedAt = DateTime.Now
        };
        context.UserHealthStats.Add(healthStats);

        // 5. Cập nhật Podcast mẫu cho khớp chủ đề "Chữa lành"
        context.Podcasts.Add(new Podcast
        {
            Title = "Làm sao để code không Stress tại UIT?", 
            Description = "Podcast chia sẻ cách cân bằng giữa việc học và sức khỏe tinh thần.",
            Tags = "Stress,ChuaLanh",
            CategoryId = category.Id,
            IsPremium = false
        });

        // 6. Cập nhật Blog mẫu
        context.Blogs.Add(new Blog
        {
            Title = "Nhật ký của một Senior Dev về sức khỏe tinh thần",
            Content = "Đừng để deadline làm mờ mắt, hãy chăm sóc tâm hồn mình trước.",
            AuthorId = admin.Id,
            Slug = "cham-soc-suc-khoe-tinh-than"
        });

        context.SaveChanges();
    }
}