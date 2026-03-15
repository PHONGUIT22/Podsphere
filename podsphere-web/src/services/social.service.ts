import { api } from "../lib/api";
import { ReviewDto, CreateReviewDto, CommentDto, CreateCommentDto, BlogDto } from "../types/social";

export const socialService = {
  // --- Review ---
  getReviewsByTarget: async (targetId: string) => {
    const { data } = await api.get<ReviewDto[]>(`/reviews/${targetId}`);
    return data;
  },

  addReview: async (review: CreateReviewDto) => {
    const { data } = await api.post<ReviewDto>("/reviews", review);
    return data;
  },

    // --- Comment ---
    // Trong src/services/social.service.ts
  addComment: async (episodeId: string, comment: CreateCommentDto) => {
    // Đổi từ /episodes thành /podcasts để khớp với BE PodcastsController
    const { data } = await api.post<CommentDto>(`/podcasts/${episodeId}/comments`, comment);
    return data;
  },

  // --- Blog ---
  getAllBlogs: async () => {
    const { data } = await api.get<BlogDto[]>("/blogs");
    return data;
  }
};