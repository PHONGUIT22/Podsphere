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
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header - Chuyển sang Indigo */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tighter text-indigo-500 uppercase">
            Xin Quẻ Kinh Dịch
          </h1>
          <p className="text-zinc-500 font-medium">
            "Hữu niệm tất ứng - Thành tâm thỉnh quẻ, linh ứng tại tâm"
          </p>
        </div>

        {/* Form Gieo Quẻ */}
        {!result && (
          <div className="bg-zinc-900/50 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <form onSubmit={handleCastIChing} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chủ đề */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    <Tag size={16} className="text-zinc-600" /> Chủ đề xin hỏi
                  </label>
                  <select 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white font-medium focus:border-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    {TOPICS.map(t => <option key={t} value={t} className="bg-zinc-900">{t}</option>)}
                  </select>
                </div>
                
                {/* Ngày */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    <Calendar size={16} className="text-zinc-600" /> Ngày gieo quẻ
                  </label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white font-medium focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Giờ */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    <Clock size={16} className="text-zinc-600" /> Giờ gieo quẻ
                  </label>
                  <input 
                    type="time" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white font-medium focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Câu hỏi */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  <MessageSquare size={16} className="text-zinc-600" /> Câu hỏi chi tiết
                </label>
                <textarea
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Hữu niệm tất ứng - Nhập câu hỏi của bạn tại đây..."
                  className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white font-medium focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              {error && (
                <div className="bg-red-950/30 text-red-500 p-4 rounded-xl font-bold border border-red-900/50">
                  ⚠️ {error}
                </div>
              )}

              {/* Nút bấm chuyển sang màu Indigo */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 text-xl rounded-[1.5rem] text-white font-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                    loading 
                      ? 'bg-indigo-400 cursor-not-allowed opacity-70' 
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
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
        )}

        {/* Kết Quả */}
        {result && (
          <div className="animate-in fade-in zoom-in duration-700 pb-20">
            <IChingHexagram 
              hexagramData={result.hexagramData.data} 
              aiReading={result.aiReading} 
            />
            <button 
              onClick={() => setResult(null)}
              className="mt-12 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest mx-auto block p-4 bg-zinc-900 rounded-2xl transition-all border border-zinc-800"
            >
              ← Gieo quẻ khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}