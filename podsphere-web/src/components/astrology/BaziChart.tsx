// src/components/astrology/BaziChart.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

const WUXING_COLORS: Record<string, string> = {
  'Kim': 'text-[#71717a]', 'Mộc': 'text-[#16a34a]', 'Thủy': 'text-[#2563eb]', 'Hỏa': 'text-[#dc2626]', 'Thổ': 'text-[#ca8a04]', 
};

const WUXING_BG_COLORS: Record<string, string> = {
  'Kim': 'bg-[#71717a]', 'Mộc': 'bg-[#16a34a]', 'Thủy': 'bg-[#2563eb]', 'Hỏa': 'bg-[#dc2626]', 'Thổ': 'bg-[#ca8a04]', 
};

const CHI_ELEMENTS: Record<string, string> = {
  '子': 'Thủy', '丑': 'Thổ', '寅': 'Mộc', '卯': 'Mộc', '辰': 'Thổ', '巳': 'Hỏa', '午': 'Hỏa', '未': 'Thổ', '申': 'Kim', '酉': 'Kim', '戌': 'Thổ', '亥': 'Thủy'
};

const TRANSLATE: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu', '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi'
};

const SHORTEN_TEN_GOD: Record<string, string> = {
  'Chính Tài': 'Tài', 'Thiên Tài': 'T.Tài', 'Chính Quan': 'Quan', 'Thất Sát': 'Sát', 'Chính Ấn': 'Ấn', 'Thiên Ấn': 'Kiêu',
  'Thực Thần': 'Thực', 'Thương Quan': 'Thương', 'Tỷ Kiên': 'Tỷ', 'Kiếp Tài': 'Kiếp', 'NHẬT CHỦ': 'NHẬT CHỦ'
};

const GridRow = ({ label, children, bg = "bg-white" }: any) => (
  <div className={`grid grid-cols-[120px_1fr_1fr_1fr_1fr] w-full border-b border-slate-300 ${bg}`}>
    <div className="flex items-center justify-center border-r border-slate-300 bg-slate-100 p-2 text-center text-xs font-black text-slate-700 uppercase tracking-tighter">
      {label}
    </div>
    {children}
  </div>
);

const DataCell = ({ children, className = "" }: any) => (
  <div className={`flex flex-col items-center justify-center border-r border-slate-300 last:border-r-0 p-2 text-center min-h-[50px] ${className}`}>
    {children}
  </div>
);

