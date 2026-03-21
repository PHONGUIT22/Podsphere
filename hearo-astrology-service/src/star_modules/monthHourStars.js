// src/star_modules/monthHourStars.js

function anSaoThangGio(engine, thangAm, gioAmIdx) {
    // 1. Sao theo THÁNG (Dùng Index 0-11)
    // Tả Phụ: Khởi từ Thìn (4), đi thuận theo tháng sinh
    let taPhuIdx = (4 + thangAm - 1) % 12;
    engine.addStar(taPhuIdx, "TẢ PHỤ");

    // Hữu Bật: Khởi từ Tuất (10), đi nghịch theo tháng sinh
    let huuBatIdx = (10 - (thangAm - 1) + 12) % 12;
    engine.addStar(huuBatIdx, "HỮU BẬT");

    // 2. Sao theo GIỜ
    // Văn Khúc: Khởi từ Thìn (4), đi thuận theo giờ sinh
    let vanKhucIdx = (4 + gioAmIdx) % 12;
    engine.addStar(vanKhucIdx, "VĂN KHÚC");

    // Văn Xương: Khởi từ Tuất (10), đi nghịch theo giờ sinh
    let vanXuongIdx = (10 - gioAmIdx + 12) % 12;
    engine.addStar(vanXuongIdx, "VĂN XƯƠNG");

    // Địa Không: Khởi từ Hợi (11), đi nghịch theo giờ sinh
    let diaKhongIdx = (11 - gioAmIdx + 12) % 12;
    engine.addStar(diaKhongIdx, "ĐỊA KHÔNG");

    // Địa Kiếp: Khởi từ Hợi (11), đi thuận theo giờ sinh
    let diaKiepIdx = (11 + gioAmIdx) % 12;
    engine.addStar(diaKiepIdx, "ĐỊA KIẾP");
}

module.exports = { anSaoThangGio };