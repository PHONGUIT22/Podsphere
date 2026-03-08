// Dựa trên Hearo.Application.Common.Models.Podcast.PodcastDto
export interface PodcastDto {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  isPremium: boolean;
  categoryId: string;
  categoryName?: string; // Nếu BE có map thêm tên category
}