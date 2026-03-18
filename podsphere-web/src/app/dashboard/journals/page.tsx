"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
// SỬA TẠI ĐÂY: Dùng UserJournalDto và hàm getJournals chuẩn
import { healthService } from "@/services/health.service";
import { UserJournalDto } from "@/types/health"; 
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, BookHeart, Smile, Meh, Frown, Calendar, Edit3 } from "lucide-react";

export default function JournalsHistoryPage() {
  // SỬA TẠI ĐÂY: Dùng Type UserJournalDto
  const [journals, setJournals] = useState<UserJournalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

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

    fetchJournals();
  }, [isAuthenticated]);

  // Hàm helper để render Icon và Màu sắc dựa theo tâm trạng
  const getMoodStyle = (mood: string | null) => {
    const m = mood?.toLowerCase() || "bình thường";
    switch (m) {
      case "tốt":
        return { icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "tệ":
        return { icon: Frown, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
      default: // "bình thường"
        return { icon: Meh, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050b10] px-4 text-center">
         <h1 className="text-2xl font-black text-white">Mày cần đăng nhập để xem trang này!</h1>
         <Link href="/login" className="mt-4 text-indigo-500 font-bold hover:underline">Đăng nhập ngay &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      
      {/* HEADER */}
      <section className="relative px-6 py-12 md:py-20 lg:px-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <Link href="/dashboard/health" className="inline-flex items-center gap-2 mb-8 text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Quay lại TT Sức khỏe
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-purple-800 shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
              <BookHeart size={48} className="text-white" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">Góc nhìn nội tâm</p>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">Nhật ký của tôi</h1>
              <p className="text-sm font-medium text-zinc-500 mt-2">Mày đã viết {journals.length} trang nhật ký tâm trạng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DANH SÁCH NHẬT KÝ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 mt-4">
        {journals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {journals.map((journal) => {
              const Style = getMoodStyle(journal.mood);
              const Icon = Style.icon;

              return (
                <div 
                  key={journal.id} 
                  className={`flex flex-col p-6 rounded-[2rem] bg-[#0a1219] border ${Style.border} hover:scale-[1.02] transition-transform duration-300 shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4 border-b border-zinc-800/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${Style.bg} ${Style.color}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-lg leading-none">{journal.mood || "Bình thường"}</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
                          <Calendar size={12} />
                          {new Date(journal.createdAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nội dung nhật ký */}
                  <div className="space-y-2 flex-1">
                    <h4 className="text-white font-bold text-sm">{journal.title}</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium whitespace-pre-wrap">
                      "{journal.content}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TRẠNG THÁI TRỐNG */
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-zinc-800 bg-[#0a1219] py-24 mt-4 text-center px-4">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 shadow-inner border border-zinc-800">
                <Edit3 className="text-zinc-600" size={32} />
             </div>
             <h3 className="mt-6 text-xl font-black text-white tracking-tight">Chưa có dòng tâm sự nào</h3>
             <p className="mt-2 text-sm font-medium text-zinc-500 max-w-sm">
               Những dòng ghi chép tâm trạng của mày ở Trung tâm Sức khỏe sẽ được lưu trữ an toàn tại đây.
             </p>
             <Link href="/dashboard/health" className="mt-8 rounded-full bg-indigo-600 text-white px-8 py-3 text-sm font-black hover:bg-indigo-500 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)]">
               Viết nhật ký ngay
             </Link>
          </div>
        )}
      </section>

    </div>
  );
}