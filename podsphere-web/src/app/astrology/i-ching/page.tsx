'use client';

import { useState, useEffect } from 'react';
import IChingHexagram from '@/components/astrology/IChingHexagram';

const TOPICS = ['Chung', 'Công danh', 'Tài lộc', 'Tình duyên', 'Gia đạo', 'Sức khỏe', 'Giao dịch', 'Xuất hành'];

export default function IChingPage() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('Chung');
  
  // State cho Ngày và Giờ
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Set giá trị mặc định là thời gian hiện tại khi trang vừa load
  useEffect(() => {
    const now = new Date();
    // Format YYYY-MM-DD
    setSelectedDate(now.toISOString().split('T')[0]);
    // Format HH:mm
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
      
      // Parse ngày giờ từ Form
      const d = new Date(selectedDate);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
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
          year,
          month,
          day,
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-amber-600">Xin Quẻ Kinh Dịch</h1>
        <p className="text-gray-500">Gieo quẻ Mai Hoa Dịch Số - Tùy chỉnh ngày giờ hoặc dùng giờ hiện tại.</p>
      </div>

      {/* Form Gieo Quẻ */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleCastIChing} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề xin hỏi</label>
              <select 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày gieo quẻ</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ gieo quẻ</label>
              <input 
                type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi chi tiết (Hữu niệm tất ứng)</label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="VD: Tuần tới tôi đi phỏng vấn công ty X có thuận lợi không?"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg rounded-xl text-white font-bold transition-all shadow-md ${
              loading ? 'bg-amber-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {loading ? 'Đang thỉnh thiên cơ...' : 'Gieo Quẻ Ngay'}
          </button>
        </form>
      </div>

      {/* Kết Quả */}
      {result && (
        <IChingHexagram 
          hexagramData={result.hexagramData.data} 
          aiReading={result.aiReading} 
        />
      )}
    </div>
  );
}