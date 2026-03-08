import { api } from "../lib/api";
import { CourseDto, LessonDto, UserCourseDto } from "../types/course";

export const courseService = {
  // Lấy danh sách tất cả khóa học
  getAllCourses: async () => {
    const { data } = await api.get<CourseDto[]>("/courses");
    return data;
  },

  // Lấy danh sách bài học của một khóa
  getLessonsByCourseId: async (courseId: string) => {
    const { data } = await api.get<LessonDto[]>(`/courses/${courseId}/lessons`);
    return data;
  },

  // Lấy danh sách các khóa học mà User hiện tại đã mua/đăng ký
  getMyCourses: async () => {
    const { data } = await api.get<UserCourseDto[]>("/courses/my-courses");
    return data;
  }
};