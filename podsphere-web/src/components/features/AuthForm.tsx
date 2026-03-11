"use client";

import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { UserDto } from "@/types/auth"; // Import đúng type User của mày

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export const AuthForm = ({ initialMode = "login" }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // FIX: Dùng setAuth thay vì login
  const { setAuth } = useAuthStore(); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // FIX: Truyền 1 Object { email, password }
        const response = await authService.login({ 
          email: formData.email, 
          password: formData.password 
        });

        // FIX: Mapping lại dữ liệu vì AuthResponse của mày không có field email
        const userForStore: UserDto = {
          id: response.id,
          username: response.username,
          email: formData.email, // Lấy tạm email từ form vì BE không trả về
          role: response.role,
          fullName: null,
          avatar: null,
          createdAt: ""
        };

        setAuth(userForStore, response.token);
        router.push("/dashboard/health");
      } else {
        // FIX: Truyền 1 Object { username, email, password }
        await authService.register({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        });
        
        alert("Đăng ký thành công rồi! Đăng nhập đi mày.");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi rồi mày ơi, check lại đi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isLogin ? "Chào mày quay lại!" : "Tạo tài khoản mới"}
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-3 top-3 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Tên người dùng"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required={!isLogin}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-zinc-400" size={18} />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-zinc-400" size={18} />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full py-6 text-base">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 w-full text-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-600"
      >
        {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
};