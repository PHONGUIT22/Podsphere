"use client";

import { useEffect, useState } from "react";
import { PodcastCard } from "@/components/ui/PodcastCard";
import { CourseCard } from "@/components/ui/CourseCard";
import { BlogCard } from "@/components/ui/BlogCard";
import { podcastService } from "@/services/podcast.service";
import { courseService } from "@/services/course.service";
import { blogService } from "@/services/blog.service";
import { PodcastDto } from "@/types/podcast";
import { CourseDto } from "@/types/course";
import { BlogDto } from "@/types/social";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowRight, Sparkles, LayoutGrid, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [podcasts, setPodcasts] = useState<PodcastDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [podData, courseData, blogData] = await Promise.all([
          podcastService.getAllPodcasts(),
          courseService.getAllCourses(),
          blogService.getAllBlogs(),
        ]);

        setPodcasts(podData.slice(0, 4));
        setCourses(courseData.slice(0, 3));
        setBlogs(blogData.slice(0, 3));
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang chủ rồi: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      
      {/* SECTION 1: PODCASTS MỚI NHẤT */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Podcast Mới Nhất</h2>
          </div>
          <Link href="/podcasts" className="flex items-center text-sm font-bold text-indigo-600 hover:underline">
            Xem tất cả <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {podcasts.map((p) => (
            <PodcastCard key={p.id} podcast={p} />
          ))}
        </div>
      </section>

      {/* SECTION 2: KHÓA HỌC NỔI BẬT */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Khóa Học Đề Xuất</h2>
          </div>
          <Link href="/courses" className="flex items-center text-sm font-bold text-indigo-600 hover:underline">
            Khám phá thêm <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* SECTION 3: BLOG & KIẾN THỨC (Dàn trang 2 cột cho xịn) */}
      <section className="rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900/50">
        <div className="mb-8 flex items-center gap-2">
          <LayoutGrid className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-black tracking-tight dark:text-white">Kiến thức bổ ích</h2>
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