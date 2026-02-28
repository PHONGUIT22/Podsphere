using Hearo.Application.Common.Models.Auth;

namespace Hearo.Application.Common.Interfaces.Authentication;

public interface IAuthService
{
    Task<AuthResponse> Login(LoginRequest request);
    Task<AuthResponse> Register(RegisterRequest request);
    Task<bool> UpdateUserRole(Guid userId, string newRole);
}