// src/components/ui/RecommendationBanner.tsx
import { HealthRecommendationDto } from "@/types/health";
import { Sparkles, BrainCircuit } from "lucide-react";

export const RecommendationBanner = ({ rec }: { rec: HealthRecommendationDto }) => {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl shadow-indigo-500/20">
      {/* Background patterns */}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
      <div className="absolute bottom-0 left-0 h-40 w-full bg-linear-to-t from-black/20 to-transparent"></div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/20 shadow-inner backdrop-blur-xl">
          <BrainCircuit size={32} className="text-yellow-300" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-200" />
            <h2 className="text-xl font-black tracking-tight uppercase">AI Health Insights</h2>
          </div>
          <p className="mt-2 text-lg font-medium leading-relaxed text-white/90">
            "{rec.advice}"
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rec.suggestedPodcastTags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[10px] font-bold backdrop-blur-md">
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <button className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-black text-indigo-600 shadow-xl transition-all hover:scale-105 active:scale-95">
          NGHE NGAY
        </button>
      </div>
    </div>
  );
};