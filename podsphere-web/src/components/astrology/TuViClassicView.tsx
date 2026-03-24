// src/components/astrology/TuViClassicView.tsx
import React from 'react';

// ==========================================================
// 1. DANH SÁCH SAO GOM NHÓM THEO MÀU SẮC (MÀU TRẦM CỔ ĐIỂN)
// ==========================================================
const STAR_GROUPS: Record<string, string[]> = {
    "#cc0000": [ // ĐỎ ĐẬM
        "Thái Dương", "Liêm Trinh", "Hỏa Tinh", "Linh Tinh", "Địa Không", "Địa Kiếp", 
        "Thiên Khôi", "Thiên Việt", "Thiên Mã", "L.Thiên Mã", "Thiên Hình", "Tiểu Hao", 
        "Đại Hao", "Kiếp Sát", "Phá Toái", "Quan Phủ", "Quan Phù", "Tử Phù", "Trực Phù", 
        "Điếu Khách", "Phi Liêm", "Nguyệt Đức", "Thiếu Dương", "Hỷ Thần", "Lực Sĩ", 
        "Tuế Phá", "Đẩu Quân", "Thiên Không", "Thiên Quan", "Thiên Giải", "Phục Binh", 
        "Thiên Đức", "Thái Tuế", "L.Thái Tuế", "Tuần", "Bệnh", "Tử"
    ],
    "#008000": [ // XANH LÁ ĐẬM
        "Thiên Cơ", "Thiên Lương", "Hóa Lộc", "Hóa Quyền", "Đào Hoa", "Tang Môn", 
        "L.Tang Môn", "Giải Thần", "Phượng Các", "Bát Tọa", "Tướng Quân", "Đường Phù", 
        "Ân Quang", "Dưỡng"
    ],
    "#c27c0e": [ // VÀNG ĐẤT/CAM
        "Tử Vi", "Thiên Phủ", "Lộc Tồn", "L.Lộc Tồn", "Tả Phù", "Tả Phụ", "Thiên Quý", 
        "Quốc Ấn", "Thiên Thọ", "Thiên Tài", "Thiên Trù", "Địa Giải", "Phong Cáo", 
        "Bệnh Phù", "Cô Thần", "Quả Tú", "Thiên Thương", "Phúc Đức", "Thiên Phúc", 
        "Tam Thai", "LN Văn Tinh", "Mộ", "Tuyệt", "Thai"
    ],
    "#666666": [ // XÁM ĐẬM
        "Vũ Khúc", "Thất Sát", "Kình Dương", "L.Kình Dương", "Đà La", "L.Đà La", 
        "Bạch Hổ", "L.Bạch Hổ", "Văn Xương", "Hoa Cái", "Tấu Thư", "Thai Phụ", 
        "Thiên Khốc", "L.Thiên Khốc", "Thiên La", "Địa Võng", "Triệt", "Quan Đới", 
        "Lâm Quan", "Đế Vượng", "Lâm quan", "Quan đới"
    ],
    "#000000": [ // ĐEN TUYỀN
        "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Phá Quân", "Thiên Đồng", 
        "Hữu Bật", "Văn Khúc", "Hóa Kỵ", "Hóa Khoa", "Thiên Diêu", "Hồng Loan", 
        "Thiên Hỷ", "Thanh Long", "Long Trì", "Lưu Hà", "Bác Sĩ", "Bác Sỹ", "Thiếu Âm", 
        "Long Đức", "Thiên Sứ", "Thiên Hư", "L.Thiên Hư", "Thiên Y", "Tràng sinh", 
        "Mộc dục", "Suy"
    ]
};

const STAR_COLORS: Record<string, string> = {};
Object.entries(STAR_GROUPS).forEach(([color, stars]) => {
    stars.forEach(star => STAR_COLORS[star.toLowerCase()] = color);
});

