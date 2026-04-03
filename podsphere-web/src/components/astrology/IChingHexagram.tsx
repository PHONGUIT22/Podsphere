// src/components/astrology/IChingHexagram.tsx
'use client';

import React from 'react';

export default function IChingHexagram({ hexagramData, aiReading }: any) {
  if (!hexagramData || !hexagramData.primary || !hexagramData.mutated) return null;

  const { primary, mutated, haoDong, topic, question, fullTime, bazi, tietKhi, nhatThan, nguyetLenh } = hexagramData;

  const TRIGRAM_LINES: Record<string, number[]> = {
    'Càn': [1, 1, 1], 'Đoài': [1, 1, 0], 'Ly': [1, 0, 1], 'Chấn': [1, 0, 0],
    'Tốn': [0, 1, 1], 'Khảm': [0, 1, 0], 'Cấn': [0, 0, 1], 'Khôn': [0, 0, 0]
  };

  const pLower = primary.lower?.name || 'Khôn';
  const pUpper = primary.upper?.name || 'Khôn';
  const mLower = mutated.lower?.name || 'Khôn';
  const mUpper = mutated.upper?.name || 'Khôn';

  const pLines = [...TRIGRAM_LINES[pLower], ...TRIGRAM_LINES[pUpper]];
  const mLines = [...TRIGRAM_LINES[mLower], ...TRIGRAM_LINES[mUpper]];

  // Vạch quẻ nhỏ cho Bảng (Đen tĩnh, Đỏ động + Bo tròn)
  const SmallLine = ({ isYang, isMoving }: { isYang: number, isMoving: boolean }) => {
    const bgColor = isMoving ? 'bg-[#ff0000]' : 'bg-black';
    return (
      <div className="flex justify-between w-10 h-2.5 mx-auto">
        {isYang === 1 ? (
          <div className={`w-full h-full rounded-full shadow-sm border border-black/10 ${bgColor}`}></div>
        ) : (
          <>
            <div className={`w-[42%] h-full rounded-full shadow-sm border border-black/10 ${bgColor}`}></div>
            <div className={`w-[42%] h-full rounded-full shadow-sm border border-black/10 ${bgColor}`}></div>
          </>
        )}
      </div>
    );
  };

  // Vạch quẻ lớn cho phần giữa (Đen tĩnh, Đỏ động + Bo tròn)
  const BigLine = ({ isYang, isMoving }: { isYang: number, isMoving: boolean }) => {
    const bgColor = isMoving ? 'bg-[#ff0000]' : 'bg-black';
    return (
      <div className="flex justify-between w-28 h-4 mx-auto mb-2.5">
        {isYang === 1 ? (
          <div className={`w-full h-full rounded-full shadow-md border border-black/10 ${bgColor}`}></div>
        ) : (
          <>
            <div className={`w-[44%] h-full rounded-full shadow-md border border-black/10 ${bgColor}`}></div>
            <div className={`w-[44%] h-full rounded-full shadow-md border border-black/10 ${bgColor}`}></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden font-sans">
      
      {/* 1. HEADER */}
      <div className="p-6 bg-slate-50 border-b border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[15px]">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-bold w-28 shrink-0">Việc cần xem:</span>
              <span className="font-black text-blue-900 text-lg uppercase tracking-tight">{question || topic || 'Chung'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-bold w-28 shrink-0">Thời gian:</span>
              <span className="text-slate-900 font-black">{fullTime}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-bold w-28 shrink-0">Can chi:</span>
              <span className="font-black text-slate-950 leading-relaxed">{bazi}</span>
            </div>
          </div>
          
          <div className="space-y-3 border-l-0 md:border-l border-gray-300 md:pl-8">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-bold">Tiết Khí:</span> 
              <span className="font-black text-emerald-800">{tietKhi}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-bold">Nhật thần (Ngày):</span> 
              <span className="font-black text-red-700">{nhatThan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-bold">Nguyệt lệnh (Tháng):</span> 
              <span className="font-black text-red-700">{nguyetLenh}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUẺ LỚN */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 border-b border-gray-300 bg-white">
        <div className="p-10 text-center bg-white">
          <h2 className="text-[24px] font-black text-[#1b52a7] uppercase mb-8 tracking-[0.2em]">{primary.hexagram.name}</h2>
          <div className="flex flex-col-reverse justify-center mb-6">
             {pLines.map((isYang, idx) => <BigLine key={idx} isYang={isYang} isMoving={(idx + 1) === haoDong} />)}
          </div>
          <p className="text-[18px] text-slate-900 font-black">Họ {primary.palace}</p>
        </div>
        <div className="p-10 text-center bg-white">
          <h2 className="text-[24px] font-black text-[#b91c1c] uppercase mb-8 tracking-[0.2em]">{mutated.hexagram.name}</h2>
          <div className="flex flex-col-reverse justify-center mb-6">
             {mLines.map((isYang, idx) => <BigLine key={idx} isYang={isYang} isMoving={(idx + 1) === haoDong} />)}
          </div>
          <p className="text-[18px] text-slate-900 font-black">Họ {mutated.palace}</p>
        </div>
      </div>

      {/* 3. BẢNG LỤC HÀO */}
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-300">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#1b52a7] text-white font-black text-[15px] uppercase">
                <th className="py-4 px-1 w-14 border-r border-white/20">Hào</th>
                <th className="py-4 px-1 w-12 border-r border-white/20">T/Ư</th>
                <th className="py-4 px-2 text-left border-r border-white/20">Lục Thân</th>
                <th className="py-4 px-2 text-left border-r border-white/20">Can Chi</th>
                <th className="py-4 px-2 text-left border-r border-white/20">Phục Thần</th>
                <th className="py-4 px-1 w-10">TK</th>
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const h = primary.lucHao[i];
                const isMoving = (i + 1) === haoDong;
                return (
                  <tr key={i} className={`border-b border-gray-200 ${isMoving ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                    <td className="py-4 px-1 align-middle border-r border-gray-100"><SmallLine isYang={pLines[i]} isMoving={isMoving} /></td>
                    <td className="py-4 px-1 font-black text-[16px] border-r border-gray-100">
                        {h.theUng === 'Thế' ? <span className="text-[#ff0000]">T</span> : h.theUng === 'Ứng' ? <span className="text-[#1b52a7]">Ư</span> : ''}
                    </td>
                    <td className={`py-4 px-3 text-left border-r border-gray-100 ${isMoving ? 'text-[#ff0000] font-black' : 'text-slate-950 font-bold'}`}>{h.lucThan}</td>
                    <td className={`py-4 px-3 text-left border-r border-gray-100 ${isMoving ? 'text-[#ff0000] font-black' : 'text-slate-900 font-bold'}`}>{h.canChi}</td>
                    <td className="py-4 px-3 text-left text-slate-500 text-[13px] italic font-bold border-r border-gray-100">{h.phucThan || ''}</td>
                    <td className="py-4 px-1 font-black text-[#ff0000] text-[16px]">{h.isTuanKhong ? 'K' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#b91c1c] text-white font-black text-[15px] uppercase">
                <th className="py-4 px-1 w-14 border-r border-white/20">Hào</th>
                <th className="py-4 px-2 text-left border-r border-white/20">Lục Thân</th>
                <th className="py-4 px-2 text-left border-r border-white/20">Can Chi</th>
                <th className="py-4 px-2 text-left border-r border-white/20">Lục Thú</th>
                <th className="py-4 px-1 w-10">TK</th>
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const h = mutated.lucHao[i];
                const isMoving = (i + 1) === haoDong;
                return (
                  <tr key={i} className={`border-b border-gray-200 ${isMoving ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                    <td className="py-4 px-1 align-middle border-r border-gray-100"><SmallLine isYang={mLines[i]} isMoving={isMoving} /></td>
                    <td className={`py-4 px-3 text-left border-r border-gray-100 ${isMoving ? 'text-[#ff0000] font-black' : 'text-slate-950 font-bold'}`}>{h.lucThan}</td>
                    <td className={`py-4 px-3 text-left border-r border-gray-100 ${isMoving ? 'text-[#ff0000] font-black' : 'text-slate-900 font-bold'}`}>{h.canChi}</td>
                    <td className="py-4 px-3 text-left text-purple-900 font-black border-r border-gray-100 uppercase text-[12px]">{primary.lucHao[i].lucThu}</td>
                    <td className="py-4 px-1 font-black text-[#ff0000] text-[16px]">{h.isTuanKhong ? 'K' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BẢNG THẦN SÁT & VƯỢNG SUY */}
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-300 border-t border-gray-400">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#f0f9db] text-[#1b4317] font-black text-[14px]">
                <th className="py-3 border-r border-gray-300">Hào</th>
                <th className="py-3 border-r border-gray-300">V-S</th>
                <th className="py-3 border-r border-gray-300">Quái Thần</th>
                <th className="py-3 border-r border-gray-300">Lộc</th>
                <th className="py-3 border-r border-gray-300">Mã</th>
                <th className="py-3 border-r border-gray-300">Quý</th>
                <th className="py-3 font-bold">Đào</th>
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const h = primary.lucHao[i];
                const isMoving = (i + 1) === haoDong;
                return (
                  <tr key={`ts-p-${i}`} className={`border-b border-gray-200 text-slate-950 font-black ${isMoving ? 'bg-[#fffef0] text-red-700' : ''}`}>
                    <td className="py-4 border-r border-gray-200 uppercase">{h.fullHaoName}</td>
                    <td className="py-4 border-r border-gray-200">{h.vuongSuy}</td>
                    <td className="py-4 border-r border-gray-200 text-slate-300">-</td>
                    <td className="py-4 border-r border-gray-200">{h.loc}</td>
                    <td className="py-4 border-r border-gray-200">{h.ma}</td>
                    <td className="py-4 border-r border-gray-200">{h.quy}</td>
                    <td className="py-4">{h.dao}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#f0f9db] text-[#1b4317] font-black text-[14px]">
                <th className="py-3 border-r border-gray-300">Hào</th>
                <th className="py-3 border-r border-gray-300">V-S</th>
                <th className="py-3 border-r border-gray-300">Lộc</th>
                <th className="py-3 border-r border-gray-300">Mã</th>
                <th className="py-3 border-r border-gray-300">Quý</th>
                <th className="py-3 font-bold">Đào</th>
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const h = mutated.lucHao[i];
                const isMoving = (i + 1) === haoDong;
                return (
                  <tr key={`ts-m-${i}`} className={`border-b border-gray-200 text-slate-950 font-black ${isMoving ? 'bg-[#fffef0] text-red-700' : ''}`}>
                    <td className="py-4 border-r border-gray-200 uppercase">{h.fullHaoName}</td>
                    <td className="py-4 border-r border-gray-200">{h.vuongSuy}</td>
                    <td className="py-4 border-r border-gray-200">{h.loc}</td>
                    <td className="py-4 border-r border-gray-200">{h.ma}</td>
                    <td className="py-4 border-r border-gray-200">{h.quy}</td>
                    <td className="py-4">{h.dao}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. LỜI GIẢI AI */}
      <div className="p-10 bg-[#FFFCF5] border-t border-amber-300">
        <h3 className="font-black text-amber-900 mb-6 text-[22px] flex items-center gap-3">
            <span className="text-4xl text-amber-600">✨</span> 
            Lời Giải Từ Huyền Cơ
        </h3>
        <div className="text-slate-950 font-black leading-relaxed italic bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl text-[18px]">
            {aiReading || "Đang phân tích thiên cơ..."}
        </div>
      </div>
    </div>
  );
}