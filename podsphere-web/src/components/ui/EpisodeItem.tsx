// src/components/ui/EpisodeItem.tsx
import { Lock, PlayCircle } from "lucide-react";

export const EpisodeItem = ({ episode, onPlay }: { episode: any, onPlay: any }) => {
  // Nếu là tập Exclusive mà không có link (do Service xóa) thì là BỊ KHÓA
  const isLocked = episode.isExclusive && !episode.audioUrl;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isLocked ? 'opacity-60 bg-zinc-50' : 'hover:bg-zinc-100'}`}>
      <div className="flex items-center gap-4">
        <span className="text-zinc-400">{episode.order}</span>
        <div>
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            {episode.title}
            {episode.isExclusive && <Lock size={12} className="text-yellow-500" />}
          </h4>
        </div>
      </div>
      
      <button 
        onClick={() => {
          if (isLocked) {
             alert("Tập này chỉ dành cho dân Premium thôi mậy! Gan NASH độ 2 rồi, lo nạp tiền mua gói sức khỏe đi!");
          } else {
             onPlay(episode);
          }
        }}
        className={isLocked ? "text-zinc-300" : "text-indigo-600"}
      >
        {isLocked ? <Lock size={20} /> : <PlayCircle size={24} />}
      </button>
    </div>
  );
};