const express = require('express');
const TuViEngine = require('./TuViEngine');
const { Solar } = require('lunar-javascript');
const app = express();

app.get('/api/astrology/tuvi-pro', (req, res) => {
    // 1. Bốc thêm gender và minute từ query
    const { year, month, day, hour, minute, name, gender } = req.query;
    
    const solar = Solar.fromYmdHms(
        parseInt(year), 
        parseInt(month), 
        parseInt(day), 
        parseInt(hour), 
        parseInt(minute || 0), 0
    );
    const lunar = solar.getLunar();
    
    // 2. Định nghĩa isMale chuẩn (1 là Nam, còn lại là Nữ)
    const isMale = parseInt(gender) === 1;
    
    const engine = new TuViEngine();
    
    // 3. Dựng khung
    const menhIdx = engine.setupPalaces(lunar.getMonth(), lunar.getTimeZhiIndex());
    
    // 4. CHỈ GỌI BUILD 1 LẦN DUY NHẤT VỚI ĐẦY ĐỦ THAM SỐ
    engine.build(lunar, menhIdx, isMale);

        // 3. Trả về cấu trúc phẳng để React bốc cho dễ
    res.json({
        fullName: name || "Ẩn danh",
        solarDate: solar.toFullString(),
        lunarDate: lunar.toFullString(),
        conGiap: chiNam, // Đã dịch sang tiếng Việt
        // Đưa canChi ra ngoài cùng luôn
        canChi: {
            year: canNam + " " + chiNam,
            month: lunar.getMonthInGanZhi() + " (Dịch sau)",
            day: lunar.getDayInGanZhi() + " (Dịch sau)",
            hour: lunar.getTimeZhi() + " (Dịch sau)"
        },
        // Dữ liệu từ Engine
        cuc: engine.cuc,
        palaces: engine.getLaSo().palaces
    });
});

app.listen(3001, () => console.log("🚀 TuVi Engine v3.0 - Đã FIX lỗi và chạy ngon!"));