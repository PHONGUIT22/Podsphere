// src/components/astrology/TuViLySoView.tsx
import React from 'react';

// ==========================================================
// 1. DANH SÁCH SAO ĐƯỢC GOM NHÓM THEO MÀU SẮC (NGŨ HÀNH)
// Rất dễ để bạn thêm, sửa, xóa các sao sau này
// ==========================================================
const STAR_GROUPS: Record<string, string[]> = {
    // 🔥 HÀNH HỎA - ĐỎ (#cc0000)
    "#cc0000": [
        "Thái Dương", "Liêm Trinh", "Hỏa Tinh", "Linh Tinh", "Địa Không", "Địa Kiếp", 
        "Thiên Khôi", "Thiên Việt", "Thiên Mã", "L.Thiên Mã", "Thiên Hình", "Tiểu Hao", 
        "Đại Hao", "Kiếp Sát", "Phá Toái", "Quan Phủ", "Quan Phù", "Tử Phù", "Trực Phù", 
        "Điếu Khách", "Phi Liêm", "Nguyệt Đức", "Thiếu Dương", "Hỷ Thần", "Lực Sĩ", 
        "Tuế Phá", "Đẩu Quân", "Thiên Không", "Thiên Quan", "Thiên Giải", "Phục Binh", 
        "Thiên Đức", "Thái Tuế", "L.Thái Tuế", 
        "Tuần", "Bệnh", "Tử" // Vòng Tràng Sinh & Tuần
    ],

    // 🌳 HÀNH MỘC - XANH LÁ (#008000)
    "#008000": [
        "Thiên Cơ", "Thiên Lương", "Hóa Lộc", "Hóa Quyền", "Đào Hoa", "Tang Môn", 
        "L.Tang Môn", "Giải Thần", "Phượng Các", "Bát Tọa", "Tướng Quân", "Đường Phù", 
        "Ân Quang", 
        "Dưỡng"
    ],

    // ⛰️ HÀNH THỔ - VÀNG/CAM/NÂU (#c27c0e)
    "#c27c0e": [
        "Tử Vi", "Thiên Phủ", "Lộc Tồn", "L.Lộc Tồn", "Tả Phù", "Tả Phụ", "Thiên Quý", 
        "Quốc Ấn", "Thiên Thọ", "Thiên Tài", "Thiên Trù", "Địa Giải", "Phong Cáo", 
        "Bệnh Phù", "Cô Thần", "Quả Tú", "Thiên Thương", "Phúc Đức", "Thiên Phúc", 
        "Tam Thai", "LN Văn Tinh", 
        "Mộ", "Tuyệt", "Thai"
    ],

    // ⚔️ HÀNH KIM - XÁM/BẠC (#666666)
    "#666666": [
        "Vũ Khúc", "Thất Sát", "Kình Dương", "L.Kình Dương", "Đà La", "L.Đà La", 
        "Bạch Hổ", "L.Bạch Hổ", "Văn Xương", "Hoa Cái", "Tấu Thư", "Thai Phụ", 
        "Thiên Khốc", "L.Thiên Khốc", "Thiên La", "Địa Võng", 
        "Triệt", "Quan Đới", "Lâm Quan", "Đế Vượng", "Lâm quan", "Quan đới" // Fix chữ hoa/thường
    ],

    // 💧 HÀNH THỦY - ĐEN/XANH ĐẬM (#111111)
    "#111111": [
        "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Phá Quân", "Thiên Đồng", 
        "Hữu Bật", "Văn Khúc", "Hóa Kỵ", "Hóa Khoa", "Thiên Diêu", "Hồng Loan", 
        "Thiên Hỷ", "Thanh Long", "Long Trì", "Lưu Hà", "Bác Sĩ", "Bác Sỹ", "Thiếu Âm", 
        "Long Đức", "Thiên Sứ", "Thiên Hư", "L.Thiên Hư", "Thiên Y", 
        "Tràng sinh", "Mộc dục", "Suy"
    ]
};

// ==========================================================
// TỰ ĐỘNG CHUYỂN ĐỔI MẢNG TRÊN THÀNH OBJECT ĐỂ LOOKUP SIÊU TỐC
// ==========================================================
const STAR_COLORS: Record<string, string> = {};
Object.entries(STAR_GROUPS).forEach(([color, stars]) => {
    stars.forEach((star) => {
        // Lưu key dạng lowercase để tra cứu không phân biệt hoa/thường
        STAR_COLORS[star.toLowerCase()] = color;
    });
});

