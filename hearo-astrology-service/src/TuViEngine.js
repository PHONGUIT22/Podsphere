// src/TuViEngine.js
const { CHI, CAN } = require('./constants');
const { anChinhTinh } = require('./star_modules/mainStars');
const { anSaoThangGio } = require('./star_modules/monthHourStars');
const { anSaoCanNam } = require('./star_modules/yearStemStars');
const { anSaoChiNam } = require('./star_modules/yearBranchStars');
const { anVongTrangSinh, anSaoTuan } = require('./star_modules/lifeCycleStars'); 

class TuViEngine {
    constructor() {
        this.palaces = [];
        this.cuc = 0;
        this.canNam = "";
        this.chiNam = "";
    }

    setupPalaces(thangAm, gioAmIdx) {
        let menhIdx = (2 + thangAm - 1 - gioAmIdx + 12) % 12;
        let thanIdx = (2 + thangAm - 1 + gioAmIdx) % 12;
        const palaceNames = ["Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc", "Thiên Di", "Giải Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"];
        
        this.palaces = [];
        for (let i = 0; i < 12; i++) {
            let nameIdx = (i - menhIdx + 12) % 12;
            this.palaces.push({
                chi: CHI[i],
                name: palaceNames[nameIdx],
                isThan: i === thanIdx,
                stars: [],
                tuanTriet: [] // BẮT BUỘC PHẢI KHỞI TẠO Ở ĐÂY
            });
        }
        return menhIdx;
    }

    addStar(viTri, tenSao, loai = 'stars') {
        // Fix lỗi NaN: nếu viTri không phải số, thoát luôn
        if (isNaN(viTri)) return; 

        let idx = (Math.floor(viTri) % 12 + 12) % 12;
        if (loai === 'tuanTriet') {
            this.palaces[idx].tuanTriet.push(tenSao);
        } else {
            this.palaces[idx].stars.push(tenSao);
        }
    }

    build(lunar, menhIdx, isMale) {
            // 1. DỊCH CAN NĂM SANG TIẾNG VIỆT (Giáp, Ất...)
            const canHan = lunar.getYearGan(); 
            const canVietNames = {
                '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu', 
                '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý'
            };
            this.canNam = canVietNames[canHan]; 

            // 2. DỊCH CHI NĂM SANG TIẾNG VIỆT (Tý, Sửu...) - CHỖ NÀY MÀY THIẾU NÈ!
            const chiHan = lunar.getYearZhi();
            const chiVietNames = {
                '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', 
                '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', 
                '戌': 'Tuất', '亥': 'Hợi'
            };
            this.chiNam = chiVietNames[chiHan]; // Đã định nghĩa chiNam

            // 3. Lấy các thông số phụ trợ
            const chiMenh = CHI[menhIdx];
            const ngayAm = lunar.getDay();
            const thangAm = lunar.getMonth();
            const gioAmIdx = lunar.getTimeZhiIndex();

            // 4. GỌI CÁC MODULE BẮN SAO (Dùng đúng các biến đã khai báo ở trên)
            this.cuc = anChinhTinh(this, this.canNam, chiMenh, ngayAm);
            anSaoThangGio(this, thangAm, gioAmIdx);
            anSaoCanNam(this, this.canNam);
            anSaoChiNam(this, this.chiNam); // Hết lỗi ReferenceError
            anVongTrangSinh(this, this.cuc, isMale, this.canNam);
            anSaoTuan(this, this.canNam, this.chiNam);
        }

    getLaSo() {
        const result = {};
        this.palaces.forEach(p => {
            result[p.chi] = { 
                name: p.name, 
                isThan: p.isThan, 
                stars: p.stars,
                tuanTriet: p.tuanTriet
            };
        });
        return { cuc: this.cuc, palaces: result };
    }
}

module.exports = TuViEngine;