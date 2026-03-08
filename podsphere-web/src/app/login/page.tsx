"use client";

import { AuthForm } from "@/components/features/AuthForm";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState("");

  const handleLogin = async (data: any) => {
    try {
      setError("");
      // Gọi API login
      const response = await authService.login({
        email: data.email,
        password: data.password
      });
      
      // Lưu vào Store và nhảy về trang chủ
      setAuth({ 
        id: response.id, 
        username: response.username, 
        email: data.email, 
        role: response.role,
        createdAt: new Date().toISOString(),
        fullName: null,
        avatar: null
      }, response.token);
      
      router.push("/");
    } catch (err: any) {
      setError("Sai email hoặc mật khẩu rồi mày ơi.");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
}