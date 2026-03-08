// PodcastDto.cs
export interface PodcastDto {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    isPremium: boolean;
    tags: string | null;
    categoryId: string;
    categoryName: string | null;
}

// EpisodeDto.cs
export interface EpisodeDto {
    id: string;
    title: string;
    audioUrl: string;
    duration: number;
    order: number;
    isExclusive: boolean;
    podcastId: string;
}

// CategoryDto.cs
export interface CategoryDto {
    id: string;
    name: string;
    slug: string;
}