import { create } from 'zustand';
import { EpisodeDto } from '@/types/podcast';
import { historyService } from "@/services/history.service"; // Đã có import chuẩn

interface PlayerState {
  currentEpisode: EpisodeDto | null;
  isPlaying: boolean;
  queue: EpisodeDto[];
  setCurrentEpisode: (episode: EpisodeDto) => void;
  togglePlay: () => void;
  setPlaying: (status: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: null,
  isPlaying: false,
  queue: [],

  // SỬA LẠI HÀM NÀY:
  setCurrentEpisode: (episode) => {
    // 1. Cập nhật State để Player ở dưới đáy màn hình hiện lên và hát ngay
    set({ currentEpisode: episode, isPlaying: true });

    // 2. TỰ ĐỘNG GỌI API LƯU LỊCH SỬ
    // Dùng .catch để nếu user chưa login (không có token) thì nó cũng không làm crash app
    historyService.addToHistory(episode.id).catch((err) => {
       console.warn("Lịch sử chưa được lưu (User có thể chưa đăng nhập):", err.message);
    });
  },
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaying: (status) => set({ isPlaying: status }),
}));