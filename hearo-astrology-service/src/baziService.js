// src/baziService.js
const { Solar, Lunar } = require('lunar-javascript');

const GAN_MAP = {
    '甲': { element: 'Mộc', polarity: 'Dương' }, '乙': { element: 'Mộc', polarity: 'Âm' },
    '丙': { element: 'Hỏa', polarity: 'Dương' }, '丁': { element: 'Hỏa', polarity: 'Âm' },
    '戊': { element: 'Thổ', polarity: 'Dương' }, '己': { element: 'Thổ', polarity: 'Âm' },
    '庚': { element: 'Kim', polarity: 'Dương' }, '辛': { element: 'Kim', polarity: 'Âm' },
    '壬': { element: 'Thủy', polarity: 'Dương' }, '癸': { element: 'Thủy', polarity: 'Âm' }
};

const CHI_HIDDEN_MAP = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'],
    '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'], '午': ['丁', '己'], '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

const NAP_AM_MAP = {
    '甲子': 'Hải Trung Kim', '乙丑': 'Hải Trung Kim', '丙寅': 'Lư Trung Hỏa', '丁卯': 'Lư Trung Hỏa', '戊辰': 'Đại Lâm Mộc', '己巳': 'Đại Lâm Mộc',
    '庚午': 'Lộ Bàng Thổ', '辛未': 'Lộ Bàng Thổ', '壬申': 'Kiếm Phong Kim', '癸酉': 'Kiếm Phong Kim', '甲戌': 'Sơn Đầu Hỏa', '乙亥': 'Sơn Đầu Hỏa',
    '丙 tử': 'Giản Hạ Thủy', '丁丑': 'Giản Hạ Thủy', '戊寅': 'Thành Đầu Thổ', '己卯': 'Thành Đầu Thổ', '庚辰': 'Bạch Lạp Kim', '辛巳': 'Bạch Lạp Kim',
    '壬午': 'Dương Liễu Mộc', '癸未': 'Dương Liễu Mộc', '甲申': 'Tuyền Trung Thủy', '乙酉': 'Tuyền Trung Thủy', '丙戌': 'Ốc Thượng Thổ', '丁亥': 'Ốc Thượng Thổ',
    '戊 tử': 'Tích Lịch Hỏa', '己丑': 'Tích Lịch Hỏa', '庚寅': 'Tùng Bách Mộc', '辛卯': 'Tùng Bách Mộc', '壬辰': 'Trường Lưu Thủy', '癸巳': 'Trường Lưu Thủy',
    '甲午': 'Sa Trung Kim', '乙未': 'Sa Trung Kim', '丙申': 'Sơn Hạ Hỏa', '丁酉': 'Sơn Hạ Hỏa', '戊戌': 'Bình Địa Mộc', '己亥': 'Bình Địa Mộc',
    '庚 tử': 'Bích Thượng Thổ', '辛丑': 'Bích Thượng Thổ', '壬寅': 'Kim Bạch Kim', '癸卯': 'Kim Bạch Kim', '甲辰': 'Phú Đăng Hỏa', '乙巳': 'Phú Đăng Hỏa',
    '丙午': 'Thiên Hà Thủy', '丁 mầm': 'Thiên Hà Thủy', '戊申': 'Đại Trạch Thổ', '己酉': 'Đại Trạch Thổ', '庚戌': 'Thoa Xuyến Kim', '辛亥': 'Thoa Xuyến Kim',
    '壬 tử': 'Tang Đố Mộc', '癸丑': 'Tang Đố Mộc', '甲寅': 'Đại Khê Thủy', '乙卯': 'Đại Khê Thủy', '丙辰': 'Sa Trung Thổ', '丁巳': 'Sa Trung Thổ',
    '戊午': 'Thiên Thượng Hỏa', '己 mầm': 'Thiên Thượng Hỏa', '庚申': 'Thạch Lựu Mộc', '辛酉': 'Thạch Lựu Mộc', '壬戌': 'Đại Hải Thủy', '癸亥': 'Đại Hải Thủy'
};