const getStarColorCode = (starName: string) => {
    if (!starName) return "#000000"; 
    const lowerName = starName.toLowerCase();
    if (STAR_COLORS[lowerName]) return STAR_COLORS[lowerName];
    const baseName = lowerName.replace(/^(l\.|ln )/, '').trim();
    return STAR_COLORS[baseName] || "#000000"; 
};

const BAD_STARS = [
    "Kình Dương", "L.Kình Dương", "Đà La", "L.Đà La", "Địa Không", "Địa Kiếp", "Hỏa Tinh", "Linh Tinh", 
    "Hóa Kỵ", "Thiên Hình", "Đại Hao", "Tiểu Hao", "Phá Toái", "Quan Phủ", "Quan Phù", "Điếu Khách", 
    "Tang Môn", "L.Tang Môn", "Bạch Hổ", "L.Bạch Hổ", "Thiên Không", "Tuế Phá", "Kiếp Sát", "Cô Thần", 
    "Quả Tú", "Lưu Hà", "Thiên Khốc", "L.Thiên Khốc", "Thiên Hư", "L.Thiên Hư", "Phục Binh", "Tử Phù", 
    "Trực Phù", "Bệnh Phù", "Phi Liêm", "Thái Tuế", "L.Thái Tuế", "Thiên La", "Địa Võng", "Thiên Thương", 
    "Thiên Sứ", "Thiên Diêu", "Đẩu Quân", "Tướng Quân"
];

