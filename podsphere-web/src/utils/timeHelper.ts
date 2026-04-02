// src/utils/timeHelper.ts

const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export function getCurrentTimeBazi() {
  const now = new Date();
  const hour = now.getHours();
  
  // Tính Địa Chi của giờ (23h-1h: Tý, 1h-3h: Sửu...)
  let branchIndex = Math.floor((hour + 1) / 2) % 12;
  
  // Lấy ngẫu nhiên Thiên Can (Vì tính chính xác Thiên Can giờ cần ngày, 
  // ở đây ta random nhanh cho Mai Hoa hoặc bạn có thể fix cứng nếu chỉ quan tâm Địa Chi)
  let stemIndex = Math.floor(Math.random() * 10); 

  return {
    timeGan: STEMS[stemIndex],
    timeZhi: BRANCHES[branchIndex]
  };
}