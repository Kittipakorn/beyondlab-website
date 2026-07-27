import type { Metadata } from "next";
import { cookies } from "next/headers";
import { requireCompleteProfile } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getCourseCatalog } from "@/lib/courseDb";
import type { CourseEnrollment, PurchaseOrder } from "./AccountPageClient";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "บัญชีของฉัน | BeyondLab",
  description: "พื้นที่ส่วนตัวสำหรับจัดการบัญชี คอร์ส ประวัติการซื้อ และสิทธิ์สมาชิก BeyondLab",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireCompleteProfile("/account");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  let courses: CourseEnrollment[] = [];
  let orders: PurchaseOrder[] = [];

  try {
    const enrolledCourseIds = await getEnrolledCourseIds();

    if (enrolledCourseIds.length > 0) {
      const courseCatalog = await getCourseCatalog(true);
      courses = courseCatalog
        .filter((course) => enrolledCourseIds.includes(course.id))
        .map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          image: course.image,
          href: `/learn/${encodeURIComponent(course.id)}`,
          totalLessons: course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0,
          ),
        }));
    }
  } catch (error) {
    console.error("Unable to load courses for account", error);
  }

  try {
    const response = await fetch(`${backendUrl}/api/user/orders`, {
      headers: { Cookie: (await cookies()).toString() },
      cache: "no-store",
    });

    if (response.ok) {
      const data = (await response.json()) as { orders?: PurchaseOrder[] };
      orders = Array.isArray(data.orders) ? data.orders : [];
    }
  } catch (error) {
    console.error("Unable to load orders for account", error);
  }

  return (
    <AccountPageClient
      username={session.username}
      email={session.email}
      backendUrl={backendUrl}
      courses={courses}
      orders={orders}
    />
  );
}
