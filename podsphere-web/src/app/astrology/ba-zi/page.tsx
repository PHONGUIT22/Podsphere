"use client";
import React, { useState } from 'react';
import { BaziChart } from '@/components/astrology/BaziChart';
import { Sparkles, Send } from 'lucide-react';

export default function BaziPage() {
  const [formData, setFormData] = useState({ birthDate: '', hour: 0, isMale: true });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.birthDate) {
            alert("Vui lòng chọn ngày sinh!");
            return;
        }

        setLoading(true);
        try {
            const dateObj = new Date(formData.birthDate);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            const hour = formData.hour;
            const gender = formData.isMale ? 1 : 0;

            // Sử dụng 127.0.0.1 nếu localhost gặp vấn đề phân giải IP
            const url = `http://127.0.0.1:3001/api/astrology/bazi?year=${year}&month=${month}&day=${day}&hour=${hour}&gender=${gender}`;
            
            console.log("Fetching from:", url); // Kiểm tra URL trong Console (F12)

            const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            });

            const json = await res.json();
            
            if (json.status === "success") {
                setResult(json.data); 
            } else {
                throw new Error(json.error || "Lỗi server");
            }
        } catch (error: any) {
            console.error("Fetch error:", error);
            alert("Không thể kết nối tới Server Node.js (Cổng 3001). Hãy chắc chắn bạn đã chạy 'node src/index.js'");
        } finally {
            setLoading(false);
        }
        };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tighter text-indigo-500">Bát Tự</h1>
          <p className="text-zinc-500">Nhập thông tin giờ sinh để phân tích ngũ hành bản mệnh</p>
        </div>

        {/* Form nhập liệu */}
        {!result && (
          <form onSubmit={handleSubmit} className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Ngày sinh dương lịch</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none"
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Giờ sinh (0-23)</label>
                <input 
                  type="number" min="0" max="23" required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none"
                  onChange={e => setFormData({...formData, hour: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-4">
               <button 
                type="button"
                onClick={() => setFormData({...formData, isMale: true})}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all ${formData.isMale ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
               >NAM MỆNH</button>
               <button 
                type="button"
                onClick={() => setFormData({...formData, isMale: false})}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all ${!formData.isMale ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
               >NỮ MỆNH</button>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black rounded-3xl hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? "ĐANG TÍNH TOÁN..." : "XEM LÁ SỐ"} <Send size={20} />
            </button>
          </form>
        )}

        {/* Kết quả lá số */}
        {result && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-700">
            <BaziChart data={result} />
            <button 
              onClick={() => setResult(null)}
              className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest mx-auto block"
            >
              Nhập lại thông tin
            </button>
          </div>
        )}

      </div>
    </div>
  );
}