// src/star_modules/yearStemStars.js

function anSaoCanNam(engine, canNam) {
    // 1. AN SAO LỘC TỒN, KÌNH DƯƠNG, ĐÀ LA
    const locTonTable = {
        "Giáp": 2, "Ất": 3, "Bính": 5, "Đinh": 6, "Mậu": 5, 
        "Kỷ": 6, "Canh": 8, "Tân": 9, "Nhâm": 11, "Quý": 0
    };
    
    let locTonIdx = locTonTable[canNam];
    engine.addStar(locTonIdx, "LỘC TỒN");
    engine.addStar(locTonIdx + 1, "KÌNH DƯƠNG");
    engine.addStar(locTonIdx - 1, "ĐÀ LA");

    // 2. AN SAO THIÊN KHÔI, THIÊN VIỆT (Quý nhân)
    const khoiVietTable = {
        "Giáp": [1, 7], "Mậu": [1, 7], "Canh": [1, 7],
        "Ất": [0, 8], "Kỷ": [0, 8],
        "Bính": [11, 9], "Đinh": [11, 9],
        "Nhâm": [3, 5], "Quý": [3, 5],
        "Tân": [6, 2]
    };

    let [khoiIdx, vietIdx] = khoiVietTable[canNam];
    engine.addStar(khoiIdx, "THIÊN KHÔI");
    engine.addStar(vietIdx, "THIÊN VIỆT");

    // 3. AN TRIỆT (Sao phá phách nhất lá số, án ngữ 2 cung)
    const trietTable = {
        "Giáp": [8, 9], "Kỷ": [8, 9],
        "Ất": [6, 7], "Canh": [6, 7],
        "Bính": [4, 5], "Tân": [4, 5],
        "Đinh": [2, 3], "Nhâm": [2, 3],
        "Mậu": [0, 11], "Quý": [0, 11]
    };
    
    let trietPos = trietTable[canNam];
    engine.addStar(trietPos[0], "TRIỆT", "tuanTriet");
    engine.addStar(trietPos[1], "TRIỆT", "tuanTriet");
}

module.exports = { anSaoCanNam };