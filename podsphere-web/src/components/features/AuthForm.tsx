"use client";
import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { LoginRequest, RegisterRequest } from "@/types/auth";

export const AuthForm = ({ type = "login", onSubmit }: { 
  type?: "login" | "register", 
  onSubmit: (data: any) => void 
}) => {
  const [mode, setMode] = useState(type);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {mode === "login" ? "Chào mày quay lại!" : "Tạo tài khoản mới"}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          {mode === "login" ? "Nhập thông tin để tiếp tục nghe Podcast" : "Tham gia cộng đồng Podsphere ngay"}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
        {mode === "register" && (
          <div className="relative">
            <User className="absolute left-3 top-3 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Tên người dùng"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-zinc-400" size={18} />
          <input
            type="email"
            placeholder="Email của mày"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-zinc-400" size={18} />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95">
          {mode === "login" ? <LogIn size={20} /> : <UserPlus size={20} />}
          {mode === "login" ? "Đăng nhập" : "Đăng ký"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <button 
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {mode === "login" ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
        </button>
      </div>
    </div>
  );
};