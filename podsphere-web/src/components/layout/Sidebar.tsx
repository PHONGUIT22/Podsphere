"use client";

import { Home, Compass, Library, Activity, LayoutGrid, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore"; // Thêm import Store chứa logic Sidebar

const menuItems = [
  { icon: Home, label: "Trang chủ", href: "/" },
  { icon: Compass, label: "Khám phá", href: "/explore" },
  { icon: Activity, label: "Sức khỏe", href: "/dashboard/health" },
  { icon: Library, label: "Thư viện", href: "/library" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  // Lấy state và hàm đóng Sidebar từ UI Store
  const { isSidebarOpen, closeSidebar } = useUIStore(); 

  return (
    <>
      {/* 1. Overlay (Màn đen mờ mờ): Bấm ra ngoài vùng Sidebar trên mobile để đóng */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={closeSidebar}
        />
      )}

      {/* 2. Sidebar Chính */}
      {/* Đã bỏ class "hidden" và thay bằng flex, kết hợp translate-x để tạo hiệu ứng trượt */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-zinc-200 bg-white p-4 transition-transform duration-300 dark:border-zinc-800 dark:bg-black lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600"></div>
          <span className="text-xl font-bold tracking-tighter">PODSPHERE</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href; 
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={closeSidebar} // Click vào link thì tự đóng Sidebar (trên mobile)
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-white" 
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Phần Gần đây */}
        <div className="mt-8">
          <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Gần đây</h4>
          <div className="mt-4 space-y-1">
            <Link 
              href="#" 
              onClick={closeSidebar}
              className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-500 hover:text-indigo-600"
            >
              <Heart size={14} /> Podcast yêu thích
            </Link>
            <Link 
              href="#" 
              onClick={closeSidebar}
              className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-500 hover:text-indigo-600"
            >
              <LayoutGrid size={14} /> Danh mục thiền
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};