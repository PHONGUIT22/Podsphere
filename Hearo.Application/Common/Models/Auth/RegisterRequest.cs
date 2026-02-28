public record RegisterRequest(
    string Username, 
    string Email, 
    string Password,
    double Weight, // Để lưu số 86kg của mày
    double Height  // Để lưu 1m68
);