// src/star_modules/mainStars.js
const { CHI } = require('../constants');

// 1. Hàm tính CỤC (Cực kỳ quan trọng)
function getCuc(canNam, chiMenh) {
    const table = {
        "GiápKỷ": { "TýSửu": 4, "DầnMão": 5, "ThìnTỵ": 2, "NgọMùi": 6, "ThânDậu": 3, "TuấtHợi": 4 },
        "ẤtCanh": { "TýSửu": 3, "DầnMão": 4, "ThìnTỵ": 5, "NgọMùi": 2, "ThânDậu": 6, "TuấtHợi": 3 },
        "BínhTân": { "TýSửu": 6, "DầnMão": 3, "ThìnTỵ": 4, "NgọMùi": 5, "ThânDậu": 2, "TuấtHợi": 6 },
        "ĐinhNhâm": { "TýSửu": 2, "DầnMão": 6, "ThìnTỵ": 3, "NgọMùi": 4, "ThânDậu": 5, "TuấtHợi": 2 },
        "MậuQuý": { "TýSửu": 5, "DầnMão": 2, "ThìnTỵ": 6, "NgọMùi": 3, "ThânDậu": 4, "TuấtHợi": 5 }
    };
    let keyCan = "";
    if (["Giáp", "Kỷ"].includes(canNam)) keyCan = "GiápKỷ";
    else if (["Ất", "Canh"].includes(canNam)) keyCan = "ẤtCanh";
    else if (["Bính", "Tân"].includes(canNam)) keyCan = "BínhTân";
    else if (["Đinh", "Nhâm"].includes(canNam)) keyCan = "ĐinhNhâm";
    else keyCan = "MậuQuý";

    let keyChi = "";
    for (let k in table[keyCan]) { if (k.includes(chiMenh)) keyChi = k; }
    return table[keyCan][keyChi];
}

// 2. Hàm tìm vị trí sao TỬ VI (Công thức toán học chuẩn)
function getTuViPos(cuc, ngayAm) {
    let check = ngayAm % cuc;
    let b = (check === 0) ? (ngayAm / cuc) : (Math.floor(ngayAm / cuc) + 1);
    let x = (check === 0) ? 0 : (cuc - check);
    
    let khoiTuVi = (x % 2 === 0) ? (b + x) : (b - x);
    return (khoiTuVi + 120) % 12; // Vị trí 0-11
}

// 3. Hàm chính để an 14 sao
function anChinhTinh(engine, canNam, chiMenh, ngayAm) {
    const cuc = getCuc(canNam, chiMenh);
    const tuViIdx = getTuViPos(cuc, ngayAm);

    // --- VÒNG SAO TỬ VI (Đi Nghịch) ---
    engine.addStar(tuViIdx, "TỬ VI");
    engine.addStar(tuViIdx - 1, "LIÊM TRINH");
    engine.addStar(tuViIdx - 2, "THIÊN ĐỒNG");
    engine.addStar(tuViIdx - 3, "VŨ KHÚC");
    engine.addStar(tuViIdx - 4, "THÁI DƯƠNG");
    engine.addStar(tuViIdx - 5, "THIÊN CƠ");

    // --- VÒNG SAO THIÊN PHỦ (Đi Thuận) ---
    // Thiên Phủ đối xứng Tử Vi qua trục Dần-Thân
    let thienPhuIdx = (2 - tuViIdx + 12) % 12; 
    
    engine.addStar(thienPhuIdx, "THIÊN PHỦ");
    engine.addStar(thienPhuIdx + 1, "THÁI ÂM");
    engine.addStar(thienPhuIdx + 2, "THAM LANG");
    engine.addStar(thienPhuIdx + 3, "CỰ MÔN");
    engine.addStar(thienPhuIdx + 4, "THIÊN TƯỚNG");
    engine.addStar(thienPhuIdx + 5, "THIÊN LƯƠNG");
    engine.addStar(thienPhuIdx + 6, "THẤT SÁT");
    engine.addStar(thienPhuIdx + 10, "PHÁ QUÂN");

    return cuc;
}

module.exports = { anChinhTinh };