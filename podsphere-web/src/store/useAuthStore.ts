import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Dùng middleware này để lưu data
import { UserDto } from '@/types/auth';

interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserDto, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        // Không cần thủ công localStorage.setItem nữa, persist nó tự lo
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        // Persist cũng sẽ tự xóa hoặc cập nhật localStorage khi set về null
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage'); // Xóa sạch dấu vết nếu muốn
      },
    }),
    {
      name: 'auth-storage', // Tên của key trong localStorage
      storage: createJSONStorage(() => localStorage), // Lưu vào localStorage
    }
  )
);