import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCompleteProfile } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getCourseById } from "@/lib/courseDb";
import { CourseUnavailable } from "../CourseUnavailable";
import { LearningWorkspace } from "../LearningWorkspace";

export const metadata: Metadata = {
  title: "ห้องเรียน | BeyondLab",
  description: "ดูวิดีโอบทเรียนและเอกสารประกอบคอร์ส BeyondLab",
};

export const dynamic = "force-dynamic";

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
    const course = await getCourseById(courseId, true);
    if (course.id !== courseId) notFound();
    return <LearningWorkspace course={course} studentName={studentName} studentEmail={session.email} />;
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    console.error("Unable to load course from database", error);
    return <CourseUnavailable notConfigured={false} retryHref={`/learn/${encodeURIComponent(courseId)}`} />;
  }
}
