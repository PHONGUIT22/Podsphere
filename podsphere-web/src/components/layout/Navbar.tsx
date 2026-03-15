"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Bổ sung import Menu, Moon, Sun từ lucide-react
import { Search, Bell, LogOut, User as UserIcon, Settings, X, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { systemService } from "@/services/system.service";
import { NotificationDto } from "@/types/system";
import { NotificationList } from "@/components/features/NotificationList";

// Import UI Store theo gợi ý của AI
import { useUIStore } from "@/store/useUIStore"; 

export const Navbar = () => {
  const router = useRouter();
  
  // Store
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar, isDarkMode, toggleTheme } = useUIStore(); // Lấy từ UI Store
  
  // States
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  
  // Bổ sung state lưu kết quả search nhanh
  const [results, setResults] = useState<any[]>([]); 

  // 1. Lấy thông báo thật từ Backend
  useEffect(() => {
    if (isAuthenticated) {
      systemService.getMyNotifications()
        .then(setNotifications)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  // 2. Logic Logout
  const handleLogout = () => {
    if (confirm("Mày muốn đăng xuất thật à?")) {
      logout(); 
      authService.logout(); 
    }
  };

  // 3. Logic Search (Kết hợp gõ dropdown nhanh & Nhấn Enter sang trang Explore)
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.length > 2) {
      // Demo dummy data dropdown. Chỗ này sau gọi API search real nhé
      setResults([{ id: '1', title: `Kết quả nhanh cho: ${val}` }]); 
    } else {
      setResults([]);
    }
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowNotifications(false);
      setShowUserMenu(false);
      setResults([]); // Ẩn dropdown search khi đã enter
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  const hasUnreadNotification = notifications.some((noti) => !noti.isRead);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 lg:pl-72">
      
      {/* KHỐI BÊN TRÁI: Menu Mobile + Search Bar */}
      <div className="flex flex-1 items-center gap-3 md:gap-4">
        {/* Nút Hamburger cho Mobile (ẩn trên desktop lg) */}
        <button 
          onClick={toggleSidebar} 
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Ô Tìm kiếm với Dropdown */}
        <div className="relative w-full max-w-md">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900">
            <Search size={18} className="text-zinc-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchEnter}
              placeholder="Tìm podcast, khóa học..." 
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown (Hiện khi gõ > 2 ký tự) */}
          {results.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 text-[10px] font-bold uppercase text-zinc-500">Kết quả nhanh</div>
              {results.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => {
                     // Nếu click vào kết quả nhanh thì đẩy sang trang nào đó (ví dụ detail podcast)
                     router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
                     setResults([]);
                  }}
                  className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm cursor-pointer transition-colors"
                >
                  {r.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KHỐI BÊN PHẢI: Theme + Notification + User */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2">
        
        {/* Nút Đổi Theme */}
        <button 
          onClick={toggleTheme} 
          className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Nút thông báo + Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={`relative rounded-full p-2 transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'}`}
          >
            <Bell size={20} />
            {hasUnreadNotification && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-black"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
              <NotificationList notifications={notifications} />
            </div>
          )}
        </div>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 rounded-full p-1 pr-2 sm:pr-3 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-md">
                {user?.username?.[0].toUpperCase()}
              </div>
              <span className="hidden text-xs font-bold sm:block dark:text-white">{user?.username}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 dark:border-zinc-800 dark:bg-zinc-950 z-50">
                <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Tài khoản</p>
                  <p className="truncate text-xs font-semibold dark:text-white">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-300">
                    <UserIcon size={14} /> Hồ sơ của tôi
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-300">
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
          <Link href="/login" className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-zinc-800 dark:border-zinc-800 dark:bg-white dark:text-black">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};