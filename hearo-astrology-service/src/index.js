// src/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Solar } = require('lunar-javascript');

const app = express();
app.use(cors());
app.use(express.json());

const PYTHON_API_URL = 'http://127.0.0.1:8000/api/lap-la-so';

app.get('/api/astrology/info', async (req, res) => {
    try {
        // Nhận thêm `viewYear` từ request
        let { year, month, day, hour, gender, viewYear } = req.query;

        if (!year || !month || !day || !hour || gender === undefined) {
            return res.status(400).json({ error: "Gửi thiếu params rồi thằng lỏi!" });
        }

        // Lấy mặc định năm nay nếu Frontend không gửi viewYear
        const namXemHan = viewYear ? parseInt(viewYear) : new Date().getFullYear();

        const solar = Solar.fromYmdHms(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), 0, 0);
        const lunar = solar.getLunar();
        
        const pythonGio = lunar.getTimeZhiIndex() + 1; 
        const pythonGioiTinh = parseInt(gender) === 1 ? 1 : -1;

        // Bắn lệnh qua Server Python lấy lá số, KÈM NAM_XEM
        const response = await axios.get(PYTHON_API_URL, {
            params: {
                nam: parseInt(year),
                thang: parseInt(month),
                ngay: parseInt(day),
                gio: pythonGio,
                gioi_tinh: pythonGioiTinh,
                nam_xem: namXemHan // TRUYỀN NĂM XEM CHO PYTHON
            }
        });

        if (response.data.status === "error") {
            throw new Error(response.data.message || "Lỗi mẹ nó từ lõi Python rồi");
        }

        return res.json({
            status: "success",
            message: "Lá số Tử Vi lấy thành công từ Core Python",
            lunarDateInfo: {
                canChiNam: lunar.getYearInGanZhi(),
                canChiThang: lunar.getMonthInGanZhi(),
                canChiNgay: lunar.getDayInGanZhi(),
                canChiGio: lunar.getTimeInGanZhi()
            },
            laso: response.data.data 
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
});