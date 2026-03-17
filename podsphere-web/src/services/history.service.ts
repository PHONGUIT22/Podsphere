import { api } from "../lib/api";
import { EpisodeDto } from "../types/podcast";

export const historyService = {
  // Gọi cái này mỗi khi thằng người dùng nhấn nút PLAY
  addToHistory: async (episodeId: string) => {
    return await api.post(`/history/${episodeId}`);
  },

  // Lấy danh sách để hiện lên trang "Gần đây"
  getMyHistory: async () => {
    const { data } = await api.get<EpisodeDto[]>("/history");
    return data;
  }
};