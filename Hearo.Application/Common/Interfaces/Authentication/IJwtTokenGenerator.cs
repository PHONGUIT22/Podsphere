using Hearo.Domain.Entities;

namespace Hearo.Application.Common.Interfaces.Authentication;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}