// src/ichingService.js
const { Solar } = require('lunar-javascript');
const { TRIGRAMS, HEXAGRAM_LOOKUP, HEXAGRAMS } = require('./iching/gua_64');
const { getFullInterpretation } = require('./iching/interpretations');
const { calculateLucHao } = require('./iching/luchao'); 

const HAN_VIET_MAP = {
    '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
    '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
    '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn',
    '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu',
    '戌': 'Tuất', '亥': 'Hợi'
};

const ZHI_ELEMENTS = {
    'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Thìn': 'Thổ', 'Tỵ': 'Hỏa',
    'Ngọ': 'Hỏa', 'Mùi': 'Thổ', 'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

function translateGanZhi(cnStr) {
    if (!cnStr || cnStr.length < 2) return cnStr;
    const gan = HAN_VIET_MAP[cnStr.charAt(0)] || cnStr.charAt(0);
    const zhi = HAN_VIET_MAP[cnStr.charAt(1)] || cnStr.charAt(1);
    return `${gan} ${zhi}`;
}

const FLIP_MAP = {
    1: { 1: 5, 2: 3, 3: 2 }, 2: { 1: 6, 2: 4, 3: 1 }, 3: { 1: 7, 2: 1, 3: 4 }, 4: { 1: 8, 2: 2, 3: 3 },
    5: { 1: 1, 2: 7, 3: 6 }, 6: { 1: 2, 2: 8, 3: 5 }, 7: { 1: 3, 2: 5, 3: 8 }, 8: { 1: 4, 2: 6, 3: 7 }
};

async function castMaiHoaHexagram(year, month, day, hour, topic) {
    try {
        const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
        const lunar = solar.getLunar();

        // 1. THÔNG TIN HEADER (Giống web mẫu)
        const timeStr = `${hour.toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} - ${day}/${month}/${year}`;
        const timeZhiVN = HAN_VIET_MAP[lunar.getTimeZhi()] || lunar.getTimeZhi();
        const lunarStr = `Giờ ${timeZhiVN}, ngày ${lunar.getDay()}/${lunar.getMonth()}/${lunar.getYear()} ÂL`;
        
        const baziStr = `Giờ ${translateGanZhi(lunar.getTimeInGanZhi())}, ngày ${translateGanZhi(lunar.getDayInGanZhi())}, tháng ${translateGanZhi(lunar.getMonthInGanZhi())}, năm ${translateGanZhi(lunar.getYearInGanZhi())}`;

        const tietKhi = lunar.getJieQi() || 'Không rõ';
        const nhatThanZhi = HAN_VIET_MAP[lunar.getDayZhi()];
        const nhatThan = `${nhatThanZhi}-${ZHI_ELEMENTS[nhatThanZhi]}`;
        const nguyetLenhZhi = HAN_VIET_MAP[lunar.getMonthZhi()];
        const nguyetLenh = `${nguyetLenhZhi}-${ZHI_ELEMENTS[nguyetLenhZhi]}`;

        // 2. TÍNH QUẺ MAI HOA
        const cnDayGanZhi = lunar.getDayInGanZhi(); 
        const namZhi = lunar.getYearZhiIndex() + 1;
        const thangAm = lunar.getMonth();
        const ngayAm = lunar.getDay();
        const gioZhi = lunar.getTimeZhiIndex() + 1;

        let upperId = (namZhi + thangAm + ngayAm) % 8 || 8;
        let lowerId = (namZhi + thangAm + ngayAm + gioZhi) % 8 || 8;
        let haoDong = (namZhi + thangAm + ngayAm + gioZhi) % 6 || 6;

        const primaryHexId = HEXAGRAM_LOOKUP[`${upperId},${lowerId}`];
        let mutUpperId = upperId;
        let mutLowerId = lowerId;
        if (haoDong <= 3) mutLowerId = FLIP_MAP[lowerId][haoDong];
        else mutUpperId = FLIP_MAP[upperId][haoDong - 3];
        const mutatedHexId = HEXAGRAM_LOOKUP[`${mutUpperId},${mutLowerId}`];

        // 3. TÍNH LỤC HÀO
        const primaryLucHao = calculateLucHao(primaryHexId, TRIGRAMS[lowerId].name, TRIGRAMS[upperId].name, cnDayGanZhi);
        const mutatedLucHao = calculateLucHao(mutatedHexId, TRIGRAMS[mutLowerId].name, TRIGRAMS[mutUpperId].name, cnDayGanZhi, primaryLucHao.palaceName);

        // 4. VÁ LỖI & DỊCH SANG TIẾNG VIỆT
        const viDayGan = HAN_VIET_MAP[cnDayGanZhi.charAt(0)];
        const viDayZhi = HAN_VIET_MAP[cnDayGanZhi.charAt(1)];
        const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
        const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
        const offset = (BRANCHES.indexOf(viDayZhi) - STEMS.indexOf(viDayGan) + 12) % 12;
        const realTuanKhong = [BRANCHES[(offset + 10) % 12], BRANCHES[(offset + 11) % 12]];

        const LUC_THU_START = { 'Giáp': 0, 'Ất': 0, 'Bính': 1, 'Đinh': 1, 'Mậu': 2, 'Kỷ': 3, 'Canh': 4, 'Tân': 4, 'Nhâm': 5, 'Quý': 5 };
        const LUC_THU_LIST = ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'];
        const ltStartIdx = LUC_THU_START[viDayGan] || 0;

        const fixAndTranslateLines = (lines) => {
            return lines.map((line, idx) => {
                const chiHán = line.canChi.split('-')[0].trim();
                const chiViệt = HAN_VIET_MAP[chiHán] || chiHán;
                const hànhHán = line.canChi.split('-')[1].trim();
                return {
                    ...line,
                    canChi: `${chiViệt} - ${hànhHán}`,
                    phucThan: line.phucThan ? line.phucThan.replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, m => HAN_VIET_MAP[m]) : null,
                    isTuanKhong: realTuanKhong.includes(chiViệt),
                    lucThu: LUC_THU_LIST[(ltStartIdx + idx) % 6]
                };
            });
        };

        return {
            status: 'success',
            data: {
                topic: topic,
                fullTime: `${timeStr} (${lunarStr})`,
                bazi: baziStr,
                tietKhi: tietKhi,
                nhatThan: nhatThan,
                nguyetLenh: nguyetLenh,
                haoDong: haoDong,
                primary: {
                    id: primaryHexId,
                    hexagram: HEXAGRAMS[primaryHexId],
                    upper: TRIGRAMS[upperId],
                    lower: TRIGRAMS[lowerId],
                    palace: primaryLucHao.palaceName, // Lấy Họ (Cung)
                    lucHao: fixAndTranslateLines(primaryLucHao.lines)
                },
                mutated: {
                    id: mutatedHexId,
                    hexagram: HEXAGRAMS[mutatedHexId],
                    upper: TRIGRAMS[mutUpperId],
                    lower: TRIGRAMS[mutLowerId],
                    palace: primaryLucHao.palaceName, // Quẻ biến cùng Họ quẻ chính
                    lucHao: fixAndTranslateLines(mutatedLucHao.lines)
                }
            }
        };
    } catch (error) {
        throw new Error("Lỗi thuật toán Kinh Dịch: " + error.message);
    }
}

module.exports = { castMaiHoaHexagram };