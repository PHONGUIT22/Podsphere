"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { EpisodeItem } from "@/components/ui/EpisodeItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EpisodeDto } from "@/types/podcast";
import { History, Lock, PlayCircle, Clock, Compass } from "lucide-react";
import { historyService } from "@/services/history.service";

export default function RecentEpisodesPage() {
  const [recentEpisodes, setRecentEpisodes] = useState<EpisodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuthStore();
  const { setCurrentEpisode, currentEpisode } = usePlayerStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchRecentHistory = async () => {
      try {
        setLoading(true);
        
        // Gọi API lấy lịch sử nghe thật từ backend
        const data = await historyService.getMyHistory();
        
        // Nhét luôn data vào state
        setRecentEpisodes(data);

      } catch (error) {
        console.error("Lỗi lấy lịch sử nghe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentHistory();
  }, [isAuthenticated]);


  if (loading) return <LoadingSpinner fullPage />;

  // 1. GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050b10] px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-500/10">
          <Lock size={40} className="text-violet-500" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-white tracking-tight">Cần đăng nhập</h1>
        <p className="mt-2 max-w-sm text-sm font-medium text-zinc-500">
          Đăng nhập để xem lại lịch sử những tập podcast mày vừa nghe gần đây.
        </p>
        <Link href="/login" className="mt-8 rounded-2xl bg-violet-600 px-8 py-3.5 text-sm font-black text-white hover:bg-violet-500 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.2)] hover:scale-105 active:scale-95">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // 2. GIAO DIỆN CHÍNH KHI ĐÃ ĐĂNG NHẬP
  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      
      {/* HEADER SECTION - Phối màu Violet (Tím nhạt) huyền bí */}
      <section className="relative px-6 py-12 md:py-20 lg:px-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-125 bg-violet-600/10 blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Cover Art Box */}
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-indigo-900 shadow-[0_20px_40px_rgba(139,92,246,0.3)]">
            <History size={64} className="text-white" />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <p className="text-[10px] font-black tracking-[0.2em] text-violet-400 uppercase">Lịch sử nghe</p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
              Gần đây
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-zinc-500">
              <div className="flex items-center gap-1 text-white bg-white/10 px-2 py-1 rounded-md">
                <Clock size={14} /> {recentEpisodes.length} tập
              </div>
              được lưu lại trong lịch sử
            </div>
          </div>
        </div>
      </section>

      {/* EPISODES LIST SECTION */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12 pt-8">

        {recentEpisodes.length > 0 ? (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {recentEpisodes.map((ep, idx) => {
              const isPlaying = currentEpisode?.id === ep.id;
              
              return (
                <div 
                  key={ep.id} 
                  className={`group relative rounded-3xl transition-all duration-300 border border-transparent overflow-hidden ${
                    isPlaying 
                    ? 'bg-violet-900/20 border-violet-500/30' 
                    : 'hover:bg-[#0a1219] hover:border-zinc-800'
                  }`}
                >
                  <EpisodeItem 
                    episode={{...ep, order: idx + 1}} 
                    onPlay={(ep: EpisodeDto) => setCurrentEpisode(ep)} 
                  />
                  
                  {/* Sóng nhạc nếu đang phát */}
                  {isPlaying && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-0.5 items-end h-4 pointer-events-none">
                      <div className="w-1 bg-violet-500 animate-[music-bar_0.8s_ease-in-out_infinite] h-full" />
                      <div className="w-1 bg-violet-500 animate-[music-bar_1.2s_ease-in-out_infinite] h-2/3" />
                      <div className="w-1 bg-violet-500 animate-[music-bar_1s_ease-in-out_infinite] h-1/2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // TRẠNG THÁI TRỐNG - Empty State
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-zinc-800 bg-[#0a1219] py-32 mt-4">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 shadow-inner border border-zinc-800">
                <Clock className="text-zinc-600" size={32} />
             </div>
             <h3 className="mt-6 text-xl font-black text-white tracking-tight">Chưa có lịch sử nghe</h3>
             <p className="mt-2 text-sm font-medium text-zinc-500 max-w-sm text-center">
               Mày chưa bật bài podcast nào gần đây cả. Vào mục khám phá và chọn một bài để bắt đầu nhé!
             </p>
             <Link href="/podcasts" className="mt-8 flex items-center gap-2 rounded-2xl bg-white text-black px-6 py-3 text-sm font-black hover:bg-zinc-200 transition-all hover:scale-105">
               <Compass size={18} /> Khám phá Podcast
             </Link>
          </div>
        )}

      </section>

      {/* Sóng nhạc Keyframes */}
      <style jsx>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
}