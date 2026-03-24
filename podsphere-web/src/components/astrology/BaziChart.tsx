// src/components/astrology/BaziChart.tsx
import React from 'react';

// 1. Bảng màu Ngũ Hành
const WUXING_COLORS: Record<string, string> = {
  'Kim': 'text-[#71717a]', // Xám
  'Mộc': 'text-[#22c55e]', // Xanh lá
  'Thủy': 'text-[#3b82f6]', // Xanh dương
  'Hỏa': 'text-[#ef4444]', // Đỏ
  'Thổ': 'text-[#eab308]', // Vàng đất
};

// 2. Bảng dịch Chữ Hán sang Tiếng Việt
const TRANSLATE: Record<string, string> = {
  // Thiên Can
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
  // Địa Chi
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn',
  '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu',
  '戌': 'Tuất', '亥': 'Hợi'
};

export const BaziChart = ({ data }: { data: any }) => {
  if (!data || !data.pillars) return null;

  // ĐỔI THỨ TỰ: Năm -> Tháng -> Ngày -> Giờ (Từ trái qua phải)
  const order = ['year', 'month', 'day', 'hour'];
  const labels = { year: 'NĂM', month: 'THÁNG', day: 'NGÀY', hour: 'GIỜ' };

  return (
    <div className="w-full bg-[#18181b] p-6 rounded-3xl border border-zinc-800 shadow-2xl">
      <div className="grid grid-cols-4 gap-2">
        {order.map((key) => {
          const p = data.pillars[key];
          return (
            <div key={key} className="flex flex-col space-y-2">
              {/* Tiêu đề trụ */}
              <div className="text-center text-[10px] font-black text-zinc-500 tracking-widest pb-2 border-b border-zinc-800">
                {labels[key as keyof typeof labels]}
              </div>

              {/* Thập Thần Thiên Can */}
              <div className="text-center text-[11px] font-bold text-indigo-400 h-5">
                {p.tenGodGan}
              </div>

              {/* KHU VỰC CAN CHI CHÍNH */}
              <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 flex flex-col items-center shadow-inner">
                {/* Thiên Can - Dịch sang tiếng Việt */}
                <div className={`text-3xl font-black mb-2 uppercase ${WUXING_COLORS[p.element] || 'text-white'}`}>
                  {TRANSLATE[p.gan] || p.gan}
                </div>
                {/* Địa Chi - Dịch sang tiếng Việt */}
                <div className={`text-3xl font-black uppercase ${WUXING_COLORS[p.hiddenGan[0]?.element] || 'text-white'}`}>
                  {TRANSLATE[p.chi] || p.chi}
                </div>
              </div>

              {/* Tàng Can & Thập Thần Ẩn - Dịch sang tiếng Việt */}
              <div className="flex flex-col items-center bg-black/20 py-3 rounded-xl space-y-1">
                {p.hiddenGan.map((tg: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px]">
                    <span className={`${WUXING_COLORS[tg.element]} font-bold`}>
                        {TRANSLATE[tg.name] || tg.name}
                    </span>
                    <span className="text-zinc-600 text-[10px]">({tg.tenGod})</span>
                  </div>
                ))}
              </div>

              {/* Vòng Trường Sinh */}
              <div className="text-center text-[11px] font-bold text-zinc-700 italic pt-1 uppercase">
                {p.truongSinh !== "N/A" ? p.truongSinh : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Thông tin Nhật Chủ */}
      <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-medium">Mệnh chủ (Nhật Chủ):</span>
          <span className={`font-black ${WUXING_COLORS[data.dayMaster?.element]}`}>
            {TRANSLATE[data.dayMaster?.name] || data.dayMaster?.name} ({data.dayMaster?.element})
          </span>
        </div>
        <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
          Hearo Astrology Engine
        </div>
      </div>
    </div>
  );
};