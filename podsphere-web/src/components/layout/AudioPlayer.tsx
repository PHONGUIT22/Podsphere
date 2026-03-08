"use client";

import React, { useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Crown, Repeat, Shuffle } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";

export const AudioPlayer = () => {
  // Lấy state trực tiếp từ Store
  const { currentEpisode, isPlaying, togglePlay, setPlaying } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Đồng bộ trạng thái chơi nhạc giữa Store và thẻ <audio>
  useEffect(() => {
    if (!audioRef.current || !currentEpisode) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentEpisode, setPlaying]);

  if (!currentEpisode) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/95 lg:pl-64">
      <audio 
        ref={audioRef} 
        src={currentEpisode.audioUrl} 
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Thông tin tập - Lấy từ Store */}
        <div className="flex w-1/3 items-center gap-3">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
            <img src="/placeholder.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold">{currentEpisode.title}</h4>
            <p className="text-[10px] text-zinc-500 uppercase">PODSPHERE PLAYER</p>
          </div>
          {currentEpisode.isExclusive && <Crown size={14} className="text-yellow-500" fill="currentColor" />}
        </div>

        {/* Điều khiển */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-6">
            <button className="text-zinc-400"><SkipBack size={20} /></button>
            <button 
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
            </button>
            <button className="text-zinc-400"><SkipForward size={20} /></button>
          </div>
          {/* Thanh progress có thể bổ sung logic sau */}
          <div className="h-1 w-full max-w-md rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="h-full w-1/3 rounded-full bg-indigo-600"></div>
          </div>
        </div>

        <div className="flex w-1/3 justify-end gap-4">
          <Volume2 size={18} className="text-zinc-500" />
        </div>
      </div>
    </div>
  );
};