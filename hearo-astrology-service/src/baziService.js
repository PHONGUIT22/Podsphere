// src/baziService.js
const { Solar } = require('lunar-javascript');

// 1. Bảng tra cứu Ngũ hành (Dùng tiếng Việt cho dễ)
const GAN_MAP = {
    '甲': { element: 'Mộc', polarity: 'Dương' },
    '乙': { element: 'Mộc', polarity: 'Âm' },
    '丙': { element: 'Hỏa', polarity: 'Dương' },
    '丁': { element: 'Hỏa', polarity: 'Âm' },
    '戊': { element: 'Thổ', polarity: 'Dương' },
    '己': { element: 'Thổ', polarity: 'Âm' },
    '庚': { element: 'Kim', polarity: 'Dương' },
    '辛': { element: 'Kim', polarity: 'Âm' },
    '壬': { element: 'Thủy', polarity: 'Dương' },
    '癸': { element: 'Thủy', polarity: 'Âm' }
};

// 2. Bảng tra cứu Tàng Can
const CHI_HIDDEN_MAP = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
    '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
    '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

// 3. Logic Thập Thần
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

const getBaziData = (year, month, day, hour, gender) => {
    // Sử dụng Solar và Lunar y hệt như index.js của bạn
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();

    // Dùng những hàm CHẮC CHẮN chạy trong index.js của bạn
    const pStrs = {
        year: lunar.getYearInGanZhi(),
        month: lunar.getMonthInGanZhi(),
        day: lunar.getDayInGanZhi(),
        hour: lunar.getTimeInGanZhi()
    };

    const dayMasterGan = pStrs.day.substring(0, 1);

    const processPillar = (pStr, type) => {
        const gan = pStr.substring(0, 1);
        const chi = pStr.substring(1, 2);
        const isDay = type === 'day';

        return {
            gan,
            chi,
            element: GAN_MAP[gan]?.element || '?',
            tenGodGan: isDay ? "NHẬT CHỦ" : getTenGod(gan, dayMasterGan),
            hiddenGan: (CHI_HIDDEN_MAP[chi] || []).map(hGan => ({
                name: hGan,
                element: GAN_MAP[hGan]?.element || '?',
                tenGod: getTenGod(hGan, dayMasterGan)
            })),
            truongSinh: "N/A"
        };
    };

    return {
        pillars: {
            year: processPillar(pStrs.year, 'year'),
            month: processPillar(pStrs.month, 'month'),
            day: processPillar(pStrs.day, 'day'),
            hour: processPillar(pStrs.hour, 'hour')
        },
        dayMaster: {
            name: dayMasterGan,
            element: GAN_MAP[dayMasterGan]?.element || '?'
        }
    };
};

module.exports = { getBaziData };