const TRUONG_SINH_TABLE = {
    '甲': { '亥': 'Trường sinh', '子': 'Mộc dục', '丑': 'Quan đới', '寅': 'Lâm quan', '卯': 'Đế vượng', '辰': 'Suy', '巳': 'Bệnh', '午': 'Tử', '未': 'Mộ', '申': 'Tuyệt', '酉': 'Thai', '戌': 'Dưỡng' },
    '丙': { '寅': 'Trường sinh', '卯': 'Mộc dục', '辰': 'Quan đới', '巳': 'Lâm quan', '午': 'Đế vượng', '未': 'Suy', '申': 'Bệnh', '酉': 'Tử', '戌': 'Mộ', '亥': 'Tuyệt', '子': 'Thai', '丑': 'Dưỡng' },
    '戊': { '寅': 'Trường sinh', '卯': 'Mộc dục', '辰': 'Quan đới', '巳': 'Lâm quan', '午': 'Đế vượng', '未': 'Suy', '申': 'Bệnh', '酉': 'Tử', '戌': 'Mộ', '亥': 'Tuyệt', '子': 'Thai', '丑': 'Dưỡng' },
    '庚': { '巳': 'Trường sinh', '午': 'Mộc dục', '未': 'Quan đới', '申': 'Lâm quan', '酉': 'Đế vượng', '戌': 'Suy', '亥': 'Bệnh', '子': 'Tử', '丑': 'Mộ', '寅': 'Tuyệt', '卯': 'Thai', '辰': 'Dưỡng' },
    '壬': { '申': 'Trường sinh', '酉': 'Mộc dục', '戌': 'Quan đới', '亥': 'Lâm quan', '子': 'Đế vượng', '丑': 'Suy', '寅': 'Bệnh', '卯': 'Tử', '辰': 'Mộ', '巳': 'Tuyệt', '午': 'Thai', '未': 'Dưỡng' },
    '乙': { '午': 'Trường sinh', '巳': 'Mộc dục', '辰': 'Quan đới', '卯': 'Lâm quan', '寅': 'Đế vượng', '丑': 'Suy', '子': 'Bệnh', '亥': 'Tử', '戌': 'Mộ', '酉': 'Tuyệt', '申': 'Thai', '未': 'Dưỡng' },
    '丁': { '酉': 'Trường sinh', '申': 'Mộc dục', '未': 'Quan đới', '午': 'Lâm quan', '巳': 'Đế vượng', '辰': 'Suy', '卯': 'Bệnh', '寅': 'Tử', '丑': 'Mộ', '子': 'Tuyệt', '亥': 'Thai', '戌': 'Dưỡng' },
    '己': { '酉': 'Trường sinh', '申': 'Mộc dục', '未': 'Quan đới', '午': 'Lâm quan', '巳': 'Đế vượng', '辰': 'Suy', '卯': 'Bệnh', '寅': 'Tử', '丑': 'Mộ', '子': 'Tuyệt', '亥': 'Thai', '戌': 'Dưỡng' },
    '辛': { '子': 'Trường sinh', '亥': 'Mộc dục', '戌': 'Quan đới', '酉': 'Lâm quan', '申': 'Đế vượng', '未': 'Suy', '午': 'Bệnh', '巳': 'Tử', '辰': 'Mộ', '卯': 'Tuyệt', '寅': 'Thai', '丑': 'Dưỡng' },
    '癸': { '卯': 'Trường sinh', '寅': 'Mộc dục', '丑': 'Quan đới', '子': 'Lâm quan', '亥': 'Đế vượng', '戌': 'Suy', '酉': 'Bệnh', '申': 'Tử', '未': 'Mộ', '午': 'Tuyệt', '巳': 'Thai', '辰': 'Dưỡng' }
};

