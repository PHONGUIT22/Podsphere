// src/components/astrology/TuViGrid.tsx
import React from 'react';

export const TuViGrid = ({ data }: { data: any }) => {
  const gridOrder = ["Tỵ", "Ngọ", "Mùi", "Thân", "Thìn", "Center", "Center", "Dậu", "Mão", "Center", "Center", "Tuất", "Dần", "Sửu", "Tý", "Hợi"];

  return (
    <div className="grid grid-cols-4 gap-2 aspect-square w-full max-w-2xl mx-auto p-2 bg-zinc-950 rounded-[2rem] border border-zinc-800 shadow-2xl font-sans">
      {gridOrder.map((chi, i) => {
        if (chi === "Center") {
          if (i === 5) {
            return (
              <div key={i} className="col-span-2 row-span-2 flex flex-col items-center justify-center p-4 bg-indigo-600/5 rounded-[2rem] text-center border border-indigo-500/10">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Thiên Bàn</h4>
                <p className="text-xl font-black text-white tracking-tighter uppercase">{data.fullName}</p>
                <div className="mt-4 space-y-1 text-[10px] font-bold text-zinc-500 uppercase">
                    <p>Cục: {data.cuc}</p>
                    <p>Âm Lịch: {data.lunarDate.split(' ')[0]}</p>
                </div>
              </div>
            );
          }
          return null;
        }

        const palace = data.data.palaces[chi];

        return (
          <div key={i} className={`flex flex-col justify-between p-3 rounded-2xl bg-zinc-900/50 border transition-all ${palace.name === 'Mệnh' ? 'border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'border-zinc-800'}`}>
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-black text-zinc-600 uppercase">{chi}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${palace.name === 'Mệnh' ? 'text-indigo-400' : 'text-zinc-400'}`}>
                {palace.name} {palace.isThan && <span className="text-[8px] text-pink-500">(THÂN)</span>}
              </span>
            </div>
            
            {/* DANH SÁCH SAO */}
            <div className="flex flex-col py-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {palace.stars.map((star: string, idx: number) => (
                    <span key={idx} className={`text-[9px] font-bold leading-tight ${
                        ["TỬ VI", "THIÊN PHỦ", "THÁI DƯƠNG", "THÁI ÂM"].includes(star) ? "text-yellow-500" : 
                        ["THẤT SÁT", "PHÁ QUÂN", "THAM LANG"].includes(star) ? "text-red-400" : "text-zinc-300"
                    }`}>
                        {star}
                    </span>
                ))}
            </div>

            {/* HIỂN THỊ TUẦN/TRIỆT Ở DƯỚI CÙNG */}
            <div className="flex gap-1 mt-auto">
                {palace.tuanTriet.map((st: string, idx: number) => (
                    <span key={idx} className="text-[9px] font-black text-white bg-red-600 px-1 rounded-sm animate-pulse">
                        {st}
                    </span>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};