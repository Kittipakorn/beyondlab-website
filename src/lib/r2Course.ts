import "server-only";

import { getCourseById } from "./courseDb";

export { type CourseLesson, type CourseModule, type CourseRecord as R2Course } from "./courseDb";
export { getCourseById, getCourseCatalog } from "./courseDb";

export async function getR2Course(courseId: string) {
  return getCourseById(courseId);
}
