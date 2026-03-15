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
        // 1. Fetch dữ liệu chung
        const [courseData, blogData] = await Promise.all([
          courseService.getAllCourses(),
          blogService.getAllBlogs(),
        ]);
        setCourses(courseData.slice(0, 3));
        setBlogs(blogData.slice(0, 3));

        // 2. Logic Podcast: Nếu login thì lấy gợi ý, không thì lấy tất cả
        if (isAuthenticated) {
          const [recPodData, recHealthData] = await Promise.all([
            podcastService.getRecommendedPodcasts(), 
            healthService.getRecommendations(),      
          ]);
          setPodcasts(recPodData.slice(0, 4));
          setHealthRec(recHealthData);
        } else {
          const podData = await podcastService.getAllPodcasts();
          setPodcasts(podData.slice(0, 4));
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
    // THAY ĐỔI 1: Bọc container theo gợi ý AI (có mx-auto, căn giữa, khoảng cách các section rộng hơn space-y-20)
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-20">
      
      {/* 1. HERO SECTION & HEALTH BANNER */}
      <section className="space-y-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black tracking-tighter dark:text-white lg:text-5xl">
            Chào {isAuthenticated ? user?.username : "mày"}, <br className="hidden sm:block" />
            <span className="text-indigo-600">tâm trạng</span> hôm nay sao rồi?
          </h1>
          <p className="max-w-xl text-lg font-medium text-zinc-500">
            {isAuthenticated 
              ? "Dựa vào các chỉ số gan NASH và độ stress, tao đã chuẩn bị riêng cho mày vài tập podcast cực 'chill' đây."
              : "Đăng nhập để nhận lộ trình nghe Podcast và lời khuyên sức khỏe riêng cho mày nhé."}
          </p>
        </div>

        {isAuthenticated && healthRec && (
          <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
            <RecommendationBanner rec={healthRec} />
          </div>
        )}
      </section>

      {/* 2. SECTION PODCASTS */}
      <section>
        {/* THAY ĐỔI 2: Style header mới từ AI (Chữ to 3xl, có gạch chân màu xanh) */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">
              {isAuthenticated ? "Dành riêng cho mày" : "Podcast mới nhất"}
            </h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-indigo-600"></div>
          </div>
          <Link href="/podcasts" className="text-sm font-bold text-indigo-600 hover:underline">
            Xem tất cả danh mục
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {podcasts.map((p) => (
            <PodcastCard key={p.id} podcast={p} />
          ))}
        </div>
      </section>

      {/* 3. SECTION KHÓA HỌC */}
      <section>
        {/* Đồng bộ giao diện header cho Khóa học */}
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

      {/* 4. SECTION BLOG */}
      {/* THAY ĐỔI 3: Vẫn giữ background xám bo góc nhưng sửa lại header cho đồng bộ */}
      <section className="rounded-[2.5rem] bg-zinc-50 p-8 dark:bg-zinc-900/50 lg:p-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Kiến thức cộng đồng</h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-indigo-600"></div>
          </div>
          <Link href="/blogs" className="text-sm font-bold text-indigo-600 hover:underline">
            Đọc tất cả bài viết
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blogs.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      </section>

    </div>
  );
}