import type { Metadata } from "next";
import { requireCompleteProfile } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getR2Course } from "@/lib/r2Course";
import { CourseLibrary } from "./CourseLibrary";
import { CourseUnavailable } from "./CourseUnavailable";
import { EmptyCourseLibrary } from "./EmptyCourseLibrary";

export const metadata: Metadata = {
  title: "คอร์สของฉัน | BeyondLab",
  description: "เลือกคอร์สและกลับมาเรียนต่อในห้องเรียน BeyondLab",
};

export default async function LearnPage() {
  const session = await requireCompleteProfile("/learn");

  let enrolledCourseIds: string[];
  try {
    enrolledCourseIds = await getEnrolledCourseIds();
  } catch (error) {
    console.error("Unable to check course access", error);
    return <CourseUnavailable notConfigured={false} title="ตรวจสอบสิทธิ์คอร์สไม่สำเร็จ" description="ระบบยังไม่สามารถตรวจสอบคอร์สของบัญชีนี้ได้ กรุณาลองใหม่อีกครั้ง" />;
  }

  if (enrolledCourseIds.length === 0) {
    return <EmptyCourseLibrary studentName={session.username} />;
  }

  try {
    const course = await getR2Course();
    if (!enrolledCourseIds.includes(course.id)) {
      return <EmptyCourseLibrary studentName={session.username} />;
    }
    return <CourseLibrary course={course} studentName={session.username} />;
  } catch (error) {
    console.error("Unable to load course library from R2", error);
    return <CourseUnavailable notConfigured={error instanceof Error && error.message === "R2_NOT_CONFIGURED"} />;
  }
}
