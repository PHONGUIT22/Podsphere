// src/star_modules/lifeCycleStars.js

function anVongTrangSinh(engine, cuc, isMale, canNam) {
    const vongTrangSinh = [
        "TRÀNG SINH", "MỘC DỤC", "QUAN ĐỚI", "LÂM QUAN", "ĐẾ VƯỢNG", "SUY", 
        "BỆNH", "TỬ", "MỘ", "TUYỆT", "THAI", "DƯỠNG"
    ];

    // 1. Xác định vị trí bắt đầu (Tràng Sinh) dựa vào CỤC
    const startPosTable = {
        2: 8,  // Thủy nhị cục -> Thân (8)
        5: 8,  // Thổ ngũ cục -> Thân (8)
        3: 11, // Mộc tam cục -> Hợi (11)
        4: 5,  // Kim tứ cục -> Tỵ (5)
        6: 2   // Hỏa lục cục -> Dần (2)
    };
    let startIdx = startPosTable[cuc];

    // 2. Xác định chiều đi (Thuận/Nghịch)
    // Dương Nam, Âm Nữ đi thuận. Âm Nam, Dương Nữ đi nghịch.
    const isYangCan = ["Giáp", "Bính", "Mậu", "Canh", "Nhâm"].includes(canNam);
    let isThuan = (isYangCan && isMale) || (!isYangCan && !isMale);

    // 3. Bắn 12 sao vào cung
    for (let i = 0; i < 12; i++) {
        let currentPos = isThuan ? (startIdx + i) : (startIdx - i + 12);
        engine.addStar(currentPos % 12, vongTrangSinh[i]);
    }
}

// Bổ sung thêm sao TUẦN (Sao cực mạnh án ngữ 2 cung giống Triệt)
function anSaoTuan(engine, canNam, chiNam) {
    const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    
    let canIdx = CAN.indexOf(canNam);
    let chiIdx = CHI.indexOf(chiNam);
    
    // Thuật toán tìm cung Tuần Không (Lấy Chi trừ Can)
    let startTuan = (chiIdx - canIdx + 12) % 12;
    let pos1 = (startTuan - 1 + 12) % 12;
    let pos2 = (startTuan - 2 + 12) % 12;

    engine.addStar(pos1, "TUẦN", "tuanTriet");
    engine.addStar(pos2, "TUẦN", "tuanTriet");
}

module.exports = { anVongTrangSinh, anSaoTuan };