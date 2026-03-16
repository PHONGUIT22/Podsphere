// src/services/favorite.service.ts
import { api } from "../lib/api";
import { PodcastDto } from "../types/podcast";

export const favoriteService = {
  // Thêm hoặc Xóa khỏi danh sách yêu thích (Toggle)
  togglePodcastFavorite: async (podcastId: string) => {
    const { data } = await api.post<{ message: string }>(`/favorites/podcast/${podcastId}`);
    return data;
  },

  // Lấy toàn bộ danh sách podcast đã thích
  getMyFavoritePodcasts: async () => {
    const { data } = await api.get<PodcastDto[]>("/favorites/podcasts");
    return data;
  },
  // Thêm hàm lưu/bỏ lưu tập podcast
  toggleEpisodeFavorite: async (episodeId: string) => {
    const { data } = await api.post<{ message: string }>(`/favorites/episode/${episodeId}`);
    return data;
  }
};