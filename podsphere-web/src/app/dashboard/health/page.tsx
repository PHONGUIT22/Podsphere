"use client";

import { useEffect, useState } from "react";
import { healthService } from "@/services/health.service";
import { podcastService } from "@/services/podcast.service"; 
import { HealthStatCard } from "@/components/ui/HealthStatCard";
import { RecommendationBanner } from "@/components/ui/RecommendationBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UserHealthStatsDto, HealthRecommendationDto } from "@/types/health";
import { PodcastDto } from "@/types/podcast"; 
import { JournalEntryForm } from "@/components/features/JournalEntryForm";
// THÊM ICON MỚI
import { History, ChevronRight, ArrowRight, Sparkles, BrainCircuit, PlayCircle, Headphones, Edit3, Save, X, Moon, Smile, Zap, Wind } from "lucide-react";

import Link from "next/link";
import { toast } from "react-hot-toast";

export default function HealthDashboard() {
  const [stats, setStats] = useState<UserHealthStatsDto | null>(null);
  const [rec, setRec] = useState<HealthRecommendationDto | null>(null);
  const [recommendedPodcasts, setRecommendedPodcasts] = useState<PodcastDto[]>([]);
  const [loading, setLoading] = useState(true);

  // STATE CHO VIỆC CẬP NHẬT CHỈ SỐ
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [statsForm, setStatsForm] = useState({
    moodScore: 5,
    stressLevel: "Bình thường",
    sleepHours: 7
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, recData, podData] = await Promise.all([
        healthService.getStats(),
        healthService.getRecommendations(),
        podcastService.getRecommendedPodcasts()
      ]);
      console.log("DỮ LIỆU STATS THỰC TẾ:", statsData);       
      setStats(statsData);
      setRec(recData);
      setRecommendedPodcasts(podData || []);

      // Cập nhật giá trị ban đầu cho form edit
      if (statsData) {    
        setStatsForm({
          moodScore: statsData.moodScore || 5,
          stressLevel: statsData.stressLevel || "Bình thường",
          sleepHours: statsData.sleepHours || 7
        });
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HÀM XỬ LÝ LƯU CHỈ SỐ SỨC KHỎE
  const handleUpdateStats = async () => {
    try {
      const loadingToast = toast.loading("Đang phân tích chỉ số mới...");
      await healthService.updateStats(statsForm);
      toast.success("Đã cập nhật chỉ số sức khỏe!", { id: loadingToast });
      setIsEditingStats(false);
      await fetchData(); // Fetch lại để AI cập nhật lời khuyên mới
    } catch (error) {
      toast.error("Lỗi khi cập nhật mậy ơi!");
    }
  };

  const handleSaveJournal = async (data: { title: string, content: string, mood: string }) => {
    try {
      const result = await healthService.addJournal(data);
      if (result) {
        toast.success("Lưu nhật ký thành công!");
        await fetchData(); 
      }
    } catch (err) {
      console.error("Lỗi lưu nhật ký:", err);
    }
  };

  if (loading && !stats) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-10">
      {/* HEADER - Giữ nguyên */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 lg:px-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-5xl">
            Trung tâm <span className="text-indigo-600">Sức khỏe</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest italic">
            Phân tích tâm trí bởi AI PodSphere
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
           <BrainCircuit size={18} className="text-indigo-600" />
           <span className="text-[10px] font-black text-indigo-600 uppercase">AI Insights Active</span>
        </div>
      </div>

      {/* 1. LỜI KHUYÊN BANNER - Giữ nguyên */}
      {rec && (
        <div className="px-4 lg:px-0">
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl shadow-indigo-500/10 transition-all hover:shadow-indigo-500/20">
            <RecommendationBanner rec={rec} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 px-4 lg:px-0">
        <div className="lg:col-span-2 space-y-12">
               {/* --- BẮT ĐẦU PHẦN SỬA THEO AI: AI NUDGE --- */}
          {(statsForm.stressLevel === "High" || statsForm.stressLevel === "Căng thẳng") && (
            <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-indigo-600 to-purple-700 p-8 text-white shadow-xl shadow-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h4 className="font-black text-2xl tracking-tight">Mày đang stress quá mậy! 🧘‍♂️</h4>
                  <p className="text-sm text-indigo-100 opacity-90 font-medium">AI nhận thấy mức độ căng thẳng của mày đang cao. Dành 5 phút thiền cấp tốc để cân bằng lại nhé.</p>
                </div>
                <Link 
                  href="/dashboard/meditation?target=Quick"
                  className="shrink-0 px-8 py-4 rounded-2xl bg-white text-indigo-700 text-sm font-black hover:bg-indigo-50 transition-all uppercase tracking-widest shadow-lg active:scale-95"
                >
                  Thiền ngay
                </Link>
              </div>
              {/* Decor chìm phía sau cho xịn */}
              <Wind size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12 pointer-events-none" />
            </div>
          )}
          {/* --- KẾT THÚC PHẦN AI NUDGE --- */}
          {/* 2. CHỈ SỐ SINH HỌC & FORM CẬP NHẬT */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-indigo-600" size={20} />
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Chỉ số sinh học</h3>
              </div>
              
              {!isEditingStats ? (
                <button 
                  onClick={() => setIsEditingStats(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <Edit3 size={14} /> CẬP NHẬT CHỈ SỐ
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditingStats(false)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {isEditingStats ? (
              /* FORM CẬP NHẬT CHỈ SỐ CỰC ĐẸP */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-[2.5rem] bg-indigo-600/5 border-2 border-dashed border-indigo-500/20 animate-in zoom-in-95 duration-300">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <Smile size={14} className="text-indigo-500" /> Tâm trạng ({statsForm.moodScore}/10)
                  </label>
                  <input 
                    type="range" min="1" max="10" 
                    value={statsForm.moodScore}
                    onChange={(e) => setStatsForm({...statsForm, moodScore: parseInt(e.target.value)})}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <Zap size={14} className="text-indigo-500" /> Mức độ Stress
                  </label>
                  <select 
                    value={statsForm.stressLevel}
                    onChange={(e) => setStatsForm({...statsForm, stressLevel: e.target.value})}
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="Thấp">Thấp (Chill)</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Hơi cao">Hơi cao</option>
                    <option value="Căng thẳng">Rất Căng thẳng</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <Moon size={14} className="text-indigo-500" /> Giờ ngủ: {statsForm.sleepHours || 0}h
                  </label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={isNaN(statsForm.sleepHours) ? "" : statsForm.sleepHours}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsedVal = parseFloat(val);
                      setStatsForm({
                        ...statsForm, 
                        sleepHours: isNaN(parsedVal) ? 0 : parsedVal 
                      });
                    }}
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-3 pt-4 border-t border-indigo-500/10 flex justify-end">
                  <button 
                    onClick={handleUpdateStats}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Save size={18} /> LƯU CHỈ SỐ MỚI
                  </button>
                </div>
              </div>
            ) : (
              /* HIỂN THỊ CARD CHỈ SỐ NHƯ CŨ */
              stats ? (
                <div className="transition-all hover:scale-[1.01]">
                  <HealthStatCard stats={stats} />
                </div>
              ) : (
                <div className="h-48 w-full rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              )
            )}
          </section>

          {/* 3. NHẬT KÝ TÂM TRẠNG - Giữ nguyên */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-2xl font-black dark:text-white tracking-tight">Ghi chép tâm trạng</h3>
                <div className="mt-1.5 h-1.5 w-10 rounded-full bg-indigo-600"></div>
              </div>
              <Link href="/dashboard/journals" className="group flex items-center gap-1.5 text-sm font-black text-indigo-500 hover:text-indigo-600 transition-all uppercase tracking-tighter">
                Toàn bộ lịch sử <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900/30 shadow-sm">
               <JournalEntryForm onSave={handleSaveJournal} />
            </div>

            <Link href="/dashboard/journals" className="group block">
              <div className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-indigo-50/50 p-6 transition-all hover:bg-indigo-100/50 dark:border-indigo-900/20 dark:bg-indigo-950/20">
                <div className="absolute -right-6 -top-6 text-indigo-600/10 -rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0">
                  <History size={120} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 group-hover:rotate-6 transition-transform">
                      <History size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black dark:text-white tracking-tight">Kho lưu trữ cảm xúc</h4>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">Xem lại hành trình của bạn</p>
                    </div>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md group-hover:translate-x-1 transition-all">
                    <ArrowRight size={20} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        </div>

        {/* 4. SIDEBAR GỢI Ý - Giữ nguyên */}
        <aside className="space-y-6">
           {/* ... Giữ nguyên phần sidebar cũ ... */}
           <div className="sticky top-24">
            <h3 className="text-xl font-black mb-4 dark:text-white uppercase tracking-tighter">Dành riêng cho mày</h3>
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-pretty">AI Recommendation</span>
              </div>
              
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium mb-6">
                Trạng thái: <span className="font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded-lg">
                  {/* FIX: Lấy stressWarning từ biến rec (vì stats không có) */}
                  {rec?.stressWarning || rec?.mentalStatus || "Đang đo..."}
                </span>, đây là nội dung phù hợp nhất:
              </p>
              
              <div className="flex flex-col gap-4">
                 {loading ? (
                    <>
                      <div className="h-20 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse border border-zinc-200 dark:border-zinc-700" />
                      <div className="h-20 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse border border-zinc-200 dark:border-zinc-700" />
                    </>
                 ) : recommendedPodcasts.length > 0 ? (
                    recommendedPodcasts.map((pod) => (
                      <Link 
                        key={pod.id} 
                        href={`/podcasts/${pod.id}`}
                        className="group flex items-center gap-4 rounded-2xl p-2 transition-all hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-100 dark:hover:border-white/10"
                      >
                        {/* FIX LỖI IMG SRC: Kiểm tra nếu thumbnail rỗng thì không render thẻ img */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-md bg-zinc-200 dark:bg-zinc-800">
                          {pod.thumbnail ? (
                             <img 
                               src={pod.thumbnail} 
                               className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                               alt={pod.title} 
                             />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                               <Headphones size={20} className="text-zinc-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <PlayCircle size={24} className="text-white fill-white/20" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-indigo-600 uppercase mb-0.5 truncate">{pod.categoryName}</p>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{pod.title}</h4>
                        </div>
                      </Link>
                    ))
                 ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
                      <Headphones size={32} className="text-zinc-300 mb-2" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Không có gợi ý nào</p>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}