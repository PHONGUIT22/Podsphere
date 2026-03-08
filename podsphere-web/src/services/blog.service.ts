import { api } from "../lib/api";
import { BlogDto } from "../types/social";

export const blogService = {
  // Lấy tất cả bài blog
  getAllBlogs: async () => {
    const { data } = await api.get<BlogDto[]>("/blogs");
    return data;
  },

  // Lấy chi tiết một bài blog theo Slug (để làm URL đẹp) hoặc ID
  getBlogBySlug: async (slug: string) => {
    const { data } = await api.get<BlogDto>(`/blogs/${slug}`);
    return data;
  }
};