// src/components/features/CommentList.tsx
"use client";

import { CommentDto } from "@/types/social";

export const CommentList = ({ comments }: { comments: CommentDto[] }) => {
  if (comments.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-zinc-500">
        Chưa có ai bình luận hết, mày mở bát đi!
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">{comment.userUsername}</span>
              <span className="text-[10px] text-zinc-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};