"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Bell, UserCircle, LogOut, User as UserIcon, Settings, X } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { NotificationList } from "@/components/features/NotificationList";
// Giả định mày sẽ lấy list noti từ service sau, giờ tao dùng dummy data để test UI
const dummyNotifications = [
  { id: "1", title: "Chào mừng mày!", message: "Bắt đầu nghe Podcast ngay thôi.", isRead: false, type: "System", createdAt: new Date().toISOString() }
];

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    if (confirm("Mày muốn đăng xuất thật à?")) {
      logout(); // Xóa state trong Store
      authService.logout(); // Xóa token và về login
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 lg:pl-72">
      {/* 1. Ô tìm kiếm */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900">
        <Search size={18} className="text-zinc-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm podcast, khóa học..." 
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500" 
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-zinc-600">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* 2. Nút thông báo + Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative rounded-full p-2 transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-black"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
              <NotificationList notifications={dummyNotifications} />
            </div>
          )}
        </div>

        {/* 3. User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-full p-1 pr-3 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user?.username?.[0].toUpperCase()}
              </div>
              <span className="hidden text-xs font-bold sm:block">{user?.username}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Tài khoản</p>
                  <p className="truncate text-xs font-semibold">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <UserIcon size={14} /> Hồ sơ của tao
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <Settings size={14} /> Cài đặt
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-zinc-800 dark:border-zinc-800 dark:bg-white dark:text-black">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};