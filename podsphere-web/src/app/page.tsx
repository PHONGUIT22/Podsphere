"use client";

import { useEffect, useState } from "react";
import { PodcastList } from "../components/podcast-list";
import { PodcastDto } from "../types/podcast";
import { podcastService } from "../services/podcast.service"; 

export default function Home() {
  // 1. Tạo State để lưu danh sách Podcast từ API
  const [podcasts, setPodcasts] = useState<PodcastDto[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Dùng useEffect để gọi API ngay khi trang vừa load xong
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const data = await podcastService.getAllPodcasts();
        setPodcasts(data); // Lưu data thật vào state
      } catch (error) {
        console.error("Lỗi khi gọi API Podcast:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-bold">Đang tải Podcast...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Podsphere Explorer
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Dữ liệu này được lấy trực tiếp từ Backend của mày đó!
          </p>
        </div>

        {}
        {podcasts.length > 0 ? (
          <PodcastList podcasts={podcasts} />
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500">Chưa có Podcast nào trong Database.</p>
          </div>
        )}
      </main>
    </div>
  );
}