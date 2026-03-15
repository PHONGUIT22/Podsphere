import { CommentDto } from "@/types/social";
import { api } from "../lib/api";
import { PodcastDto, EpisodeDto, CategoryDto } from "../types/podcast";

export const podcastService = {
  // Lấy toàn bộ danh sách Podcast
  getAllPodcasts: async () => {
    const { data } = await api.get<PodcastDto[]>("/podcasts");
    return data;
  },

  // Lấy chi tiết 1 Podcast theo ID
  getPodcastById: async (id: string) => {
    const { data } = await api.get<PodcastDto>(`/podcasts/${id}`);
    return data;
  },

  // Lấy danh sách các tập của một Podcast
  getEpisodesByPodcastId: async (podcastId: string) => {
    const { data } = await api.get<EpisodeDto[]>(`/podcasts/${podcastId}/episodes`);
    return data;
  },

  // Lấy danh sách các danh mục (Category)
  getCategories: async () => {
    const { data } = await api.get<CategoryDto[]>("/categories");
    return data;
  },
  getRecommendedPodcasts: async () => {
    // Gọi đến endpoint [HttpGet("recommended")] trong PodcastsController.cs
    const { data } = await api.get<PodcastDto[]>("/podcasts/recommended");
    return data;
  },
  getCommentsByEpisodeId: async (episodeId: string) => {
    const { data } = await api.get<CommentDto[]>(`/podcasts/episodes/${episodeId}/comments`);
    return data;
  }
  
};