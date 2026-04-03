'use client';

import { useState, useEffect } from 'react';
import IChingHexagram from '@/components/astrology/IChingHexagram';
import { Sparkles, Calendar, Clock, MessageSquare, Tag } from 'lucide-react';

const TOPICS = ['Chung', 'Công danh', 'Tài lộc', 'Tình duyên', 'Gia đạo', 'Sức khỏe', 'Giao dịch', 'Xuất hành'];

export default function IChingPage() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('Chung');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
  }, []);

  const handleCastIChing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Vui lòng nhập câu hỏi của bạn.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token'); 
      const d = new Date(selectedDate);
      const hour = parseInt(selectedTime.split(':')[0]);

      const response = await fetch('http://localhost:5015/api/Astrology/cast-iching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question,
          topic,
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate(),
          hour,
          method: 'MaiHoa'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra khi gieo quẻ.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-amber-500 uppercase tracking-tighter">
            Xin Quẻ Kinh Dịch
          </h1>
          <p className="text-zinc-500 font-medium italic">
            "Hữu niệm tất ứng - Thành tâm thỉnh quẻ, linh ứng tại tâm"
          </p>
        </div>

        {/* Form Gieo Quẻ - Nền trắng, Chữ đen đậm */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-4">
          <form onSubmit={handleCastIChing} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chủ đề */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-black uppercase tracking-widest ml-1">
                  <Tag size={16} /> Chủ đề xin hỏi
                </label>
                <select 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-black font-bold focus:bg-white focus:border-amber-500 outline-none transition-all cursor-pointer"
                >
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              {/* Ngày */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-black uppercase tracking-widest ml-1">
                  <Calendar size={16} /> Ngày gieo quẻ
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-black font-bold focus:bg-white focus:border-amber-500 outline-none transition-all"
                />
              </div>

              {/* Giờ */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-black uppercase tracking-widest ml-1">
                  <Clock size={16} /> Giờ gieo quẻ
                </label>
                <input 
                  type="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-black font-bold focus:bg-white focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Câu hỏi */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-black uppercase tracking-widest ml-1">
                <MessageSquare size={16} /> Câu hỏi chi tiết
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="VD: Tuần tới tôi đi phỏng vấn công ty X có thuận lợi không?"
                className="w-full p-5 bg-gray-100 border-2 border-gray-200 rounded-2xl text-black font-bold focus:bg-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold border border-red-200 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 text-xl rounded-[1.5rem] text-white font-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                loading 
                  ? 'bg-amber-300 cursor-not-allowed opacity-70' 
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20'
              }`}
            >
              {loading ? (
                <><Sparkles className="animate-spin" /> ĐANG THỈNH THIÊN CƠ...</>
              ) : (
                'GIEO QUẺ NGAY'
              )}
            </button>
          </form>
        </div>

        {/* Kết Quả */}
        {result && (
          <div className="animate-in fade-in zoom-in duration-500 pb-20">
            <IChingHexagram 
              hexagramData={result.hexagramData.data} 
              aiReading={result.aiReading} 
            />
            <button 
              onClick={() => setResult(null)}
              className="mt-8 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest mx-auto block p-4 bg-zinc-900/50 rounded-2xl transition-all border border-zinc-800"
            >
              ← Gieo quẻ khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}