// src/components/astrology/BaziChart.tsx
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { domToPng } from 'modern-screenshot';

// --- HẰNG SỐ CẤU HÌNH GIAO DIỆN ---
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

export const BaziChart = ({ data }: { data: any }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [aiReading, setAiReading] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [persona, setPersona] = useState<'traditional' | 'genz'>('traditional');

  if (!data || !data.pillars) return null;

  const order = ['year', 'month', 'day', 'hour'] as const;
  const solarLabels = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
  const solarData = [data.solar.year, data.solar.month, data.solar.day, data.solar.hour];
  const analysis = data.analysis;

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`http://localhost:5015/api/Astrology/generate-ai-reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baziJsonData: JSON.stringify(data),
          persona: persona
        })
      });
      const json = await res.json();
      if (res.ok && json.status === "success") {
        setAiReading(json.aiReading);
      } else {
        alert("Lỗi AI: " + (json.message || json.error));
      }
    } catch (error) {
      alert("Mất kết nối tới máy chủ AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await domToPng(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        filter: (node) => {
          if (node instanceof HTMLElement && node.hasAttribute('data-ignore')) return false;
          return true;
        }
      });
      const link = document.createElement('a');
      link.download = `La-So-Hearo-${data.fullName || 'User'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert("Lỗi tải ảnh!");
    }
  };

  return (
    <div className="w-[900px] mx-auto font-sans pb-20">
      
      {/* PHẦN 1: BẢN ĐỒ LÁ SỐ */}
      <div ref={chartRef} className="p-8 bg-white text-slate-900 border-[12px] border-slate-100 shadow-2xl relative mb-10 overflow-visible">
        
        <button 
           onClick={handleDownloadPNG}
           data-ignore="true" 
           className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-[10px] font-black z-10 uppercase shadow-lg"
        >
          📸 Tải ảnh lá số
        </button>

        {/* HEADER */}
        <div className="flex justify-between items-center border-b-4 border-double border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center text-white text-4xl border-4 border-slate-200 shadow-inner">☯</div>
            <div>
               <h1 className="text-4xl font-black uppercase tracking-widest text-slate-900" style={{ fontFamily: "serif" }}>Tứ Trụ Mệnh Bàn</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Hearo Astrology Engine</p>
            </div>
          </div>

          <div className="flex flex-col text-[14px] text-slate-800 w-[400px] space-y-1" style={{ fontFamily: "serif" }}>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-400 italic">Họ tên:</span>
              <span className="font-black uppercase text-red-800">{data.fullName || "Ẩn Danh"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-400 italic">Mệnh:</span>
              <span className="font-bold">{data.polarityGender}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-400 italic">Dương lịch:</span>
              <span className="font-bold">{data.solar.hour}h - {data.solar.day}/{data.solar.month}/{data.solar.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 italic">Âm lịch:</span>
              <span className="font-bold">{data.lunarDateString}</span>
            </div>
          </div>
        </div>

        {/* BẢNG TỨ TRỤ CHÍNH */}
        <div className="border-2 border-slate-800 mb-8 shadow-sm">
          <GridRow label="Dương Lịch">
            {solarData.map((val, i) => <DataCell key={i} className="font-bold text-slate-500 text-sm">{val} <span className="text-[10px] font-normal">{solarLabels[i]}</span></DataCell>)}
          </GridRow>
          <GridRow label="Chủ Tinh" bg="bg-indigo-50/40">
            {order.map((key) => <DataCell key={key} className="text-[11px] font-black text-indigo-800 uppercase tracking-tighter">{SHORTEN_TEN_GOD[data.pillars[key].tenGodGan] || data.pillars[key].tenGodGan}</DataCell>)}
          </GridRow>
          <GridRow label="Bát Tự">
            {order.map((key) => {
              const p = data.pillars[key];
              return (
                <DataCell key={key} className="py-6">
                  <span className={`text-5xl font-black leading-none mb-2 ${WUXING_COLORS[p.element]}`}>{TRANSLATE[p.gan]}</span>
                  <span className={`text-5xl font-black leading-none ${WUXING_COLORS[p.hiddenGan[0]?.element]}`}>{TRANSLATE[p.chi]}</span>
                </DataCell>
              )
            })}
          </GridRow>
          <GridRow label="Tàng Can">
            {order.map((key) => <DataCell key={key} className="flex-row flex-wrap gap-2">{data.pillars[key].hiddenGan.map((hg: any, i: number) => <span key={i} className={`text-sm font-black ${WUXING_COLORS[hg.element]}`}>{TRANSLATE[hg.name]}</span>)}</DataCell>)}
          </GridRow>
          <GridRow label="Phó Tinh" bg="bg-slate-50">
            {order.map((key) => <DataCell key={key} className="flex-row flex-wrap gap-1">{data.pillars[key].hiddenGan.map((hg: any, i: number) => <span key={i} className="text-[10px] text-slate-400 font-bold italic">({SHORTEN_TEN_GOD[hg.tenGod] || hg.tenGod})</span>)}</DataCell>)}
          </GridRow>
          <GridRow label="Vận Thế">
            {order.map((key) => <DataCell key={key} className="text-[11px] font-bold text-slate-500 uppercase italic tracking-tighter">{data.pillars[key].truongSinh}</DataCell>)}
          </GridRow>
          <GridRow label="Nạp Âm" bg="bg-slate-50">
            {order.map((key) => <DataCell key={key} className="text-[11px] font-bold text-slate-600 px-1">{data.pillars[key].napAm}</DataCell>)}
          </GridRow>
        </div>

        {/* ========================================================= */}
        {/* BẢNG THẦN SÁT NGUYÊN CỤC (CHỈNH THEO MẪU YÊU CẦU) */}
        {/* ========================================================= */}
        <div className="border-2 border-slate-800 mb-8 flex overflow-hidden shadow-sm">
            {/* CỘT TRÁI: THÔNG TIN PHỤ */}
            <div className="w-[240px] border-r-2 border-slate-800 bg-white">
                {[
                    { label: "MỆNH CUNG", val: data.extraInfo.menhCung },
                    { label: "THAI NGUYÊN", val: data.extraInfo.thaiNguyen },
                    { label: "NIÊN KHÔNG", val: data.extraInfo.nienKhong },
                    { label: "NHẬT KHÔNG", val: data.extraInfo.nhatKhong }
                ].map((item, i) => (
                    <div key={i} className="grid grid-cols-[100px_1fr] border-b border-slate-300 last:border-b-0 h-[50px]">
                        <div className="bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-700 border-r border-slate-300 uppercase px-2 text-center leading-tight">
                            {item.label}
                        </div>
                        <div className="flex items-center justify-center text-[13px] font-bold text-slate-600 italic">
                            {item.val}
                        </div>
                    </div>
                ))}
            </div>

            {/* CỘT PHẢI: THẦN SÁT 4 TRỤ */}
            <div className="flex-1 flex flex-col">
                <div className="bg-slate-50 border-b border-slate-800 h-[40px] flex items-center justify-center text-xs font-black tracking-widest text-indigo-900 uppercase">
                    Bảng Thần Sát Nguyên Cục
                </div>
                <div className="flex-1 grid grid-cols-4 bg-yellow-50/20">
                    {[
                        { label: "NIÊN THẦN", key: 'year' },
                        { label: "NGUYỆT THẦN", key: 'month' },
                        { label: "NHẬT THẦN", key: 'day' },
                        { label: "THỜI THẦN", key: 'hour' }
                    ].map((col, i) => (
                        <div key={i} className="border-r border-slate-300 last:border-r-0 flex flex-col">
                            <div className="h-[30px] flex items-center justify-center bg-slate-100/50 border-b border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                {col.label}
                            </div>
                            <div className="flex-1 p-2 flex flex-col items-center gap-1">
                                {data.pillars[col.key].stars?.map((star: string, idx: number) => (
                                    <span key={idx} className="text-[10px] font-bold text-yellow-800 text-center leading-tight">
                                        {star}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* PHÂN TÍCH NHẬT CHỦ */}
        {analysis && (
          <div className="border-2 border-slate-900 mb-8 bg-white shadow-sm overflow-visible">
             <div className="bg-slate-900 text-white px-3 py-2 text-[11px] font-black uppercase text-center tracking-widest">Đánh Giá Cục Diện & Năng Lượng</div>
             <div className="p-6 grid grid-cols-[1.2fr_2fr] gap-8">
                <div className="border-r border-slate-200 pr-6 flex flex-col justify-center">
                   <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Trạng thái Nhật chủ</div>
                   <div className={`text-2xl font-black mb-2 ${analysis.strength.includes('VƯỢNG') ? 'text-red-700' : analysis.strength.includes('YẾU') ? 'text-blue-700' : 'text-emerald-700'}`}>
                     {analysis.strength}
                   </div>
                   <p className="text-[13px] text-slate-600 leading-relaxed italic border-t pt-2">{analysis.desc}</p>
                </div>
                <div className="space-y-3">
                   {Object.keys(analysis.percentages).map(group => {
                      const percent = analysis.percentages[group];
                      const el = analysis.groupElements[group];
                      return (
                        <div key={group} className="flex items-center gap-4">
                           <div className="w-24 text-right text-[11px] font-black text-slate-700 uppercase">{group}</div>
                           <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div className={`h-full ${WUXING_BG_COLORS[el]}`} style={{ width: `${percent}%` }}></div>
                           </div>
                           <div className="w-10 text-left text-[12px] font-black text-slate-500">{percent}%</div>
                        </div>
                      )
                   })}
                </div>
             </div>
          </div>
        )}

        {/* ĐẠI VẬN */}
        <div className="mb-8">
          <div className="bg-slate-900 text-white px-3 py-2 flex justify-between items-center rounded-t">
            <h3 className="text-[11px] font-black uppercase tracking-widest">Tiến Trình Đại Vận (10 Năm)</h3>
            <span className="text-[10px] font-bold text-yellow-400 uppercase">Khởi vận: {data.startAgeInfo}</span>
          </div>
          <div className="border-2 border-slate-900 border-t-0 bg-white grid grid-cols-[80px_repeat(10,1fr)]">
              <div className="bg-slate-100 border-r border-slate-300 p-2 text-[9px] font-black text-slate-500 uppercase flex items-center justify-center text-center">Đại Vận</div>
              {data.majorCycles.map((mc: any, i: number) => (
                <div key={i} className="border-r border-slate-200 py-3 text-center leading-tight last:border-r-0">
                  <div className={`text-xl font-black ${WUXING_COLORS[mc.element]}`}>{TRANSLATE[mc.gan]}</div>
                  <div className={`text-xl font-black ${WUXING_COLORS[CHI_ELEMENTS[mc.chi]]}`}>{TRANSLATE[mc.chi]}</div>
                  <div className="text-[9px] font-bold text-indigo-500 mt-1 uppercase tracking-tighter">{SHORTEN_TEN_GOD[mc.tenGod] || mc.tenGod}</div>
                  <div className="text-[11px] font-black text-red-600 mt-2 border-t pt-1">{mc.ageRange}</div>
                </div>
              ))}
          </div>
        </div>

        {/* NIÊN VẬN (30 NĂM) */}
        <div className="mb-8">
          <div className="bg-emerald-800 text-white px-3 py-2 rounded-t flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-widest">Bảng Lưu Niên (Biến Thiên 30 Năm)</h3>
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
                    <div key={i} className="border-r border-slate-300 py-2 text-center leading-none">
                      <div className={`text-[13px] font-black ${WUXING_COLORS[ac.element]}`}>{TRANSLATE[ac.gan]}</div>
                      <div className={`text-[13px] font-black ${WUXING_COLORS[CHI_ELEMENTS[ac.chi]]}`}>{TRANSLATE[ac.chi]}</div>
                      <div className="text-[8px] font-bold text-indigo-500 mt-0.5 uppercase tracking-tighter">({SHORTEN_TEN_GOD[ac.tenGod] || ac.tenGod})</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center border-t-2 border-slate-100 pt-4">
           <p className="text-[10px] font-bold text-slate-300 tracking-[0.5em] uppercase">© HEARO ASTROLOGY - POWERED BY AI</p>
        </div>
      </div>

      {/* PHẦN 2: AI LUẬN GIẢI */}
      <div className="bg-white p-10 border-2 border-indigo-100 rounded-3xl shadow-xl">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-widest mb-2">✨ AI Luận Giải Chuyên Sâu ✨</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
         </div>
         
         {!aiReading && (
           <div className="max-w-2xl mx-auto space-y-8">
              <div className="grid grid-cols-2 gap-6">
                 <div onClick={() => setPersona('traditional')} className={`cursor-pointer p-6 rounded-2xl border-4 transition-all ${persona === 'traditional' ? 'border-indigo-600 bg-indigo-50 scale-105' : 'border-slate-100 opacity-60'}`}>
                    <div className="text-5xl mb-4">🧔🏻‍♂️</div>
                    <h3 className="font-black text-indigo-900 text-lg">Thầy Huyền Cơ</h3>
                    <p className="text-xs text-slate-500 mt-2">Luận giải uyên thâm, cổ phong, chuẩn đạo lý.</p>
                 </div>
                 <div onClick={() => setPersona('genz')} className={`cursor-pointer p-6 rounded-2xl border-4 transition-all ${persona === 'genz' ? 'border-rose-500 bg-rose-50 scale-105' : 'border-slate-100 opacity-60'}`}>
                    <div className="text-5xl mb-4">😸</div>
                    <h3 className="font-black text-rose-600 text-lg">Mèo Mệnh GenZ</h3>
                    <p className="text-xs text-slate-500 mt-2">Dùng tiếng lóng, tấu hài, mặn mòi.</p>
                 </div>
              </div>
              <button onClick={handleGenerateAI} disabled={isGenerating} className={`w-full py-5 rounded-2xl text-white font-black text-lg transition-all shadow-lg active:scale-95 ${persona === 'genz' ? 'bg-rose-600' : 'bg-indigo-900'}`}>
                {isGenerating ? "Vũ trụ đang tải dữ liệu..." : `Mời ${persona === 'genz' ? 'Thầy Mèo' : 'Thầy Huyền Cơ'} xem lá số`}
              </button>
           </div>
         )}

         {aiReading && (
           <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 max-w-3xl mx-auto">
               <div className="prose prose-slate prose-indigo max-w-none text-[16px] leading-relaxed text-slate-800 bg-white p-8 rounded-3xl shadow-2xl border border-indigo-50">
                   <ReactMarkdown>{aiReading}</ReactMarkdown>
               </div>
               <div className="mt-8 flex justify-center">
                 <button onClick={() => setAiReading('')} className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">
                   🔄 Luận lại với phong cách khác
                 </button>
               </div>
           </div>
         )}
      </div>

    </div>
  );
};