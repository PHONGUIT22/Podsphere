import { Home, Compass, Library, Activity, LayoutGrid, Heart } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: Home, label: "Trang chủ", href: "/" },
  { icon: Compass, label: "Khám phá", href: "/explore" },
  { icon: Activity, label: "Sức khỏe", href: "/dashboard/health" },
  { icon: Library, label: "Thư viện", href: "/library" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-right border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-600"></div>
        <span className="text-xl font-bold tracking-tighter">PODSPHERE</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white">
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Gần đây</h4>
        <div className="mt-4 space-y-1">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-500 hover:text-indigo-600"><Heart size={14} /> Podcast yêu thích</Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-500 hover:text-indigo-600"><LayoutGrid size={14} /> Danh mục thiền</Link>
        </div>
      </div>
    </aside>
  );
};