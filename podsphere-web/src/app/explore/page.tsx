"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Flame, Sparkles, Hash, Trophy, Headphones, ArrowRight } from "lucide-react";

// Dữ liệu giả lập cho các Thẻ màu sắc (Giống Spotify Browse)
const browseCategories = [
  { id: 1, name: "Tâm lý học", color: "from-blue-600 to-blue-400", img: "🧠" },
  { id: 2, name: "Chữa lành", color: "from-emerald-600 to-teal-400", img: "🌿" },
  { id: 3, name: "Sinh viên UIT", color: "from-indigo-600 to-purple-500", img: "💻" },
  { id: 4, name: "Thư giãn & Ngủ", color: "from-indigo-900 to-slate-800", img: "🌙" },
  { id: 5, name: "Phát triển bản thân", color: "from-orange-500 to-amber-400", img: "🚀" },
  { id: 6, name: "Tình yêu", color: "from-rose-500 to-pink-500", img: "❤️" },
  { id: 7, name: "Giao tiếp", color: "from-cyan-600 to-cyan-400", img: "🗣️" },
  { id: 8, name: "Tiếng Anh", color: "from-violet-600 to-fuchsia-500", img: "🇬🇧" },
];

// Dữ liệu giả lập cho Bảng xếp hạng
const topTrending = [
  { id: "1", title: "Khủng hoảng tuổi 20: Làm sao để vượt qua?", author: "Minh Podcast", plays: "12.5K" },
  { id: "2", title: "Bí kíp sống sót qua mùa đồ án UIT", author: "IT Confessions", plays: "9.2K" },
  { id: "3", title: "Overthinking trước khi ngủ và cách tắt não", author: "Chữa lành cùng Tun", plays: "8.8K" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-24 font-sans">
      
      {/* 1. HEADER & SEARCH BAR (Khu vực tìm kiếm trung tâm) */}
      <section className="relative px-6 py-12 md:py-20 lg:px-12 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Glow chìm nền */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Tìm kiếm
          </h1>
          
          {/* Thanh Search bự chà bá */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-zinc-900/80 border border-zinc-700 hover:border-zinc-500 rounded-full px-6 py-4 transition-all">
              <Search size={24} className="text-zinc-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bạn muốn nghe gì hôm nay?" 
                className="w-full bg-transparent text-white text-lg font-medium px-4 outline-none placeholder:text-zinc-500"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* CỘT TRÁI: DANH MỤC THỊNH HÀNH (Chiếm 2 phần) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Hash size={24} className="text-indigo-500" />
            <h2 className="text-2xl font-black text-white tracking-tight">Duyệt theo chủ đề</h2>
          </div>

          {/* Grid thẻ màu sắc kiểu Spotify */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {browseCategories.map((cat) => (
              <Link 
                href={`/podcasts?category=${cat.name}`} 
                key={cat.id}
                className={`relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br ${cat.color} p-4 hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer group`}
              >
                <h3 className="text-white font-black text-lg leading-tight w-2/3 z-10 relative shadow-black/50 drop-shadow-md">
                  {cat.name}
                </h3>
                {/* Icon bự chà bá xoay nghiêng ở góc phải */}
                <div className="absolute -bottom-4 -right-4 text-7xl opacity-80 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 drop-shadow-2xl">
                  {cat.img}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG XẾP HẠNG & GỢI Ý (Chiếm 1 phần) */}
        <div className="space-y-12">
          
          {/* Top Trending */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Trophy size={24} className="text-yellow-500" />
                <h2 className="text-xl font-black text-white tracking-tight">Top Trending</h2>
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">VN</span>
            </div>

            <div className="space-y-4">
              {topTrending.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 group cursor-pointer hover:bg-zinc-900/50 p-2 rounded-xl transition-colors">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-black text-lg ${
                    index === 0 ? 'text-yellow-500 bg-yellow-500/10' : 
                    index === 1 ? 'text-zinc-300 bg-zinc-300/10' : 
                    index === 2 ? 'text-amber-600 bg-amber-600/10' : 'text-zinc-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{item.author}</p>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 flex items-center gap-1">
                    <Flame size={12} className={index === 0 ? "text-orange-500" : ""} /> {item.plays}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 rounded-xl border border-zinc-800 text-xs font-bold text-white hover:bg-zinc-800 transition-colors">
              Xem toàn bộ bảng xếp hạng
            </button>
          </div>

          {/* Nút Surprise Me */}
          <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-900 to-purple-900 p-8 overflow-hidden group cursor-pointer shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="relative z-10 space-y-4">
              <Sparkles size={32} className="text-purple-300 animate-pulse" />
              <div>
                <h3 className="text-xl font-black text-white">Chưa biết nghe gì?</h3>
                <p className="text-sm text-indigo-200 mt-1 font-medium">Để AI chọn ngẫu nhiên một tập podcast phù hợp với tâm trạng của mày nhé.</p>
              </div>
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-black hover:scale-105 transition-transform">
                <Headphones size={18} /> Nghe thử ngay
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}