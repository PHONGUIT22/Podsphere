"use client";
import { useState } from "react";
import { PenLine, Smile, Meh, Frown, Save } from "lucide-react";
import { Button } from "@/components/ui/Button"; // Dùng component Button xịn của mày

export const JournalEntryForm = ({ onSave }: { onSave: (data: { title: string, content: string, mood: string }) => void }) => {
  const [mood, setMood] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { icon: Smile, label: "Tốt", color: "text-green-500", bg: "bg-green-50" },
    { icon: Meh, label: "Bình thường", color: "text-yellow-500", bg: "bg-yellow-50" },
    { icon: Frown, label: "Tệ", color: "text-red-500", bg: "bg-red-50" },
  ];

  const handleSave = async () => {
    if (!mood || !content.trim()) {
      alert("Chọn tâm trạng và viết vài dòng đã mày ơi!");
      return;
    }
    setIsSubmitting(true);
    // Giả định tiêu đề lấy theo ngày hoặc mặc định
    await onSave({ title: `Nhật ký ngày ${new Date().toLocaleDateString()}`, content, mood });
    setContent("");
    setMood(null);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <PenLine size={20} className="text-indigo-600" />
        <h3 className="font-bold text-zinc-900 dark:text-white">Hôm nay mày thấy thế nào?</h3>
      </div>

      <div className="mb-6 flex gap-4">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => setMood(m.label)}
            className={`flex flex-1 flex-col items-center gap-2 rounded-xl p-3 transition-all ${mood === m.label ? `${m.bg} ring-2 ring-indigo-500` : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50'}`}
          >
            <m.icon size={24} className={m.color} />
            <span className="text-[10px] font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết vài dòng về cảm xúc của mày..."
        className="h-32 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
      ></textarea>

      {/* Sử dụng component Button mày đã viết để có loading spinner */}
      <Button 
        onClick={handleSave} 
        isLoading={isSubmitting}
        className="mt-4 w-full"
      >
        <Save size={18} className="mr-2" />
        Lưu nhật ký
      </Button>
    </div>
  );
};