// 60 HOA GIÁP CHUẨN
const JIA_ZI = [
    '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
    '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
    '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
    '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
    '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
    '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

const getTenGod = (targetGan, dayMasterGan) => {
    if (!GAN_MAP[targetGan] || !GAN_MAP[dayMasterGan]) return "-";
    if (targetGan === dayMasterGan) return "Tỷ Kiên";
    const dm = GAN_MAP[dayMasterGan];
    const tg = GAN_MAP[targetGan];
    const relations = {
        'Mộc': { 'Mộc': 'Tỷ/Kiếp', 'Hỏa': 'Thực/Thương', 'Thổ': 'Tài', 'Kim': 'Quan/Sát', 'Thủy': 'Ấn' },
        'Hỏa': { 'Mộc': 'Ấn', 'Hỏa': 'Tỷ/Kiếp', 'Thổ': 'Thực/Thương', 'Kim': 'Tài', 'Thủy': 'Quan/Sát' },
        'Thổ': { 'Mộc': 'Quan/Sát', 'Hỏa': 'Ấn', 'Thổ': 'Tỷ/Kiếp', 'Kim': 'Thực/Thương', 'Thủy': 'Tài' },
        'Kim': { 'Mộc': 'Tài', 'Hỏa': 'Quan/Sát', 'Thổ': 'Ấn', 'Kim': 'Tỷ/Kiếp', 'Thủy': 'Thực/Thương' },
        'Thủy': { 'Mộc': 'Thực/Thương', 'Hỏa': 'Tài', 'Thổ': 'Quan/Sát', 'Kim': 'Ấn', 'Thủy': 'Tỷ/Kiếp' }
    };
    let base = relations[dm.element][tg.element];
    if (base === 'Tỷ/Kiếp') return dm.polarity === tg.polarity ? "Tỷ Kiên" : "Kiếp Tài";
    if (base === 'Thực/Thương') return dm.polarity === tg.polarity ? "Thực Thần" : "Thương Quan";
    if (base === 'Ấn') return dm.polarity === tg.polarity ? "Thiên Ấn" : "Chính Ấn";
    if (base === 'Tài') return dm.polarity === tg.polarity ? "Thiên Tài" : "Chính Tài";
    if (base === 'Quan/Sát') return dm.polarity === tg.polarity ? "Thất Sát" : "Chính Quan";
    return base;
};

const getMsFromSolar = (s) => new Date(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour(), s.getMinute(), s.getSecond()).getTime();

const processPillar = (pStr, dayMasterGan, type) => {
    const gan = pStr.substring(0, 1);
    const chi = pStr.substring(1, 2);
    return {
        gan, chi,
        element: GAN_MAP[gan]?.element || '?',
        tenGodGan: type === 'day' ? "NHẬT CHỦ" : getTenGod(gan, dayMasterGan),
        hiddenGan: (CHI_HIDDEN_MAP[chi] || []).map(hGan => ({
            name: hGan, element: GAN_MAP[hGan]?.element || '?', tenGod: getTenGod(hGan, dayMasterGan)
        })),
        napAm: NAP_AM_MAP[pStr] || 'N/A',
        truongSinh: TRUONG_SINH_TABLE[dayMasterGan]?.[chi] || '-'
    };
};

const getBaziData = (year, month, day, hour, genderStr) => {
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();
    const gender = parseInt(genderStr) === 1 ? 'Nam' : 'Nữ';
    
    const dayMasterGan = lunar.getDayGan();
    const yearPolarity = GAN_MAP[lunar.getYearGan()].polarity;
    const isDươngNamÂmNữ = (gender === 'Nam' && yearPolarity === 'Dương') || (gender === 'Nữ' && yearPolarity === 'Âm');

    // TÍNH KHỞI VẬN
    const jqTable = lunar.getJieQiTable();
    const jqNames = lunar.getJieQiList();
    const currentMillis = getMsFromSolar(solar);
    let targetSolarDate = null;

    if (isDươngNamÂmNữ) {
        for (let name of jqNames) {
            let s = jqTable[name];
            if (getMsFromSolar(s) > currentMillis && jqNames.indexOf(name) % 2 === 0) {
                targetSolarDate = s; break;
            }
        }
    } else {
        const reversedNames = [...jqNames].reverse();
        for (let name of reversedNames) {
            let s = jqTable[name];
            if (getMsFromSolar(s) < currentMillis && jqNames.indexOf(name) % 2 === 0) {
                targetSolarDate = s; break;
            }
        }
    }

    if (!targetSolarDate) targetSolarDate = solar;
    const diffSeconds = Math.abs(getMsFromSolar(targetSolarDate) - currentMillis) / 1000;
    const totalDays = diffSeconds / (24 * 3600);
    
    // Khởi vận chuẩn: 3 ngày = 1 năm tuổi
    const startYears = Math.floor(totalDays / 3);
    const startMonths = Math.floor((totalDays % 3) * 4);
    const startDays = Math.floor(((totalDays % 3) % (1/4)) * 120);
    
    // Website thường cộng thêm 1 tuổi mụ để hiển thị đại vận
    const startAge = startYears + 1; 

    const monthPillar = lunar.getMonthInGanZhi();
    let currentIndex = JIA_ZI.indexOf(monthPillar);
    const majorCycles = [];

    // Lấy 10 đại vận cho giống web
    for (let i = 0; i < 10; i++) {
        currentIndex = isDươngNamÂmNữ ? (currentIndex + 1) % 60 : (currentIndex - 1 + 60) % 60;
        const pStr = JIA_ZI[currentIndex];
        majorCycles.push({
            pillar: pStr,
            gan: pStr[0],
            chi: pStr[1],
            startAge: startAge + (i * 10),
            startYear: year + startAge + (i * 10),
            tenGod: getTenGod(pStr[0], dayMasterGan),
            element: GAN_MAP[pStr[0]].element
        });
    }

    return {
        solar: { year, month, day, hour: `${hour}:00` },
        gender,
        startAgeInfo: `${startYears} tuổi ${startMonths} tháng ${startDays} ngày (Khởi vận ${startAge} tuổi)`,
        pillars: {
            year: processPillar(lunar.getYearInGanZhi(), dayMasterGan, 'year'),
            month: processPillar(lunar.getMonthInGanZhi(), dayMasterGan, 'month'),
            day: processPillar(lunar.getDayInGanZhi(), dayMasterGan, 'day'),
            hour: processPillar(lunar.getTimeInGanZhi(), dayMasterGan, 'hour')
        },
        majorCycles,
        dayMaster: { name: dayMasterGan, element: GAN_MAP[dayMasterGan].element }
    };
};

module.exports = { getBaziData };