import type { Metadata } from "next";
import { requireCompleteProfile } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getCourseCatalog } from "@/lib/courseDb";
import { CourseLibrary } from "./CourseLibrary";
import { CourseUnavailable } from "./CourseUnavailable";
import { EmptyCourseLibrary } from "./EmptyCourseLibrary";

export const metadata: Metadata = {
  title: "คอร์สของฉัน | BeyondLab",
  description: "เลือกคอร์สและกลับมาเรียนต่อในห้องเรียน BeyondLab",
};

export const dynamic = "force-dynamic";

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
    const courseCatalog = await getCourseCatalog(true);
    const enrolledCourses = courseCatalog.filter((course) => enrolledCourseIds.includes(course.id));
    if (enrolledCourses.length === 0) {
      return <EmptyCourseLibrary studentName={session.username} />;
    }
    return <CourseLibrary courses={enrolledCourses} studentName={session.username} />;
  } catch (error) {
    console.error("Unable to load course library from database", error);
    return <CourseUnavailable notConfigured={false} />;
  }
}
