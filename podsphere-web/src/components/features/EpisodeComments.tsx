"use client";
import { useState, useEffect } from "react";
import { podcastService } from "@/services/podcast.service";
import { CommentDto } from "@/types/social";
import { Send, User, MessageSquare, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  episodeId: string;
  episodeTitle: string;
  onClose: () => void;
}

export function EpisodeComments({ episodeId, episodeTitle, onClose }: Props) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await podcastService.getCommentsByEpisodeId(episodeId);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, [episodeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await podcastService.addComment(episodeId, newComment);
      setNewComment("");
      toast.success("Đã đăng bình luận!");
      fetchComments(); // Reload lại list
    } catch (error) {
      toast.error("Đăng bình luận thất bại!");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white border-l border-zinc-800 w-full max-w-md fixed right-0 top-0 z-[60] shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg">Bình luận</h3>
          <p className="text-xs text-zinc-500 truncate max-w-[200px]">{episodeTitle}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

        {/* List Comments */}
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
    {loading ? (
        <div className="text-center text-zinc-500 text-sm italic">Đang tải bình luận...</div>
    ) : comments.length > 0 ? (
        comments.map((c) => (
        <div key={c.id} className="flex gap-4">
            {/* AVATAR: Sửa c.user?.avatar thành c.userAvatar */}
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold overflow-hidden">
            {c.userAvatar ? (
                <img src={c.userAvatar} className="h-full w-full object-cover" alt={c.userUsername || ""} />
            ) : (
                <User size={18} />
            )}
            </div>

            <div className="space-y-1">
            <div className="flex items-center gap-2">
                {/* USERNAME: Sửa c.user?.username thành c.userUsername */}
                <span className="text-sm font-black text-white">{c.userUsername || "Người dùng"}</span>
                <span className="text-[10px] text-zinc-600 uppercase font-bold">
                {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{c.content}</p>
            
            {/* Nếu mày có timestamp (thời điểm trong audio), hiện nó ra luôn */}
            {c.timestamp > 0 && (
                <span className="text-[10px] text-indigo-500 font-bold">
                tại {Math.floor(c.timestamp / 60)}:{(c.timestamp % 60).toString().padStart(2, '0')}
                </span>
            )}
            </div>
        </div>
        ))
    ) : (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
        <MessageSquare size={48} className="mb-2 opacity-20" />
        <p className="text-sm font-medium">Chưa có bình luận nào.</p>
        </div>
    )}
    </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-zinc-800 bg-[#0d0d0d]">
        <div className="relative">
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết cảm nghĩ của mày..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-indigo-600 transition-all"
          />
          <button type="submit" className="absolute right-2 top-2 p-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}