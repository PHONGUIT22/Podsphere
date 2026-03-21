"use client";

import { useState } from "react";
import { ArrowLeft, Send, Sparkles, User, Calendar, Clock, Venus, Mars } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { TuViGrid } from "@/components/astrology/TuViGrid"; // Component tao đã đưa hôm qua
import { toast } from "react-hot-toast";

export default function TuViPage() {
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    hour: 0,
    isMale: true,
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5015/api/Astrology/create-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Parse cục JSON từ Backend trả về
      const parsed = JSON.parse(res.data.data);
      // Gắn thêm họ tên vào để hiện ở Thiên Bàn
      parsed.fullName = formData.fullName;
      
      setResultData(parsed);
      toast.success("Đã lập xong lá số cho mày!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi rồi mậy, check lại Backend/NodeJS đi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12 pb-32">
      {/* 1. NÚT QUAY LẠI */}
      <Link href="/astrology" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors uppercase font-black text-[10px] tracking-[0.2em]">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại trung tâm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* 2. CỘT TRÁI: FORM NHẬP LIỆU */}
        <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Lập Lá Số <span className="text-indigo-500">Tử Vi</span></h1>
            <p className="text-sm text-zinc-500 font-medium">Nhập chính xác giờ sinh để có kết quả đúng nhất mậy.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6 bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] shadow-xl">
            {/* Họ Tên */}
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

            {/* Ngày Sinh & Giờ Sinh */}
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

            {/* Giới tính */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Giới tính (Rất quan trọng)</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isMale: true})}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${formData.isMale ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                >
                  <Mars size={14} /> NAM
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isMale: false})}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${!formData.isMale ? 'bg-pink-600 border-pink-500 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                >
                  <Venus size={14} /> NỮ
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black py-5 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner /> : <><Sparkles size={18} className="text-indigo-600" /> AN SAO LẬP LÁ SỐ</>}
            </button>
          </form>
        </div>

        {/* 3. CỘT PHẢI: HIỂN THỊ KẾT QUẢ */}
        <div className="lg:col-span-2 min-h-[600px] flex flex-col">
          {resultData ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-widest">Lá Số Đã Lập</h2>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">TRỰC TUYẾN</span>
               </div>
               {/* VẼ LÁ SỐ */}
               <TuViGrid data={resultData} />
                            
              {/* GIẢI THÍCH NHANH */}
              <div className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/10 space-y-4">
                <h4 className="text-indigo-400 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={16} /> Nhận định tổng quan
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Lá số của <span className="text-white font-bold">{resultData?.fullName}</span> sinh năm <span className="text-white font-bold">{resultData?.canChi?.year}</span> ({resultData?.conGiap}). 
                  Mệnh đóng tại cung <span className="text-white font-bold">Tý</span>, 
                  có ngũ hành cục là <span className="text-indigo-400 font-bold">{resultData?.cuc} (Mộc Tam Cục)</span>. 
                  Lá số này cho thấy mày là người thông minh, có quý nhân phù trợ, hãy nghe thêm các podcast về "Chữa lành tâm hồn" trên PodSphere để cân bằng năng lượng nhé!
                </p>
              </div>
            </div>
          ) : (
            /* TRẠNG THÁI CHỜ */
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] text-center p-10">
               <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
                  <Sparkles size={40} className="text-zinc-700" />
               </div>
               <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu</h3>
               <p className="text-zinc-600 text-xs mt-2 max-w-xs">Mày vui lòng điền đầy đủ thông tin bên trái để hệ thống an sao và lập lá số nhé.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}