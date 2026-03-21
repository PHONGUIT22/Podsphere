"use client";

import React from "react";
import Link from "next/link";
// Thay MilkyWay bằng Orbit hoặc Stars
import { 
  Sparkles, 
  Coins, 
  Clock, 
  LayoutGrid, 
  Orbit, // <--- Thay đổi ở đây
  History, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function AstrologyHubPage() {
  const services = [
    {
      title: "Lập Lá Số Tử Vi",
      desc: "Xem vận mệnh cuộc đời qua 12 cung số, chính tinh và phụ tinh.",
      icon: <Orbit size={48} />, // <--- Thay đổi ở đây
      link: "/astrology/tu-vi",
      color: "from-indigo-600 to-blue-600",
      tag: "PHỔ BIẾN"
    },
    {
      title: "Bát Tự (Tứ Trụ)",
      desc: "Phân tích Ngũ hành bản mệnh, tìm dụng thần để cân bằng cuộc sống.",
      icon: <LayoutGrid size={48} />,
      link: "/astrology/ba-zi",
      color: "from-emerald-600 to-teal-600",
      tag: "CHI TIẾT"
    },
    {
      title: "Quẻ Mai Hoa Dịch",
      desc: "Lập quẻ dựa trên thời gian hiện tại để tìm lời giải cho sự việc tức thời.",
      icon: <Clock size={48} />,
      link: "/astrology/mai-hoa",
      color: "from-amber-600 to-orange-600",
      tag: "QUYẾT ĐỊNH"
    },
    {
      title: "Gieo Quẻ Lục Hào",
      desc: "Mô phỏng gieo 3 đồng xu để thỉnh ý quẻ Dịch cho một vấn đề cụ thể.",
      icon: <Coins size={48} />,
      link: "/astrology/luc-hao",
      color: "from-rose-600 to-pink-600",
      tag: "RANDOM XU"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-16 pb-32 font-sans bg-black min-h-screen text-white">
      
      {/* 1. HERO SECTION */}
      <header className="relative text-center space-y-4 py-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Khám phá vận mệnh</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Trung Tâm <span className="text-indigo-500">Huyền Học</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
            Kết hợp trí tuệ cổ xưa và công nghệ AI để thấu hiểu bản thân, 
            dự đoán vận thế và tìm lại sự cân bằng trong tâm hồn.
          </p>
        </div>
      </header>

      {/* 2. SERVICES GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {services.map((s, i) => (
          <Link href={s.link} key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 p-8 hover:border-indigo-500/30 transition-all duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-3xl bg-zinc-800 text-white group-hover:bg-indigo-600 transition-colors duration-500 shadow-xl`}>
                  {s.icon}
                </div>
                <span className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-400">
                  {s.tag}
                </span>
              </div>

              <div className="mt-8 space-y-3">
                <h3 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium max-w-xs">{s.desc}</p>
              </div>

              <div className="mt-10 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Bắt đầu ngay <ArrowRight size={16} className="text-indigo-500" />
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-5 text-white group-hover:scale-110 transition-transform duration-700">
              {s.icon}
            </div>
          </Link>
        ))}
      </section>

      {/* 3. LỊCH SỬ TRA CỨU */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <History className="text-indigo-500" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Lá số đã lưu</h2>
          </div>
          <button className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-[2rem] bg-zinc-900/30 border border-zinc-800 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
             <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <LayoutGrid size={20} />
             </div>
             <div>
                <h4 className="text-sm font-bold text-white">Bát tự của Tui</h4>
                <p className="text-[10px] text-zinc-500 font-medium">Lập ngày 20/03/2026</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER BANNER */}
      <div className="rounded-[3rem] bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-10 text-center space-y-4">
         <ShieldCheck className="mx-auto text-indigo-400" size={40} />
         <h3 className="text-xl font-black text-white">Kết quả phân tích bởi AI PodSphere</h3>
         <p className="max-w-md mx-auto text-xs text-indigo-200/60 font-medium italic">
           Mọi lời luận giải đều mang tính chất định hướng và tham khảo. Hãy luôn giữ tinh thần lạc quan và làm chủ vận mệnh của chính mình.
         </p>
      </div>
    </div>
  );
}