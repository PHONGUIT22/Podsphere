"use client";

import { useEffect, useState } from "react";
import { podcastService } from "@/services/podcast.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PodcastDto, CategoryDto } from "@/types/podcast";
import { 
  Play, Share2, Bookmark, Download, Bell, 
  ChevronDown, Flame, Users, Clock
} from "lucide-react";
import Link from "next/link"; // Import Link để chuyển trang

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<PodcastDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [podData, catData] = await Promise.all([
          podcastService.getAllPodcasts(),
          podcastService.getCategories()
        ]);
        setPodcasts(podData);
        setCategories(catData);
      } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPodcasts = podcasts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#050b10] text-zinc-400 pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 text-center space-y-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Flame size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">Thư viện nội dung</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
            Tất cả tập <span className="text-indigo-500">podcast</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm font-medium text-zinc-500 leading-relaxed pt-2">
            Chọn chủ đề bạn quan tâm và bắt đầu lắng nghe. <br />
            Mỗi tập là một cuộc trò chuyện về sức khỏe tinh thần và kỹ năng sống.
          </p>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 flex justify-center gap-12 pt-10">
          <div className="space-y-1">
            <p className="text-4xl font-black text-indigo-500">{podcasts.length}+</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Podcast</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-indigo-500">2K+</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Lượt nghe</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-indigo-500">30</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Phút/Tập</p>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER */}
      <section className="max-w-5xl mx-auto px-6 mb-16 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-zinc-600 mr-2">Lọc theo chủ đề:</span>
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
              selectedCategory === "all" 
              ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.4)]" 
              : "bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50"
            }`}
          >
            Tất cả <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${selectedCategory === 'all' ? 'bg-indigo-400 text-indigo-950' : 'bg-zinc-800 text-zinc-500'}`}>{podcasts.length}</span>
          </button>
          
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                selectedCategory === cat.name 
                ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.4)]" 
                : "bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50"
              }`}
            >
              {cat.name} <span className="bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-md text-[10px]">3</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PODCAST LIST (Dạng List như ảnh mày muốn) */}
      <section className="max-w-5xl mx-auto px-6 space-y-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-black text-white">Hiển thị {filteredPodcasts.length} Podcast</h3>
        </div>

        {filteredPodcasts.map((p, index) => (
          // BAO BỌC TOÀN BỘ CARD BẰNG LINK ĐỂ NHẤN VÀO LÀ SANG TRANG CHI TIẾT
          <Link 
            href={`/podcasts/${p.id}`} 
            key={p.id} 
            className="group block relative bg-[#0a1219] border border-zinc-800/40 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-10">
              
              {/* Số thứ tự #01, #02... */}
              <div className="flex items-center justify-center w-32 h-32 shrink-0 rounded-[2rem] bg-indigo-950/20 border border-indigo-500/10 text-indigo-500 text-4xl font-black shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                #{String(index + 1).padStart(2, '0')}
              </div>

              {/* Thông tin nội dung */}
              <div className="flex-1 space-y-5">
                <div className="flex items-center justify-between">
                   <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                     {p.categoryName}
                   </span>
                   <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">15 THÁNG 12, 2024</span>
                </div>

                <h2 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors duration-300">
                  {p.title}
                </h2>
                <p className="text-sm text-zinc-500 line-clamp-2 font-medium leading-relaxed">
                  {p.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.1em]">
                   <div className="flex items-center gap-2"><Clock size={14} className="text-indigo-500/50" /> 30 PHÚT</div>
                   <div className="flex items-center gap-2"><Users size={14} className="text-indigo-500/50" /> HOST: PODSPHERE</div>
                   <div className="flex items-center gap-2"><Flame size={14} className="text-orange-500/60" /> 1.2K LƯỢT NGHE</div>
                </div>

                {/* Nút giả lập và Progress Bar (ĐÃ XÓA THEO YÊU CẦU) */}
                <div className="flex items-center gap-4 pt-4">
                    <div className="flex h-12 items-center gap-3 rounded-2xl bg-indigo-600 px-6 text-[10px] font-black text-white shadow-lg transition-transform group-hover:scale-105">
                        <Play size={16} fill="currentColor" /> XEM CHI TIẾT & PHÁT
                    </div>
                </div>

                {/* Các nút hành động */}
                <div className="flex flex-wrap gap-3 pt-4">
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-500 hover:text-indigo-400 transition-all">
                      <Share2 size={14} /> CHIA SẺ
                   </button>
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-200/5 text-[10px] font-black uppercase text-zinc-500 hover:text-indigo-400 transition-all">
                      <Bookmark size={14} /> LƯU VÀO THƯ VIỆN
                   </button>
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-500 hover:text-indigo-400 transition-all">
                      <Download size={14} /> TẢI VỀ
                   </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 4. NEWSLETTER */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <div className="relative p-12 rounded-[3rem] bg-linear-to-br from-[#0a1219] to-indigo-950/20 border border-indigo-500/10 text-center space-y-6 shadow-2xl">
          <h2 className="text-4xl font-black text-white tracking-tight">Không bỏ lỡ tập mới</h2>
          <p className="text-zinc-500 text-sm font-medium">Đăng ký nhận thông báo mỗi khi có tập podcast mới ra mắt</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-6">
             <input type="email" placeholder="Email của bạn..." className="flex-1 bg-black/40 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500" />
             <button className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-lg">Đăng ký</button>
          </div>
        </div>
      </section>
    </div>
  );
}