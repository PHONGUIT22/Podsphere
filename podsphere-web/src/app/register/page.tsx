"use client";

import { AuthForm } from "@/components/features/AuthForm";
import Link from "next/link";
import { Headphones } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      {/* Logo hoặc Brand Name cho ngầu */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
          <Headphones size={28} />
        </div>
        <h1 className="text-2xl font-black tracking-tight">PodSphere</h1>
      </div>

      <div className="w-full max-w-[400px]">
        <AuthForm initialMode="register" />
        
        <p className="mt-6 text-center text-sm text-zinc-500">
          Đã có tài khoản rồi à?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <footer className="mt-12 text-[10px] text-zinc-400 uppercase tracking-widest">
        Thiết kế bởi Sinh viên UIT © 2026
      </footer>
    </div>
  );
}