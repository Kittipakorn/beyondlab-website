import type { Metadata } from "next";
import { courses } from "@/app/components/beyondlab/data";
import { CourseCatalog } from "./CourseCatalog";

export const metadata: Metadata = {
  title: "คอร์สเรียน | BeyondLab",
  description: "ค้นหาและเลือกคอร์สเรียนเขียนโปรแกรมและเทคโนโลยีจาก BeyondLab",
};

export default function CoursesPage() {
  return <CourseCatalog courses={courses} />;
}
