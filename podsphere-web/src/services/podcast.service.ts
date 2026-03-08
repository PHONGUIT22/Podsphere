import { api } from "../lib/api"; //
import { PodcastDto } from "../types/podcast";

export const podcastService = {
  // Gọi tới GET /api/podcasts bên BE
  getAllPodcasts: async () => {
    const response = await api.get<PodcastDto[]>("/podcasts");
    return response.data;
  },
};