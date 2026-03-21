// src/components/astrology/BaziChart.tsx
import React from 'react';

export const BaziChart = ({ data }: { data: any }) => {
  const pillars = [
    { label: "GIỜ", canchi: data.canChi.hour, wuxing: data.nguHanh.hour },
    { label: "NGÀY", canchi: data.canChi.day, wuxing: data.nguHanh.day },
    { label: "THÁNG", canchi: data.canChi.month, wuxing: data.nguHanh.month },
    { label: "NĂM", canchi: data.canChi.year, wuxing: data.nguHanh.year },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800">
      {pillars.map((p, i) => (
        <div key={i} className="flex flex-col items-center space-y-4">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{p.label}</span>
          <div className="flex flex-col items-center bg-zinc-950 p-4 rounded-3xl border border-zinc-800 w-full shadow-inner">
            {/* Can Chi */}
            <div className="text-2xl font-black text-white tracking-tighter mb-2">
              {p.canchi.split(' ').map((word: string, idx: number) => (
                <div key={idx} className={idx === 0 ? "text-indigo-400" : "text-white"}>{word}</div>
              ))}
            </div>
            {/* Ngũ Hành Mini Badge */}
            <div className="flex gap-1">
              {p.wuxing.split(' ').map((h: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-zinc-400 border border-white/5 uppercase">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};