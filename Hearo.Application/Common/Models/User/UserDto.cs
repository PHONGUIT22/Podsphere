using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Users;

public record UserDto : IMapFrom<User>
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? FullName { get; init; }
    public string? Avatar { get; init; }
    public string Role { get; init; } = "User";
    public DateTime CreatedAt { get; init; }
}