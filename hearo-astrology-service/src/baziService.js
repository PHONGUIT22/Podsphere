// src/baziService.js
const { Solar, Lunar } = require('lunar-javascript');

const GAN_MAP = {
    '甲': { element: 'Mộc', polarity: 'Dương' }, '乙': { element: 'Mộc', polarity: 'Âm' },
    '丙': { element: 'Hỏa', polarity: 'Dương' }, '丁': { element: 'Hỏa', polarity: 'Âm' },
    '戊': { element: 'Thổ', polarity: 'Dương' }, '己': { element: 'Thổ', polarity: 'Âm' },
    '庚': { element: 'Kim', polarity: 'Dương' }, '辛': { element: 'Kim', polarity: 'Âm' },
    '壬': { element: 'Thủy', polarity: 'Dương' }, '癸': { element: 'Thủy', polarity: 'Âm' }
};

const CHI_MAP = {
    '子': { element: 'Thủy' }, '丑': { element: 'Thổ' }, '寅': { element: 'Mộc' }, '卯': { element: 'Mộc' },
    '辰': { element: 'Thổ' }, '巳': { element: 'Hỏa' }, '午': { element: 'Hỏa' }, '未': { element: 'Thổ' },
    '申': { element: 'Kim' }, '酉': { element: 'Kim' }, '戌': { element: 'Thổ' }, '亥': { element: 'Thủy' }
};

const CHI_HIDDEN_MAP = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'],
    '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'], '午': ['丁', '己'], '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

