import { UserHealthStatsDto } from "@/types/health";
import { Activity, Moon, Zap } from "lucide-react";

export const HealthStatCard = ({ stats }: { stats: UserHealthStatsDto }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Mood Score */}
      <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
        <div className="rounded-full bg-blue-500 p-2 text-white">
          <Activity size={20} />
        </div>
        <div>
          <p className="text-xs text-blue-600 dark:text-blue-400">Tâm trạng</p>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.moodScore}/10</p>
        </div>
      </div>

      {/* Sleep Hours */}
      <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-950/20">
        <div className="rounded-full bg-purple-500 p-2 text-white">
          <Moon size={20} />
        </div>
        <div>
          <p className="text-xs text-purple-600 dark:text-purple-400">Giấc ngủ</p>
          <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{stats.sleepHours}h</p>
        </div>
      </div>

      {/* Stress Level */}
      <div className="flex items-center gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4 dark:border-orange-900/30 dark:bg-orange-950/20">
        <div className="rounded-full bg-orange-500 p-2 text-white">
          <Zap size={20} />
        </div>
        <div>
          <p className="text-xs text-orange-600 dark:text-orange-400">Căng thẳng</p>
          <p className="text-xl font-bold text-orange-900 dark:text-orange-100">{stats.stressLevel}</p>
        </div>
      </div>
    </div>
  );
};