import { api } from "../lib/api";
import { MeditationDto } from "../types/health";

export const meditationService = {
  // Lấy danh sách các bài thiền theo mục tiêu (ví dụ: "Dễ ngủ", "Giảm stress")
  getMeditations: async (target?: string) => {
    const url = target ? `/meditations?target=${target}` : "/meditations";
    const { data } = await api.get<MeditationDto[]>(url);
    return data;
  },

  // Lấy chi tiết một bài thiền
  getMeditationById: async (id: string) => {
    const { data } = await api.get<MeditationDto>(`/meditations/${id}`);
    return data;
  }
};