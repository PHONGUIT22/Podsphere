import { api } from "../lib/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authService = {
  login: async (credentials: LoginRequest) => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    if (data.token) {
      localStorage.setItem("token", data.token); 
    }
    return data;
  },

  register: async (userData: RegisterRequest) => {
    const { data } = await api.post<AuthResponse>("/auth/register", userData);
    return data;
  },

  getMe: async () => {
    try {
      const { data } = await api.get("/auth/me"); 
      return data; // Trả về thông tin user (UserDto)
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};