// src/components/astrology/BaziChart.tsx
import React from 'react';

const WUXING_COLORS: Record<string, string> = {
  'Kim': 'text-[#71717a]', 
  'Mộc': 'text-[#16a34a]', 
  'Thủy': 'text-[#2563eb]', 
  'Hỏa': 'text-[#dc2626]', 
  'Thổ': 'text-[#ca8a04]', 
};

const CHI_ELEMENTS: Record<string, string> = {
  '子': 'Thủy', '丑': 'Thổ', '寅': 'Mộc', '卯': 'Mộc',
  '辰': 'Thổ', '巳': 'Hỏa', '午': 'Hỏa', '未': 'Thổ',
  '申': 'Kim', '酉': 'Kim', '戌': 'Thổ', '亥': 'Thủy'
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

const GridRow = ({ label, children, bg = "bg-white" }: any) => (
  <div className={`grid grid-cols-[90px_1fr_1fr_1fr_1fr] md:grid-cols-[120px_1fr_1fr_1fr_1fr] ${bg} w-full border-b border-slate-300`}>
    <div className="flex items-center justify-center border-r border-slate-300 bg-slate-100 p-2 text-center text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-tighter">
      {label}
    </div>
    {children}
  </div>
);

const DataCell = ({ children, className = "" }: any) => (
  <div className={`flex flex-col items-center justify-center border-r border-slate-300 last:border-r-0 p-2 text-center ${className} min-h-[50px]`}>
    {children}
  </div>
);

export const BaziChart = ({ data }: { data: any }) => {
  if (!data || !data.pillars) return null;

  const order = ['year', 'month', 'day', 'hour'] as const;
  const solarLabels = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
  const solarData = [data.solar.year, data.solar.month, data.solar.day, data.solar.hour];

  return (
    <div className="w-full space-y-10 p-2 md:p-6 bg-white font-sans text-slate-900">
      
      {/* SECTION 1: BÁT TỰ CHÍNH */}
      <div className="max-w-6xl mx-auto shadow-2xl rounded-lg overflow-hidden border-2 border-slate-800">
        <GridRow label="Dương Lịch">
          {solarData.map((val, i) => (
            <DataCell key={i} className="font-bold text-slate-600 text-sm">{val} <span className="text-[10px] font-normal">{solarLabels[i]}</span></DataCell>
          ))}
        </GridRow>

        <GridRow label="Chủ Tinh" bg="bg-indigo-50/30">
          {order.map((key) => (
            <DataCell key={key} className="text-xs font-black text-indigo-700 uppercase">
              {SHORTEN_TEN_GOD[data.pillars[key].tenGodGan] || data.pillars[key].tenGodGan}
            </DataCell>
          ))}
        </GridRow>

        <GridRow label="Bát Tự">
          {order.map((key) => {
            const p = data.pillars[key];
            return (
              <DataCell key={key} className="py-4">
                <span className={`text-2xl md:text-3xl font-black leading-none mb-1 ${WUXING_COLORS[p.element]}`}>{TRANSLATE[p.gan]}</span>
                <span className={`text-2xl md:text-3xl font-black leading-none ${WUXING_COLORS[p.hiddenGan[0]?.element]}`}>{TRANSLATE[p.chi]}</span>
              </DataCell>
            )
          })}
        </GridRow>

        <GridRow label="Tàng Ẩn">
          {order.map((key) => (
            <DataCell key={key} className="flex-row flex-wrap gap-1 md:gap-2">
              {data.pillars[key].hiddenGan.map((hg: any, i: number) => (
                <span key={i} className={`text-[11px] md:text-xs font-black ${WUXING_COLORS[hg.element]}`}>{TRANSLATE[hg.name]}</span>
              ))}
            </DataCell>
          ))}
        </GridRow>

        <GridRow label="Phó Tinh" bg="bg-slate-50">
          {order.map((key) => (
            <DataCell key={key} className="flex-row flex-wrap gap-1">
              {data.pillars[key].hiddenGan.map((hg: any, i: number) => (
                <span key={i} className="text-[9px] md:text-[10px] text-slate-500 font-bold italic">({SHORTEN_TEN_GOD[hg.tenGod] || hg.tenGod})</span>
              ))}
            </DataCell>
          ))}
        </GridRow>

        <GridRow label="Trường Sinh">
          {order.map((key) => (
            <DataCell key={key} className="text-[10px] font-bold text-slate-500 uppercase italic">{data.pillars[key].truongSinh}</DataCell>
          ))}
        </GridRow>

        <GridRow label="Nạp Âm" bg="bg-slate-50">
          {order.map((key) => (
            <DataCell key={key} className="text-[10px] md:text-[11px] font-bold text-slate-600 leading-tight px-1">{data.pillars[key].napAm}</DataCell>
          ))}
        </GridRow>
      </div>

      {/* SECTION BỔ SUNG: BẢNG THẦN SÁT NGUYÊN CỤC */}
      {data.extraInfo && (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row border-2 border-slate-900 rounded-sm overflow-hidden text-sm bg-white shadow-lg">
          
          {/* Cột trái: Thông tin cung */}
          <div className="flex flex-col w-full md:w-[30%] border-b-2 md:border-b-0 md:border-r-2 border-slate-900">
            <div className="flex border-b border-slate-300 min-h-[44px]">
              <div className="w-[100px] flex items-center justify-center font-black text-[11px] text-blue-900 bg-slate-100 border-r border-slate-300">MỆNH CUNG</div>
              <div className="flex-1 flex flex-col items-center justify-center text-[13px] font-bold text-slate-800">
                <span>{data.extraInfo.menhCung || '-'}</span>
              </div>
            </div>
            <div className="flex border-b border-slate-300 min-h-[44px]">
              <div className="w-[100px] flex items-center justify-center font-black text-[11px] text-blue-900 bg-slate-100 border-r border-slate-300 text-center">THAI NGUYÊN</div>
              <div className="flex-1 flex items-center justify-center text-[13px] font-bold text-slate-800">
                {data.extraInfo.thaiNguyen || '-'}
              </div>
            </div>
            <div className="flex border-b border-slate-300 min-h-[44px]">
              <div className="w-[100px] flex items-center justify-center font-black text-[11px] text-blue-900 bg-slate-100 border-r border-slate-300 text-center">NIÊN KHÔNG</div>
              <div className="flex-1 flex items-center justify-center text-[13px] font-bold text-slate-800">
                {data.extraInfo.nienKhong || '-'}
              </div>
            </div>
            <div className="flex min-h-[44px]">
              <div className="w-[100px] flex items-center justify-center font-black text-[11px] text-blue-900 bg-slate-100 border-r border-slate-300 text-center">NHẬT KHÔNG</div>
              <div className="flex-1 flex items-center justify-center text-[13px] font-bold text-slate-800">
                {data.extraInfo.nhatKhong || '-'}
              </div>
            </div>
          </div>

                    {/* Cột phải: Bảng Thần Sát (Cập nhật trong file BaziChart.tsx) */}
          <div className="flex flex-col w-full md:w-[70%]">
            <div className="text-center font-black text-[14px] bg-slate-50 py-2 border-b-2 border-slate-900 text-blue-900 uppercase">
              Bảng Thần Sát Nguyên Cục
            </div>
            
            <div className="grid grid-cols-4 bg-slate-100 text-center font-black border-b border-slate-300 text-blue-900 text-[11px] py-2">
              <div>NIÊN THẦN</div>
              <div className="border-l border-slate-300">NGUYỆT THẦN</div>
              <div className="border-l border-slate-300">NHẬT THẦN</div>
              <div className="border-l border-slate-300">THỜI THẦN</div>
            </div>
            
            <div className="grid grid-cols-4 text-center bg-white flex-grow min-h-[120px]">
              {['year', 'month', 'day', 'hour'].map((key, idx) => (
                <div key={key} className={`p-2 flex flex-col gap-1 items-center justify-start ${idx > 0 ? 'border-l border-slate-300' : ''} text-[11px] md:text-[12px] font-medium text-slate-800 pt-3`}>
                  {data.pillars[key].stars?.map((star: string, i: number) => (
                    <span key={i} className="leading-tight px-1 py-0.5 bg-blue-50/50 rounded-sm w-full text-center">
                      {star}
                    </span>
                  ))}
                  {(!data.pillars[key].stars || data.pillars[key].stars.length === 0) && <span className="text-slate-300 italic">-</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ĐẠI VẬN */}
      <div className="max-w-7xl mx-auto space-y-4 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-2 bg-slate-900"></div>
            <h3 className="font-black text-xl uppercase tracking-tighter text-slate-900">Đại Vận</h3>
          </div>
          <div className="bg-slate-900 border-2 border-slate-900 px-6 py-1.5 shadow-lg shadow-slate-200">
            <span className="text-white text-[12px] font-black uppercase tracking-widest">
              Khởi vận: {data.startAgeInfo}
            </span>
          </div>
        </div>

        <div className="w-full border-2 border-slate-900 bg-white shadow-2xl overflow-hidden rounded-sm">
          {/* Hàng: Chủ Tinh */}
          <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)] border-b border-slate-300">
            <div className="bg-slate-100 border-r border-slate-900 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center leading-none">Chủ Tinh</div>
            {data.majorCycles.map((mc: any, i: number) => (
              <div key={i} className="border-r border-slate-300 last:border-r-0 p-2 text-center text-[9px] md:text-xs font-black text-indigo-600 flex items-center justify-center uppercase">
                {SHORTEN_TEN_GOD[mc.tenGod] || mc.tenGod}
              </div>
            ))}
          </div>

          {/* Hàng: Đại Vận */}
          <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)] border-b border-slate-300">
            <div className="bg-slate-100 border-r border-slate-900 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center">Đại Vận</div>
            {data.majorCycles.map((mc: any, i: number) => (
              <div key={i} className="border-r border-slate-300 last:border-r-0 py-3 md:py-4 text-center">
                <div className={`text-sm md:text-lg font-black leading-none ${WUXING_COLORS[mc.element]}`}>{TRANSLATE[mc.gan]}</div>
                <div className={`text-sm md:text-lg font-black leading-none mt-1 ${WUXING_COLORS[CHI_ELEMENTS[mc.chi]]}`}>{TRANSLATE[mc.chi]}</div>
              </div>
            ))}
          </div>

          {/* Hàng: Số Tuổi */}
          <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)] border-b border-slate-300 bg-red-50/50">
            <div className="bg-slate-100 border-r border-slate-900 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center leading-none">Số Tuổi</div>
            {data.majorCycles.map((mc: any, i: number) => (
              <div key={i} className="border-r border-slate-300 last:border-r-0 p-2 text-center text-[10px] md:text-[13px] font-black text-red-600 flex items-center justify-center">
                {mc.ageRange}
              </div>
            ))}
          </div>

          {/* Hàng: Năm */}
          <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)]">
            <div className="bg-slate-100 border-r border-slate-900 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center">Năm</div>
            {data.majorCycles.map((mc: any, i: number) => (
              <div key={i} className="border-r border-slate-300 last:border-r-0 p-1 md:p-2 text-center flex flex-col justify-center">
                <span className="text-[9px] md:text-[12px] font-black text-slate-800 leading-none">{mc.startYear}</span>
                <span className="hidden md:block text-[9px] text-slate-400 font-bold mt-1 uppercase">đến {mc.endYear}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: BẢNG LƯU NIÊN (80 NĂM) */}
      <div className="max-w-7xl mx-auto space-y-4 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-2 bg-emerald-600"></div>
          <h3 className="font-black text-xl uppercase tracking-tighter text-slate-900">Bảng Lưu Niên</h3>
        </div>

        <div className="w-full bg-slate-100 p-2 md:p-4 rounded-md space-y-6 shadow-inner border border-slate-300">
          {data.annualCycles?.map((decade: any[], decadeIndex: number) => (
            <div key={decadeIndex} className="border-2 border-slate-800 bg-white shadow-md overflow-hidden rounded-sm">
              <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)] border-b border-slate-300 bg-slate-50">
                <div className="bg-slate-200 border-r border-slate-800 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center">Năm</div>
                {decade.map((ac: any, i: number) => (
                  <div key={i} className="border-r border-slate-300 last:border-r-0 p-2 text-center text-[11px] md:text-sm font-black text-slate-800">{ac.year}</div>
                ))}
              </div>

              <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)] border-b border-slate-300">
                <div className="bg-slate-100 border-r border-slate-800 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center">Chủ Tinh</div>
                {decade.map((ac: any, i: number) => (
                  <div key={i} className="border-r border-slate-300 last:border-r-0 p-2 text-center text-[10px] md:text-xs font-bold text-indigo-600 uppercase">{SHORTEN_TEN_GOD[ac.tenGod] || ac.tenGod}</div>
                ))}
              </div>

              <div className="grid grid-cols-[70px_repeat(10,1fr)] md:grid-cols-[120px_repeat(10,1fr)]">
                <div className="bg-slate-100 border-r border-slate-800 p-2 text-[9px] md:text-[11px] font-black text-slate-700 uppercase flex items-center justify-center text-center">Lưu Niên</div>
                {decade.map((ac: any, i: number) => (
                  <div key={i} className="border-r border-slate-300 last:border-r-0 py-2 md:py-3 text-center">
                    <div className={`text-sm md:text-lg font-black leading-none ${WUXING_COLORS[ac.element]}`}>{TRANSLATE[ac.gan]}</div>
                    <div className={`text-sm md:text-lg font-black leading-none mt-1 ${WUXING_COLORS[CHI_ELEMENTS[ac.chi]]}`}>{TRANSLATE[ac.chi]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 font-medium px-2">* Lưu niên được tính từ tiết Lập Xuân của năm đó.</p>
      </div>

    </div>
  );
};