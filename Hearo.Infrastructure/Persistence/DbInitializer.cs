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
  
        // 4. Tạo chỉ số sức khỏe mẫu (Dựa trên thông số của mày)
        var healthStats = new UserHealthStats
        {
            UserId = admin.Id,
            Weight = 86.0, // Cân nặng 86kg
            Height = 1.68, // Chiều cao 1.68m
            WaistCircumference = 105.0 // Vòng bụng 105cm
        };
        context.UserHealthStats.Add(healthStats);

        // 5. Tạo Podcast mẫu
        context.Podcasts.Add(new Podcast
        {
            Title = "Hành trình vượt qua Gan NASH độ 2", // Tình trạng gan của mày
            Description = "Podcast chia sẻ kinh nghiệm sống lành mạnh cho sinh viên UIT.",
            CategoryId = category.Id,
            IsPremium = false
        });

        // 6. Tạo Blog mẫu
        context.Blogs.Add(new Blog
        {
            Title = "Cách giảm vòng bụng từ 105cm xuống chuẩn",
            Content = "Bài viết hướng dẫn các bài tập cho người có SMM 31.3 kg.",
            AuthorId = admin.Id,
            Slug = "giam-vong-bung-hieu-qua"
        });

        context.SaveChanges();
    }
}