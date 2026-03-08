"use client";
import { Search, Bell, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 lg:pl-72">
      <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
        <Search size={18} className="text-zinc-400" />
        <input type="text" placeholder="Tìm podcast, khóa học..." className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500" />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-black"></span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold">{user?.username}</span>
              <button onClick={logout} className="text-[10px] text-red-500 flex items-center gap-1 hover:underline">
                <LogOut size={10} /> Thoát
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.username?.[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 rounded-full border border-zinc-200 p-1 pr-3 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900">
            <UserCircle size={24} className="text-zinc-400" />
            <span className="text-xs font-bold">Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
};