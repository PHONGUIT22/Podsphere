"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { favoriteService } from "@/services/favorite.service";
import { useAuthStore } from "@/store/useAuthStore";
import { PodcastCard } from "@/components/ui/PodcastCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PodcastDto } from "@/types/podcast";
import { Heart, Compass, Music, Lock } from "lucide-react";

export default function LikedPodcastsPage() {
  const [podcasts, setPodcasts] = useState<PodcastDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy trạng thái đăng nhập để chặn người dùng khách
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Nếu chưa đăng nhập thì không gọi API, tắt loading luôn
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchFavoritePodcasts = async () => {
      try {
        setLoading(true);
        // Gọi hàm từ favoriteService mày đã định nghĩa
        const data = await favoriteService.getMyFavoritePodcasts();
        setPodcasts(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách đã thích:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePodcasts();
  }, [isAuthenticated]);

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
          Đăng nhập để xem và lưu trữ các tập podcast yêu thích của riêng mày nhé.
        </p>
        <Link href="/login" className="mt-8 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-black text-white hover:bg-indigo-500 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:scale-105 active:scale-95">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // 2. GIAO DIỆN CHÍNH KHI ĐÃ ĐĂNG NHẬP
  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      
      {/* HEADER SECTION - Phong cách Spotify Playlist Cover */}
      <section className="relative px-6 py-12 md:py-20 lg:px-12 overflow-hidden">
        {/* Glow chìm */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-600/10 blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Cục Cover Art xịn xò */}
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-purple-800 shadow-[0_20px_40px_rgba(79,70,229,0.4)]">
            <Heart size={64} fill="white" className="text-white" />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <p className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">Thư viện của mày</p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
              Podcast <br className="hidden md:block"/> Đã Thích
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-zinc-500">
              <span className="text-white">{podcasts.length}</span> podcast đã được lưu
            </div>
          </div>
        </div>
      </section>

      {/* DANH SÁCH PODCAST ĐÃ THÍCH */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-8">
        
        {podcasts.length > 0 ? (
          // GRID PODCAST (Tái sử dụng component PodcastCard)
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {podcasts.map((p) => (
              <PodcastCard key={p.id} podcast={p} />
            ))}
          </div>
        ) : (
          // TRẠNG THÁI TRỐNG (Chưa thích bài nào)
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-zinc-800 bg-zinc-900/20 py-32 mt-4">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 shadow-inner border border-zinc-800">
                <Music className="text-zinc-600" size={32} />
             </div>
             <h3 className="mt-6 text-xl font-black text-white tracking-tight">Chưa có podcast nào</h3>
             <p className="mt-2 text-sm font-medium text-zinc-500 max-w-xs text-center">
               Mày chưa thả tim cho bất kỳ podcast nào. Hãy dạo quanh một vòng và tìm thứ gì đó thú vị nhé!
             </p>
             <Link href="/podcasts" className="mt-8 flex items-center gap-2 rounded-2xl bg-white text-black px-6 py-3 text-sm font-black hover:bg-zinc-200 transition-all hover:scale-105">
               <Compass size={18} /> Khám phá ngay
             </Link>
          </div>
        )}

      </section>

    </div>
  );
}