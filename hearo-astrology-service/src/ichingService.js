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

const TIET_KHI_MAP = {
    '立春': 'Lập Xuân', '雨水': 'Vũ Thủy', '驚蟄': 'Kinh Trập', '春分': 'Xuân Phân',
    '清明': 'Thanh Minh', '穀雨': 'Cốc Vũ', '立夏': 'Lập Hạ', '小滿': 'Tiểu Mãn',
    '芒種': 'Mang Chủng', '夏至': 'Hạ Chí', '小暑': 'Tiểu Thử', '大暑': 'Đại Thử',
    '立秋': 'Lập Thu', '處暑': 'Xử Thử', '白露': 'Bạch Lộ', '秋分': 'Thu Phân',
    '寒露': 'Hàn Lộ', '霜降': 'Sương Giáng', '立冬': 'Lập Đông', '小雪': 'Tiểu Tuyết',
    '大雪': 'Đại Tuyết', '冬至': 'Đông Chí', '小寒': 'Tiểu Hàn', '大寒': 'Đại Hàn'
};

const ZHI_ELEMENTS = {
    'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Thìn': 'Thổ', 'Tỵ': 'Hỏa',
    'Ngọ': 'Hỏa', 'Mùi': 'Thổ', 'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

const FLIP_MAP = {
    1: { 1: 5, 2: 3, 3: 2 }, 2: { 1: 6, 2: 4, 3: 1 }, 3: { 1: 7, 2: 1, 3: 4 }, 4: { 1: 8, 2: 2, 3: 3 },
    5: { 1: 1, 2: 7, 3: 6 }, 6: { 1: 2, 2: 8, 3: 5 }, 7: { 1: 3, 2: 5, 3: 8 }, 8: { 1: 4, 2: 6, 3: 7 }
};

function translateGanZhi(cnStr) {
    if (!cnStr || cnStr.length < 2) return cnStr;
    const gan = HAN_VIET_MAP[cnStr.charAt(0)] || cnStr.charAt(0);
    const zhi = HAN_VIET_MAP[cnStr.charAt(1)] || cnStr.charAt(1);
    return `${gan} ${zhi}`;
}

async function castMaiHoaHexagram(year, month, day, hour, topic) {
    try {
        const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
        const lunar = solar.getLunar();

        // 1. THỜI GIAN (Dịch Giờ sang Tiếng Việt)
        const timeStr = `${hour.toString().padStart(2, '0')}:00 - ${day}/${month}/${year}`;
        const timeZhiVN = HAN_VIET_MAP[lunar.getTimeZhi()] || lunar.getTimeZhi(); 
        const lunarStr = `${lunar.getDay()}/${lunar.getMonth()}/${lunar.getYear()} Âm Lịch`;
        const fullTime = `${timeStr} (Giờ ${timeZhiVN} - ${lunarStr})`;

        // 2. CAN CHI (Ghi rõ Giờ, Ngày, Tháng, Năm bằng Tiếng Việt)
        const baziViệt = [
            `Giờ ${translateGanZhi(lunar.getTimeInGanZhi())}`,
            `ngày ${translateGanZhi(lunar.getDayInGanZhi())}`,
            `tháng ${translateGanZhi(lunar.getMonthInGanZhi())}`,
            `năm ${translateGanZhi(lunar.getYearInGanZhi())}`
        ].join(', ');

        // 3. TIẾT KHÍ, NHẬT THẦN, NGUYỆT LỆNH
        const prevJie = lunar.getPrevJieQi(); 
        const tietKhi = TIET_KHI_MAP[prevJie.getName()] || prevJie.getName();
        const nhatThanZhi = HAN_VIET_MAP[lunar.getDayZhi()];
        const nhatThan = `${nhatThanZhi}-${ZHI_ELEMENTS[nhatThanZhi]}`;
        const nguyetLenhZhi = HAN_VIET_MAP[lunar.getMonthZhi()];
        const nguyetLenh = `${nguyetLenhZhi}-${ZHI_ELEMENTS[nguyetLenhZhi]}`;

        // ... (Phần logic tính toán Quẻ và Lục Hào giữ nguyên) ...
        // Đảm bảo phần return data bên dưới dùng bazi: baziViệt và fullTime: fullTime đã sửa ở trên

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

        const primaryLucHao = calculateLucHao(primaryHexId, TRIGRAMS[lowerId].name, TRIGRAMS[upperId].name, cnDayGanZhi);
        const mutatedLucHao = calculateLucHao(mutatedHexId, TRIGRAMS[mutLowerId].name, TRIGRAMS[mutUpperId].name, cnDayGanZhi, primaryLucHao.palaceName);

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
                const chiHan = line.canChi.split('-')[0].trim();
                const chiViet = HAN_VIET_MAP[chiHan] || chiHan;
                const hanh = line.canChi.split('-')[1].trim();
                return {
                    ...line,
                    canChi: `${chiViet} - ${hanh}`,
                    phucThan: line.phucThan ? line.phucThan.replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, m => HAN_VIET_MAP[m]) : null,
                    isTuanKhong: realTuanKhong.includes(chiViet),
                    lucThu: LUC_THU_LIST[(ltStartIdx + idx) % 6]
                };
            });
        };

        return {
            status: 'success',
            data: {
                topic: topic,
                fullTime: fullTime,
                bazi: baziViệt,
                tietKhi: tietKhi,
                nhatThan: nhatThan,
                nguyetLenh: nguyetLenh,
                haoDong: haoDong,
                primary: {
                    id: primaryHexId,
                    hexagram: HEXAGRAMS[primaryHexId],
                    upper: TRIGRAMS[upperId],
                    lower: TRIGRAMS[lowerId],
                    palace: primaryLucHao.palaceName,
                    lucHao: fixAndTranslateLines(primaryLucHao.lines)
                },
                mutated: {
                    id: mutatedHexId,
                    hexagram: HEXAGRAMS[mutatedHexId],
                    upper: TRIGRAMS[mutUpperId],
                    lower: TRIGRAMS[mutLowerId],
                    palace: primaryLucHao.palaceName,
                    lucHao: fixAndTranslateLines(mutatedLucHao.lines)
                }
            }
        };
    } catch (error) {
        throw new Error("Lỗi thuật toán: " + error.message);
    }
}

module.exports = { castMaiHoaHexagram };