import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCompleteProfile } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getR2Course } from "@/lib/r2Course";
import { CourseUnavailable } from "../CourseUnavailable";
import { LearningWorkspace } from "../LearningWorkspace";

export const metadata: Metadata = {
  title: "ห้องเรียน | BeyondLab",
  description: "ดูวิดีโอบทเรียนและเอกสารประกอบคอร์ส BeyondLab",
};

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [{ courseId }, session] = await Promise.all([params, requireCompleteProfile("/learn")]);
  const studentName = session.username;

  try {
    const enrolledCourseIds = await getEnrolledCourseIds();
    if (!enrolledCourseIds.includes(courseId)) notFound();
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    console.error("Unable to check course access", error);
    return <CourseUnavailable notConfigured={false} title="ตรวจสอบสิทธิ์คอร์สไม่สำเร็จ" description="ระบบยังไม่สามารถยืนยันสิทธิ์เข้าเรียนได้ กรุณาลองใหม่อีกครั้ง" retryHref={`/learn/${encodeURIComponent(courseId)}`} />;
  }

  try {
    const course = await getR2Course();
    if (course.id !== courseId) notFound();
    return <LearningWorkspace course={course} studentName={studentName} studentEmail={session.email} />;
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    console.error("Unable to load course from R2", error);
    return <CourseUnavailable notConfigured={error instanceof Error && error.message === "R2_NOT_CONFIGURED"} retryHref={`/learn/${encodeURIComponent(courseId)}`} />;
  }
}
