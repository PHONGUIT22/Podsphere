namespace Hearo.Application.Common.Models.Auth;

public record AuthResponse(string Id, string Username, string Token, string Role);
public record LoginRequest(string Email, string Password);