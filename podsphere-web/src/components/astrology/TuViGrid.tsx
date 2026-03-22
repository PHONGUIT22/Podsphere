// src/components/astrology/TuViGrid.tsx
import React from 'react';

// Hàm helper để render màu sắc cho sao theo đúng thuộc tính dac_tinh
const getStarColor = (starName: string, dacTinh: string | null) => {
    const mainStars = ["Tử Vi", "Thiên Phủ", "Vũ Khúc", "Thái Dương", "Thái Âm", "Liêm Trinh"];
    if (mainStars.includes(starName)) return "text-yellow-400 font-black";

    const satPhuStars = ["Thất Sát", "Phá Quân", "Tham Lang", "Kình Dương", "Đà La", "Địa Không", "Địa Kiếp", "Hóa Kỵ"];
    if (satPhuStars.includes(starName)) return "text-red-400 font-bold";

    if (dacTinh === "V") return "text-emerald-400 font-bold"; // Vượng địa
    if (dacTinh === "Đ") return "text-blue-400 font-bold";   // Đắc địa
    if (dacTinh === "M") return "text-fuchsia-400 font-bold"; // Miếu địa
    if (dacTinh === "H") return "text-zinc-500 font-normal"; // Hãm địa
    return "text-zinc-300 font-medium";
};

export const TuViGrid = ({ data }: { data: any }) => {
  // LẤY ĐÚNG ĐƯỜNG DẪN MẢNG 12 CUNG
  const palacesArray = data?.laso?.cac_cung;
  
  if (!palacesArray || !Array.isArray(palacesArray)) {
    return (
      <div className="p-10 text-center text-zinc-500 bg-zinc-900/50 rounded-[2rem] border border-dashed border-zinc-800">
        Dữ liệu cung chưa sẵn sàng...
      </div>
    );
  }
  
  // Thứ tự hiển thị chuẩn trên Grid 4x4 để vẽ vòng tròn
  const gridOrder = [5, 6, 7, 8, 4, -1, -1, 9, 3, -1, -1, 10, 2, 1, 12, 11];
  
  return (
    <div className="grid grid-cols-4 gap-2 aspect-[4/3] w-full max-w-4xl mx-auto p-2 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 shadow-2xl font-sans">
      {gridOrder.map((idCung, i) => {
        // Ô Thiên Bàn ở giữa
        if (idCung === -1) {
          if (i === 5) {
            return (
              <div key={i} className="col-span-2 row-span-2 flex flex-col items-center justify-center p-4 bg-indigo-600/5 rounded-[2rem] text-center border border-indigo-500/10 shadow-inner">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Thiên Bàn</h4>
                <p className="text-2xl font-black text-white tracking-tighter uppercase">{data.fullName}</p>
                <div className="mt-4 space-y-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <p>Cục: {data.laso?.thong_tin?.cuc}</p>
                    <p>Mệnh: {data.laso?.thong_tin?.ban_menh}</p>
                    <p>Âm Dương: {data.laso?.thong_tin?.am_duong}</p>
                </div>
              </div>
            );
          }
          return null;
        }

        // Tìm cung tương ứng với ID
        const palace = palacesArray.find((p: any) => p.id_cung === idCung);
        if (!palace) return <div key={i} className="bg-zinc-900/20 rounded-2xl border border-zinc-800/30"></div>;

        return (
          <div key={i} className={`flex flex-col p-3 rounded-2xl bg-[#0d0d0d] border transition-all duration-500 ${palace.cung_menh ? 'border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'border-zinc-800/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-black text-zinc-600 uppercase">{palace.chi_cung}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${palace.cung_menh ? 'text-indigo-400' : 'text-zinc-400'}`}>
                {palace.ten_cung} {palace.cung_than && <span className="text-pink-500 text-[8px]">(THÂN)</span>}
              </span>
            </div>
            
            {/* DANH SÁCH SAO CHÍNH (CHÍNH TINH) */}
            <div className="flex flex-col gap-0.5 mb-2">
                {palace.chinh_tinh && palace.chinh_tinh.map((star: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1">
                        <span className={`text-[11px] ${getStarColor(star.ten_sao, star.dac_tinh)}`}>
                            {star.ten_sao}
                        </span>
                        {star.dac_tinh && <span className="text-[8px] text-zinc-600">({star.dac_tinh})</span>}
                    </div>
                ))}
            </div>

            {/* DANH SÁCH SAO PHỤ (PHỤ TINH) */}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 overflow-y-auto max-h-[60px] custom-scrollbar">
                {palace.phu_tinh && palace.phu_tinh.map((star: any, idx: number) => (
                    <span key={idx} className={`text-[9px] leading-tight ${getStarColor(star.ten_sao, star.dac_tinh)}`}>
                        {star.ten_sao}
                    </span>
                ))}
            </div>

            {/* TUẦN/TRIỆT */}
            <div className="flex gap-1 mt-auto pt-2 justify-end">
                {palace.tuan_trung && <span className="text-[8px] font-black text-white bg-red-600 px-1 rounded-sm">TUẦN</span>}
                {palace.triet_lo && <span className="text-[8px] font-black text-white bg-red-600 px-1 rounded-sm">TRIỆT</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};