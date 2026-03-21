const express = require('express');
const cors = require('cors');
const { Solar } = require('lunar-javascript');

const app = express();
app.use(cors());
app.use(express.json());

// Bảng tra cứu Can Chi tiếng Việt
const TRANSLATE = {
    '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu', 
    '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
    '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', 
    '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', 
    '戌': 'Tuất', '亥': 'Hợi',
    '木': 'Mộc', '火': 'Hỏa', '土': 'Thổ', '金': 'Kim', '水': 'Thủy'
};

const translateStr = (str) => {
    return str.split('').map(char => TRANSLATE[char] || char).join(' ');
};

app.get('/api/astrology/info', (req, res) => {
    try {
        const { year, month, day, hour, minute } = req.query;
        const solar = Solar.fromYmdHms(parseInt(year), parseInt(month), parseInt(day), parseInt(hour || 0), parseInt(minute || 0), 0);
        const lunar = solar.getLunar();
        const baZi = lunar.getEightChar();

        res.json({
            solarDate: solar.toFullString(),
            lunarDate: lunar.toFullString(),
            canChi: {
                year: translateStr(baZi.getYear()),
                month: translateStr(baZi.getMonth()),
                day: translateStr(baZi.getDay()),
                hour: translateStr(baZi.getTime())
            },
            nguHanh: {
                year: translateStr(baZi.getYearWuXing()),
                month: translateStr(baZi.getMonthWuXing()),
                day: translateStr(baZi.getDayWuXing()),
                hour: translateStr(baZi.getTimeWuXing())
            },
            tietKhi: lunar.getJieQi() || "Bình thường",
            conGiap: translateStr(lunar.getYearShengXiao())
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("✅ Astrology Service đã Việt hóa!"));