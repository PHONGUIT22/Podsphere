public interface IAstrologyService
{
    // Hàm này nhận ngày sinh, giờ sinh và trả về chuỗi JSON kết quả
    Task<string> GetAstrologyDataAsync(DateTime birthDate, int hour, bool isMale, int viewYear);
    Task<string> GetBaziDataAsync(DateTime birthDate, int hour, bool isMale);
}