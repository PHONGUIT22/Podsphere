using Microsoft.EntityFrameworkCore;
using Hearo.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer; // Mở ra khi làm Login
using Microsoft.Extensions.DependencyInjection;
using Hearo.Application.Common.Interfaces.Authentication;
using Hearo.Application.Common.Interfaces.Persistence; // Để nó hiểu IApplicationDbContext
using Hearo.Application.Services.Authentication;       // Để thấy AuthService (sau khi đã dời folder)
using Microsoft.IdentityModel.Tokens;
using Hearo.Infrastructure.Authentication;

using System.Text;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Services.Podcasts;
var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký DbContext (Đã chuẩn bài)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<HearoDbContext>(options =>
    options.UseSqlServer(connectionString, 
        b => b.MigrationsAssembly("Hearo.Infrastructure")));

// 2. Đăng ký Controller và Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Mày dán cái Token JWT vào đây thôi (không cần chữ Bearer phía trước đâu)."
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddScoped<IAuthService, AuthService>()
;
builder.Services.AddScoped<IHealthService, HealthService>();
builder.Services.AddScoped<IPodcastService, PodcastService>();
builder.Services.AddScoped<IApplicationDbContext>(provider => 
    provider.GetRequiredService<HearoDbContext>());
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
// 3. Đăng ký Authentication/Authorization (Mày chuẩn bị làm ở đây)
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)...
// Cấu hình Authentication với JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!))
    };
});
var app = builder.Build();
// --- Thêm đoạn này vào ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<HearoDbContext>();
        DbInitializer.Seed(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Có biến khi đang Seed Data mày ơi!");
    }
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
// QUAN TRỌNG: Mày phải có dòng này để chạy được các Controller API
app.UseAuthorization(); // Phải nằm sau app.UseHttpsRedirection()
app.UseMiddleware<PremiumMiddleware>();
app.MapControllers();   // <--- THÊM DÒNG NÀY VÀO

// Tạm thời giữ lại cái WeatherForecast để test nếu mày muốn
app.MapGet("/weatherforecast", () => { /* ... code cũ ... */ })
   .WithName("GetWeatherForecast")
   .WithOpenApi();

app.Run();