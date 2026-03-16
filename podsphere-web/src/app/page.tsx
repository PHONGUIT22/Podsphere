"use client";

import { useEffect, useState } from "react";
import { PodcastCard } from "@/components/ui/PodcastCard";
import { CourseCard } from "@/components/ui/CourseCard";
import { BlogCard } from "@/components/ui/BlogCard";
import { RecommendationBanner } from "@/components/ui/RecommendationBanner";
import { podcastService } from "@/services/podcast.service";
import { courseService } from "@/services/course.service";
import { blogService } from "@/services/blog.service";
import { healthService } from "@/services/health.service";
import { useAuthStore } from "@/store/useAuthStore";
import { PodcastDto } from "@/types/podcast";
import { CourseDto } from "@/types/course";
import { BlogDto } from "@/types/social";
import { HealthRecommendationDto } from "@/types/health";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PlayCircle } from "lucide-react"; 
import Link from "next/link";

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const [podcasts, setPodcasts] = useState<PodcastDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [healthRec, setHealthRec] = useState<HealthRecommendationDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseData, blogData] = await Promise.all([
          courseService.getAllCourses(),
          blogService.getAllBlogs(),
        ]);
        setCourses(courseData.slice(0, 3));
        setBlogs(blogData.slice(0, 3));

        if (isAuthenticated) {
          const [recPodData, recHealthData] = await Promise.all([
            podcastService.getRecommendedPodcasts(), 
            healthService.getRecommendations(),      
          ]);
          setPodcasts(recPodData.slice(0, 5));
          setHealthRec(recHealthData);
        } else {
          const podData = await podcastService.getAllPodcasts();
          setPodcasts(podData.slice(0, 5));
        }
      } catch (error) {
        console.error("Lỗi trang chủ: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-12 pb-20">
      
      {/* 1. MODERN HERO BANNER */}
      <section className="relative overflow-hidden rounded-[3rem] bg-indigo-700 p-8 text-white lg:p-16 shadow-2xl">
        <div className="relative z-10 flex flex-col justify-center gap-6 lg:w-2/3 animate-in fade-in slide-in-from-left-8 duration-700">
          <span className="w-fit rounded-full bg-white/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            🔥 Đang thịnh hành
          </span>
          <h1 className="text-4xl font-black leading-tight lg:text-6xl">
             {isAuthenticated ? `Chào mày, ${user?.username}!` : "Lắng nghe tâm hồn mày"}
          </h1>
          <p className="max-w-md text-lg font-medium text-indigo-100/80">
            Khám phá hơn 500+ tập podcast về tâm lý, thiền định và bí kíp sống sót tại UIT.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-indigo-700 shadow-xl transition-all hover:scale-105 active:scale-95">
              Nghe Ngay
            </button>
            <button className="rounded-2xl border-2 border-white/30 px-8 py-4 text-sm font-black text-white backdrop-blur-md transition-all hover:bg-white/10">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 hidden h-full w-1/2 lg:block">
           <img 
             src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop" 
             className="h-full w-full object-cover opacity-60 mix-blend-overlay"
             alt="Hero"
           />
           <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-transparent"></div>
        </div>
      </section>

      {/* 2. CONTINUE PLAYING & HEALTH */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
           {isAuthenticated && healthRec ? (
             <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
               <RecommendationBanner rec={healthRec} />
             </div>
           ) : (
             <div className="flex h-full flex-col justify-center rounded-[2.5rem] border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-xl font-black dark:text-white">Đăng nhập để nhận lộ trình</h3>
                <p className="mt-2 text-sm text-zinc-500">Hệ thống AI sẽ phân tích chỉ số sức khỏe của mày để gợi ý nội dung phù hợp nhất.</p>
                <Link href="/login" className="mt-4 w-fit rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Đăng nhập ngay</Link>
             </div>
           )}
        </div>

        <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
           <h3 className="text-lg font-black dark:text-white">Đang nghe dở</h3>
           <div className="mt-6 flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800">
                 <img src={podcasts[0]?.thumbnail || "/placeholder.png"} className="h-full w-full object-cover" alt="" />
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="truncate text-sm font-black dark:text-white">{podcasts[0]?.title || "Chưa có dữ liệu"}</p>
                 <p className="text-xs font-medium text-zinc-500 mt-1">Gần đây nhất</p>
              </div>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-transform hover:scale-105 active:scale-95">
                <PlayCircle size={20} fill="currentColor" />
              </button>
           </div>
        </div>
      </div>
      {/* Thêm vào page.tsx phía trên Grid Podcast */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {["Tất cả", "Thiền định", "Thư giãn", "Tập trung", "Kỹ năng"].map((cat) => (
          <button key={cat} className="shrink-0 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold transition-all hover:border-indigo-600 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900">
            {cat}
          </button>
        ))}
      </div>
      {/* 3. GRID PODCASTS */}
      <section className="pt-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">
              {isAuthenticated ? "Dành riêng cho mày" : "Podcast nổi bật"}
            </h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-indigo-600"></div>
          </div>
          <Link href="/podcasts" className="text-sm font-bold text-indigo-600 hover:underline">Xem hết</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {podcasts.map((p) => (
            <Link href={`/podcasts/${p.id}`} key={p.id} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-md dark:bg-zinc-800">
                <img src={p.thumbnail || "/placeholder.png"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.title} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <PlayCircle size={48} className="text-white scale-75 transition-transform duration-300 group-hover:scale-100" fill="white" />
                </div>
              </div>
              <h4 className="mt-4 line-clamp-1 text-sm font-black dark:text-white group-hover:text-indigo-600 transition-colors">{p.title}</h4>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mt-1">{p.categoryName || "Podcast"}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SECTION KHÓA HỌC */}
      <section className="pt-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Khóa học kỹ năng</h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-indigo-600"></div>
          </div>
          <Link href="/courses" className="text-sm font-bold text-indigo-600 hover:underline">
            Khám phá thêm
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* 5. SECTION BLOG (ĐÃ FIX LỖI LỆCH HEADER) */}
      <section className="pt-8">
        {/* Tiêu đề được đưa ra ngoài để bằng mép với các phần trên */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Kiến thức cộng đồng</h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-indigo-600"></div>
          </div>
          <Link href="/blogs" className="text-sm font-bold text-indigo-600 hover:underline">
            Đọc tất cả bài viết
          </Link>
        </div>
        
        {/* Nền xám chỉ bọc Grid card ở dưới */}
        <div className="rounded-[3rem] bg-zinc-50 p-8 dark:bg-zinc-900/50 lg:p-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {blogs.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}