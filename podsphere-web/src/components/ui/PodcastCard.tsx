"use client";

import { useState } from "react";
import { PodcastDto } from "@/types/podcast";
import { Play, Crown, Loader2 } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { podcastService } from "@/services/podcast.service"; // Import service để gọi API

export const PodcastCard = ({ podcast }: { podcast: PodcastDto }) => {
  const { setCurrentEpisode } = usePlayerStore();
  const [isFetching, setIsFetching] = useState(false); // Trạng thái đang tải tập nhạc

  const handlePlayClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsFetching(true);
      
      // 1. Gọi API lấy danh sách tập nhạc riêng cho Podcast này
      const episodes = await podcastService.getEpisodesByPodcastId(podcast.id);

      // 2. Kiểm tra nếu có tập thì mới phát
      if (episodes && episodes.length > 0) {
        // Phát tập đầu tiên (hoặc tập mày muốn)
        setCurrentEpisode(episodes[0]);
      } else {
        alert("Podcast này đúng là chưa có tập nào thật mày ơi, check lại DB đi!");
      }
    } catch (error) {
      console.error("Lỗi lấy tập nhạc:", error);
      alert("Không lấy được danh sách tập nhạc rồi!");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={podcast.thumbnail || "/placeholder-podcast.png"}
          alt={podcast.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        
        {podcast.isPremium && (
          <div className="absolute right-2 top-2 rounded-full bg-yellow-400 p-1.5 text-black shadow-lg">
            <Crown size={14} fill="currentColor" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <button 
            onClick={handlePlayClick}
            disabled={isFetching}
            className="rounded-full bg-white p-3 text-black shadow-xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            {isFetching ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {podcast.categoryName || "General"}
        </span>
        <h3 className="mt-1 line-clamp-1 font-semibold text-zinc-900 dark:text-white">
          {podcast.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
          {podcast.description}
        </p>
      </div>
    </div>
  );
};