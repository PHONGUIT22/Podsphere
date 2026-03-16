// src/components/ui/PodcastCard.tsx
"use client";
import { PodcastDto } from "@/types/podcast";
import { Crown, PlayCircle } from "lucide-react";
import Link from "next/link";

export const PodcastCard = ({ podcast }: { podcast: PodcastDto }) => {
  return (
    <Link href={`/podcasts/${podcast.id}`} className="group block">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-50 p-2 transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] dark:bg-zinc-900/40 dark:hover:bg-zinc-900">
        
        {/* Thumbnail với Overlay Play */}
        <div className="relative aspect-square overflow-hidden rounded-4xl">
          <img
            src={podcast.thumbnail || "/placeholder-podcast.png"}
            alt={podcast.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Nút Play trung tâm kiểu Spotify/Hearo */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl scale-75 transition-transform duration-300 group-hover:scale-100">
              <PlayCircle size={32} fill="currentColor" />
            </div>
          </div>

          {/* Badge Premium */}
          {podcast.isPremium && (
            <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg">
              <Crown size={16} fill="currentColor" />
            </div>
          )}
        </div>
        
        {/* Thông tin podcast */}
        <div className="p-4 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
            {podcast.categoryName || "PODCAST"}
          </span>
          <h3 className="mt-1 line-clamp-1 text-base font-black text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            {podcast.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[11px] font-medium text-zinc-400">
            Tác giả: {"Podsphere Team"}
          </p>
        </div>
      </div>
    </Link>
  );
};