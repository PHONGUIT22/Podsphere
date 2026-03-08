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
  addComment: async (episodeId: string, comment: CreateCommentDto) => {
    const { data } = await api.post<CommentDto>(`/episodes/${episodeId}/comments`, comment);
    return data;
  },

  // --- Blog ---
  getAllBlogs: async () => {
    const { data } = await api.get<BlogDto[]>("/blogs");
    return data;
  }
};