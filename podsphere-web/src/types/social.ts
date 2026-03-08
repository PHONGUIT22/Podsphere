// ReviewDto.cs
export interface ReviewDto {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    userId: string;
    userUsername: string | null;
    podcastId: string | null;
    podcastTitle: string | null;
    courseId: string | null;
    courseTitle: string | null;
}

// CreateReviewDto.cs
export interface CreateReviewDto {
    targetId: string;
    rating: number;
    comment: string;
}

// CommentDto.cs
export interface CommentDto {
    id: string;
    content: string;
    timestamp: number;
    createdAt: string;
    userId: string;
    userUsername: string | null;
    userAvatar: string | null;
}

// CreateCommentDto.cs
export interface CreateCommentDto {
    content: string;
    timestamp: number;
}

// BlogDto.cs
export interface BlogDto {
    id: string;
    title: string;
    content: string;
    thumbnail: string | null;
    slug: string;
    authorId: string;
    authorFullName: string | null;
}