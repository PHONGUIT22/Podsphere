import { CourseDto } from "@/types/course";
import { BookOpen, Tag } from "lucide-react";

export const CourseCard = ({ course }: { course: CourseDto }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-video">
        <img src={course.thumbnail || "/course-placeholder.png"} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          COURSE
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-bold text-zinc-900 dark:text-white">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{course.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {course.salePrice < course.price && (
              <span className="text-[10px] text-zinc-400 line-through">{course.price.toLocaleString()}đ</span>
            )}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{course.salePrice.toLocaleString()}đ</span>
          </div>
          <button className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};