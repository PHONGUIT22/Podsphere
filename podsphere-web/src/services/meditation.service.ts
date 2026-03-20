import { api } from "../lib/api";
import { MeditationDto } from "../types/health";
export type { MeditationDto } from "../types/health"; 

export const meditationService = {
  getMeditationByTarget: async (target: string) => {
    try {
      // 1. Backend trả về List (Mảng), nên ta để kiểu là <MeditationDto[]>
      const { data } = await api.get<MeditationDto[]>(`/meditation/search?target=${target}`);
      
      // 2. Kiểm tra nếu mảng có dữ liệu thì lấy thằng đầu tiên
      if (data && data.length > 0) {
        return data[0];
      }
      
      // 3. Nếu mảng rỗng [], gọi API lấy tất cả để chữa cháy (Fallback)
      const all = await api.get<MeditationDto[]>("/meditation");
      return all.data.length > 0 ? all.data[0] : null;

    } catch (error) {
      console.error("Lỗi lấy bài thiền:", error);
      return null;
    }
  },
  
  getAll: async () => {
    const { data } = await api.get<MeditationDto[]>("/meditation");
    return data;
  }
};