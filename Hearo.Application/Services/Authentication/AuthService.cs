using Hearo.Application.Common.Interfaces.Authentication;
using Hearo.Application.Common.Models.Auth;
using Hearo.Application.Common.Interfaces.Persistence;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Hearo.Domain.Entities;
namespace Hearo.Application.Services.Authentication;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    public async Task<bool> UpdateUserRole(Guid userId, string newRole)
    {
    var user = await _context.Users.FindAsync(userId);
    if (user == null) return false;

    // Chỉ chấp nhận các Role hợp lệ
    var validRoles = new List<string> { "Admin", "Creator", "User" };
    if (!validRoles.Contains(newRole)) throw new Exception("Role khong hop le may oi!");

    user.Role = newRole;
    await _context.SaveChangesAsync();
    return true;
    }
    public AuthService(IApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }
    public async Task<AuthResponse> Register(RegisterRequest request)
    {
    // 1. Kiểm tra email tồn tại chưa
    if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        throw new Exception("Email nay co thang dung roi may oi!");

    // 2. Băm mật khẩu (BCrypt)
    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

    // 3. Tạo User mới
    var user = new User
    {
        Id = Guid.NewGuid(),
        Username = request.Username,
        Email = request.Email,
        PasswordHash = hashedPassword,
        Role = "User" // Mặc định là User thường
    };

    // 4. Lưu luôn thông số sức khỏe (86kg, 1m68)
    // Trong hàm Register, đoạn tạo healthStats:
    var healthStats = new UserHealthStats
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        MoodScore = 5, // Mặc định trung bình
        StressLevel = "Medium",
        SleepHours = 7,
        UpdatedAt = DateTime.Now
    };

    _context.Users.Add(user);
    _context.UserHealthStats.Add(healthStats);
    await _context.SaveChangesAsync();

    var token = _jwtTokenGenerator.GenerateToken(user);
    return new AuthResponse(user.Id.ToString(), user.Username, token, user.Role);
    }
    public async Task<AuthResponse> Login(LoginRequest request)
    {
        // 1. Tìm user theo Email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        // Dùng BCrypt.Verify để kiểm tra mật khẩu đã băm
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
           throw new Exception("Sai email hoac mat khau roi!");

        // 3. Tạo Token
        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse(user.Id.ToString(), user.Username, token, user.Role);
    }
}