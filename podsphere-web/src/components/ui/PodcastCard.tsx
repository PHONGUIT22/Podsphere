"use client";

import { PodcastDto } from "@/types/podcast";
import { Crown, Info } from "lucide-react";
import Link from "next/link"; // Dùng Link để nhảy trang nhanh

export const PodcastCard = ({ podcast }: { podcast: PodcastDto }) => {
  return (
    // Bọc cả cái Card vào thẻ Link để ấn vào đâu cũng nhảy trang
    <Link href={`/podcasts/${podcast.id}`} className="block group">
      <div className="relative rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
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
          {/* Thay nút Play bằng nút Info hoặc bỏ hẳn để user tự biết ấn vào card */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-black shadow-xl">
              Xem các tập
            </div>
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
    </Link>
  );
};