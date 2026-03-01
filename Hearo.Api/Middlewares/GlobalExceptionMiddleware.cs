public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    public GlobalExceptionMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try {
            await _next(context);
        }
        catch (Exception ex) {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { 
                error = ex.Message, 
                detail = "Có biến rồi mày ơi, check lại log đi!",
                timestamp = DateTime.UtcNow
            });
        }
    }
}