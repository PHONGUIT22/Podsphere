import { PlayCircle, FileText, Video, Headphones } from "lucide-react";
import { LessonDto } from "@/types/course";

export const LessonItem = ({ lesson, isCompleted }: { lesson: LessonDto, isCompleted?: boolean }) => {
  return (
    <div className={`group flex items-center justify-between border-b border-zinc-100 p-4 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50 ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          {lesson.videoUrl ? <Video size={18} /> : <Headphones size={18} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
            Bài {lesson.order}: {lesson.title}
          </h4>
          <div className="mt-1 flex gap-3">
            {lesson.workbookUrl && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <FileText size={10} /> Bài tập đính kèm
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="rounded-full p-2 text-zinc-400 hover:bg-white hover:text-indigo-600 shadow-sm transition-all dark:hover:bg-zinc-800">
        <PlayCircle size={24} />
      </button>
    </div>
  );
};