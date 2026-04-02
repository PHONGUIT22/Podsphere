/**
 * THUẬT TOÁN LỤC HÀO NÂNG CAO - NẠP GIÁP, PHỤC THẦN, TUẦN KHÔNG
 */

const ZHI_ELEMENTS = {
    'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Thìn': 'Thổ', 'Tỵ': 'Hỏa',
    'Ngọ': 'Hỏa', 'Mùi': 'Thổ', 'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

const LUC_THU_LIST = ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'];
const LUC_THU_START = { 'Giáp': 0, 'Ất': 0, 'Bính': 1, 'Đinh': 1, 'Mậu': 2, 'Kỷ': 3, 'Canh': 4, 'Tân': 4, 'Nhâm': 5, 'Quý': 5 };

const NAP_GIAP_RULES = {
    'Càn':  { inner: ['Giáp Tý', 'Giáp Dần', 'Giáp Thìn'], outer: ['Nhâm Ngọ', 'Nhâm Thân', 'Nhâm Tuất'], palace: 'Càn', element: 'Kim' },
    'Khảm': { inner: ['Mậu Dần', 'Mậu Thìn', 'Mậu Ngọ'], outer: ['Mậu Thân', 'Mậu Tuất', 'Mậu Tý'], palace: 'Khảm', element: 'Thủy' },
    'Cấn':  { inner: ['Bính Thìn', 'Bính Ngọ', 'Bính Thân'], outer: ['Bính Tuất', 'Bính Tý', 'Bính Dần'], palace: 'Cấn', element: 'Thổ' },
    'Chấn': { inner: ['Canh Tý', 'Canh Dần', 'Canh Thìn'], outer: ['Canh Ngọ', 'Canh Thân', 'Canh Tuất'], palace: 'Chấn', element: 'Mộc' },
    'Tốn':  { inner: ['Tân Sửu', 'Tân Hợi', 'Tân Dậu'], outer: ['Tân Mùi', 'Tân Tỵ', 'Tân Mão'], palace: 'Tốn', element: 'Mộc' },
    'Ly':   { inner: ['Kỷ Mão', 'Kỷ Sửu', 'Kỷ Hợi'], outer: ['Kỷ Dậu', 'Kỷ Mùi', 'Kỷ Tỵ'], palace: 'Ly', element: 'Hỏa' },
    'Khôn': { inner: ['Ất Mùi', 'Ất Tỵ', 'Ất Mão'], outer: ['Quý Sửu', 'Quý Hợi', 'Quý Dậu'], palace: 'Khôn', element: 'Thổ' },
    'Đoài': { inner: ['Đinh Tỵ', 'Đinh Mão', 'Đinh Sửu'], outer: ['Đinh Hợi', 'Đinh Dậu', 'Đinh Mùi'], palace: 'Đoài', element: 'Kim' }
};

// 1. Tính Tuần Không dựa trên Can Chi ngày
function getTuanKhong(dayGanZhi) {
    const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    const stems = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const dG = dayGanZhi.substring(0, 1);
    const dZ = dayGanZhi.substring(1, 2);
    let offset = (branches.indexOf(dZ) - stems.indexOf(dG) + 12) % 12;
    return [branches[(offset + 10) % 12], branches[(offset + 11) % 12]];
}

function getLucThan(cungElement, haoElement) {
    if (cungElement === haoElement) return 'Huynh Đệ';
    const relations = {
        'Kim': { 'Thủy': 'Tử Tôn', 'Mộc': 'Thê Tài', 'Hỏa': 'Quan Quỷ', 'Thổ': 'Phụ Mẫu' },
        'Thủy': { 'Mộc': 'Tử Tôn', 'Hỏa': 'Thê Tài', 'Thổ': 'Quan Quỷ', 'Kim': 'Phụ Mẫu' },
        'Mộc': { 'Hỏa': 'Tử Tôn', 'Thổ': 'Thê Tài', 'Kim': 'Quan Quỷ', 'Thủy': 'Phụ Mẫu' },
        'Hỏa': { 'Thổ': 'Tử Tôn', 'Kim': 'Thê Tài', 'Thủy': 'Quan Quỷ', 'Mộc': 'Phụ Mẫu' },
        'Thổ': { 'Kim': 'Tử Tôn', 'Thủy': 'Thê Tài', 'Mộc': 'Quan Quỷ', 'Hỏa': 'Phụ Mẫu' }
    };
    return relations[cungElement][haoElement];
}

// Bảng tra cứu Palace (Cung) cho 64 Quẻ (giữ nguyên BAST_GUA_INFO của bạn)
const BAST_GUA_INFO = {
    1: ['Bát Thuần Càn', 'Càn', 'Kim', 6], 2: ['Bát Thuần Khôn', 'Khôn', 'Thổ', 6], 
    3: ['Thủy Lôi Truân', 'Khảm', 'Thủy', 2], 4: ['Sơn Thủy Mông', 'Ly', 'Hỏa', 4],
    5: ['Thủy Thiên Nhu', 'Khôn', 'Thổ', 4], 6: ['Thiên Thủy Tụng', 'Ly', 'Hỏa', 4],
    7: ['Địa Thủy Sư', 'Khảm', 'Thủy', 2], 8: ['Thủy Địa Tỷ', 'Khôn', 'Thổ', 3],
    9: ['Phong Thiên Tiểu Súc', 'Tốn', 'Mộc', 1], 10: ['Thiên Trạch Lý', 'Cấn', 'Thổ', 5],
    11: ['Địa Thiên Thái', 'Khôn', 'Thổ', 3], 12: ['Thiên Địa Bĩ', 'Càn', 'Kim', 3],
    13: ['Thiên Hỏa Đồng Nhân', 'Ly', 'Hỏa', 2], 14: ['Hỏa Thiên Đại Hữu', 'Càn', 'Kim', 3],
    15: ['Địa Sơn Khiêm', 'Đoài', 'Kim', 5], 16: ['Lôi Địa Dự', 'Chấn', 'Mộc', 1],
    17: ['Trạch Lôi Tùy', 'Chấn', 'Mộc', 3], 18: ['Sơn Phong Cổ', 'Tốn', 'Mộc', 3],
    19: ['Địa Trạch Lâm', 'Khôn', 'Thổ', 2], 20: ['Phong Địa Quan', 'Càn', 'Kim', 4],
    21: ['Hỏa Lôi Phệ Hạp', 'Tốn', 'Mộc', 5], 22: ['Sơn Hỏa Bí', 'Cấn', 'Thổ', 2],
    23: ['Sơn Địa Bác', 'Càn', 'Kim', 5], 24: ['Địa Lôi Phục', 'Khôn', 'Thổ', 1],
    25: ['Thiên Lôi Vô Vọng', 'Tốn', 'Mộc', 4], 26: ['Sơn Thiên Đại Súc', 'Cấn', 'Thổ', 2],
    27: ['Sơn Lôi Di', 'Tốn', 'Mộc', 4], 28: ['Trạch Phong Đại Quá', 'Chấn', 'Mộc', 4],
    29: ['Bát Thuần Khảm', 'Khảm', 'Thủy', 6], 30: ['Bát Thuần Ly', 'Ly', 'Hỏa', 6],
    31: ['Trạch Sơn Hàm', 'Đoài', 'Kim', 3], 32: ['Lôi Phong Hằng', 'Chấn', 'Mộc', 3],
    33: ['Thiên Sơn Độn', 'Càn', 'Kim', 2], 34: ['Lôi Thiên Đại Tráng', 'Khôn', 'Thổ', 4],
    35: ['Hỏa Địa Tấn', 'Càn', 'Kim', 4], 36: ['Địa Hỏa Minh Di', 'Khảm', 'Thủy', 4],
    37: ['Phong Hỏa Gia Nhân', 'Tốn', 'Mộc', 2], 38: ['Hỏa Trạch Khuê', 'Cấn', 'Thổ', 4],
    39: ['Thủy Sơn Kiển', 'Đoài', 'Kim', 4], 40: ['Lôi Thủy Giải', 'Chấn', 'Mộc', 2],
    41: ['Sơn Trạch Tổn', 'Cấn', 'Thổ', 3], 42: ['Phong Lôi Ích', 'Tốn', 'Mộc', 3],
    43: ['Trạch Thiên Quải', 'Khôn', 'Thổ', 5], 44: ['Thiên Phong Cấu', 'Càn', 'Kim', 1],
    45: ['Trạch Địa Tụy', 'Đoài', 'Kim', 2], 46: ['Địa Phong Thăng', 'Chấn', 'Mộc', 4],
    47: ['Trạch Thủy Khốn', 'Đoài', 'Kim', 1], 48: ['Thủy Phong Tỉnh', 'Chấn', 'Mộc', 5],
    49: ['Trạch Hỏa Cách', 'Khảm', 'Thủy', 4], 50: ['Hỏa Phong Đỉnh', 'Ly', 'Hỏa', 2],
    51: ['Bát Thuần Chấn', 'Chấn', 'Mộc', 6], 52: ['Bát Thuần Cấn', 'Cấn', 'Thổ', 6],
    53: ['Phong Sơn Tiệm', 'Cấn', 'Thổ', 3], 54: ['Lôi Trạch Quy Muội', 'Đoài', 'Kim', 4],
    55: ['Lôi Hỏa Phong', 'Khảm', 'Thủy', 5], 56: ['Hỏa Sơn Lữ', 'Ly', 'Hỏa', 5],
    57: ['Bát Thuần Tốn', 'Tốn', 'Mộc', 6], 58: ['Bát Thuần Đoài', 'Đoài', 'Kim', 6],
    59: ['Phong Thủy Hoán', 'Ly', 'Hỏa', 5], 60: ['Thủy Trạch Tiết', 'Khảm', 'Thủy', 1],
    61: ['Phong Trạch Trung Phu', 'Cấn', 'Thổ', 4], 62: ['Lôi Sơn Tiểu Quá', 'Đoài', 'Kim', 4],
    63: ['Thủy Hỏa Ký Tế', 'Khảm', 'Thủy', 3], 64: ['Hỏa Thủy Vị Tế', 'Ly', 'Hỏa', 3]
};

function calculateLucHao(hexagramId, lowerName, upperName, dayGanZhi, basePalace = null) {
    const info = BAST_GUA_INFO[hexagramId];
    const palaceName = basePalace || info[1];
    const cungElement = NAP_GIAP_RULES[palaceName].element;
    const dayGan = dayGanZhi.substring(0, 1);
    const tuanKhong = getTuanKhong(dayGanZhi);
    
    const haoThe = info[3];
    const haoUng = haoThe > 3 ? haoThe - 3 : haoThe + 3;
    const startIndexLucThu = LUC_THU_START[dayGan] || 0;

    const napFull = [...NAP_GIAP_RULES[lowerName].inner, ...NAP_GIAP_RULES[upperName].outer];
    
    // Tìm Phục Thần: Lấy nạp giáp của quẻ Bát Thuần cùng Cung
    const batThuanNap = [...NAP_GIAP_RULES[palaceName].inner, ...NAP_GIAP_RULES[palaceName].outer];
    
    let lines = [];
    let hienDienLucThan = new Set();

    // Vòng 1: Tính nạp giáp và lục thân hiện tại
    for (let i = 0; i < 6; i++) {
        const chi = napFull[i].split(' ')[1];
        const el = ZHI_ELEMENTS[chi];
        const lt = getLucThan(cungElement, el);
        hienDienLucThan.add(lt);
        
        lines.push({
            position: i + 1,
            theUng: (i + 1) === haoThe ? 'Thế' : (i + 1) === haoUng ? 'Ứng' : '',
            lucThan: lt,
            canChi: `${napFull[i].split(' ')[1]}-${el}`,
            lucThu: LUC_THU_LIST[(startIndexLucThu + i) % 6],
            isTuanKhong: tuanKhong.includes(chi),
            phucThan: null
        });
    }

    // Vòng 2: Tìm Phục Thần cho những Lục Thân bị thiếu
    const allLucThan = ['Phụ Mẫu', 'Huynh Đệ', 'Tử Tôn', 'Thê Tài', 'Quan Quỷ'];
    allLucThan.forEach(lt => {
        if (!hienDienLucThan.has(lt)) {
            for (let j = 0; j < 6; j++) {
                const chiBatThuan = batThuanNap[j].split(' ')[1];
                if (getLucThan(cungElement, ZHI_ELEMENTS[chiBatThuan]) === lt) {
                    lines[j].phucThan = `${lt} - ${chiBatThuan}`;
                }
            }
        }
    });

    return { lines, cungElement, palaceName, tuanKhong: tuanKhong.join(', ') };
}

module.exports = { calculateLucHao };