import { ReviewDto } from "@/types/social";
import { Star } from "lucide-react";

export const ReviewCard = ({ review }: { review: ReviewDto }) => {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-zinc-900 dark:text-white">
          @{review.userUsername || "An danh"}
        </span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < review.rating ? "currentColor" : "none"}
              className={i < review.rating ? "text-yellow-400" : "text-zinc-300"}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 italic">
        "{review.comment}"
      </p>
      <p className="mt-2 text-[10px] text-zinc-400">
        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
      </p>
    </div>
  );
};