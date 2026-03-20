"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Sparkles, Clock, Target } from "lucide-react";
import { meditationService, MeditationDto } from "@/services/meditation.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
// IMPORT THẰNG ZENPLAYER MÀY VỪA TẠO
import { ZenPlayer } from "@/components/features/ZenPlayer";

export default function MeditationListPage() {
  const searchParams = useSearchParams();
  const targetParam = searchParams.get("target");

  const [meditations, setMeditations] = useState<MeditationDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATE ĐỂ BẬT/TẮT MÀN HÌNH PLAYER
  const [activeMeditation, setActiveMeditation] = useState<MeditationDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Lấy toàn bộ danh sách bài thiền
        const allData = await meditationService.getAll();
        setMeditations(allData);

        // LOGIC THÔNG MINH: Nếu URL có ?target=Quick, tự động bật bài thiền đó luôn
        if (targetParam && allData.length > 0) {
          const match = allData.find(m => m.target.includes(targetParam) || m.target.includes("Giảm stress"));
          if (match) setActiveMeditation(match);
        }
      } catch (e) {
        console.error("Lỗi lấy danh sách thiền:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [targetParam]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      
      {/* NẾU ĐÃ CHỌN BÀI, HIỂN THỊ ZENPLAYER ĐÈ LÊN TOÀN BỘ TRANG */}
      {activeMeditation && (
        <ZenPlayer 
          meditation={activeMeditation} 
          onClose={() => setActiveMeditation(null)} 
        />
      )}

      {/* HEADER */}
      <section className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <Link href="/dashboard/health" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <h1 className="text-5xl font-black text-white tracking-tight">Phòng Thiền Định</h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl">
            Tìm không gian tĩnh lặng, dọn dẹp tâm trí và kết nối lại với chính mình. Chọn một bài tập phù hợp với mục tiêu hiện tại của mày.
          </p>
        </div>
      </section>

      {/* DANH SÁCH BÀI THIỀN */}
      <section className="max-w-5xl mx-auto px-6">
        {meditations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditations.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setActiveMeditation(item)} // ẤN VÀO LÀ MỞ PLAYER
                className="group cursor-pointer rounded-[2rem] bg-zinc-900/50 border border-zinc-800/50 overflow-hidden hover:border-indigo-500/30 transition-all hover:bg-zinc-900/80 shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.thumbnail || "/placeholder.png"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={item.title} 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  
                  {/* Nút Play nổi lên khi hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/90 flex items-center justify-center text-white backdrop-blur-sm shadow-xl scale-75 group-hover:scale-100 transition-transform">
                      <Play size={28} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-2">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-2 border-t border-zinc-800">
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-500" /> {Math.floor(item.duration / 60)} Phút</span>
                    <span className="flex items-center gap-1.5"><Target size={14} className="text-orange-500" /> {item.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 rounded-[3rem]">
             <Sparkles size={40} className="text-zinc-600 mb-4" />
             <h3 className="text-white font-bold text-lg">Chưa có bài thiền nào</h3>
          </div>
        )}
      </section>
    </div>
  );
}