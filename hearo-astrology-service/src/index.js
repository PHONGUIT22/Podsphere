// src/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Solar } = require('lunar-javascript');

const app = express();
app.use(cors());
app.use(express.json());

// Đây là đường link tới xưởng Data Python của mày
const PYTHON_API_URL = 'http://127.0.0.1:8000/api/lap-la-so';

app.get('/api/astrology/info', async (req, res) => {
    try {
        // Frontend truyền vào Ngày Tháng Năm Giờ Dương Lịch và Giới tính (1: Nam, 0: Nữ)
        let { year, month, day, hour, gender } = req.query;

        // 1. Validate Input
        if (!year || !month || !day || !hour || gender === undefined) {
            return res.status(400).json({ error: "Gửi thiếu params rồi thằng lỏi!" });
        }

        // 2. Lấy Index giờ Âm Lịch (Tý = 0, Sửu = 1...) dùng lunar-javascript
        const solar = Solar.fromYmdHms(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), 0, 0);
        const lunar = solar.getLunar();
        
        // Thằng Python đòi Giờ Tý = 1, Sửu = 2... nên tao phải + 1
        const pythonGio = lunar.getTimeZhiIndex() + 1; 
        
        // Thằng Python đòi Giới Tính Nam = 1, Nữ = -1
        const pythonGioiTinh = parseInt(gender) === 1 ? 1 : -1;

        // 3. Bắn lệnh qua Server Python lấy lá số
        const response = await axios.get(PYTHON_API_URL, {
            params: {
                nam: parseInt(year),
                thang: parseInt(month),
                ngay: parseInt(day),
                gio: pythonGio,
                gioi_tinh: pythonGioiTinh
            }
        });

        // 4. Nếu Python trả về lỗi (do logic bên đó)
        if (response.data.status === "error") {
            throw new Error(response.data.message || "Lỗi mẹ nó từ lõi Python rồi");
        }

        // 5. Trả Lá Số xịn sò về cho Frontend
        return res.json({
            status: "success",
            message: "Lá số Tử Vi lấy thành công từ Core Python",
            lunarDateInfo: {
                canChiNam: lunar.getYearInGanZhi(),
                canChiThang: lunar.getMonthInGanZhi(),
                canChiNgay: lunar.getDayInGanZhi(),
                canChiGio: lunar.getTimeInGanZhi()
            },
            laso: response.data.data // Cục JSON Python vừa nhả ra
        });

    } catch (error) {
        console.error("Lỗi mẹ nó rồi:", error.message);
        res.status(500).json({ 
            error: "Hệ thống Tử Vi đang bảo trì", 
            details: error.message 
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ API Node.js Gateway đang chạy ở cổng ${PORT}!`);
    console.log(`👉 Mở link này để test: http://localhost:3001/api/astrology/info?year=1995&month=5&day=15&hour=6&gender=1`);
});