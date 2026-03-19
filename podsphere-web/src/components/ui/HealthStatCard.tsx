import { UserHealthStatsDto } from "@/types/health";
import { Activity, Moon, Zap, AlertCircle } from "lucide-react";

export const HealthStatCard = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      
      {/* 1. CARD TÂM TRẠNG - Màu Blue/Indigo */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-blue-500/10 bg-blue-500/5 p-6 transition-all hover:border-blue-500/30 hover:bg-blue-500/10">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-500 p-3 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
            <Activity size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/70">Tâm trạng</p>
            <div className="flex items-baseline gap-1">
              <h4 className="text-3xl font-black text-blue-900 dark:text-blue-50">{stats.moodScore}</h4>
              <span className="text-sm font-bold text-blue-500/50">/10</span>
            </div>
          </div>
        </div>
        {/* Hiệu ứng decor chìm */}
        <Activity size={60} className="absolute -bottom-4 -right-4 text-blue-500/5 rotate-12" />
      </div>

      {/* 2. CARD GIẤC NGỦ - Màu Purple */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-purple-500/10 bg-purple-500/5 p-6 transition-all hover:border-purple-500/30 hover:bg-purple-500/10">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-purple-500 p-3 text-white shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-110">
            <Moon size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/70">Giấc ngủ</p>
            <div className="flex items-baseline gap-1">
              <h4 className="text-3xl font-black text-purple-900 dark:text-purple-50">{stats.sleepHours}</h4>
              <span className="text-sm font-bold text-purple-500/50">Giờ</span>
            </div>
          </div>
        </div>
        <Moon size={60} className="absolute -bottom-4 -right-4 text-purple-500/5 -rotate-12" />
      </div>

      {/* 3. CARD CĂNG THẲNG - Màu Orange */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-orange-500/10 bg-orange-500/5 p-6 transition-all hover:border-orange-500/30 hover:bg-orange-500/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-110">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/70">Căng thẳng</p>
              <h4 className="text-xl font-black text-orange-900 dark:text-orange-50 uppercase tracking-tighter">
                {stats.stressLevel || "Bình thường"}
              </h4>
            </div>
          </div>
          
          {/* Cảnh báo nhỏ bên dưới */}
          <div className="flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-3 py-1.5 border border-orange-500/10">
             <AlertCircle size={12} className="text-orange-500" />
             <p className="text-[10px] font-bold text-orange-600/80 dark:text-orange-400/80 leading-tight line-clamp-1">
                {stats.stressWarning}
             </p>
          </div>
        </div>
      </div>

    </div>
  );
};