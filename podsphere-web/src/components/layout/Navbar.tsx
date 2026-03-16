"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, User as UserIcon, Settings, X, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { useUIStore } from "@/store/useUIStore"; 

export const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar, isDarkMode, toggleTheme } = useUIStore();
  
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { name: "Trang chủ", href: "/", active: true },
    { name: "Podcast", href: "/podcasts" },
    { name: "Khóa học", href: "/courses" },
    { name: "Cộng đồng", href: "/community" },
  ];

  const handleLogout = () => {
    if (confirm("Mày muốn đăng xuất thật à?")) {
      logout(); 
      authService.logout(); 
      setShowUserMenu(false);
    }
  };

  return (
    // THÊM lg:pl-72 VÀO ĐÂY ĐỂ CĂN THẲNG VỚI FOOTER VÀ TRANG CHỦ, Hỗ trợ Light/Dark mode
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 lg:pl-72">
      
      {/* LEFT: Logo & Mobile Menu */}
      <div className="flex items-center gap-8">
        <button onClick={toggleSidebar} className="text-zinc-600 dark:text-zinc-400 lg:hidden hover:text-indigo-600">
          <Menu size={20} />
        </button>
        
        {/* Chỉ hiện Logo trên Mobile, Desktop thì Sidebar đã lo */}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black">
             P
          </div>
          <span className="text-xl font-bold tracking-tighter text-indigo-600 dark:text-white">PODSPHERE</span>
        </Link>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold transition-colors hover:text-indigo-600 ${link.active ? 'text-indigo-600' : 'text-zinc-500 dark:text-zinc-400'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* RIGHT: Actions & User */}
      <div className="flex items-center gap-4">
        {/* Nút đổi theme */}
        <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {isAuthenticated ? (
          <div className="relative flex items-center gap-3">
             <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 rounded-full bg-zinc-50 dark:bg-zinc-900 pr-3 border border-zinc-200 dark:border-zinc-800 transition-colors hover:border-indigo-500">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                   {user?.username?.[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{user?.username || "Tài khoản"}</span>
             </button>

             {/* Dropdown Menu Khôi phục lại */}
             {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 dark:border-zinc-800 dark:bg-zinc-950 z-50">
                <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Tài khoản</p>
                  <p className="truncate text-xs font-semibold dark:text-white">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-300">
                    <UserIcon size={14} /> Hồ sơ của tao
                  </Link>
                  <Link href="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-300">
                    <Settings size={14} /> Cài đặt
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors">
            <span className="text-xs font-bold">Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
};