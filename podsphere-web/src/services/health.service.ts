import { api } from "../lib/api";
import { UserHealthStatsDto, HealthRecommendationDto, UserJournalDto } from "../types/health";

export const healthService = {
  // Lấy chỉ số sức khỏe (vòng eo, giấc ngủ, tâm trạng...)
  getStats: async () => {
    const { data } = await api.get<UserHealthStatsDto>("/health/stats");
    return data;
  },

  // BE sẽ phân tích chỉ số để quăng ra lời khuyên (Advice)
  getRecommendations: async () => {
    const { data } = await api.get<HealthRecommendationDto>("/health/recommendations");
    return data;
  },

  // Lấy nhật ký tâm trạng
  getJournals: async () => {
    const { data } = await api.get<UserJournalDto[]>("/health/journals");
    return data;
  },
  // THÊM HÀM NÀY VÀO ĐỂ HẾT LỖI
  addJournal: async (journalData: { title: string, content: string, mood: string | null }) => {
    const { data } = await api.post<UserJournalDto>("/health/journals", journalData);
    return data;
  }
};