// Vòng Tràng Sinh (12 sao cố định ở footer cung)
const VONG_TRANG_SINH = ["Tràng sinh", "Mộc dục", "Quan đới", "Lâm quan", "Đế vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];

// Danh sách sao xấu/sát tinh ép sang cột phải
const BAD_STARS = [
    "Kình Dương", "L.Kình Dương", "Đà La", "L.Đà La", "Địa Không", "Địa Kiếp", "Hỏa Tinh", "Linh Tinh", 
    "Hóa Kỵ", "Thiên Hình", "Đại Hao", "Tiểu Hao", "Phá Toái", "Quan Phủ", "Quan Phù", "Điếu Khách", 
    "Tang Môn", "L.Tang Môn", "Bạch Hổ", "L.Bạch Hổ", "Thiên Không", "Tuế Phá", "Kiếp Sát", "Cô Thần", 
    "Quả Tú", "Lưu Hà", "Thiên Khốc", "L.Thiên Khốc", "Thiên Hư", "L.Thiên Hư", "Phục Binh", "Tử Phù", 
    "Trực Phù", "Bệnh Phù", "Phi Liêm", "Thái Tuế", "L.Thái Tuế", "Thiên La", "Địa Võng", "Thiên Thương", 
    "Thiên Sứ", "Thiên Diêu", "Đẩu Quân", "Tướng Quân"
];

// Hàm hỗ trợ lấy màu an toàn (Phòng trường hợp sao chưa khai báo, fallback về Đen)
const getStarColor = (starName: string) => {
    if (!starName) return "#111111";
    const lowerName = starName.toLowerCase();
    
    if (STAR_COLORS[lowerName]) return STAR_COLORS[lowerName];
    
    // Thử xóa tiền tố L. hoặc LN để tìm màu gốc nếu không tìm thấy
    const baseName = lowerName.replace(/^(l\.|ln )/, '').trim();
    return STAR_COLORS[baseName] || "#111111"; 
};

export const TuViLySoView = ({ data }: { data: any }) => {
    const palacesArray = data?.laso?.cac_cung;
    if (!palacesArray) return null;

    // Thứ tự grid 4x4 chuẩn: Tỵ(6) Ngọ(7) Mùi(8) Thân(9) trên cùng
    const gridOrder = [6, 7, 8, 9, 5, -1, -1, 10, 4, -1, -1, 11, 3, 2, 1, 12];

    return (
        <div className="flex justify-center items-center p-8 bg-[#d1d5db] w-full min-h-screen font-serif">
            {/* PHÔI LÁ SỐ CHUẨN */}
            <div className="w-[1050px] bg-[#fdfdfb] border-[2px] border-black text-black select-none shadow-2xl overflow-hidden" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                <div className="grid grid-cols-4 grid-rows-4 w-full border-collapse">
                    
                    {gridOrder.map((idCung, i) => {
                        // ------------------------------------------
                        // THIÊN BÀN (Ô GIỮA)
                        // ------------------------------------------
                        if (idCung === -1) {
                            if (i === 5) return (
                                <div key={i} className="col-span-2 row-span-2 border border-black relative bg-[#f9f9f5] flex flex-col items-center p-4">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[380px] opacity-[0.03] pointer-events-none">☯</div>
                                    
                                    <div className="text-center z-10 w-full">
                                        <h2 className="text-[16px] font-bold text-[#0000cc]">DIỄN ĐÀN TỬ VI VIỆT NAM</h2>
                                        <h1 className="text-2xl font-bold text-[#cc0000] mt-1 tracking-tighter">LÁ SỐ TỬ VI</h1>
                                    </div>

                                    <div className="w-full mt-6 grid grid-cols-[110px_1fr] text-[15px] font-bold gap-y-1 px-8 z-10 leading-tight">
                                        <span className="text-gray-700">Họ tên:</span> <span className="text-[#0000cc] uppercase">{data.fullName}</span>
                                        <span className="text-gray-700">Năm sinh:</span> <span className="text-[#0000cc]">{data.lunarDateInfo?.canChiNam}</span>
                                        <span className="text-gray-700">Tháng sinh:</span> <span className="text-[#0000cc]">{data.laso?.thong_tin?.am_lich?.split(' ')[1]}</span>
                                        <span className="text-gray-700">Giờ sinh:</span> <span className="text-[#0000cc]">{data.laso?.thong_tin?.gio_sinh}</span>
                                        <span className="text-gray-700">Năm xem:</span> <span className="text-[#0000cc]">2025 (Ất Tỵ)</span>
                                    </div>

                                    <div className="mt-8 text-center space-y-1 z-10 border-t border-zinc-300 pt-4 w-4/5">
                                        <p className="text-[17px] font-bold text-[#0000cc]">Mệnh: {data.laso?.thong_tin?.ban_menh}</p>
                                        <p className="text-[16px] font-bold text-[#cc0000]">Cục: {data.laso?.thong_tin?.cuc}</p>
                                        <p className="text-[14px] italic">{data.laso?.thong_tin?.am_duong} • {data.laso?.thong_tin?.sinh_khac}</p>
                                    </div>

                                    <div className="absolute bottom-10 left-12 text-[14px] font-bold space-y-1 z-10">
                                        <p>Chủ Mệnh: <span className="text-[#0000cc]">{data.laso?.thong_tin?.menh_chu}</span></p>
                                        <p>Chủ Thân: <span className="text-[#0000cc]">{data.laso?.thong_tin?.than_chu}</span></p>
                                    </div>

                                    <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-[#cc0000] text-[#cc0000] flex items-center justify-center text-[10px] font-bold leading-tight text-center rounded-sm opacity-80 rotate-[-5deg]">PODSPHERE<br/>CERTIFIED</div>
                                </div>
                            );
                            return null;
                        }

                        // ------------------------------------------
                        // ĐỊA BÀN (12 CUNG)
                        // ------------------------------------------
                        const palace = palacesArray.find((p: any) => p.id_cung === idCung);
                        if (!palace) return <div key={i} className="border border-black bg-white"></div>;

                        const isMenh = palace.ten_cung === "Mệnh";
                        
                        // Phân loại sao theo phôi
                        const leftStars = [...palace.chinh_tinh, ...palace.phu_tinh.filter((s: any) => !BAD_STARS.includes(s.ten_sao) && !VONG_TRANG_SINH.map(v => v.toLowerCase()).includes(s.ten_sao.toLowerCase()))];
                        const rightStars = palace.phu_tinh.filter((s: any) => BAD_STARS.includes(s.ten_sao));
                        const trangSinhStar = palace.phu_tinh.find((s: any) => VONG_TRANG_SINH.map(v => v.toLowerCase()).includes(s.ten_sao.toLowerCase()));

                        return (
                            <div key={i} className={`relative flex flex-col h-[240px] border border-black p-1.5 ${isMenh ? 'bg-[#f4f6f0]' : 'bg-white'}`}>
                                
                                {/* Header: Chi Cung - Tên Cung - Đại Hạn */}
                                <div className="flex justify-between items-start leading-none mb-2 px-0.5">
                                    <span className={`text-[12px] font-bold ${isMenh ? 'text-[#cc0000]' : 'text-gray-600'}`}>{palace.chi_cung}</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-bold uppercase text-black">{palace.ten_cung}</span>
                                        {palace.cung_than && <span className="text-[10px] font-normal leading-none mt-[1px]">&lt;Thân&gt;</span>}
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-800">{palace.dai_han}</span>
                                </div>

                                {/* Sao Chính Tinh (Căn giữa, to) */}
                                <div className="flex flex-col items-center justify-center min-h-[40px] mb-2">
                                    {palace.chinh_tinh.map((s: any, idx: number) => (
                                        <div key={idx} style={{ color: getStarColor(s.ten_sao) }} className="text-[16px] font-bold uppercase leading-tight">
                                            {s.ten_sao} {s.dac_tinh && <span className="text-[13px]">({s.dac_tinh})</span>}
                                        </div>
                                    ))}
                                </div>

                                {/* Sao Phụ Tinh (Chia 2 cột) */}
                                <div className="flex flex-1 w-full overflow-hidden">
                                    {/* Cột trái: Sao tốt/Cát Tinh */}
                                    <div className="w-1/2 flex flex-col items-start gap-[1px]">
                                        {leftStars.map((s: any, idx: number) => (
                                            <div key={idx} style={{ color: getStarColor(s.ten_sao) }} className="text-[12px] font-bold leading-tight">
                                                {s.ten_sao}{s.dac_tinh && <span className="font-bold">({s.dac_tinh})</span>}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Cột phải: Sao xấu/Hung Tinh/Sát Tinh */}
                                    <div className="w-1/2 flex flex-col items-end gap-[1px]">
                                        {rightStars.map((s: any, idx: number) => (
                                            <div key={idx} style={{ color: getStarColor(s.ten_sao) }} className="text-[12px] font-bold leading-tight text-right">
                                                {s.ten_sao}{s.dac_tinh && <span className="font-bold">({s.dac_tinh})</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer: Chi Cung - Tràng Sinh - Tháng */}
                                <div className="mt-auto pt-1 flex justify-between items-end border-t border-gray-100 px-0.5">
                                    <span className="text-[12px] text-gray-500 font-bold">{palace.chi_cung}</span>
                                    {/* Render màu Tràng Sinh dựa trên config mới */}
                                    <span style={{ color: getStarColor(trangSinhStar?.ten_sao || "") }} className="text-[13px] font-black uppercase">
                                        {trangSinhStar?.ten_sao || ""}
                                    </span>
                                    <span className="text-[12px] text-gray-500 font-bold">Tháng {(i % 12) + 1}</span>
                                </div>

                                {/* Tuần / Triệt án ngữ viền - Cập nhật màu background theo config */}
                                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                                    {palace.tuan_trung && (
                                        <span style={{ backgroundColor: getStarColor('Tuần') }} className="text-white text-[11px] font-bold px-2 py-px border border-white">
                                            Tuần
                                        </span>
                                    )}
                                    {palace.triet_lo && (
                                        <span style={{ backgroundColor: getStarColor('Triệt') }} className="text-white text-[11px] font-bold px-2 py-px border border-white">
                                            Triệt
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};