import type { Metadata } from "next";
import { getCourseCatalog } from "@/lib/courseDb";
import { CourseCatalog } from "./CourseCatalog";

export const metadata: Metadata = {
  title: "คอร์สเรียน | BeyondLab",
  description: "ค้นหาและเลือกคอร์สเรียนเขียนโปรแกรมและเทคโนโลยีจาก BeyondLab",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourseCatalog().catch((error) => {
    console.error("Unable to load course catalog", error);
    return [];
  });
  return <CourseCatalog courses={courses.filter((course) => !course.hidden)} />;
}
