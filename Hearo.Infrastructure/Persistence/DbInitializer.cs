using Hearo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace Hearo.Infrastructure.Persistence;

public static class DbInitializer
{
    public static void Seed(HearoDbContext context)
    {
        // 0. Đảm bảo DB đã được tạo
        context.Database.EnsureCreated();

        // --- 1. SEED USER (CHỈ NẠP NẾU CHƯA CÓ) ---
        if (!context.Users.Any())
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Username = "hearo_admin",
                Email = "admin@hearo.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                FullName = "Admin PodSphere",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
            context.SaveChanges();

            // Nạp Health Stats kèm theo cho Admin luôn
            context.UserHealthStats.Add(new UserHealthStats
            {
                UserId = admin.Id,
                MoodScore = 8,
                StressLevel = "Low",
                SleepHours = 8.0,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // --- 2. SEED CATEGORY ---
        if (!context.Categories.Any())
        {
            context.Categories.Add(new Category { Name = "Sức khỏe tâm thần", Slug = "suc-khoe-tam-than" });
            context.SaveChanges();
        }

        var mainCategory = context.Categories.First();
        var mainAdmin = context.Users.First();

        // --- 3. SEED PODCAST ---
        if (!context.Podcasts.Any())
        {
            context.Podcasts.Add(new Podcast
            {
                Title = "Làm sao để code không Stress tại UIT?",
                Description = "Podcast chia sẻ cách cân bằng giữa việc học và sức khỏe tinh thần.",
                Tags = "Stress,ChuaLanh",
                CategoryId = mainCategory.Id,
                IsPremium = false
            });
        }

        // --- 4. SEED BLOG ---
        if (!context.Blogs.Any())
        {
            context.Blogs.Add(new Blog
            {
                Title = "Nhật ký của một Senior Dev về sức khỏe tinh thần",
                Content = "Đừng để deadline làm mờ mắt, hãy chăm sóc tâm hồn mình trước.",
                AuthorId = mainAdmin.Id,
                Slug = "cham-soc-suc-khoe-tinh-than"
            });
        }

        // --- 5. QUAN TRỌNG: SEED 6 BÀI THIỀN (CHỈ NẠP NẾU BẢNG ĐANG RỖNG) ---
        if (!context.Meditations.Any())
        {
            context.Meditations.AddRange(
                new Meditation
                {
                    Id = Guid.NewGuid(),
                    Title = "3 Phút Hạ Nhiệt Stress",
                    Description = "Bài thiền 'cứu bồ' dành cho những lúc mày vừa bị Deadline vả hoặc rớt môn. Lấy lại bình tĩnh ngay lập tức.",
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    Thumbnail = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500",
                    Duration = 180,
                    Target = "Quick"
                },
                new Meditation
                {
                    Id = Guid.NewGuid(),
                    Title = "Hít Thở Tỉnh Thức",
                    Description = "Tập trung vào hơi thở để lấy lại sự tập trung trước khi bắt đầu một buổi code xuyên đêm.",
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                    Thumbnail = "https://images.unsplash.com/photo-1518241353349-9b5ed3e35ab0?q=80&w=500",
                    Duration = 300,
                    Target = "Quick"
                },
                new Meditation
                {
                    Id = Guid.NewGuid(),
                    Title = "Chữa Lành Nội Tâm",
                    Description = "Thiền sâu kết hợp nhạc tần số 432Hz giúp xoa dịu những tổn thương và tìm lại sự bình yên.",
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                    Thumbnail = "https://images.unsplash.com/photo-1528319725582-ddc0b3a14651?q=80&w=500",
                    Duration = 900,
                    Target = "Deep"
                },
                new Meditation
                {
                    Id = Guid.NewGuid(),
                    Title = "Mưa Đêm Trên Mái Tôn",
                    Description = "Tiếng kể chuyện kết hợp âm thanh mưa rơi đưa mày vào giấc ngủ sâu trong vòng 3 nốt nhạc.",
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                    Thumbnail = "https://images.unsplash.com/photo-1444464666168-49d633b867ad?q=80&w=500",
                    Duration = 1800,
                    Target = "Sleep"
                },
                new Meditation
                {
                    Id = Guid.NewGuid(),
                    Title = "Tiếng Sóng Biển Rì Rào",
                    Description = "Đưa tâm hồn mày ra biển vắng, nơi chỉ có tiếng sóng và sự bình yên tuyệt đối. Thích hợp để ngủ.",
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                    Thumbnail = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500",
                    Duration = 2100,
                    Target = "Sleep"
                },
                new Meditation
                {
                    Id = Guid.NewGuid(),
                    Title = "Tư Duy Alpha Siêu Cấp",
                    Description = "Nhạc sóng não Alpha giúp mày học bài nhanh hơn, nhớ lâu hơn và không bị xao nhãng.",
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
                    Thumbnail = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500",
                    Duration = 3600,
                    Target = "Focus"
                }
            );
        }

        // Lưu tất cả dữ liệu
        context.SaveChanges();
    }
}