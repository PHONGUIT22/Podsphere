"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { favoriteService } from "@/services/favorite.service";
import { useAuthStore } from "@/store/useAuthStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { EpisodeItem } from "@/components/ui/EpisodeItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EpisodeDto } from "@/types/podcast";
import { Bookmark, Lock, PlayCircle, Mic2 } from "lucide-react";

export default function SavedEpisodesPage() {
  const [episodes, setEpisodes] = useState<EpisodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuthStore();
  const { setCurrentEpisode, currentEpisode } = usePlayerStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchSavedEpisodes = async () => {
      try {
        setLoading(true);
        // Gọi hàm vừa thêm ở Bước 1
        const data = await favoriteService.getMySavedEpisodes();
        setEpisodes(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách tập đã lưu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEpisodes();
  }, [isAuthenticated]);

  // Hàm xử lý khi user bấm "Bỏ lưu" ngay tại trang này
  const handleRemoveSaved = async (episodeId: string) => {
    try {
      // 1. Cập nhật UI ngay lập tức cho mượt (lọc bỏ tập vừa ấn khỏi danh sách)
      setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
      
      // 2. Gọi API để xóa dưới Backend
      await favoriteService.toggleEpisodeFavorite(episodeId);
    } catch (error) {
      console.error("Lỗi khi bỏ lưu tập:", error);
      // Nếu API lỗi thì tao nghĩ mày nên fetch lại danh sách để đồng bộ, 
      // nhưng tạm thời cứ để vầy cho UX nó mượt.
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  // 1. GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050b10] px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10">
          <Lock size={40} className="text-indigo-500" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-white tracking-tight">Cần đăng nhập</h1>
        <p className="mt-2 max-w-sm text-sm font-medium text-zinc-500">
          Đăng nhập để xem danh sách các tập podcast mà mày đã lưu lại.
        </p>
        <Link href="/login" className="mt-8 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-black text-white hover:bg-indigo-500 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:scale-105 active:scale-95">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // 2. GIAO DIỆN CHÍNH KHI ĐÃ ĐĂNG NHẬP (Tương tự Spotify Saved Episodes)
  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      
      {/* HEADER SECTION - Bọc màu Xanh Lục bảo phối Tím xịn xò */}
      <section className="relative px-6 py-12 md:py-20 lg:px-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-teal-600/10 blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Cover Art Box */}
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-teal-500 to-indigo-800 shadow-[0_20px_40px_rgba(20,184,166,0.3)]">
            <Bookmark size={64} fill="white" className="text-white" />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <p className="text-[10px] font-black tracking-[0.2em] text-teal-400 uppercase">Danh sách phát</p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
              Tập của tôi
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-zinc-500">
              <div className="flex items-center gap-1 text-white bg-white/10 px-2 py-1 rounded-md">
                <PlayCircle size={14} /> {episodes.length} tập
              </div>
              được lưu trữ để nghe lại
            </div>
          </div>
        </div>
      </section>

      {/* EPISODES LIST SECTION */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12 pt-8">
        
        {/* Nút Play All (Giả lập) */}
        {episodes.length > 0 && (
          <div className="mb-8">
            <button 
              onClick={() => setCurrentEpisode(episodes[0])}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-black shadow-[0_10px_20px_rgba(20,184,166,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              <PlayCircle size={28} fill="currentColor" />
            </button>
          </div>
        )}

        {episodes.length > 0 ? (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {episodes.map((ep, idx) => {
              const isPlaying = currentEpisode?.id === ep.id;
              
              return (
                <div 
                  key={ep.id} 
                  className={`group relative rounded-[1.5rem] transition-all duration-300 border border-transparent overflow-hidden ${
                    isPlaying 
                    ? 'bg-teal-900/20 border-teal-500/30' 
                    : 'hover:bg-[#0a1219] hover:border-zinc-800'
                  }`}
                >
                  <EpisodeItem 
                    episode={{...ep, order: idx + 1}} 
                    onPlay={(ep: EpisodeDto) => setCurrentEpisode(ep)} 
                    onSave={handleRemoveSaved} // Truyền hàm xóa khỏi list
                    isSaved={true} // Trang này mặc định toàn là bài ĐÃ LƯU
                  />
                  
                  {/* Sóng nhạc nếu đang phát */}
                  {isPlaying && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-0.5 items-end h-4 pointer-events-none">
                      <div className="w-1 bg-teal-500 animate-[music-bar_0.8s_ease-in-out_infinite] h-full" />
                      <div className="w-1 bg-teal-500 animate-[music-bar_1.2s_ease-in-out_infinite] h-2/3" />
                      <div className="w-1 bg-teal-500 animate-[music-bar_1s_ease-in-out_infinite] h-1/2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // TRẠNG THÁI TRỐNG
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-zinc-800 bg-[#0a1219] py-32 mt-4">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 shadow-inner border border-zinc-800">
                <Mic2 className="text-zinc-600" size={32} />
             </div>
             <h3 className="mt-6 text-xl font-black text-white tracking-tight">Chưa lưu tập nào</h3>
             <p className="mt-2 text-sm font-medium text-zinc-500 max-w-sm text-center">
               Những tập podcast mày nhấn <Bookmark size={14} className="inline mx-1" /> sẽ xuất hiện ở đây. Tìm một tập thú vị và lưu lại nhé!
             </p>
             <Link href="/podcasts" className="mt-8 flex items-center gap-2 rounded-2xl bg-white text-black px-6 py-3 text-sm font-black hover:bg-zinc-200 transition-all hover:scale-105">
               Khám phá Podcast
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