import { HealthRecommendationDto } from "@/types/health";
import { Lightbulb } from "lucide-react";

export const RecommendationBanner = ({ rec }: { rec: HealthRecommendationDto }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
      <div className="relative z-10 flex items-start gap-4">
        <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
          <Lightbulb size={24} className="text-yellow-300" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Lời khuyên dành cho mày</h2>
          <p className="mt-1 text-sm text-white/90 leading-relaxed">
            {rec.advice}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rec.suggestedPodcastTags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium backdrop-blur-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Trang trí background */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
    </div>
  );
};