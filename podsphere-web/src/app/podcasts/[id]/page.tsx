"use client";

import { useEffect, useState, use } from "react";
import { podcastService } from "@/services/podcast.service";
import { usePlayerStore } from "@/store/usePlayerStore";
import { EpisodeItem } from "@/components/ui/EpisodeItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PodcastDto, EpisodeDto } from "@/types/podcast";
import { ArrowLeft, Play, Music } from "lucide-react";
import Link from "next/link";

export default function PodcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrapping params trong Next.js 15
  const resolvedParams = use(params);
  const podcastId = resolvedParams.id;

  const [podcast, setPodcast] = useState<PodcastDto | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { setCurrentEpisode } = usePlayerStore();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Lấy thông tin podcast và danh sách tập
        const [pData, eData] = await Promise.all([
          podcastService.getPodcastById(podcastId),
          podcastService.getEpisodesByPodcastId(podcastId)
        ]);
        setPodcast(pData);
        setEpisodes(eData);
      } catch (error) {
        console.error("Lỗi lấy chi tiết podcast:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [podcastId]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!podcast) return <div className="p-10 text-center">Không tìm thấy podcast này mày ơi!</div>;

  return (
    <div className="space-y-8">
      {/* Nút quay lại */}
      <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-indigo-600">
        <ArrowLeft size={16} className="mr-2" /> Quay lại trang chủ
      </Link>

      {/* Header của Podcast */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end">
        <div className="h-52 w-52 shrink-0 overflow-hidden rounded-2xl shadow-2xl">
          <img src={podcast.thumbnail || "/placeholder.png"} className="h-full w-full object-cover" alt="" />
        </div>
        <div className="space-y-4">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            {podcast.categoryName}
          </span>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white">{podcast.title}</h1>
          <p className="max-w-2xl text-zinc-500">{podcast.description}</p>
          
          <button 
                onClick={() => {
                  const firstEp = episodes[0];
                  if (!firstEp) return;

                  // Check xem tập này có phải hàng Premium bị khóa link không
                  const isLocked = firstEp.isExclusive && !firstEp.audioUrl;

                  if (isLocked) {
                    alert("Tập mới nhất là hàng Premium! Bụng mỡ 105cm gan NASH độ 2 rồi, nạp tiền mua gói sức khỏe đi chứ nghe chùa sao được!");
                  } else {
                    setCurrentEpisode(firstEp);
                  }
                }}
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Play size={20} fill="currentColor" /> Phát tập mới nhất
          </button>
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Danh sách các tập (Episodes) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music size={20} className="text-indigo-600" />
          <h2 className="text-xl font-bold dark:text-white">Danh sách các tập ({episodes.length})</h2>
        </div>
        
        <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {episodes.length > 0 ? (
            episodes.map((ep) => (
              // Dùng cái EpisodeItem mày đã có sẵn
              <EpisodeItem 
                key={ep.id} 
                episode={ep} 
                onPlay={(ep: EpisodeDto) => setCurrentEpisode(ep)} 
              />
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500">Podcast này chưa có tập nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}