const NAP_AM_MAP = {
    '甲子': 'Hải Trung Kim', '乙丑': 'Hải Trung Kim', '丙寅': 'Lư Trung Hỏa', '丁卯': 'Lư Trung Hỏa', '戊辰': 'Đại Lâm Mộc', '己巳': 'Đại Lâm Mộc',
    '庚午': 'Lộ Bàng Thổ', '辛未': 'Lộ Bàng Thổ', '壬申': 'Kiếm Phong Kim', '癸酉': 'Kiếm Phong Kim', '甲戌': 'Sơn Đầu Hỏa', '乙亥': 'Sơn Đầu Hỏa',
    '丙子': 'Giản Hạ Thủy', '丁丑': 'Giản Hạ Thủy', '戊寅': 'Thành Đầu Thổ', '己卯': 'Thành Đầu Thổ', '庚辰': 'Bạch Lạp Kim', '辛巳': 'Bạch Lạp Kim',
    '壬午': 'Dương Liễu Mộc', '癸未': 'Dương Liễu Mộc', '甲申': 'Tuyền Trung Thủy', '乙酉': 'Tuyền Trung Thủy', '丙戌': 'Ốc Thượng Thổ', '丁亥': 'Ốc Thượng Thổ',
    '戊子': 'Tích Lịch Hỏa', '己丑': 'Tích Lịch Hỏa', '庚寅': 'Tùng Bách Mộc', '辛卯': 'Tùng Bách Mộc', '壬辰': 'Trường Lưu Thủy', '癸巳': 'Trường Lưu Thủy',
    '甲午': 'Sa Trung Kim', '乙未': 'Sa Trung Kim', '丙申': 'Sơn Hạ Hỏa', '丁酉': 'Sơn Hạ Hỏa', '戊戌': 'Bình Địa Mộc', '己亥': 'Bình Địa Mộc',
    '庚子': 'Bích Thượng Thổ', '辛丑': 'Bích Thượng Thổ', '壬寅': 'Kim Bạch Kim', '癸卯': 'Kim Bạch Kim', '甲辰': 'Phú Đăng Hỏa', '乙巳': 'Phú Đăng Hỏa',
    '丙午': 'Thiên Hà Thủy', '丁未': 'Thiên Hà Thủy', '戊申': 'Đại Trạch Thổ', '己酉': 'Đại Trạch Thổ', '庚戌': 'Thoa Xuyến Kim', '辛亥': 'Thoa Xuyến Kim',
    '壬子': 'Tang Đố Mộc', '癸丑': 'Tang Đố Mộc', '甲寅': 'Đại Khê Thủy', '乙卯': 'Đại Khê Thủy', '丙辰': 'Sa Trung Thổ', '丁巳': 'Sa Trung Thổ',
    '戊午': 'Thiên Thượng Hỏa', '己未': 'Thiên Thượng Hỏa', '庚申': 'Thạch Lựu Mộc', '辛酉': 'Thạch Lựu Mộc', '壬戌': 'Đại Hải Thủy', '癸亥': 'Đại Hải Thủy'
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

const JIA_ZI = [
    '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
    '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
    '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
    '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
    '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
    '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

const GAN_VN = { '甲':'Giáp', '乙':'Ất', '丙':'Bính', '丁':'Đinh', '戊':'Mậu', '己':'Kỷ', '庚':'Canh', '辛':'Tân', '壬':'Nhâm', '癸':'Quý' };
const CHI_VN = { '子':'Tý', '丑':'Sửu', '寅':'Dần', '卯':'Mão', '辰':'Thìn', '巳':'Tỵ', '午':'Ngọ', '未':'Mùi', '申':'Thân', '酉':'Dậu', '戌':'Tuất', '亥':'Hợi' };

const translatePillar = (p) => p && p.length === 2 ? `${GAN_VN[p[0]]} ${CHI_VN[p[1]]}` : '';

const getKhongVong = (pillar) => {
    const ganArr = Object.keys(GAN_VN);
    const chiArr = Object.keys(CHI_VN);
    const gIdx = ganArr.indexOf(pillar[0]);
    const cIdx = chiArr.indexOf(pillar[1]);
    let diff = cIdx - gIdx;
    if (diff < 0) diff += 12;
    const v1 = (diff + 10) % 12;
    const v2 = (diff + 11) % 12;
    return `${CHI_VN[chiArr[v1]]} - ${CHI_VN[chiArr[v2]]}`;
};

const getStars = (gan, chi, context) => {
    const { dayGan, yearGan, monthChi, dayChi, yearChi } = context;
    const stars = [];
    
    const thienAtMap = { '甲':['丑','未'], '戊':['丑','未'], '庚':['寅','午'], '辛':['寅','午'], '乙':['子','申'], '己':['子','申'], '壬':['卯','巳'], '癸':['卯','巳'], '丙':['亥','酉'], '丁':['亥','酉'] };
    if (thienAtMap[dayGan]?.includes(chi) || thienAtMap[yearGan]?.includes(chi)) stars.push("Thiên Ất");

    const thienDucMap = { '子':'巳', '丑':'庚', '寅':'丁', '卯':'申', '辰':'壬', '巳':'辛', '午':'亥', '未':'甲', '申':'癸', '酉':'寅', '戌':'丙', '亥':'乙' };
    if (thienDucMap[monthChi] === gan || thienDucMap[monthChi] === chi) stars.push("Thiên Đức");

    const nguyetDucMap = { '寅':'丙', '午':'丙', '戌':'丙', '申':'壬', '子':'壬', '辰':'壬', '亥':'甲', '卯':'甲', '未':'甲', '巳':'庚', '酉':'庚', '丑':'庚' };
    if (nguyetDucMap[monthChi] === gan) stars.push("Nguyệt Đức");

    const vanXuongMap = { '甲':'巳', '乙':'午', '丙':'申', '戊':'申', '丁':'酉', '己':'酉', '庚':'亥', '辛':'子', '壬':'寅', '癸':'卯' };
    if (vanXuongMap[dayGan] === chi || vanXuongMap[yearGan] === chi) stars.push("Văn Xương");

    const locMap = { '甲':'寅', '乙':'卯', '丙':'巳', '丁':'午', '戊':'巳', '己':'午', '庚':'申', '辛':'酉', '壬':'亥', '癸':'子' };
    if (locMap[dayGan] === chi) stars.push("Lộc Thần");

    const kinhDuongMap = { '甲':'卯', '乙':'辰', '丙':'午', '丁':'未', '戊':'午', '己':'未', '庚':'酉', '辛':'戌', '壬':'子', '癸':'丑' };
    if (kinhDuongMap[dayGan] === chi) stars.push("Kình Dương");

    const getTriadBase = (c) => {
        if (['申', '子', '辰'].includes(c)) return 'Thủy';
        if (['寅', '午', '戌'].includes(c)) return 'Hỏa';
        if (['巳', '酉', '丑'].includes(c)) return 'Kim';
        if (['亥', '卯', '未'].includes(c)) return 'Mộc';
        return '';
    };

    const bases = [getTriadBase(yearChi), getTriadBase(dayChi)];
    const dichMaMap = { 'Thủy':'寅', 'Hỏa':'申', 'Kim':'亥', 'Mộc':'巳' };
    if (bases.some(b => dichMaMap[b] === chi)) stars.push("Dịch Mã");

    const daoHoaMap = { 'Thủy':'酉', 'Hỏa':'Mão', 'Kim':'Ngọ', 'Mộc':'子' };
    if (bases.some(b => daoHoaMap[b] === chi)) stars.push("Đào Hoa");

    const hoaCaiMap = { 'Thủy':'辰', 'Hỏa':'戌', 'Kim':'丑', 'Mộc':'未' };
    if (bases.some(b => hoaCaiMap[b] === chi)) stars.push("Hoa Cái");

    const kiepSatMap = { 'Thủy':'巳', 'Hỏa':'亥', 'Kim':'寅', 'Mộc':'申' };
    if (bases.some(b => kiepSatMap[b] === chi)) stars.push("Kiếp Sát");

    const tuongTinhMap = { 'Thủy':'子', 'Hỏa':'午', 'Kim':'酉', 'Mộc':'卯' };
    if (bases.some(b => tuongTinhMap[b] === chi)) stars.push("Tướng Tinh");

    const taiSatMap = { 'Thủy':'午', 'Hỏa':'子', 'Kim':'卯', 'Mộc':'酉' };
    if (bases.some(b => taiSatMap[b] === chi)) stars.push("Tai Sát");

    const coQuaMap = {
        '亥':'寅戌', '子':'寅戌', '丑':'寅戌', '寅':'巳丑', '卯':'巳丑', '辰':'巳丑', 
        '巳':'申辰', '午':'申辰', '未':'申辰', '申':'亥未', '酉':'亥未', '戌':'亥未'  
    };
    const coQua = coQuaMap[yearChi];
    if (coQua) {
        if (chi === coQua[0]) stars.push("Cô Thần");
        if (chi === coQua[1]) stars.push("Quả Tú");
    }

    return [...new Set(stars)]; 
};

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

// THUẬT TOÁN ĐÁNH GIÁ ĐỘ MẠNH YẾU CỦA BÁT TỰ & THẬP THẦN
const analyzeBaziChart = (pillars, dayMasterGan) => {
    let scores = { 'Tỷ/Kiếp': 0, 'Ấn': 0, 'Thực/Thương': 0, 'Tài': 0, 'Quan/Sát': 0 };
    let totalScore = 0;

    const RELATIONS = {
        'Mộc': { 'Tỷ/Kiếp': 'Mộc', 'Thực/Thương': 'Hỏa', 'Tài': 'Thổ', 'Quan/Sát': 'Kim', 'Ấn': 'Thủy' },
        'Hỏa': { 'Tỷ/Kiếp': 'Hỏa', 'Thực/Thương': 'Thổ', 'Tài': 'Kim', 'Quan/Sát': 'Thủy', 'Ấn': 'Mộc' },
        'Thổ': { 'Tỷ/Kiếp': 'Thổ', 'Thực/Thương': 'Kim', 'Tài': 'Thủy', 'Quan/Sát': 'Mộc', 'Ấn': 'Hỏa' },
        'Kim': { 'Tỷ/Kiếp': 'Kim', 'Thực/Thương': 'Thủy', 'Tài': 'Mộc', 'Quan/Sát': 'Hỏa', 'Ấn': 'Thổ' },
        'Thủy': { 'Tỷ/Kiếp': 'Thủy', 'Thực/Thương': 'Mộc', 'Tài': 'Hỏa', 'Quan/Sát': 'Thổ', 'Ấn': 'Kim' }
    };
    const dmElement = GAN_MAP[dayMasterGan].element;
    const groupElements = RELATIONS[dmElement];

    const addScore = (gan, weight) => {
        if (!gan || gan === '?') return;
        const tg = getTenGod(gan, dayMasterGan);
        let group = '';
        if(tg.includes('Tỷ') || tg.includes('Kiếp')) group = 'Tỷ/Kiếp';
        else if(tg.includes('Thực') || tg.includes('Thương')) group = 'Thực/Thương';
        else if(tg.includes('Tài')) group = 'Tài';
        else if(tg.includes('Quan') || tg.includes('Sát')) group = 'Quan/Sát';
        else if(tg.includes('Ấn') || tg.includes('Kiêu')) group = 'Ấn';

        if(group) {
            scores[group] += weight;
            totalScore += weight;
        }
    };

    // Điểm số phân bổ (Trọng số Lệnh tháng cao nhất)
    const weights = {
        year: { gan: 10, chiMain: 10, chiSub1: 3, chiSub2: 1 },
        month: { gan: 12, chiMain: 25, chiSub1: 8, chiSub2: 3 }, 
        day: { gan: 0, chiMain: 12, chiSub1: 4, chiSub2: 1 }, // DM là 10đ cộng riêng bên dưới
        hour: { gan: 10, chiMain: 10, chiSub1: 3, chiSub2: 1 }
    };

    scores['Tỷ/Kiếp'] += 10;
    totalScore += 10;

    Object.keys(pillars).forEach(key => {
        const p = pillars[key];
        if(key !== 'day') addScore(p.gan, weights[key].gan);
        const hg = p.hiddenGan;
        if(hg[0]) addScore(hg[0].name, weights[key].chiMain);
        if(hg[1]) addScore(hg[1].name, weights[key].chiSub1);
        if(hg[2]) addScore(hg[2].name, weights[key].chiSub2);
    });

    let percentages = {};
    Object.keys(scores).forEach(k => {
        percentages[k] = Math.round((scores[k] / totalScore) * 100);
    });

    const helpDM = percentages['Tỷ/Kiếp'] + percentages['Ấn'];
    let strength = "CÂN BẰNG";
    let desc = "Bát tự tương đối hài hòa, cuộc đời bình ổn, ít sóng gió lớn. Cần dụng thần linh hoạt tùy theo đại vận.";
    
    if (helpDM >= 60) {
        strength = "THÂN VƯỢNG (MẠNH)";
        desc = "Nhật Chủ được lệnh hoặc được nhiều sinh trợ. Tính cách độc lập, tự tin, khả năng chịu áp lực tốt. Dụng thần thường là Thực/Thương, Tài, hoặc Quan/Sát để xì hơi/tỉa gọt bớt sự dư thừa.";
    } else if (helpDM <= 40) {
        strength = "THÂN NHƯỢC (YẾU)";
        desc = "Nhật Chủ thất lệnh hoặc bị khắc xết nhiều. Tính cách thận trọng, khôn khéo, hợp làm việc nhóm. Dụng thần là Ấn hoặc Tỷ/Kiếp để bồi bổ, tương trợ cho bản mệnh vững vàng.";
    }

    return { percentages, strength, desc, helpDM, groupElements };
};

const getMsFromSolar = (s) => new Date(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour(), s.getMinute(), s.getSecond()).getTime();

const processPillar = (pStr, dayMasterGan, type, context) => {
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
        truongSinh: TRUONG_SINH_TABLE[dayMasterGan]?.[chi] || '-',
        stars: getStars(gan, chi, context)
    };
};

const getBaziData = (year, month, day, hour, genderStr, viewYear) => {
    const solar = Solar.fromYmdHms(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), 0, 0);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();
    
    const gender = parseInt(genderStr) === 1 ? 'Nam' : 'Nữ';
    const dayMasterGan = lunar.getDayGan();
    const yearGan = lunar.getYearGan();
    const monthChi = lunar.getMonthZhi();
    const dayChi = lunar.getDayZhi();
    const yearChi = lunar.getYearZhi();
    
    const context = { dayGan: dayMasterGan, yearGan, monthChi, dayChi, yearChi };

    const extraInfo = {
        menhCung: translatePillar(eightChar.getMingGong()),
        thaiNguyen: translatePillar(eightChar.getTaiYuan()),
        nienKhong: getKhongVong(lunar.getYearInGanZhi()),
        nhatKhong: getKhongVong(lunar.getDayInGanZhi())
    };

    const yearPolarity = GAN_MAP[yearGan].polarity;
    const isDươngNamÂmNữ = (gender === 'Nam' && yearPolarity === 'Dương') || (gender === 'Nữ' && yearPolarity === 'Âm');

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
    const startYears = Math.floor(totalDays / 3);
    const startMonths = Math.floor((totalDays % 3) * 4);
    const startDays = Math.floor(((totalDays % 3) % (1/4)) * 120);
    const startAge = startYears + 1; 

    const monthPillar = lunar.getMonthInGanZhi();
    let currentIndex = JIA_ZI.indexOf(monthPillar);
    const majorCycles = [];

    for (let i = 0; i < 10; i++) {
        currentIndex = isDươngNamÂmNữ ? (currentIndex + 1) % 60 : (currentIndex - 1 + 60) % 60;
        const pStr = JIA_ZI[currentIndex];
        const sAge = startAge + (i * 10);
        const eAge = sAge + 9;
        const sYear = parseInt(year) + sAge;
        const eYear = sYear + 9;

        majorCycles.push({
            pillar: pStr,
            gan: pStr[0],
            chi: pStr[1],
            startAge: sAge,
            endAge: eAge,
            ageRange: `${sAge}-${eAge}t`,
            startYear: sYear,
            endYear: eYear,
            tenGod: getTenGod(pStr[0], dayMasterGan),
            element: GAN_MAP[pStr[0]].element
        });
    }

    const startViewYear = viewYear ? parseInt(viewYear) : new Date().getFullYear();
    const annualCycles = []; 

    // CHỈ CHẠY 3 VÒNG LẶP (30 NĂM LƯU NIÊN) THAY VÌ 8
    for (let row = 0; row < 3; row++) {
        const decade = [];
        for (let col = 0; col < 10; col++) {
            const curY = startViewYear + (row * 10) + col;
            const ySolar = Solar.fromYmd(curY, 6, 1);
            const yLunar = ySolar.getLunar();
            const pStr = yLunar.getYearInGanZhi();
            const gan = pStr[0];
            const chi = pStr[1];

            decade.push({
                year: curY,
                pillar: pStr,
                gan, chi,
                tenGod: getTenGod(gan, dayMasterGan),
                element: GAN_MAP[gan].element,
                chiElement: CHI_MAP[chi].element,
                napAm: NAP_AM_MAP[pStr] || ''
            });
        }
        annualCycles.push(decade); 
    }

    const pillarsProcessed = {
        year: processPillar(lunar.getYearInGanZhi(), dayMasterGan, 'year', context),
        month: processPillar(lunar.getMonthInGanZhi(), dayMasterGan, 'month', context),
        day: processPillar(lunar.getDayInGanZhi(), dayMasterGan, 'day', context),
        hour: processPillar(lunar.getTimeInGanZhi(), dayMasterGan, 'hour', context)
    };

    const analysis = analyzeBaziChart(pillarsProcessed, dayMasterGan);

    return {
        solar: { year, month, day, hour: `${hour}:00` },
        lunarDateString: `${lunar.getDay()}/${lunar.getMonth()}/${lunar.getYear()}`,
        gender,
        polarityGender: `${yearPolarity} ${gender}`,
        startAgeInfo: `${startYears} tuổi ${startMonths} tháng ${startDays} ngày (Khởi vận ${startAge} tuổi)`,
        extraInfo,
        pillars: pillarsProcessed,
        majorCycles,
        annualCycles,
        analysis, // TRẢ VỀ THÊM THÔNG TIN PHÂN TÍCH
        dayMaster: { name: dayMasterGan, element: GAN_MAP[dayMasterGan].element }
    };
};

module.exports = { getBaziData };