public interface IAstrologyService
{
    // Hàm này nhận ngày sinh, giờ sinh và trả về chuỗi JSON kết quả
    Task<string> GetAstrologyDataAsync(DateTime birthDate, int hour, bool isMale, int viewYear);
    Task<string> GetBaziDataAsync(DateTime birthDate, int hour, bool isMale);
    Task<string> CastIChingHexagramAsync(int year, int month, int day, int hour, string topic);
}