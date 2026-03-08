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

  useEffect(() => {
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
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trung tâm Sức khỏe</h1>
        <p className="text-zinc-500">Theo dõi trạng thái và nhận lời khuyên cá nhân hóa.</p>
      </div>

      {/* 1. Lời khuyên từ hệ thống */}
      {rec && <RecommendationBanner rec={rec} />}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Chỉ số sức khỏe */}
          <section>
            <h3 className="mb-4 font-bold text-lg">Chỉ số của mày</h3>
            {stats ? <HealthStatCard stats={stats} /> : <p>Chưa có dữ liệu thống kê.</p>}
          </section>

          {/* 3. Nhật ký */}
          <section>
            <h3 className="mb-4 font-bold text-lg">Ghi chép tâm trạng</h3>
            <JournalEntryForm onSave={(data) => console.log(data)} />
          </section>
        </div>

        {/* Cột phụ bên phải có thể thêm danh sách Podcast gợi ý */}
        <div className="space-y-4">
          <h3 className="font-bold">Dành riêng cho mày</h3>
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-500">Dựa trên mức độ stress {stats?.stressLevel}, hãy thử nghe:</p>
            {/* Render PodcastCard ở đây sau */}
          </div>
        </div>
      </div>
    </div>
  );
}