"use client";

import { useEffect, useState } from "react";
import { healthService } from "@/services/health.service";
import { HealthStatCard } from "@/components/ui/HealthStatCard";
import { RecommendationBanner } from "@/components/ui/RecommendationBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UserHealthStatsDto, HealthRecommendationDto } from "@/types/health";
import { JournalEntryForm } from "@/components/features/JournalEntryForm";

export default function HealthDashboard() {
  const [stats, setStats] = useState<UserHealthStatsDto | null>(null);
  const [rec, setRec] = useState<HealthRecommendationDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu dùng chung để có thể gọi lại sau khi lưu nhật ký
  const fetchData = async () => {
    try {
      const [statsData, recData] = await Promise.all([
        healthService.getStats(),
        healthService.getRecommendations()
      ]);
      setStats(statsData);
      setRec(recData);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu sức khỏe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveJournal = async (data: { title: string, content: string, mood: string }) => {
    try {
      const result = await healthService.addJournal(data);
      if (result) {
        alert("Lưu xong rồi nhé mày!");
        // Fetch lại lời khuyên vì tâm trạng mới có thể thay đổi gợi ý podcast
        await fetchData(); 
      }
    } catch (err) {
      console.error("Lỗi lưu nhật ký:", err);
      alert("Lỗi rồi, BE code Controller Journal chưa đấy?");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Trung tâm Sức khỏe</h1>
        <p className="text-zinc-500">Theo dõi trạng thái và nhận lời khuyên cá nhân hóa từ PodSphere.</p>
      </div>

      {/* 1. Lời khuyên cá nhân hóa */}
      {rec && <RecommendationBanner rec={rec} />}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Các chỉ số cơ bản */}
          <section>
            <h3 className="mb-4 text-lg font-bold">Chỉ số của mày</h3>
            {stats ? <HealthStatCard stats={stats} /> : (
              <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
                Chưa có dữ liệu thống kê. Mày cần cập nhật chỉ số sức khỏe trước.
              </div>
            )}
          </section>

          {/* 3. Form nhập liệu tâm trạng */}
          <section>
            <h3 className="mb-4 text-lg font-bold">Ghi chép tâm trạng</h3>
            <JournalEntryForm onSave={handleSaveJournal} />
          </section>
        </div>

        {/* 4. Cột gợi ý Podcast dựa trên stress level */}
        <aside className="space-y-4">
          <h3 className="font-bold">Dành riêng cho mày</h3>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-xs leading-relaxed text-zinc-500">
              Dựa trên mức độ stress <span className="font-bold text-indigo-600">{stats?.stressLevel || "đang phân tích"}</span>, 
              mày nên thử nghe những nội dung giúp cân bằng lại tâm trí:
            </p>
            <div className="mt-4 flex flex-col gap-3">
               {/* Chỗ này mày render PodcastCard của những tập liên quan đến tag gợi ý nhé */}
               <p className="text-[10px] italic text-zinc-400">Đang cập nhật danh sách phát...</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}