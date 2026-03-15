// src/components/features/CommentForm.tsx
"use client";

import { useState } from "react";
import { socialService } from "@/services/social.service";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CommentFormProps {
  episodeId: string;
  onSuccess: () => void; // Để load lại danh sách sau khi đăng
}

export const CommentForm = ({ episodeId, onSuccess }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      // Gọi API AddComment từ BE
      await socialService.addComment(episodeId, { 
        content, 
        timestamp: 0 // Hoặc lấy timestamp hiện tại của AudioPlayer nếu muốn
      });
      setContent("");
      onSuccess(); // Trình kích hoạt load lại list
    } catch (error) {
      alert("Lỗi rồi mày ơi, không đăng được bình luận!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết gì đó cho tập này đi..."
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900"
        />
      </div>
      <Button type="submit" disabled={loading} className="rounded-full px-4">
        <Send size={16} />
      </Button>
    </form>
  );
};