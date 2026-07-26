import "server-only";
import { cookies } from "next/headers";

export type CourseResource = {
  label: string;
  url: string;
};

export type CourseLesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: CourseResource[];
  videoKey: string | undefined;
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type CourseRecord = {
  id: string;
  title: string;
  label: string;
  subtitle: string;
  description: string;
  audience: string;
  format: string;
  price: string;
  priceAmount: number;
  originalPrice: string;
  duration: string;
  students: string;
  image: string;
  cta: string;
  href: string;
  paymentHref: string;
  status: "open" | "soon";
  hidden?: boolean;
  points: string[];
  instructor: string;
  modules: CourseModule[];
};

type CourseListResponse = {
  courses?: unknown;
};

type CourseResponse = {
  course?: unknown;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

async function getCookieHeader() {
  const store = await cookies();
  return store
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toCourseRecord(value: unknown): CourseRecord | null {
  if (!isObject(value)) return null;

  const modules = Array.isArray(value.modules)
    ? value.modules
        .map((module) => {
          if (!isObject(module) || !Array.isArray(module.lessons)) return null;
          return {
            id: typeof module.id === "string" ? module.id : "",
            title: typeof module.title === "string" ? module.title : "",
            lessons: module.lessons
              .map((lesson) => {
                if (!isObject(lesson)) return null;
                const resources = Array.isArray(lesson.resources)
                  ? lesson.resources
                      .map((resource) => {
                        if (!isObject(resource)) return null;
                        return {
                          label: typeof resource.label === "string" ? resource.label : "",
                          url: typeof resource.url === "string" ? resource.url : "",
                        };
                      })
                      .filter((resource): resource is CourseResource => Boolean(resource?.label && resource?.url))
                  : [];
                return {
                  id: typeof lesson.id === "string" ? lesson.id : "",
                  title: typeof lesson.title === "string" ? lesson.title : "",
                  description: typeof lesson.description === "string" ? lesson.description : "",
                  duration: typeof lesson.duration === "string" ? lesson.duration : "",
                  resources,
                  videoKey: typeof lesson.videoKey === "string" ? lesson.videoKey : undefined,
                };
              })
              .filter((lesson): lesson is CourseLesson => Boolean(lesson?.id && lesson?.title)),
          };
        })
        .filter((module): module is CourseModule => Boolean(module?.id && module?.title))
    : [];

  return {
    id: typeof value.id === "string" ? value.id : "",
    title: typeof value.title === "string" ? value.title : "",
    label: typeof value.label === "string" ? value.label : "",
    subtitle: typeof value.subtitle === "string" ? value.subtitle : "",
    description: typeof value.description === "string" ? value.description : "",
    audience: typeof value.audience === "string" ? value.audience : "",
    format: typeof value.format === "string" ? value.format : "",
    price: typeof value.price === "string" ? value.price : "",
    priceAmount: typeof value.priceAmount === "number" ? value.priceAmount : Number(value.priceAmount ?? 0) || 0,
    originalPrice: typeof value.originalPrice === "string" ? value.originalPrice : "",
    duration: typeof value.duration === "string" ? value.duration : "",
    students: typeof value.students === "string" ? value.students : "",
    image: typeof value.image === "string" ? value.image : "",
    cta: typeof value.cta === "string" ? value.cta : "",
    href: typeof value.href === "string" ? value.href : "",
    paymentHref: typeof value.paymentHref === "string" ? value.paymentHref : "",
    status: value.status === "soon" ? "soon" : "open",
    hidden: Boolean(value.hidden),
    points: Array.isArray(value.points)
      ? value.points.filter((point): point is string => typeof point === "string")
      : [],
    instructor: typeof value.instructor === "string" ? value.instructor : "",
    modules,
  };
}

export async function getCourseCatalog(includeHidden = false): Promise<CourseRecord[]> {
  const cookieHeader = includeHidden ? await getCookieHeader() : "";
  const response = await fetch(`${backendUrl}/api/courses${includeHidden ? "?includeHidden=1" : ""}`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  if (!response.ok) {
    throw new Error(`COURSE_LIST_${response.status}`);
  }

  const data = (await response.json()) as CourseListResponse;
  if (!Array.isArray(data.courses)) {
    throw new Error("COURSE_LIST_INVALID_RESPONSE");
  }

  return data.courses
    .map(toCourseRecord)
    .filter((course): course is CourseRecord => Boolean(course?.id && course?.title));
}

export async function getCourseById(courseId: string, includeHidden = false): Promise<CourseRecord> {
  const cookieHeader = includeHidden ? await getCookieHeader() : "";
  const response = await fetch(
    `${backendUrl}/api/courses/${encodeURIComponent(courseId)}${includeHidden ? "?includeHidden=1" : ""}`,
    {
      cache: "no-store",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    },
  );
  if (!response.ok) {
    throw new Error(`COURSE_${response.status}`);
  }

  const data = (await response.json()) as CourseResponse;
  const course = toCourseRecord(data.course);
  if (!course) {
    throw new Error("COURSE_INVALID_RESPONSE");
  }

  return course;
}
