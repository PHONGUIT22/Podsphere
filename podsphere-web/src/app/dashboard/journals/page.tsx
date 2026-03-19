"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { healthService } from "@/services/health.service";
import { UserJournalDto } from "@/types/health"; 
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// THÊM ICON TRASH2
import { ArrowLeft, BookHeart, Smile, Meh, Frown, Calendar, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function JournalsHistoryPage() {
  const [journals, setJournals] = useState<UserJournalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await healthService.getJournals();
      setJournals(data);
    } catch (error) {
      console.error("Lỗi lấy nhật ký:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchJournals();
  }, [isAuthenticated]);

  // HÀM XỬ LÝ XÓA
  const handleDelete = async (id: string) => {
    if (!confirm("Mày có chắc muốn xóa dòng tâm sự này không?")) return;

    try {
      await healthService.deleteJournal(id);
      toast.success("Đã xóa xong!");
      // Cập nhật lại list ngay tại chỗ mà không cần load lại trang
      setJournals(journals.filter(j => j.id !== id));
    } catch (error) {
      toast.error("Lỗi rồi, không xóa được!");
    }
  };

  const getMoodStyle = (mood: string | null) => {
    const m = mood?.toLowerCase() || "bình thường";
    switch (m) {
      case "tốt":
        return { icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "tệ":
        return { icon: Frown, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
      default:
        return { icon: Meh, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      {/* HEADER (Giữ nguyên như cũ) */}
      <section className="relative px-6 py-12 md:py-20 lg:px-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link href="/dashboard/health" className="inline-flex items-center gap-2 mb-8 text-xs font-bold text-zinc-500 hover:text-indigo-400 uppercase tracking-widest">
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-800 shadow-xl">
              <BookHeart size={48} className="text-white" />
            </div>
            <div className="space-y-2 text-center md:text-left">
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">Nhật ký của tôi</h1>
               <p className="text-sm font-medium text-zinc-500 mt-2">Tổng cộng {journals.length} trang viết.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DANH SÁCH */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journals.map((journal) => {
            const Style = getMoodStyle(journal.mood);
            const Icon = Style.icon;

            return (
              <div key={journal.id} className={`group flex flex-col p-6 rounded-[2rem] bg-[#0a1219] border ${Style.border} transition-all duration-300 hover:shadow-2xl`}>
                <div className="flex items-start justify-between mb-4 border-b border-zinc-800/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${Style.bg} ${Style.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg leading-none">{journal.mood || "Bình thường"}</h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">{new Date(journal.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  
                  {/* NÚT XÓA Ở ĐÂY */}
                  <button 
                    onClick={() => handleDelete(journal.id)}
                    className="p-2 rounded-xl bg-zinc-900 text-zinc-600 hover:bg-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="space-y-2 flex-1">
                  <h4 className="text-white font-bold text-sm">{journal.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium whitespace-pre-wrap italic">
                    "{journal.content}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}