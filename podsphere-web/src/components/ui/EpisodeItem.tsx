// src/components/ui/EpisodeItem.tsx
import { Lock, PlayCircle, Bookmark, BookmarkCheck } from "lucide-react";

interface EpisodeItemProps {
  episode: any;
  onPlay: (ep: any) => void;
  onSave?: (epId: string) => void; // Prop tuỳ chọn: Hàm xử lý lưu
  isSaved?: boolean;               // Prop tuỳ chọn: Trạng thái bài đã được lưu hay chưa
}

export const EpisodeItem = ({ episode, onPlay, onSave, isSaved }: EpisodeItemProps) => {
  // Nếu là tập Exclusive mà không có link (do Backend không trả về) thì là BỊ KHÓA
  const isLocked = episode.isExclusive && !episode.audioUrl;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${
      isLocked 
        ? 'opacity-50 grayscale cursor-not-allowed' // Style khi bị khoá
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer' // Style bình thường
    }`}>
      
      {/* KHỐI THÔNG TIN BÊN TRÁI */}
      <div 
        className="flex flex-1 items-center gap-5 overflow-hidden pr-4"
        onClick={() => {
          // Bấm thẳng vào dòng cũng nghe được (nếu không khoá)
          if (!isLocked) onPlay(episode);
        }}
      >
        {/* Số thứ tự tập */}
        <span className="text-zinc-400 font-bold text-xs w-6 text-center shrink-0">
          {episode.order || "-"}
        </span>
        
        {/* Tên tập & Thời lượng */}
        <div className="flex-1 truncate">
          <h4 className="font-bold flex items-center gap-2 text-sm text-zinc-900 dark:text-white truncate">
            {episode.title}
            {episode.isExclusive && <Lock size={12} className="text-yellow-500 shrink-0" />}
          </h4>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 truncate">
             MP3 • {episode.duration ? `${Math.floor(episode.duration / 60)} phút` : "12:45"}
          </p>
        </div>
      </div>
      
      {/* KHỐI NÚT BẤM BÊN PHẢI */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* NÚT LƯU TRỮ (Chỉ hiện nếu component cha truyền hàm onSave vào) */}
        {onSave && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (không tự Play khi ấn Save)
              onSave(episode.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'text-zinc-400 hover:text-indigo-600 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            title={isSaved ? "Bỏ lưu trữ" : "Lưu vào thư viện"}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}

        {/* NÚT PHÁT (PLAY) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (isLocked) {
               alert("Gói thường không nghe được hàng VIP này đâu mậy! Gan NASH độ 2 rồi, lo nạp tiền mua Premium đi!");
            } else {
               onPlay(episode);
            }
          }}
          className={isLocked ? "text-zinc-300 dark:text-zinc-700" : "text-indigo-600 hover:scale-110 transition-transform"}
        >
          {isLocked ? (
            <Lock size={24} />
          ) : (
            <PlayCircle size={28} className="text-white fill-indigo-600 shadow-xl rounded-full shadow-indigo-500/30" />
          )}
        </button>
      </div>

    </div>
  );
};