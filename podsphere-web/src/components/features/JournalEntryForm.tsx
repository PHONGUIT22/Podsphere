"use client";
import { useState } from "react";
import { PenLine, Smile, Meh, Frown, Save } from "lucide-react";

export const JournalEntryForm = ({ onSave }: { onSave: (data: any) => void }) => {
  const [mood, setMood] = useState<string | null>(null);
  const moods = [
    { icon: Smile, label: "Tốt", color: "text-green-500", bg: "bg-green-50" },
    { icon: Meh, label: "Bình thường", color: "text-yellow-500", bg: "bg-yellow-50" },
    { icon: Frown, label: "Tệ", color: "text-red-500", bg: "bg-red-50" },
  ];

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
        placeholder="Viết vài dòng về cảm xúc của mày..."
        className="h-32 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
      ></textarea>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black">
        <Save size={18} />
        Lưu nhật ký
      </button>
    </div>
  );
};