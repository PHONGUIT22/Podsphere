"use client";

import { useEffect, useState, use } from "react";
import { podcastService } from "@/services/podcast.service";
import { favoriteService } from "@/services/favorite.service"; 
import { useAuthStore } from "@/store/useAuthStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { EpisodeItem } from "@/components/ui/EpisodeItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PodcastDto, EpisodeDto } from "@/types/podcast";
// Bổ sung MessageSquare icon
import { ArrowLeft, Play, Heart, Share2, Music, Mic2, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";
// Giả định mày đã tạo component EpisodeComments theo hướng dẫn trước đó
import { EpisodeComments } from "@/components/features/EpisodeComments";

export default function PodcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const podcastId = resolvedParams.id;

  // STATE MỚI: Quản lý việc hiện bảng bình luận của tập nào
  const [selectedCommentEpisode, setSelectedCommentEpisode] = useState<EpisodeDto | null>(null);

  const { isAuthenticated } = useAuthStore();
  const [podcast, setPodcast] = useState<PodcastDto | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [savedEpisodeIds, setSavedEpisodeIds] = useState<string[]>([]);
  
  const { setCurrentEpisode, currentEpisode } = usePlayerStore();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [pData, eData] = await Promise.all([
          podcastService.getPodcastById(podcastId),
          podcastService.getEpisodesByPodcastId(podcastId)
        ]);
        setPodcast(pData);
        setEpisodes(eData);

        if (isAuthenticated) {
          const favorites = await favoriteService.getMyFavoritePodcasts();
          const found = favorites.some(f => f.id === podcastId);
          setIsFavorite(found);
          
          const savedEps = await favoriteService.getMySavedEpisodes();
          setSavedEpisodeIds(savedEps.map(e => e.id));
        }
      } catch (error) {
        console.error("Lỗi fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [podcastId, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Đăng nhập đi mậy mới lưu được chứ!");
      return;
    }
    try {
      await favoriteService.togglePodcastFavorite(podcastId);
      setIsFavorite(!isFavorite); 
    } catch (error) {
      console.error("Lỗi thả tim:", error);
    }
  };

  const handleSaveEpisode = async (episodeId: string) => {
    if (!isAuthenticated) {
      alert("Mày chưa đăng nhập thì lưu vào mắt à?");
      return;
    }
    try {
      await favoriteService.toggleEpisodeFavorite(episodeId);
      setSavedEpisodeIds(prev => 
        prev.includes(episodeId) 
          ? prev.filter(id => id !== episodeId) 
          : [...prev, episodeId]
      );
    } catch (error) {
      console.error("Lỗi lưu trữ tập:", error);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!podcast) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="text-6xl text-zinc-300">(( ╯°□°)╯</div>
      <div className="text-xl font-bold dark:text-white">Không thấy podcast này mậy!</div>
      <Link href="/" className="text-indigo-500 font-bold hover:underline">Về trang chủ</Link>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      
      {/* 0. PHẦN BÌNH LUẬN (DRAWER) - HIỆN ĐÈ LÊN KHI CHỌN TẬP */}
      {selectedCommentEpisode && (
        <>
          {/* Lớp nền mờ phía sau */}
          <div 
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setSelectedCommentEpisode(null)} 
          />
          {/* Nội dung bảng bình luận */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0a] z-[70] shadow-2xl animate-in slide-in-from-right duration-500 border-l border-zinc-200 dark:border-zinc-800">
            <EpisodeComments 
              episodeId={selectedCommentEpisode.id} 
              episodeTitle={selectedCommentEpisode.title}
              onClose={() => setSelectedCommentEpisode(null)} 
            />
          </div>
        </>
      )}

      {/* 1. DYNAMIC BACKGROUND BLUR */}
      <div className="absolute inset-0 h-[600px] pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40 blur-[100px] scale-125 transition-all duration-1000"
          style={{
            backgroundImage: `url(${podcast.thumbnail || ""})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background dark:via-black/60 dark:to-black"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-6 lg:pt-10">
        
        {/* Nút quay lại */}
        <Link href="/" className="group inline-flex items-center gap-2 mb-8 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-all uppercase tracking-widest">
          <div className="p-2 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Quay lại
        </Link>

        {/* 2. PODCAST HERO INFO */}
        <div className="flex flex-col md:flex-row gap-8 md:items-end lg:gap-14">
          <div className="relative group mx-auto md:mx-0 shrink-0">
            <div className="absolute -inset-2 bg-indigo-500/20 rounded-[3rem] blur-2xl group-hover:bg-indigo-500/40 transition duration-500"></div>
            <img src={podcast.thumbnail || ""} className="relative h-64 w-64 lg:h-80 lg:w-80 rounded-[2.5rem] object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" alt={podcast.title} />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black tracking-[0.2em] uppercase">
                  {podcast.categoryName}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  <Mic2 size={14} /> SERIES
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter dark:text-white leading-[1.1]">
                {podcast.title}
              </h1>
              <p className="max-w-2xl text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {podcast.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button onClick={() => episodes[0] && setCurrentEpisode(episodes[0])} className="group flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-5 font-black text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                <Play size={22} fill="currentColor" /> PHÁT NGAY
              </button>
              <div className="flex gap-3">
                <button onClick={handleToggleFavorite} className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${isFavorite ? "border-red-500 bg-red-500 text-white" : "border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"}`}>
                  <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white transition-all hover:scale-105">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. EPISODES LIST */}
        <section className="mt-16 lg:mt-24 max-w-5xl">
          <div className="mb-8 flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                <Music className="text-indigo-600" size={28} /> Các tập phát sóng
              </h2>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-indigo-600/20 leading-none">{episodes.length}</span>
              <span className="block text-[10px] font-black text-zinc-400 uppercase">Tập podcast</span>
            </div>
          </div>
          
          <div className="grid gap-4">
            {episodes.map((ep, idx) => {
              const isPlaying = currentEpisode?.id === ep.id;
              const isSaved = savedEpisodeIds.includes(ep.id); 

              return (
                <div key={ep.id} className="relative flex items-center group">
                  <div className={`flex-1 rounded-[1.5rem] transition-all duration-300 border border-transparent overflow-hidden ${isPlaying ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200' : 'hover:bg-white dark:hover:bg-zinc-900/50 hover:border-zinc-200'}`}>
                    <EpisodeItem 
                      episode={{...ep, order: idx + 1}} 
                      onPlay={(ep: EpisodeDto) => setCurrentEpisode(ep)} 
                      onSave={handleSaveEpisode}
                      isSaved={isSaved}
                    />
                  </div>

                    {/* NÚT BÌNH LUẬN RIÊNG CHO MỖI TẬP */}
                    <button 
                      onClick={() => {
                        console.log("Mở comment cho tập:", ep.id);
                        setSelectedCommentEpisode(ep);
                      }}
                      // THÊM: cursor-pointer để hiện bàn tay
                      // THÊM: hover:scale-110 để nút nhúc nhích tí cho sinh động
                      className="ml-2 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center shrink-0"
                      title="Bình luận tập này"
                    >
                      <MessageSquare size={20} />
                    </button>

                  {/* Sóng nhạc nếu đang phát */}
                  {isPlaying && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-0.5 items-end h-4 pointer-events-none">
                      <div className="w-1 bg-indigo-500 animate-[music-bar_0.8s_ease-in-out_infinite] h-full" />
                      <div className="w-1 bg-indigo-500 animate-[music-bar_1.2s_ease-in-out_infinite] h-2/3" />
                      <div className="w-1 bg-indigo-500 animate-[music-bar_1s_ease-in-out_infinite] h-1/2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
}