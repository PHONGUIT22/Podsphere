import { api } from "../lib/api";
import { UserHealthStatsDto, HealthRecommendationDto, UserJournalDto } from "../types/health";

export const healthService = {
  // 1. Lấy chỉ số sức khỏe & phân tích (vòng eo, stress, mood...)
  getStats: async () => {
    const { data } = await api.get<UserHealthStatsDto>("/health/stats");
    return data;
  },

  // 2. Lấy lời khuyên cá nhân hóa từ AI
  getRecommendations: async () => {
    const { data } = await api.get<HealthRecommendationDto>("/health/recommendations");
    return data;
  },

  // 3. Cập nhật chỉ số sức khỏe (Dùng khi m ấn lưu chỉ số ở trang TT Sức khỏe)
  updateStats: async (statsData: { moodScore: number, stressLevel: string, sleepHours: number, note?: string }) => {
    // Khớp với UpdateStatsRequest ở Backend
    const { data } = await api.post("/health/stats", statsData);
    return data;
  },

  // 4. Lấy toàn bộ danh sách nhật ký tâm trạng để hiện ở trang Lịch sử
  getJournals: async () => {
    const { data } = await api.get<UserJournalDto[]>("/health/journals");
    return data;
  },

  // 5. Thêm nhật ký mới (Khớp với CreateJournalRequest ở Backend)
  addJournal: async (journalData: { title: string, content: string, mood: string | null }) => {
    const { data } = await api.post<UserJournalDto>("/health/journals", journalData);
    return data;
  }
};