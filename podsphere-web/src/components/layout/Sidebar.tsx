// src/components/layout/Sidebar.tsx
"use client";

import { Home, Compass, Library, Activity, Heart, Clock, PlayCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";

const menuItems = [
  { group: "Menu", items: [
    { icon: Home, label: "Trang chủ", href: "/" },
    { icon: Compass, label: "Khám phá", href: "/explore" },
    { icon: Activity, label: "Sức khỏe", href: "/dashboard/health" },
  ]},
  { group: "Thư viện", items: [
    { icon: Heart, label: "Đã thích", href: "/library/liked" },
    { icon: PlayCircle, label: "Tập của tôi", href: "/library/episodes" },
    { icon: Clock, label: "Gần đây", href: "/library/recent" },
  ]}
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUIStore(); 

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={closeSidebar} />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-zinc-100 bg-white p-6 transition-transform duration-300 dark:border-zinc-800 dark:bg-black lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Logo Hearo Style */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
            <PlayCircle size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter dark:text-white">HEARO</span>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((group) => (
            <div key={group.group}>
              <h4 className="mb-4 px-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href; 
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      onClick={closeSidebar}
                      className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                        isActive 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade Card (Giống trong Dashboard hiện đại) */}
        <div className="mt-auto rounded-3xl bg-zinc-900 p-4 text-white dark:bg-zinc-800">
          <p className="text-xs font-bold opacity-60">Gói Premium</p>
          <p className="mt-1 text-sm font-black">Mở khóa thiền định</p>
          <button className="mt-3 w-full rounded-xl bg-white py-2 text-xs font-black text-black transition-transform hover:scale-105">
            Nâng cấp ngay
          </button>
        </div>
      </aside>
    </>
  );
};