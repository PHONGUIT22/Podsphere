// src/components/ui/PodcastCard.tsx
"use client";
import { PodcastDto } from "@/types/podcast";
import { Crown, Play } from "lucide-react";
import Link from "next/link";

export const PodcastCard = ({ podcast }: { podcast: PodcastDto }) => {
  return (
    <Link href={`/podcasts/${podcast.id}`} className="group block">
      <div className="relative overflow-hidden rounded-4xl border border-zinc-100 bg-white p-2 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem]">
          <img
            src={podcast.thumbnail || "/placeholder-podcast.png"}
            alt={podcast.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay khi hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-indigo-600 shadow-2xl scale-75 transition-transform duration-300 group-hover:scale-100">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
          {podcast.isPremium && (
            <div className="absolute right-3 top-3 rounded-full bg-yellow-400 p-2 text-black shadow-lg">
              <Crown size={14} fill="currentColor" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            {podcast.categoryName || "Mới nhất"}
          </span>
          <h3 className="mt-1 line-clamp-1 text-base font-black text-zinc-900 dark:text-white">
            {podcast.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
            {podcast.description}
          </p>
        </div>
      </div>
    </Link>
  );
};