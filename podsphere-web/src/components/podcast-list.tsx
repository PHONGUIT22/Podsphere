import React from 'react';
import Image from 'next/image';
import { Play, Crown, Clock, Tag } from 'lucide-react'; // Mày đã có lucide-react trong package.json
import { PodcastDto} from "../types/podcast";
interface PodcastListProps {
  podcasts: PodcastDto[];
}

export const PodcastList = ({ podcasts }: PodcastListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {podcasts.map((podcast) => (
        <div 
          key={podcast.id} 
          className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900"
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={podcast.thumbnail || '/placeholder-podcast.jpg'}
              alt={podcast.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badge Premium - Dựa trên thuộc tính IsPremium */}
            {podcast.isPremium && (
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
                <Crown size={12} />
                PREMIUM
              </div>
            )}

            {/* Overlay Play Button on Hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:scale-110 transition-transform">
                <Play fill="currentColor" size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {podcast.categoryName || 'General'}
              </span>
            </div>
            
            <h3 className="line-clamp-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {podcast.title}
            </h3>
            
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {podcast.description}
            </p>

            {/* Footer info */}
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Tag size={12} />
                <span>Podcast</span>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};