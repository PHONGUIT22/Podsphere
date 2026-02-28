using Hearo.Domain.Common;

namespace Hearo.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? Avatar { get; set; }
    public string Role { get; set; } = "User"; // Admin, Creator, User
    public UserHealthStats? HealthStats { get; set; }
}