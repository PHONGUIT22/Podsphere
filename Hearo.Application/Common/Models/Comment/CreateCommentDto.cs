namespace Hearo.Application.Common.Models.Comments; // Đảm bảo đúng namespace của mày

public record CreateCommentDto
{
    public string Content { get; init; } = string.Empty;
    public double Timestamp { get; init; } // Phút/giây người dùng đang nghe
}