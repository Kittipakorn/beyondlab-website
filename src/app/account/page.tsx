import type { Metadata } from "next";
import { requireCompleteProfile } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getR2Course } from "@/lib/r2Course";
import type { CourseEnrollment } from "./AccountPageClient";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "บัญชีของฉัน | BeyondLab",
  description: "พื้นที่ส่วนตัวสำหรับจัดการบัญชี คอร์ส ประวัติการซื้อ และสิทธิ์สมาชิก BeyondLab",
};

export default async function AccountPage() {
  const session = await requireCompleteProfile("/account");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  let courses: CourseEnrollment[] = [];

  try {
    const enrolledCourseIds = await getEnrolledCourseIds();

    if (enrolledCourseIds.length > 0) {
      const course = await getR2Course();

      if (enrolledCourseIds.includes(course.id)) {
        courses = [
          {
            id: course.id,
            title: course.title,
            description: course.description,
            image: "/courses/zero-to-code.png",
            href: `/learn/${encodeURIComponent(course.id)}`,
            totalLessons: course.modules.reduce(
              (total, module) => total + module.lessons.length,
              0,
            ),
          },
        ];
      }
    }
  } catch (error) {
    console.error("Unable to load courses for account", error);
  }

  return (
    <AccountPageClient
      username={session.username}
      email={session.email}
      backendUrl={backendUrl}
      courses={courses}
    />
  );
}
