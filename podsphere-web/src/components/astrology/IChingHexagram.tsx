// src/components/astrology/IChingHexagram.tsx
'use client';

import React from 'react';

export default function IChingHexagram({ hexagramData, aiReading }: any) {
  if (!hexagramData || !hexagramData.primary || !hexagramData.mutated) return null;

  const { primary, mutated, haoDong, topic, fullTime, bazi, tietKhi, nhatThan, nguyetLenh } = hexagramData;

  // ... (Phần TRIGRAM_LINES và Line Components giữ nguyên) ...
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

  const SmallLine = ({ isYang, isMoving }: { isYang: number, isMoving: boolean }) => (
    <div className="flex justify-between w-10 h-2 mx-auto">
      {isYang === 1 ? (
        <div className={`w-full h-full ${isMoving ? 'bg-red-600' : 'bg-blue-900'}`}></div>
      ) : (
        <>
          <div className={`w-[42%] h-full ${isMoving ? 'bg-red-600' : 'bg-blue-900'}`}></div>
          <div className={`w-[42%] h-full ${isMoving ? 'bg-red-600' : 'bg-blue-900'}`}></div>
        </>
      )}
    </div>
  );

  const BigLine = ({ isYang, isMoving }: { isYang: number, isMoving: boolean }) => (
    <div className="flex justify-between w-28 h-4 mx-auto mb-1.5 shadow-sm">
      {isYang === 1 ? (
        <div className={`w-full h-full ${isMoving ? 'bg-red-600' : 'bg-blue-900'}`}></div>
      ) : (
        <>
          <div className={`w-[44%] h-full ${isMoving ? 'bg-red-600' : 'bg-blue-900'}`}></div>
          <div className={`w-[44%] h-full ${isMoving ? 'bg-red-600' : 'bg-blue-900'}`}></div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden font-sans">
      
      {/* 1. THÔNG TIN HEADER - Hiển thị rành mạch Giờ, Ngày, Tháng, Năm */}
      <div className="p-6 bg-slate-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[15px]">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28 shrink-0">Việc cần xem:</span>
              <span className="font-bold text-blue-900">{topic || 'Chung'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28 shrink-0">Thời gian:</span>
              <span className="text-gray-700 font-medium">{fullTime}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-28 shrink-0">Can chi:</span>
              <span className="font-bold text-slate-900 leading-relaxed">{bazi}</span>
            </div>
          </div>
          
          <div className="space-y-3 border-l-0 md:border-l border-gray-200 md:pl-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tiết Khí:</span> 
              <span className="font-bold text-emerald-700">{tietKhi}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Nhật thần (Ngày):</span> 
              <span className="font-bold text-red-600">{nhatThan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Nguyệt lệnh (Tháng):</span> 
              <span className="font-bold text-red-600">{nguyetLenh}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PHẦN QUẺ VÀ BẢNG LỤC HÀO TIẾP THEO GIỮ NGUYÊN NHƯ BẢN TRƯỚC */}
      {/* ... (Copy tiếp phần Quẻ Lớn và Bảng Lục Hào từ bản trước của bạn sang đây) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-200 bg-white">
        <div className="p-8 text-center bg-blue-50/10">
          <h2 className="text-2xl font-black text-blue-900 uppercase mb-6 tracking-widest">{primary.hexagram.name}</h2>
          <div className="flex flex-col-reverse justify-center mb-4">
             {pLines.map((isYang, idx) => <BigLine key={idx} isYang={isYang} isMoving={(idx + 1) === haoDong} />)}
          </div>
          <p className="text-lg text-slate-500 font-medium">Họ {primary.palace}</p>
        </div>
        <div className="p-8 text-center bg-red-50/10">
          <h2 className="text-2xl font-black text-red-800 uppercase mb-6 tracking-widest">{mutated.hexagram.name}</h2>
          <div className="flex flex-col-reverse justify-center mb-4">
             {mLines.map((isYang, idx) => <BigLine key={idx} isYang={isYang} isMoving={(idx + 1) === haoDong} />)}
          </div>
          <p className="text-lg text-slate-500 font-medium">Họ {mutated.palace}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] text-center border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white font-bold">
                <th className="py-3 px-1 w-14">Hào</th>
                <th className="py-3 px-1 w-12">T/Ư</th>
                <th className="py-3 px-1 text-left">Lục Thân</th>
                <th className="py-3 px-1 text-left">Can Chi</th>
                <th className="py-3 px-1 text-left">Phục Thần</th>
                <th className="py-3 px-1 w-10">TK</th>
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const h = primary.lucHao[i];
                const isMoving = (i + 1) === haoDong;
                return (
                  <tr key={i} className={`border-b border-gray-100 hover:bg-slate-50 ${isMoving ? 'bg-red-50' : ''}`}>
                    <td className="py-3 px-1 align-middle"><SmallLine isYang={pLines[i]} isMoving={isMoving} /></td>
                    <td className="py-3 px-1 font-bold">{h.theUng === 'Thế' ? <span className="text-red-600">T</span> : h.theUng === 'Ứng' ? <span className="text-blue-600">Ư</span> : ''}</td>
                    <td className={`py-3 px-1 text-left font-bold ${isMoving ? 'text-red-600' : 'text-slate-700'}`}>{h.lucThan}</td>
                    <td className="py-3 px-1 text-left text-slate-600 font-medium">{h.canChi}</td>
                    <td className="py-3 px-1 text-left text-gray-400 text-xs italic">{h.phucThan || ''}</td>
                    <td className="py-3 px-1 font-bold text-red-600">{h.isTuanKhong ? 'K' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] text-center border-collapse">
            <thead>
              <tr className="bg-red-800 text-white font-bold">
                <th className="py-3 px-1 w-14">Hào</th>
                <th className="py-3 px-1 text-left">Lục Thân</th>
                <th className="py-3 px-1 text-left">Can Chi</th>
                <th className="py-3 px-1 text-left">Lục Thú</th>
                <th className="py-3 px-1 w-10">TK</th>
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1, 0].map((i) => {
                const h = mutated.lucHao[i];
                const isMoving = (i + 1) === haoDong;
                return (
                  <tr key={i} className={`border-b border-gray-100 hover:bg-slate-50 ${isMoving ? 'bg-yellow-50' : ''}`}>
                    <td className="py-3 px-1 align-middle"><SmallLine isYang={mLines[i]} isMoving={isMoving} /></td>
                    <td className={`py-3 px-1 text-left font-bold ${isMoving ? 'text-red-600' : 'text-slate-700'}`}>{h.lucThan}</td>
                    <td className="py-3 px-1 text-left text-slate-600 font-medium">{h.canChi}</td>
                    <td className="py-3 px-1 text-left text-purple-700 font-bold">{primary.lucHao[i].lucThu}</td>
                    <td className="py-3 px-1 font-bold text-red-600">{h.isTuanKhong ? 'K' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 bg-amber-50/50 border-t border-amber-100">
        <h3 className="font-bold text-amber-900 mb-4 text-lg flex items-center gap-2"><span className="text-2xl">✨</span> Lời Giải Từ Huyền Cơ</h3>
        <div className="text-slate-700 leading-relaxed italic bg-white p-6 rounded-lg border border-amber-100">{aiReading || "Đang phân tích thiên cơ..."}</div>
      </div>
    </div>
  );
}