"use client";

import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Crown, RotateCcw, RotateCw } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";

export const AudioPlayer = () => {
  const { currentEpisode, isPlaying, togglePlay, setPlaying } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  // State quản lý thời gian và âm lượng
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // 0 to 1

  // Định dạng thời gian (giây -> mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Đồng bộ trạng thái Play/Pause
  useEffect(() => {
    if (!audioRef.current || !currentEpisode) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentEpisode, setPlaying]);

  // Cập nhật progress khi nhạc chạy
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Lấy tổng thời gian khi file load xong
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Xử lý khi user kéo thanh tua
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Xử lý âm lượng
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  // Nhảy tới/lui 10 giây (tiện cho podcast)
  const skipTime = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  // Logic giữ chỗ để sau này bạn thêm hàm chuyển bài vào PlayerStore
  const handlePlayPrevious = () => {
    console.log("Chưa có logic. Mày hãy thêm hàm playPrevious() vào usePlayerStore");
    // playPrevious(); 
  };

  const handlePlayNext = () => {
    console.log("Chưa có logic. Mày hãy thêm hàm playNext() vào usePlayerStore");
    // playNext();
  };

  if (!currentEpisode) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/95 lg:pl-64">
      <audio
        ref={audioRef}
        src={currentEpisode.audioUrl}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)} // Có thể đổi thành handlePlayNext() nếu muốn tự động nhảy bài khi hết
      />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* 1. Thông tin tập */}
        <div className="flex w-1/3 items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
            {/* THAY ĐỔI: Dùng thumbnail thật từ Episode, nếu không có mới hiện placeholder */}
            <img 
              src={currentEpisode.thumbnail || "/placeholder.png"} 
              alt={currentEpisode.title} 
              className="h-full w-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-zinc-900 dark:text-white">
              {currentEpisode.title}
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase font-medium">PODSPHERE PLAYER</p>
          </div>
          {currentEpisode.isExclusive && <Crown size={14} className="text-yellow-500 shrink-0" fill="currentColor" />}
        </div>

        {/* 2. Bộ điều khiển trung tâm */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button onClick={() => skipTime(-10)} className="text-zinc-400 hover:text-indigo-600 transition-colors">
              <RotateCcw size={20} />
            </button>
            
            {/* THAY ĐỔI: Gắn sự kiện chuyển bài trước */}
            <button 
              onClick={handlePlayPrevious}
              className="text-zinc-400 hover:text-indigo-600 transition-colors"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>
            
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform active:scale-90 dark:bg-white dark:text-black"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
            </button>

            {/* THAY ĐỔI: Gắn sự kiện chuyển bài tiếp theo */}
            <button 
              onClick={handlePlayNext}
              className="text-zinc-400 hover:text-indigo-600 transition-colors"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>

            <button onClick={() => skipTime(10)} className="text-zinc-400 hover:text-indigo-600 transition-colors">
              <RotateCw size={20} />
            </button>
          </div>

          {/* Thanh Progress bar xịn sò */}
          <div className="flex w-full max-w-md items-center gap-3">
            <span className="text-[10px] font-medium text-zinc-500 w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-200 accent-indigo-600 dark:bg-zinc-800"
            />
            <span className="text-[10px] font-medium text-zinc-500 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 3. Âm lượng & Phụ trợ */}
        <div className="flex w-1/3 items-center justify-end gap-3">
          <Volume2 size={18} className="text-zinc-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="hidden w-20 cursor-pointer appearance-none rounded-full bg-zinc-200 accent-indigo-600 dark:bg-zinc-800 sm:block h-1"
          />
        </div>
      </div>
    </div>
  );
};