// Thêm prop aiReading vào component
export const BaziChart = ({ data, aiReading }: { data: any, aiReading?: string }) => {
  if (!data || !data.pillars) return null;

  const order = ['year', 'month', 'day', 'hour'] as const;
  const solarLabels = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
  const solarData = [data.solar.year, data.solar.month, data.solar.day, data.solar.hour];
  const analysis = data.analysis;

  return (
    <div className="w-[900px] p-6 bg-white font-sans text-slate-900 border-8 border-slate-100 mx-auto shadow-2xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b-4 border-double border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="#d91e76" stroke="#ffffff" strokeWidth="2"/>
            <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 0 50 50 A24 24 0 0 1 50 2" fill="#ffffff" />
            <circle cx="50" cy="26" r="6" fill="#d91e76" />
            <circle cx="50" cy="74" r="6" fill="#ffffff" />
          </svg>
          <div>
             <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900" style={{ fontFamily: "Times New Roman, serif" }}>Tứ Trụ Mệnh Bàn</h1>
             <p className="text-xs font-bold text-slate-500 tracking-widest">HEARO ASTROLOGY ENGINE</p>
          </div>
        </div>

        <div className="flex flex-col text-[13px] text-slate-800 w-[380px] space-y-1" style={{ fontFamily: "Times New Roman, serif" }}>
          <div className="flex justify-between border-b border-slate-200 pb-0.5">
            <span className="text-slate-500">Họ tên:</span>
            <span className="font-bold uppercase text-indigo-700">{data.fullName || "Ẩn Danh"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-0.5">
            <span className="text-slate-500">Mệnh:</span>
            <span className="font-bold">{data.polarityGender || data.gender}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-0.5">
            <span className="text-slate-500">Dương lịch:</span>
            <span className="font-bold">{data.solar.hour} - {data.solar.day}/{data.solar.month}/{data.solar.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Âm lịch:</span>
            <span className="font-bold">{data.lunarDateString}</span>
          </div>
        </div>
      </div>

      {/* BÁT TỰ CHÍNH */}
      <div className="border-2 border-slate-800 mb-6">
        <GridRow label="Dương Lịch">
          {solarData.map((val, i) => <DataCell key={i} className="font-bold text-slate-600 text-sm">{val} <span className="text-[10px] font-normal">{solarLabels[i]}</span></DataCell>)}
        </GridRow>
        <GridRow label="Chủ Tinh" bg="bg-indigo-50/30">
          {order.map((key) => <DataCell key={key} className="text-xs font-black text-indigo-700 uppercase">{SHORTEN_TEN_GOD[data.pillars[key].tenGodGan] || data.pillars[key].tenGodGan}</DataCell>)}
        </GridRow>
        <GridRow label="Bát Tự">
          {order.map((key) => {
            const p = data.pillars[key];
            return (
              <DataCell key={key} className="py-4">
                <span className={`text-4xl font-black leading-none mb-1 ${WUXING_COLORS[p.element]}`}>{TRANSLATE[p.gan]}</span>
                <span className={`text-4xl font-black leading-none ${WUXING_COLORS[p.hiddenGan[0]?.element]}`}>{TRANSLATE[p.chi]}</span>
              </DataCell>
            )
          })}
        </GridRow>
        <GridRow label="Tàng Can">
          {order.map((key) => <DataCell key={key} className="flex-row flex-wrap gap-2">{data.pillars[key].hiddenGan.map((hg: any, i: number) => <span key={i} className={`text-xs font-black ${WUXING_COLORS[hg.element]}`}>{TRANSLATE[hg.name]}</span>)}</DataCell>)}
        </GridRow>
        <GridRow label="Phó Tinh" bg="bg-slate-50">
          {order.map((key) => <DataCell key={key} className="flex-row flex-wrap gap-1">{data.pillars[key].hiddenGan.map((hg: any, i: number) => <span key={i} className="text-[10px] text-slate-500 font-bold italic">({SHORTEN_TEN_GOD[hg.tenGod] || hg.tenGod})</span>)}</DataCell>)}
        </GridRow>
        <GridRow label="Trường Sinh">
          {order.map((key) => <DataCell key={key} className="text-xs font-bold text-slate-500 uppercase italic">{data.pillars[key].truongSinh}</DataCell>)}
        </GridRow>
        <GridRow label="Nạp Âm" bg="bg-slate-50">
          {order.map((key) => <DataCell key={key} className="text-xs font-bold text-slate-600 px-1">{data.pillars[key].napAm}</DataCell>)}
        </GridRow>
      </div>

      {/* PHẦN ĐÁNH GIÁ NHẬT CHỦ VÀ THẬP THẦN */}
      {analysis && (
        <div className="border-2 border-slate-900 mb-6 bg-white overflow-hidden">
           <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-black uppercase text-center tracking-widest">
              Đánh Giá Cục Diện Bát Tự & Năng Lượng Ngũ Hành
           </div>
           <div className="p-4 grid grid-cols-[1fr_2fr] gap-6">
              <div className="border-r border-slate-200 pr-4">
                 <div className="text-[11px] font-black text-slate-400 uppercase mb-2">Trạng thái Nhật chủ</div>
                 <div className={`text-xl font-black mb-1 ${analysis.strength.includes('VƯỢNG') ? 'text-red-600' : analysis.strength.includes('YẾU') ? 'text-blue-600' : 'text-emerald-600'}`}>
                   {analysis.strength}
                 </div>
                 <p className="text-[12px] text-slate-600 leading-relaxed italic">{analysis.desc}</p>
              </div>
              <div className="space-y-2">
                 <div className="text-[11px] font-black text-slate-400 uppercase mb-2">Cường độ Thập Thần (%)</div>
                 {Object.keys(analysis.percentages).map(group => {
                    const percent = analysis.percentages[group];
                    const el = analysis.groupElements[group];
                    return (
                      <div key={group} className="flex items-center gap-3">
                         <div className="w-20 text-right text-[11px] font-bold text-slate-700">{group}</div>
                         <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className={`h-full ${WUXING_BG_COLORS[el]} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                         </div>
                         <div className="w-8 text-left text-[11px] font-bold text-slate-500">{percent}%</div>
                      </div>
                    )
                 })}
              </div>
           </div>
        </div>
      )}

      {/* ĐẠI VẬN */}
      <div className="mb-6">
        <div className="flex justify-between items-center bg-slate-900 text-white px-3 py-1.5 rounded-t-md">
          <h3 className="text-xs font-black uppercase tracking-widest">Đại Vận (10 Năm/Bước)</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Khởi vận: {data.startAgeInfo}</span>
        </div>
        <div className="border-2 border-slate-900 border-t-0 bg-white">
           <div className="grid grid-cols-[80px_repeat(10,1fr)] border-b border-slate-300">
              <div className="bg-slate-100 border-r border-slate-900 p-2 text-[10px] font-black text-slate-700 flex items-center justify-center uppercase">Chủ Tinh</div>
              {data.majorCycles.map((mc: any, i: number) => <div key={i} className="border-r border-slate-300 p-2 text-center text-[10px] font-black text-indigo-600 uppercase">{SHORTEN_TEN_GOD[mc.tenGod] || mc.tenGod}</div>)}
           </div>
           <div className="grid grid-cols-[80px_repeat(10,1fr)] border-b border-slate-300">
              <div className="bg-slate-100 border-r border-slate-900 p-2 text-[10px] font-black text-slate-700 flex items-center justify-center uppercase text-center">Đại Vận</div>
              {data.majorCycles.map((mc: any, i: number) => (
                <div key={i} className="border-r border-slate-300 py-2 text-center leading-none">
                  <div className={`text-lg font-black ${WUXING_COLORS[mc.element]}`}>{TRANSLATE[mc.gan]}</div>
                  <div className={`text-lg font-black ${WUXING_COLORS[CHI_ELEMENTS[mc.chi]]}`}>{TRANSLATE[mc.chi]}</div>
                </div>
              ))}
           </div>
           <div className="grid grid-cols-[80px_repeat(10,1fr)] border-b border-slate-300 bg-red-50/30">
              <div className="bg-slate-100 border-r border-slate-900 p-2 text-[10px] font-black text-slate-700 flex items-center justify-center uppercase">Số Tuổi</div>
              {data.majorCycles.map((mc: any, i: number) => <div key={i} className="border-r border-slate-300 p-2 text-center text-[11px] font-black text-red-600">{mc.ageRange}</div>)}
           </div>
           <div className="grid grid-cols-[80px_repeat(10,1fr)]">
              <div className="bg-slate-100 border-r border-slate-900 p-2 text-[10px] font-black text-slate-700 flex items-center justify-center uppercase">Năm</div>
              {data.majorCycles.map((mc: any, i: number) => <div key={i} className="border-r border-slate-300 p-2 text-center text-[11px] font-black text-slate-800">{mc.startYear}</div>)}
           </div>
        </div>
      </div>

      {/* LƯU NIÊN - 3 DÒNG (30 NĂM) */}
      <div className="mb-8">
        <div className="bg-emerald-800 text-white px-3 py-1.5 rounded-t-md flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest">Bảng Lưu Niên (30 Năm)</h3>
        </div>
        <div className="bg-slate-50 p-3 border-2 border-slate-900 space-y-4">
          {data.annualCycles?.slice(0, 3).map((decade: any[], decadeIndex: number) => (
            <div key={decadeIndex} className="border border-slate-300 bg-white">
              <div className="grid grid-cols-[80px_repeat(10,1fr)] border-b border-slate-200 bg-slate-100">
                <div className="bg-slate-200 border-r border-slate-800 p-1.5 text-[10px] font-black text-slate-700 flex items-center justify-center uppercase">Năm</div>
                {decade.map((ac: any, i: number) => <div key={i} className="border-r border-slate-300 p-1.5 text-center text-[11px] font-black text-slate-800">{ac.year}</div>)}
              </div>
              <div className="grid grid-cols-[80px_repeat(10,1fr)]">
                <div className="bg-slate-100 border-r border-slate-800 p-1.5 text-[10px] font-black text-slate-700 flex items-center justify-center uppercase">Vận</div>
                {decade.map((ac: any, i: number) => (
                  <div key={i} className="border-r border-slate-300 py-1.5 text-center leading-none">
                    <div className={`text-[13px] font-black ${WUXING_COLORS[ac.element]}`}>{TRANSLATE[ac.gan]}</div>
                    <div className={`text-[13px] font-black ${WUXING_COLORS[CHI_ELEMENTS[ac.chi]]}`}>{TRANSLATE[ac.chi]}</div>
                    <div className="text-[8px] font-bold text-indigo-500 mt-0.5">({SHORTEN_TEN_GOD[ac.tenGod] || ac.tenGod})</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI READING SECTION */}
      {(aiReading || data.aiReading) && (
        <div className="mt-8 bg-indigo-50/50 p-6 border-2 border-indigo-900 rounded-lg shadow-inner">
           <div className="flex items-center gap-2 mb-4 border-b border-indigo-200 pb-2">
               <span className="text-2xl">✨</span>
               <h2 className="text-xl font-black text-indigo-900 uppercase">AI Luận Giải Tổng Quan</h2>
           </div>
           <div className="prose prose-slate prose-indigo max-w-none text-[14px] leading-relaxed text-slate-700">
               <ReactMarkdown>
                   {aiReading || data.aiReading} 
               </ReactMarkdown>
           </div>
        </div>
      )}

    </div>
  );
};