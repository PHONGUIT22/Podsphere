// RegisterRequest.cs
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// AuthResponse.cs
export interface AuthResponse {
    id: string;
    username: string;
    token: string;
    role: string;
}

// AuthResponse.cs (LoginRequest)
export interface LoginRequest {
    email: string;
    password: string;
}

// UserDto.cs
export interface UserDto {
    id: string;
    username: string;
    email: string;
    fullName: string | null;
    avatar: string | null;
    role: string;
    createdAt: string;
}