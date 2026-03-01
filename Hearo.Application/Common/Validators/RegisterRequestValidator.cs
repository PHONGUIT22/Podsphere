using FluentValidation;
using Hearo.Application.Common.Models.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(3).WithMessage("Username phải ít nhất 3 ký tự mày ơi!");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email sai định dạng rồi!");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("Mật khẩu ít nhất 6 ký tự cho an toàn.");
        
        
    }
}