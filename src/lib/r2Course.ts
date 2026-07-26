import "server-only";

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
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type R2Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules: CourseModule[];
};

type ManifestLesson = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  duration?: unknown;
  resources?: unknown;
};

type ManifestModule = {
  id?: unknown;
  title?: unknown;
  lessons?: unknown;
};

type CourseManifest = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  instructor?: unknown;
  modules?: unknown;
};

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid course manifest: ${field} must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function objectUrl(baseUrl: string, key: unknown, field: string) {
  const objectKey = requiredString(key, field);
  const base = new URL(`${baseUrl.replace(/\/$/, "")}/`);
  const resolved = new URL(objectKey.replace(/^\//, ""), base);

  if (resolved.origin !== base.origin) {
    throw new Error(`Invalid course manifest: ${field} must point to the configured R2 origin`);
  }

  return resolved.toString();
}

function parseResources(value: unknown, baseUrl: string, field: string) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error(`Invalid course manifest: ${field} must be an array`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid course manifest: ${field}[${index}] must be an object`);
    }
    const resource = item as { label?: unknown; key?: unknown };
    return {
      label: requiredString(resource.label, `${field}[${index}].label`),
      url: objectUrl(baseUrl, resource.key, `${field}[${index}].key`),
    };
  });
}

export async function getR2Course(): Promise<R2Course> {
  const baseUrl = process.env.R2_PUBLIC_URL;
  const manifestKey =
    process.env.R2_COURSE_MANIFEST_KEY ?? "courses/zero-to-code/manifest.json";

  if (!baseUrl) {
    throw new Error("R2_NOT_CONFIGURED");
  }

  const manifestUrl = objectUrl(baseUrl, manifestKey, "R2_COURSE_MANIFEST_KEY");
  const response = await fetch(manifestUrl, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`R2_MANIFEST_${response.status}`);
  }

  const manifest = (await response.json()) as CourseManifest;
  if (!Array.isArray(manifest.modules)) {
    throw new Error("Invalid course manifest: modules must be an array");
  }

  const modules = manifest.modules.map((moduleValue, moduleIndex) => {
    if (!moduleValue || typeof moduleValue !== "object") {
      throw new Error(`Invalid course manifest: modules[${moduleIndex}] must be an object`);
    }
    const module = moduleValue as ManifestModule;
    if (!Array.isArray(module.lessons)) {
      throw new Error(`Invalid course manifest: modules[${moduleIndex}].lessons must be an array`);
    }

    const lessons = module.lessons.map((lessonValue, lessonIndex) => {
      if (!lessonValue || typeof lessonValue !== "object") {
        throw new Error(
          `Invalid course manifest: modules[${moduleIndex}].lessons[${lessonIndex}] must be an object`,
        );
      }
      const lesson = lessonValue as ManifestLesson;
      const prefix = `modules[${moduleIndex}].lessons[${lessonIndex}]`;
      return {
        id: requiredString(lesson.id, `${prefix}.id`),
        title: requiredString(lesson.title, `${prefix}.title`),
        description: optionalString(lesson.description),
        duration: optionalString(lesson.duration),
        resources: parseResources(lesson.resources, baseUrl, `${prefix}.resources`),
      };
    });

    return {
      id: requiredString(module.id, `modules[${moduleIndex}].id`),
      title: requiredString(module.title, `modules[${moduleIndex}].title`),
      lessons,
    };
  });

  return {
    id: requiredString(manifest.id, "id"),
    title: requiredString(manifest.title, "title"),
    description: optionalString(manifest.description),
    instructor: optionalString(manifest.instructor),
    modules,
  };
}
