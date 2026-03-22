// src/star_modules/mainStars.js

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

// HÀM TÍNH TỬ VI CỰC CHUẨN (ĐÃ FIX LỖI MẤT GỐC DẦN)
function getTuViPos(cuc, ngayAm) {
    let thuongSo = Math.ceil(ngayAm / cuc);
    let soNgayThieu = (thuongSo * cuc) - ngayAm;
    
    // Khởi từ Dần (Index 2). Đi tới 'thuongSo' bước (tính cả cung Dần nên phải - 1)
    let viTriTam = (2 + thuongSo - 1) % 12;
    
    // Nếu ngày thiếu là chẵn -> tiến, lẻ -> lùi
    let tuViIdx;
    if (soNgayThieu % 2 === 0) {
        tuViIdx = (viTriTam + soNgayThieu) % 12;
    } else {
        tuViIdx = (viTriTam - soNgayThieu + 12) % 12;
    }
    return tuViIdx;
}

function anChinhTinh(engine, canNam, chiMenh, ngayAm) {
    const cuc = getCuc(canNam, chiMenh);
    const tuViIdx = getTuViPos(cuc, ngayAm);

    // --- VÒNG SAO TỬ VI (Đi Nghịch) --- TỌA ĐỘ PHẢI CHUẨN NHƯ SAU:
    engine.addStar(tuViIdx, "TỬ VI");
    engine.addStar((tuViIdx - 1 + 12) % 12, "THIÊN CƠ");     // Cách Tử Vi 1 cung
    engine.addStar((tuViIdx - 3 + 12) % 12, "THÁI DƯƠNG");   // Cách Tử Vi 3 cung
    engine.addStar((tuViIdx - 4 + 12) % 12, "VŨ KHÚC");      // Cách Tử Vi 4 cung
    engine.addStar((tuViIdx - 5 + 12) % 12, "THIÊN ĐỒNG");   // Cách Tử Vi 5 cung
    engine.addStar((tuViIdx - 8 + 12) % 12, "LIÊM TRINH");   // Cách Tử Vi 8 cung

    // --- VÒNG SAO THIÊN PHỦ (Đi Thuận) --- (Cái này mảng của mày đúng)
    let thienPhuIdx = (2 - tuViIdx + 12) % 12; 
    
    engine.addStar(thienPhuIdx, "THIÊN PHỦ");
    engine.addStar((thienPhuIdx + 1) % 12, "THÁI ÂM");
    engine.addStar((thienPhuIdx + 2) % 12, "THAM LANG");
    engine.addStar((thienPhuIdx + 3) % 12, "CỰ MÔN");
    engine.addStar((thienPhuIdx + 4) % 12, "THIÊN TƯỚNG");
    engine.addStar((thienPhuIdx + 5) % 12, "THIÊN LƯƠNG");
    engine.addStar((thienPhuIdx + 6) % 12, "THẤT SÁT");
    engine.addStar((thienPhuIdx + 10) % 12, "PHÁ QUÂN");

    return cuc; // Trả ra Cục để bọn khác xài
}

module.exports = { anChinhTinh, getCuc };