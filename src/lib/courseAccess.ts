import "server-only";

import { cookies } from "next/headers";

type CourseAccessResponse = {
  courseIds?: unknown;
};

export async function getEnrolledCourseIds() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${backendUrl}/api/user/courses`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`COURSE_ACCESS_${response.status}`);
  }

  const data = (await response.json()) as CourseAccessResponse;
  if (!Array.isArray(data.courseIds)) {
    throw new Error("COURSE_ACCESS_INVALID_RESPONSE");
  }

  return [
    ...new Set(
      data.courseIds.filter(
        (courseId): courseId is string =>
          typeof courseId === "string" && Boolean(courseId.trim()),
      ),
    ),
  ];
}
