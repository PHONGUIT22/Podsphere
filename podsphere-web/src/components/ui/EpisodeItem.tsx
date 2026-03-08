import { EpisodeDto } from "@/types/podcast";
import { PlayCircle, Lock } from "lucide-react";

export const EpisodeItem = ({ episode, onPlay }: { episode: EpisodeDto, onPlay: (ep: EpisodeDto) => void }) => {
  return (
    <div className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
      <div className="flex items-center gap-4">
        <span className="w-4 text-xs font-medium text-zinc-400">{episode.order}</span>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            {episode.title}
            {episode.isExclusive && <Lock size={12} className="text-yellow-500" />}
          </h4>
          <p className="text-xs text-zinc-500">{Math.floor(episode.duration / 60)} phút</p>
        </div>
      </div>
      <button 
        onClick={() => onPlay(episode)}
        className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <PlayCircle size={24} />
      </button>
    </div>
  );
};