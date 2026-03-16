"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Biến này để chống lỗi giao diện của Next.js khi dùng localStorage
  const [mounted, setMounted] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    
    // TẠM THỜI TẮT LẤY DỮ LIỆU TỪ SERVER VÌ BACKEND CHƯA CÓ API /auth/me
    // Zustand 'persist' đã tự động nhớ state user & token ở dưới LocalStorage rồi.
    /*
    if (!token) return;
    const initAuth = async () => { ... }
    */
  }, [token]);

  // Nếu giao diện chưa load xong từ LocalStorage lên thì render trống để tránh lỗi nháy hình
  if (!mounted) {
    return <div className="min-h-screen bg-[#050b10]"></div>; 
  }

  return <>{children}</>;
};