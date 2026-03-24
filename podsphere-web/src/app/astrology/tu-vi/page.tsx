"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, User, Calendar, Clock, Venus, Mars, CalendarSearch } from "lucide-react"; // Thêm icon CalendarSearch
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import axios from "axios";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "react-hot-toast";

export default function TuViPage() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    hour: 0,
    isMale: true,
    viewYear: new Date().getFullYear(), // MẶC ĐỊNH LÀ NĂM HIỆN TẠI
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // LƯU Ý: Đảm bảo BE .NET (localhost:5015) của bạn nhận field `viewYear` 
      // và truyền nó tiếp sang API Node/Python nhé!
      const res = await axios.post(
        "http://localhost:5015/api/Astrology/create-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const parsedData = JSON.parse(res.data.data);
      const finalResult = {
        ...parsedData,
        fullName: formData.fullName,
        viewYear: formData.viewYear // Truyền năm xem qua View để hiển thị
      };

      localStorage.setItem("last_tuvi_result", JSON.stringify(finalResult));
      toast.success("Đã lập xong, đang mở lá số...");
      router.push("/astrology/tu-vi/view");

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "Lỗi rồi mậy, check lại Backend đi!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12 pb-32">
      <Link href="/astrology" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors uppercase font-black text-[10px] tracking-[0.2em]">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại trung tâm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Lập Lá Số <span className="text-indigo-500">Tử Vi</span></h1>
            <p className="text-sm text-zinc-500 font-medium">Nhập chính xác giờ sinh và năm xem hạn để có kết quả đúng nhất.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6 bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] shadow-xl">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2">
                <User size={12} /> Họ và Tên
              </label>
              <input 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Nguyễn Văn A"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2">
                  <Calendar size={12} /> Ngày sinh
                </label>
                <input 
                  required type="date"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all text-sm"
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2">
                  <Clock size={12} /> Giờ sinh
                </label>
                <input 
                  required type="number" min="0" max="23"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all text-sm"
                  placeholder="0-23"
                  onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {/* Ô NHẬP GIỚI TÍNH */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Giới tính</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isMale: true})}
                    className={`flex items-center justify-center gap-1 py-4 rounded-xl border transition-all font-bold text-xs ${formData.isMale ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                  >
                    <Mars size={14} /> NAM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isMale: false})}
                    className={`flex items-center justify-center gap-1 py-4 rounded-xl border transition-all font-bold text-xs ${!formData.isMale ? 'bg-pink-600 border-pink-500 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                  >
                    <Venus size={14} /> NỮ
                  </button>
                </div>
              </div>

              {/* Ô NHẬP NĂM XEM HẠN BỔ SUNG */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2">
                  <CalendarSearch size={12} /> Năm xem hạn
                </label>
                <input 
                  required type="number" min="1900" max="2100"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all text-sm text-center font-bold"
                  value={formData.viewYear}
                  onChange={(e) => setFormData({...formData, viewYear: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black py-5 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? <LoadingSpinner /> : <><Sparkles size={18} className="text-indigo-600" /> AN SAO LẬP LÁ SỐ</>}
            </button>
          </form>
        </div>

        {/* ... (Giữ nguyên CỘT PHẢI) ... */}
        <div className="lg:col-span-2 min-h-[600px] flex flex-col">
          {/* ... */}
        </div>

      </div>
    </div>
  );
}