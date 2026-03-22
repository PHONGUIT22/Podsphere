// src/star_modules/yearBranchStars.js

function anSaoChiNam(engine, chiNam) {
    // 1. VÒNG THÁI TUẾ (12 SAO - ĐI THUẬN)
    const vongThaiTue = [
        "THÁI TUẾ", "THIẾU DƯƠNG", "TANG MÔN", "THIẾU ÂM", 
        "QUAN PHÙ", "TỬ PHÙ", "TUẾ PHÁ", "LONG ĐỨC", 
        "BẠCH HỔ", "PHÚC ĐỨC", "ĐIẾU KHÁCH", "TRỰC PHÙ"
    ];

    const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    let chiNamIdx = CHI.indexOf(chiNam);

    // Thái Tuế bắt đầu ngay tại Chi của Năm sinh, sau đó đi thuận
    vongThaiTue.forEach((sao, i) => {
        engine.addStar((chiNamIdx + i) % 12, sao);
    });

    // 2. SAO THIÊN MÃ (Nghị lực, di chuyển)
    const thienMaTable = {
        "Hợi": 5, "Mão": 5, "Mùi": 5, // Hợi Mão Mùi -> Tỵ (5)
        "Dần": 8, "Ngọ": 8, "Tuất": 8, // Dần Ngọ Tuất -> Thân (8)
        "Tỵ": 11, "Dậu": 11, "Sửu": 11, // Tỵ Dậu Sửu -> Hợi (11)
        "Thân": 2, "Tý": 2, "Thìn": 2  // Thân Tý Thìn -> Dần (2)
    };
    engine.addStar(thienMaTable[chiNam], "THIÊN MÃ");

    // 3. SAO ĐÀO HOA (Sức hút, tình duyên)
    const daoHoaTable = {
        "Hợi": 0, "Mão": 0, "Mùi": 0,   // Tý (0)
        "Dần": 3, "Ngọ": 3, "Tuất": 3,   // Mão (3)
        "Tỵ": 6, "Dậu": 6, "Sửu": 6,   // Ngọ (6)
        "Thân": 9, "Tý": 9, "Thìn": 9   // Dậu (9)
    };
    engine.addStar(daoHoaTable[chiNam], "ĐÀO HOA");

    // 4. SAO HỒNG LOAN (Duyên ngầm, hỷ tín)
    // Hồng Loan: Khởi từ Mão (3), đi nghịch đến Chi năm
    let hongLoanIdx = (3 - chiNamIdx + 12) % 12;
    engine.addStar(hongLoanIdx, "HỒNG LOAN");

    // Thiên Hỷ đối xứng Hồng Loan qua trục Tý-Ngọ
    let thienHyIdx = (hongLoanIdx + 6) % 12;
    engine.addStar(thienHyIdx, "THIÊN HỶ");
}

module.exports = { anSaoChiNam };