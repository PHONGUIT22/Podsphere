using Microsoft.AspNetCore.Http;

namespace Hearo.Api.Models; 

public class CreateEpisodeRequest
{
    public IFormFile File { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsExclusive { get; set; }
}