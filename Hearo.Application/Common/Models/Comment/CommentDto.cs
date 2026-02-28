using Hearo.Domain.Entities;
using Hearo.Application.Common.Mappings;

namespace Hearo.Application.Common.Models.Comments;

public record CommentDto : IMapFrom<Comment>
{
    public Guid Id { get; init; }
    public string Content { get; init; } = string.Empty;
    public double Timestamp { get; init; }
    public DateTime CreatedAt { get; init; }
    
    public Guid UserId { get; init; }
    public string? UserUsername { get; init; } // Map từ User.Username
    public string? UserAvatar { get; init; }   // Map từ User.Avatar
}