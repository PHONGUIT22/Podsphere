// CourseDto.cs
export interface CourseDto {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    price: number;
    salePrice: number;
}

// LessonDto.cs
export interface LessonDto {
    id: string;
    title: string;
    videoUrl: string | null;
    audioUrl: string | null;
    workbookUrl: string | null;
    order: number;
    courseId: string;
    courseTitle: string | null;
}

// UserCourseDto.cs
export interface UserCourseDto {
    userId: string;
    courseId: string;
    courseTitle: string | null;
    purchaseDate: string;
    progressPercent: number;
}