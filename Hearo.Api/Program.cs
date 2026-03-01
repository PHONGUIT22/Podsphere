using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

using Hearo.Infrastructure.Persistence;
using Hearo.Infrastructure.Authentication;
using Hearo.Application.Common.Interfaces.Authentication;
using Hearo.Application.Common.Interfaces.Persistence;
using Hearo.Application.Common.Interfaces.Services;
using Hearo.Application.Common.Mappings;
using Hearo.Application.Services.Authentication;
using Hearo.Application.Services.Podcasts;
using Hearo.Application.Services.Blogs;
using Hearo.Application.Services.Courses;
using Hearo.Application.Services.Lessons;
using Hearo.Application.Services.Meditations;
using Hearo.Application.Services.Notifications;
using Hearo.Application.Services.Payments;
using Hearo.Application.Services.Reviews;
using Hearo.Application.Services.Users;
using FluentValidation;
using FluentValidation.AspNetCore;
var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH DATABASE & INFRASTRUCTURE
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<HearoDbContext>(options =>
    options.UseSqlServer(connectionString,
        b => b.MigrationsAssembly("Hearo.Infrastructure")));

builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<HearoDbContext>());


// 2. CẤU HÌNH SWAGGER & CONTROLLERS
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Dán Token JWT vào đây (không cần thêm chữ Bearer phía trước)."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Bổ sung CORS (Rất quan trọng khi gọi API từ Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// 3. ĐĂNG KÝ SERVICES (DEPENDENCY INJECTION)
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
// Đăng ký AutoMapper quét tầng Application
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// JWT Generator
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// Nhóm Xác thực & Người dùng
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// Nhóm Sức khỏe & Tinh thần
builder.Services.AddScoped<IHealthService, HealthService>(); // Nếu có IHealthService
builder.Services.AddScoped<IMeditationService, MeditationService>();

// Nhóm Nội dung (Podcast & Blog)
builder.Services.AddScoped<IPodcastService, PodcastService>();
builder.Services.AddScoped<IBlogService, BlogService>();

// Nhóm Khóa học & Bài học
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<IUserCourseService, UserCourseService>();

// Nhóm Tương tác & Hệ thống
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Nhóm Tài chính
builder.Services.AddScoped<IPaymentService, PaymentService>();

// 4. CẤU HÌNH AUTHENTICATION (JWT)
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

// 5. BUILD APP & CONFIGURE PIPELINE
var app = builder.Build();

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<HearoDbContext>();
        DbInitializer.Seed(context); // Hãy chắc chắn bạn đã implement hàm này an toàn
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Có lỗi xảy ra trong quá trình Seed Data Database!");
    }
}

// Cấu hình HTTP request pipeline 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll"); 

app.UseAuthentication(); 
app.UseAuthorization();  

// Middleware kiểm tra quyền Premium (Chỉ chạy sau khi đã biết user là ai - tức là sau Authorization)
app.UseMiddleware<GlobalExceptionMiddleware>(); // Thêm dòng này lên đầu Pipeline
app.UseMiddleware<PremiumMiddleware>(); 

app.MapControllers(); // Gọi các Controllers

app.Run();