const VONG_TRANG_SINH = ["Tràng sinh", "Mộc dục", "Quan đới", "Lâm quan", "Đế vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];
const CHI_INDEX: Record<string, number> = { "Tý": 1, "Sửu": 2, "Dần": 3, "Mão": 4, "Thìn": 5, "Tỵ": 6, "Ngọ": 7, "Mùi": 8, "Thân": 9, "Dậu": 10, "Tuất": 11, "Hợi": 12 };

export const TuViClassicView = ({ data }: { data: any }) => {
    const palacesArray = data?.laso?.cac_cung;
    if (!palacesArray || !Array.isArray(palacesArray)) return null;

    const gridOrder = [6, 7, 8, 9, 5, -1, -1, 10, 4, -1, -1, 11, 3, 2, 1, 12];
    
    // ==========================================================
    // 🧠 HÀM TÍNH NGUYỆT VẬN
    // Quy tắc: Từ cung Tiểu Vận năm xem, nghịch tháng thuận giờ
    // ==========================================================
    const getNguyetVanMap = () => {
        // 1. Lấy Chi của năm xem (VD: "Ất Tỵ (2025)" -> lấy "Tỵ")
        const viewYearStr = data.laso?.thong_tin?.am_lich?.split(' ')[1] || ""; 
        const yearChi = viewYearStr.replace(/[\(\)]/g, "").slice(-2, -1) || "Tỵ"; 
        
        // 2. Tìm cung có Tiểu Vận trùng với Chi năm xem
        const startPalace = palacesArray.find(p => p.tieu_han === yearChi);
        if (!startPalace) return {};

        // 3. Lấy tháng sinh và giờ sinh của đương số
        const amLich = data.laso?.thong_tin?.am_lich || ""; 
        const birthMonth = parseInt(amLich.split('/')[1] || "1");
        
        const gioSinhStr = data.laso?.thong_tin?.gio_sinh?.split(' ')[1] || "Tý";
        const birthHourIdx = CHI_INDEX[gioSinhStr] || 1;

        // 4. Bắt đầu tính: Nghịch tháng
        let pos = startPalace.id_cung - (birthMonth - 1);
        while (pos <= 0) pos += 12;

        // 5. Tiếp tục: Thuận giờ -> Đây là vị trí Tháng 1
        let month1Id = (pos + (birthHourIdx - 1));
        while (month1Id > 12) month1Id -= 12;

        // 6. Tạo Map PalaceID -> Số tháng (Đi thuận 12 tháng)
        const monthMap: Record<number, number> = {};
        for (let m = 1; m <= 12; m++) {
            let currentPalaceId = (month1Id + (m - 1));
            while (currentPalaceId > 12) currentPalaceId -= 12;
            monthMap[currentPalaceId] = m;
        }
        return monthMap;
    };

    const nguyetVanMap = getNguyetVanMap();

    // Lấy tọa độ mép trong cùng của Cung (chạm mép Thiên Bàn)
    const getInnerAnchorPoint = (tenCung: string) => {
        const palace = palacesArray.find(p => p.ten_cung?.toLowerCase() === tenCung.toLowerCase());
        if (!palace) return null;
        
        const index = gridOrder.indexOf(palace.id_cung);
        if (index === -1) return null;
        
        const col = index % 4; // Cột 0 đến 3
        const row = Math.floor(index / 4); // Hàng 0 đến 3
        
        let x, y;
        
        // Trục X: Chạm mép Trái (x=100) hoặc Phải (x=300) của Thiên Bàn
        if (col === 0) x = 100;
        else if (col === 3) x = 300;
        else x = col * 100 + 50; 

        // Trục Y: Chạm mép Trên (y=100) hoặc Dưới (y=300) của Thiên Bàn
        if (row === 0) y = 100;
        else if (row === 3) y = 300;
        else y = row * 100 + 50; 

        return { x, y };
    };

    const menhCoord = getInnerAnchorPoint("Mệnh");
    const taiCoord = getInnerAnchorPoint("Tài Bạch");
    const quanCoord = getInnerAnchorPoint("Quan lộc");

    return (
        <div className="mx-auto w-full max-w-[1100px] bg-[#d1d5db] p-8 flex justify-center font-serif">
            
            {/* Phôi lá số - Nền vàng ngà (ivory) */}
            <div className="relative w-full border-[2px] border-black bg-[#fdfaef] shadow-2xl overflow-hidden" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                
                {/* LỚP SVG VẼ TAM GIÁC MỆNH TÀI QUAN */}
                {menhCoord && taiCoord && quanCoord && (
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40" viewBox="0 0 400 400" preserveAspectRatio="none">
                        <polygon
                            points={`${menhCoord.x},${menhCoord.y} ${taiCoord.x},${taiCoord.y} ${quanCoord.x},${quanCoord.y}`}
                            fill="transparent"
                            stroke="#0000cc" 
                            strokeWidth="1.2"
                            strokeDasharray="5,4"
                        />
                    </svg>
                )}

                <div className="grid grid-cols-4 relative z-10">
                    
                    {gridOrder.map((idCung, i) => {
                        // ==========================================
                        // Ô TRUNG TÂM (THIÊN BÀN)
                        // ==========================================
                        if (idCung === -1) {
                            if (i === 5) return (
                                <div key={i} className="col-span-2 row-span-2 border border-black p-4 flex flex-col items-center justify-start relative z-10 bg-transparent">
                                    {/* Tiêu đề Lá Số */}
                                    <h1 className="text-[28px] font-black text-[#8b0000] uppercase tracking-[0.2em] mt-2 border-b-[2px] border-[#8b0000] pb-1 mb-6">
                                        Lá Số Tử Vi
                                    </h1>
                                    
                                    {/* Khu vực thông tin chính */}
                                    <div className="w-full grid grid-cols-2 gap-x-0 px-2">
                                        
                                        {/* Cột Trái: Thông tin Ngày sinh */}
                                        <div className="flex flex-col space-y-2 text-[15px] pr-6 border-r border-gray-300">
                                            <p className="flex justify-between items-center">
                                                <span className="text-[#444444] font-medium">Họ tên:</span> 
                                                <span className="text-[#003366] font-black uppercase text-[17px]">{data.fullName || "Ẩn Danh"}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-[#444444] font-medium">Năm sinh:</span> 
                                                <span className="text-[#003366] font-bold">{data.lunarDateInfo?.canChiNam}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-[#444444] font-medium">Tháng:</span> 
                                                <span className="text-[#003366] font-bold">{data.laso?.thong_tin?.am_lich?.split('/')[1]}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-[#444444] font-medium">Giờ sinh:</span> 
                                                <span className="text-[#003366] font-bold">{data.laso?.thong_tin?.gio_sinh}</span>
                                            </p>
                                            <div className="mt-4 pt-2 border-t border-dashed border-gray-300">
                                                <p className="flex justify-between italic">
                                                    <span className="text-[#444444]">Năm xem:</span> 
                                                    <span className="text-[#8b0000] font-bold">{data.laso?.thong_tin?.nam_xem || "2025"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cột Phải: Thông tin Mệnh Cục */}
                                        <div className="flex flex-col space-y-2 text-[15px] pl-6">
                                            <p className="text-[#003366] font-black text-[16px] italic underline underline-offset-4 decoration-gray-300">
                                                {data.laso?.thong_tin?.am_duong}
                                            </p>
                                            <p className="text-[#003366] font-bold text-[16px]">
                                                <span className="text-[#444444] font-medium">Mệnh: </span> 
                                                {data.laso?.thong_tin?.ban_menh}
                                            </p>
                                            <p className="text-[#003366] font-bold text-[16px]">
                                                <span className="text-[#444444] font-medium">Cục: </span> 
                                                {data.laso?.thong_tin?.cuc}
                                            </p>
                                            
                                            <div className="mt-2 space-y-1.5 border-t border-dashed border-gray-300 pt-2">
                                                <p className="flex justify-between">
                                                    <span className="text-[#444444] font-medium">Chủ mệnh:</span> 
                                                    <span className="text-[#003366] font-bold">{data.laso?.thong_tin?.menh_chu}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-[#444444] font-medium">Chủ thân:</span> 
                                                    <span className="text-[#003366] font-bold">{data.laso?.thong_tin?.than_chu}</span>
                                                </p>
                                            </div>

                                            <div className="mt-3 text-[#003366] font-bold italic text-[14px] bg-blue-50/50 p-1 rounded">
                                                {data.laso?.thong_tin?.sinh_khac}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Thiên bàn */}
                                    <div className="absolute bottom-3 right-4 text-[10px] tracking-widest font-bold uppercase text-gray-400">
                                        PodSphere AI Astrology
                                    </div>
                                    
                                    {/* Hình bát quái chìm phía sau */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[380px] opacity-[0.03] pointer-events-none select-none">
                                        ☯
                                    </div>
                                </div>
                            );
                            return null;
                        }

                        // ==========================================
                        // 12 CUNG ĐỊA BÀN
                        // ==========================================
                        const palace = palacesArray.find((p: any) => p.id_cung === idCung);
                        if (!palace) return <div key={i} className="border border-black"></div>;

                        const lowerVongTrangSinh = VONG_TRANG_SINH.map(v => v.toLowerCase());
                        const leftStars = palace.phu_tinh.filter((s: any) => 
                            !BAD_STARS.map(b => b.toLowerCase()).includes(s.ten_sao.toLowerCase()) && 
                            !lowerVongTrangSinh.includes(s.ten_sao.toLowerCase())
                        );
                        const rightStars = palace.phu_tinh.filter((s: any) => 
                            BAD_STARS.map(b => b.toLowerCase()).includes(s.ten_sao.toLowerCase())
                        );
                        const trangSinhStar = palace.phu_tinh.find((s: any) => 
                            lowerVongTrangSinh.includes(s.ten_sao.toLowerCase())
                        );

                        const isMenh = palace.ten_cung === "Mệnh";
                        const monthNum = nguyetVanMap[palace.id_cung];

                        return (
                            <div key={i} className={`relative flex flex-col h-[260px] border border-black p-1.5 ${isMenh ? 'bg-[#f4efe1]' : 'bg-transparent'}`}>
                                
                                {/* HEADER CUNG */}
                                <div className="flex justify-between items-start leading-none mb-3 z-10">
                                    <span className={`text-[14px] font-black ${isMenh ? 'text-[#cc0000]' : 'text-[#cc0000]'}`}>{palace.chi_cung}</span>
                                    <div className="flex flex-col items-center">
                                        <span className={`text-[15px] font-black uppercase tracking-wide ${isMenh ? 'text-[#cc0000]' : 'text-[#cc0000]'}`}>
                                            {palace.ten_cung}
                                        </span>
                                        {palace.cung_than && <span className="text-[11px] font-black text-gray-600 leading-none mt-0.5">&lt;THÂN&gt;</span>}
                                    </div>
                                    <span className="text-[14px] font-black text-black">{palace.dai_han}</span>
                                </div>

                                {/* CHÍNH TINH */}
                                <div className="flex flex-col items-center justify-center min-h-[44px] mb-3 leading-tight z-10">
                                    {palace.chinh_tinh.length === 0 ? (
                                        <span className="text-[16px] font-bold text-gray-400 italic">Vô Chính Diệu</span>
                                    ) : (
                                        palace.chinh_tinh.map((s: any, idx: number) => (
                                            <div key={idx} style={{ color: getStarColorCode(s.ten_sao) }} className="text-[17px] font-black uppercase tracking-wide drop-shadow-sm">
                                                {s.ten_sao}{s.dac_tinh && <span className="text-[14px] ml-0.5">({s.dac_tinh})</span>}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* PHỤ TINH */}
                                <div className="flex flex-1 w-full overflow-hidden px-1 z-10">
                                    <div className="w-1/2 flex flex-col items-start gap-px">
                                        {leftStars.map((s: any, idx: number) => (
                                            <div key={idx} style={{ color: getStarColorCode(s.ten_sao) }} className="text-[13px] font-bold leading-tight drop-shadow-sm">
                                                {s.ten_sao}{s.dac_tinh && <span>({s.dac_tinh})</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-1/2 flex flex-col items-end gap-px">
                                        {rightStars.map((s: any, idx: number) => (
                                            <div key={idx} style={{ color: getStarColorCode(s.ten_sao) }} className="text-[13px] font-bold leading-tight text-right drop-shadow-sm">
                                                {s.ten_sao}{s.dac_tinh && <span>({s.dac_tinh})</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="mt-auto pt-1 flex justify-between items-end border-t border-gray-300 z-10">
                                    <span className="text-[13px] text-gray-500 font-bold italic">
                                        {palace.chi_cung}
                                    </span>
                                    <span style={{ color: getStarColorCode(trangSinhStar?.ten_sao || "") }} className="text-[14px] font-black uppercase tracking-wide">
                                        {trangSinhStar?.ten_sao || ""}
                                    </span>
                                    
                                    {/* HIỂN THỊ SỐ THÁNG NGUYỆT VẬN Ở ĐÂY */}
                                    <span className="text-[13px] text-[#003366] font-black">
                                        {monthNum ? `T.${monthNum}` : `Tháng`}
                                    </span>
                                </div>

                                {/* TEM TUẦN / TRIỆT */}
                                <div className="absolute -bottom-2.5 right-2 flex gap-1 z-20">
                                    {palace.tuan_trung && (
                                        <span style={{ backgroundColor: getStarColorCode('Tuần') }} className="text-white text-[12px] font-bold px-1.5 py-px border-[1.5px] border-white shadow-sm">
                                            TUẦN
                                        </span>
                                    )}
                                    {palace.triet_lo && (
                                        <span style={{ backgroundColor: getStarColorCode('Triệt') }} className="text-white text-[12px] font-bold px-1.5 py-px border-[1.5px] border-white shadow-sm">
                                            TRIỆT
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