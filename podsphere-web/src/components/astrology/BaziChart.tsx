// src/components/astrology/BaziChart.tsx
import React from 'react';

const WUXING_COLORS: Record<string, string> = {
  'Kim': 'text-gray-400',
  'Mộc': 'text-green-600',
  'Thủy': 'text-blue-600',
  'Hỏa': 'text-red-600',
  'Thổ': 'text-yellow-600',
};

const TRANSLATE: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn',
  '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu',
  '戌': 'Tuất', '亥': 'Hợi'
};

const SHORTEN_TEN_GOD: Record<string, string> = {
  'Chính Tài': 'Tài', 'Thiên Tài': 'T.Tài', 'Chính Quan': 'Quan',
  'Thất Sát': 'Sát', 'Chính Ấn': 'Ấn', 'Thiên Ấn': 'Kiêu',
  'Thực Thần': 'Thực', 'Thương Quan': 'Thương', 'Tỷ Kiên': 'Tỷ', 'Kiếp Tài': 'Kiếp',
  'NHẬT CHỦ': 'NHẬT CHỦ'
};

export const BaziChart = ({ data }: { data: any }) => {
  if (!data || !data.pillars) return null;

  const order = ['year', 'month', 'day', 'hour'];
  const solarData = [data.solar.year, data.solar.month, data.solar.day, data.solar.hour];

  return (
    <div className="space-y-10 p-4 bg-gray-50/50 rounded-xl">
      
      {/* SECTION 1: BẢNG BÁT TỰ CHÍNH (Giữ nguyên logic cũ) */}
      <div className="w-full max-w-4xl mx-auto overflow-hidden border-t border-l border-gray-300 bg-white shadow-md font-sans rounded-sm">
        <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr]">
            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Dương<br/>Lịch</div>
            {solarData.map((val, i) => (
                <div key={i} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center text-sm font-bold text-gray-800 min-h-[50px]">{val}</div>
            ))}

            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Chủ<br/>Tinh</div>
            {order.map((key) => (
                <div key={key} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center text-[12px] font-medium text-gray-700 min-h-[50px]">{SHORTEN_TEN_GOD[data.pillars[key].tenGodGan] || data.pillars[key].tenGodGan}</div>
            ))}

            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Bát Tự</div>
            {order.map((key) => {
                const p = data.pillars[key];
                return (
                    <div key={key} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center py-4 min-h-[50px]">
                        <span className={`text-xl font-bold ${WUXING_COLORS[p.element]}`}>{TRANSLATE[p.gan]}</span>
                        <span className={`text-xl font-bold ${WUXING_COLORS[p.hiddenGan[0]?.element]}`}>{TRANSLATE[p.chi]}</span>
                    </div>
                )
            })}

            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Tàng Ẩn</div>
            {order.map((key) => (
                <div key={key} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center min-h-[50px]">
                    <div className="flex gap-2 justify-center">
                        {data.pillars[key].hiddenGan.map((hg: any, i: number) => (
                            <span key={i} className={`text-[11px] font-bold ${WUXING_COLORS[hg.element]}`}>{TRANSLATE[hg.name]}</span>
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Phó Tinh</div>
            {order.map((key) => (
                <div key={key} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center min-h-[50px]">
                    <div className="flex gap-1 justify-center">
                        {data.pillars[key].hiddenGan.map((hg: any, i: number) => (
                            <span key={i} className="text-[9px] text-gray-500">{SHORTEN_TEN_GOD[hg.tenGod] || hg.tenGod}</span>
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Trường Sinh</div>
            {order.map((key) => (
                <div key={key} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center text-xs text-gray-700 min-h-[50px]">{data.pillars[key].truongSinh}</div>
            ))}

            <div className="flex items-center justify-center border-b border-r border-gray-300 bg-gray-50 p-2 text-center text-[11px] font-bold text-blue-900 uppercase min-h-[50px]">Nạp Âm</div>
            {order.map((key) => (
                <div key={key} className="flex flex-col items-center justify-center border-b border-r border-gray-300 p-2 text-center text-[10px] text-gray-600 leading-tight min-h-[50px]">{data.pillars[key].napAm}</div>
            ))}
        </div>
      </div>

      {/* SECTION 2: BẢNG ĐẠI VẬN (SỬA LẠI ĐỂ KHÔNG BỊ LỆCH) */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-blue-900 font-black text-base uppercase tracking-widest border-l-4 border-blue-900 pl-3">Tiểu vận & Đại vận</h3>
          <span className="text-[11px] font-bold text-gray-500 italic bg-gray-200 px-3 py-1 rounded-full">Khởi vận: {data.startAgeInfo}</span>
        </div>

        {/* Thêm overflow-x-auto để cuộn ngang nếu bảng quá rộng */}
        <div className="overflow-x-auto border-t border-l border-gray-300 bg-white shadow-md rounded-sm">
          <div className="min-w-[800px]"> {/* Đảm bảo chiều rộng tối thiểu để không bị dồn chữ */}
            
            {/* Hàng 1: Thập Thần */}
            <div className="flex">
              <div className="w-[100px] flex-shrink-0 bg-gray-50 border-b border-r border-gray-300 p-2 text-[10px] font-black text-blue-900 text-center uppercase flex items-center justify-center">Chủ Tinh</div>
              {data.majorCycles.map((mc: any, i: number) => (
                <div key={i} className="flex-1 border-b border-r border-gray-300 p-2 text-center text-[11px] font-bold text-gray-500 flex items-center justify-center min-w-[70px]">
                  {SHORTEN_TEN_GOD[mc.tenGod] || mc.tenGod}
                </div>
              ))}
            </div>

            {/* Hàng 2: Can Chi Đại Vận */}
            <div className="flex">
              <div className="w-[100px] flex-shrink-0 bg-gray-50 border-b border-r border-gray-300 p-2 text-[10px] font-black text-blue-900 text-center uppercase flex items-center justify-center">Đại Vận</div>
              {data.majorCycles.map((mc: any, i: number) => (
                <div key={i} className="flex-1 border-b border-r border-gray-300 p-2 text-center flex flex-col justify-center py-3 min-w-[70px]">
                  <span className={`text-base font-black leading-none ${WUXING_COLORS[mc.element]}`}>{TRANSLATE[mc.gan]}</span>
                  <span className={`text-base font-black leading-none text-gray-800 mt-1`}>{TRANSLATE[mc.chi]}</span>
                </div>
              ))}
            </div>

            {/* Hàng 3: Số tuổi */}
            <div className="flex">
              <div className="w-[100px] flex-shrink-0 bg-gray-50 border-b border-r border-gray-300 p-2 text-[10px] font-black text-blue-900 text-center uppercase flex items-center justify-center">Số Tuổi</div>
              {data.majorCycles.map((mc: any, i: number) => (
                <div key={i} className="flex-1 border-b border-r border-gray-300 p-2 text-center text-[12px] font-black text-red-600 bg-red-50/20 flex items-center justify-center min-w-[70px]">
                  {mc.startAge}
                </div>
              ))}
            </div>

            {/* Hàng 4: Năm bắt đầu */}
            <div className="flex">
              <div className="w-[100px] flex-shrink-0 bg-gray-50 border-b border-r border-gray-300 p-2 text-[10px] font-black text-blue-900 text-center uppercase flex items-center justify-center">Năm</div>
              {data.majorCycles.map((mc: any, i: number) => (
                <div key={i} className="flex-1 border-b border-r border-gray-300 p-2 text-center text-[10px] text-gray-400 font-medium italic flex items-center justify-center min-w-[70px]">
                  {mc.startYear}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};