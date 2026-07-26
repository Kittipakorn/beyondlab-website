"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CourseLesson, CourseModule, CourseRecord, CourseResource } from "@/lib/courseDb";

type CourseForm = {
  id: string;
  title: string;
  label: string;
  subtitle: string;
  description: string;
  audience: string;
  format: string;
  price: string;
  priceAmount: string;
  originalPrice: string;
  duration: string;
  students: string;
  image: string;
  cta: string;
  href: string;
  paymentHref: string;
  status: "open" | "soon";
  hidden: boolean;
  instructor: string;
  pointsText: string;
  modules: CourseModule[];
};

function defaultModules(): CourseModule[] {
  return [
    {
      id: "module-1",
      title: "ชื่อหมวด",
      lessons: [
        {
          id: "1.1",
          title: "ชื่อบทเรียน",
          description: "",
          duration: "",
          resources: [],
          videoKey: "",
        },
      ],
    },
  ];
}

function cloneModules(modules?: CourseModule[]): CourseModule[] {
  if (!modules?.length) return defaultModules();
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.length
      ? module.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          resources: lesson.resources.map((resource) => ({ ...resource })),
          videoKey: lesson.videoKey ?? "",
        }))
      : defaultModules()[0].lessons,
  }));
}

function sanitizeModules(modules: CourseModule[]): CourseModule[] {
  return modules.map((module) => ({
    id: module.id.trim(),
    title: module.title.trim(),
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id.trim(),
      title: lesson.title.trim(),
      description: lesson.description.trim(),
      duration: lesson.duration.trim(),
      resources: lesson.resources
        .map((resource) => ({
          label: resource.label.trim(),
          url: resource.url.trim(),
        }))
        .filter((resource) => resource.label || resource.url),
      videoKey: lesson.videoKey?.trim() || "",
    })),
  }));
}

function buildCourseForm(course?: CourseRecord | null): CourseForm {
  return {
    id: course?.id ?? "",
    title: course?.title ?? "",
    label: course?.label ?? "คอร์สออนไลน์",
    subtitle: course?.subtitle ?? "",
    description: course?.description ?? "",
    audience: course?.audience ?? "",
    format: course?.format ?? "",
    price: course?.price ?? "",
    priceAmount: course?.priceAmount ? String(course.priceAmount) : "",
    originalPrice: course?.originalPrice ?? "",
    duration: course?.duration ?? "",
    students: course?.students ?? "",
    image: course?.image ?? "",
    cta: course?.cta ?? "",
    href: course?.href ?? "",
    paymentHref: course?.paymentHref ?? "",
    status: course?.status ?? "open",
    hidden: course?.hidden ?? false,
    instructor: course?.instructor ?? "",
    pointsText: course?.points?.join("\n") ?? "",
    modules: cloneModules(course?.modules),
  };
}

function totalLessons(course: CourseRecord) {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}

type ToastFn = (message: string, type?: "success" | "error") => void;

type PendingVideoDelete = {
  key: string;
  courseId: string;
  lessonId: string;
};

function lessonCollapseKey(moduleIndex: number, lessonIndex: number) {
  return `${moduleIndex}-${lessonIndex}`;
}

function formatVideoDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "";
  const roundedSeconds = Math.round(totalSeconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const seconds = roundedSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function AdminVideoPreview({
  backendUrl,
  videoKey,
  onDurationDetected,
}: {
  backendUrl: string;
  videoKey: string;
  onDurationDetected: (duration: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const normalizedKey = videoKey.trim();

  useEffect(() => {
    if (!normalizedKey) {
      setPreviewUrl("");
      setError("");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(`${backendUrl}/api/admin/courses/video-preview-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify({ key: normalizedKey }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || typeof data.url !== "string") {
          throw new Error(data.error || "ไม่สามารถโหลดตัวอย่างคลิปได้");
        }
        return data.url;
      })
      .then((url) => {
        if (!controller.signal.aborted) setPreviewUrl(url);
      })
      .catch((previewError: unknown) => {
        if (controller.signal.aborted) return;
        setPreviewUrl("");
        setError(previewError instanceof Error ? previewError.message : "ไม่สามารถโหลดตัวอย่างคลิปได้");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [backendUrl, normalizedKey, reloadKey]);

  if (!normalizedKey) return null;

  return (
    <div className="mt-3 w-full max-w-[320px] rounded-2xl border border-[#eadfce] bg-[#faf6f0] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase text-[#71675f]">ตัวอย่างคลิป</p>
        <button
          type="button"
          onClick={() => setReloadKey((current) => current + 1)}
          className="rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed]"
        >
          โหลดใหม่
        </button>
      </div>
      {loading ? (
        <div className="mt-3 grid aspect-video place-items-center rounded-xl bg-white text-xs font-semibold text-[#71675f]">
          กำลังโหลดตัวอย่างคลิป...
        </div>
      ) : error ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {error}
        </div>
      ) : previewUrl ? (
        <video
          key={previewUrl}
          src={previewUrl}
          controls
          preload="metadata"
          onLoadedMetadata={(event) => {
            const duration = formatVideoDuration(event.currentTarget.duration);
            if (duration) onDurationDetected(duration);
          }}
          className="mt-3 aspect-video w-full rounded-xl bg-black"
        />
      ) : null}
    </div>
  );
}

export function CourseManager({
  backendUrl,
  onToast,
}: {
  backendUrl: string;
  onToast: ToastFn;
}) {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CourseRecord | null>(null);
  const [form, setForm] = useState<CourseForm>(buildCourseForm());
  const [uploadingVideo, setUploadingVideo] = useState<string | null>(null);
  const [collapsedModules, setCollapsedModules] = useState<Set<number>>(new Set());
  const [collapsedLessons, setCollapsedLessons] = useState<Set<string>>(new Set());
  const [pendingVideoDeletes, setPendingVideoDeletes] = useState<PendingVideoDelete[]>([]);
  const [savedFormSnapshot, setSavedFormSnapshot] = useState(() => JSON.stringify(buildCourseForm()));
  const formSnapshot = useMemo(() => JSON.stringify(form), [form]);
  const isDirty = viewMode === "form" && formSnapshot !== savedFormSnapshot;
  const unsavedMessage = "ยังไม่ได้บันทึกการแก้ไข ต้องการออกจากหน้านี้ไหม?";

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/courses`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCourses(Array.isArray(data.courses) ? data.courses : []);
      } else {
        onToast(data.error || "ไม่สามารถดึงข้อมูลคอร์สได้", "error");
      }
    } catch {
      onToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [backendUrl]);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = unsavedMessage;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.href === window.location.href) return;
      if (window.confirm(unsavedMessage)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isDirty]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = [...courses];
    if (!query) return list;
    return list.filter((course) =>
      [
        course.id,
        course.title,
        course.subtitle,
        course.description,
        course.label,
        course.instructor,
        course.status,
      ]
        .concat(course.points)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [courses, searchQuery]);

  const openCreate = () => {
    const nextForm = buildCourseForm();
    setEditingCourse(null);
    setForm(nextForm);
    setSavedFormSnapshot(JSON.stringify(nextForm));
    setCollapsedModules(new Set());
    setCollapsedLessons(new Set());
    setPendingVideoDeletes([]);
    setViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (course: CourseRecord) => {
    const nextForm = buildCourseForm(course);
    setEditingCourse(course);
    setForm(nextForm);
    setSavedFormSnapshot(JSON.stringify(nextForm));
    setCollapsedModules(new Set(course.modules.map((_, index) => index).filter((index) => index > 0)));
    setCollapsedLessons(new Set(course.modules.flatMap((module, moduleIndex) =>
      module.lessons.map((_, lessonIndex) => lessonCollapseKey(moduleIndex, lessonIndex)).filter((key) => key !== "0-0"),
    )));
    setPendingVideoDeletes([]);
    setViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDiscardChanges = () => !isDirty || window.confirm(unsavedMessage);

  const closeForm = () => {
    if (!confirmDiscardChanges()) return;
    setViewMode("list");
    setEditingCourse(null);
  };

  const toggleModuleCollapsed = (moduleIndex: number) => {
    setCollapsedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleIndex)) {
        next.delete(moduleIndex);
      } else {
        next.add(moduleIndex);
      }
      return next;
    });
  };

  const toggleLessonCollapsed = (moduleIndex: number, lessonIndex: number) => {
    const key = lessonCollapseKey(moduleIndex, lessonIndex);
    setCollapsedLessons((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const updateModule = (moduleIndex: number, patch: Partial<CourseModule>) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex ? { ...module, ...patch } : module,
      ),
    }));
  };

  const addModule = () => {
    let nextModuleIndex = 0;
    setForm((current) => {
      const nextIndex = current.modules.length + 1;
      nextModuleIndex = current.modules.length;
      return {
        ...current,
        modules: [
          ...current.modules,
          {
            id: `module-${nextIndex}`,
            title: `หมวดที่ ${nextIndex}`,
            lessons: [
              {
                id: `${nextIndex}.1`,
                title: "ชื่อบทเรียน",
                description: "",
                duration: "",
                resources: [],
                videoKey: "",
              },
            ],
          },
        ],
      };
    });
    setCollapsedModules((current) => {
      const next = new Set(current);
      next.delete(nextModuleIndex);
      return next;
    });
    setCollapsedLessons((current) => {
      const next = new Set(current);
      next.delete(lessonCollapseKey(nextModuleIndex, 0));
      return next;
    });
  };

  const deleteVideoObject = async (videoKey: string, courseId: string, lessonId: string) => {
    const response = await fetch(`${backendUrl}/api/admin/courses/video-delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ key: videoKey, courseId, lessonId }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "ลบคลิปไม่สำเร็จ");
    }
    return typeof data.message === "string" ? data.message : "ลบคลิปจาก R2 สำเร็จ";
  };

  const queueVideoDeletes = (items: PendingVideoDelete[]) => {
    if (items.length === 0) return;
    setPendingVideoDeletes((current) => {
      const next = [...current];
      for (const item of items) {
        if (!item.key || next.some((existing) => existing.key === item.key)) continue;
        next.push(item);
      }
      return next;
    });
  };

  const removeModule = async (moduleIndex: number) => {
    const module = form.modules[moduleIndex];
    const videoLessons = module?.lessons.filter((lesson) => lesson.videoKey?.trim()) ?? [];
    const message = videoLessons.length > 0
      ? `ต้องการลบโมดูลนี้ใช่ไหม? บทเรียนในโมดูลนี้จะถูกลบด้วย และคลิป ${videoLessons.length} ไฟล์จะถูกลบจาก R2 หลังจากกดบันทึกคอร์ส`
      : "ต้องการลบโมดูลนี้ใช่ไหม? บทเรียนในโมดูลนี้จะถูกลบด้วย";
    if (!window.confirm(message)) return;
    queueVideoDeletes(videoLessons.map((lesson) => ({
      key: lesson.videoKey?.trim() ?? "",
      courseId: form.id.trim(),
      lessonId: lesson.id.trim(),
    })));

    setForm((current) => ({
      ...current,
      modules: current.modules.length > 1
        ? current.modules.filter((_, index) => index !== moduleIndex)
        : current.modules,
    }));
    setCollapsedModules((current) => {
      const next = new Set<number>();
      current.forEach((index) => {
        if (index < moduleIndex) next.add(index);
        if (index > moduleIndex) next.add(index - 1);
      });
      return next;
    });
    setCollapsedLessons((current) => {
      const next = new Set<string>();
      current.forEach((key) => {
        const [rawModuleIndex, rawLessonIndex] = key.split("-");
        const currentModuleIndex = Number(rawModuleIndex);
        const currentLessonIndex = Number(rawLessonIndex);
        if (!Number.isInteger(currentModuleIndex) || !Number.isInteger(currentLessonIndex)) return;
        if (currentModuleIndex < moduleIndex) next.add(key);
        if (currentModuleIndex > moduleIndex) next.add(lessonCollapseKey(currentModuleIndex - 1, currentLessonIndex));
      });
      return next;
    });
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, patch: Partial<CourseLesson>) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, innerIndex) =>
                innerIndex === lessonIndex ? { ...lesson, ...patch } : lesson,
              ),
            }
          : module,
      ),
    }));
  };

  const addLesson = (moduleIndex: number) => {
    let newLessonIndex = 0;
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) => {
        if (index !== moduleIndex) return module;
        const nextLessonNumber = module.lessons.length + 1;
        newLessonIndex = module.lessons.length;
        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              id: `${moduleIndex + 1}.${nextLessonNumber}`,
              title: "ชื่อบทเรียน",
              description: "",
              duration: "",
              resources: [],
              videoKey: "",
            },
          ],
        };
      }),
    }));
    setCollapsedLessons((current) => {
      const next = new Set(current);
      next.delete(lessonCollapseKey(moduleIndex, newLessonIndex));
      return next;
    });
  };

  const removeLesson = async (moduleIndex: number, lessonIndex: number) => {
    const lesson = form.modules[moduleIndex]?.lessons[lessonIndex];
    const videoKey = lesson?.videoKey?.trim() ?? "";
    const message = videoKey
      ? "ต้องการลบบทเรียนนี้ใช่ไหม? คลิปของบทเรียนนี้จะถูกลบจาก R2 หลังจากกดบันทึกคอร์ส"
      : "ต้องการลบบทเรียนนี้ใช่ไหม?";
    if (!window.confirm(message)) return;
    queueVideoDeletes(videoKey ? [{
      key: videoKey,
      courseId: form.id.trim(),
      lessonId: lesson?.id.trim() ?? "",
    }] : []);

    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex && module.lessons.length > 1
          ? { ...module, lessons: module.lessons.filter((_, innerIndex) => innerIndex !== lessonIndex) }
          : module,
      ),
    }));
    setCollapsedLessons((current) => {
      const next = new Set<string>();
      current.forEach((key) => {
        const [rawModuleIndex, rawLessonIndex] = key.split("-");
        const currentModuleIndex = Number(rawModuleIndex);
        const currentLessonIndex = Number(rawLessonIndex);
        if (!Number.isInteger(currentModuleIndex) || !Number.isInteger(currentLessonIndex)) return;
        if (currentModuleIndex !== moduleIndex) {
          next.add(key);
          return;
        }
        if (currentLessonIndex < lessonIndex) next.add(key);
        if (currentLessonIndex > lessonIndex) next.add(lessonCollapseKey(moduleIndex, currentLessonIndex - 1));
      });
      return next;
    });
  };

  const updateResource = (
    moduleIndex: number,
    lessonIndex: number,
    resourceIndex: number,
    patch: Partial<CourseResource>,
  ) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, innerIndex) =>
                innerIndex === lessonIndex
                  ? {
                      ...lesson,
                      resources: lesson.resources.map((resource, nestedIndex) =>
                        nestedIndex === resourceIndex ? { ...resource, ...patch } : resource,
                      ),
                    }
                  : lesson,
              ),
            }
          : module,
      ),
    }));
  };

  const addResource = (moduleIndex: number, lessonIndex: number) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, innerIndex) =>
                innerIndex === lessonIndex
                  ? { ...lesson, resources: [...lesson.resources, { label: "", url: "" }] }
                  : lesson,
              ),
            }
          : module,
      ),
    }));
  };

  const removeResource = (moduleIndex: number, lessonIndex: number, resourceIndex: number) => {
    if (!window.confirm("ต้องการลบ resource นี้ใช่ไหม?")) return;
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, innerIndex) =>
                innerIndex === lessonIndex
                  ? { ...lesson, resources: lesson.resources.filter((_, nestedIndex) => nestedIndex !== resourceIndex) }
                  : lesson,
              ),
            }
          : module,
      ),
    }));
  };

  const handleVideoUpload = async (moduleIndex: number, lessonIndex: number, file: File | null) => {
    if (!file) return;
    const courseId = form.id.trim();
    const lesson = form.modules[moduleIndex]?.lessons[lessonIndex];
    const lessonId = lesson?.id.trim() ?? "";
    if (!courseId || !lessonId) {
      onToast("กรุณากรอก Course ID และ Lesson ID ก่อนอัปโหลดคลิป", "error");
      return;
    }
    if (!file.type.startsWith("video/")) {
      onToast("กรุณาเลือกไฟล์วิดีโอเท่านั้น", "error");
      return;
    }

    const uploadKey = `${moduleIndex}-${lessonIndex}`;
    setUploadingVideo(uploadKey);
    try {
      const prepareResponse = await fetch(`${backendUrl}/api/admin/courses/video-upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId,
          lessonId,
          fileName: file.name,
          contentType: file.type || "video/mp4",
        }),
      });
      const prepareData = await prepareResponse.json().catch(() => ({}));
      if (!prepareResponse.ok || typeof prepareData.uploadUrl !== "string" || typeof prepareData.key !== "string") {
        throw new Error(prepareData.error || "ไม่สามารถเตรียมอัปโหลดคลิปได้");
      }

      const uploadResponse = await fetch(prepareData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "video/mp4" },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error("อัปโหลดคลิปไม่สำเร็จ กรุณาตรวจสอบ CORS ของ R2");
      }

      updateLesson(moduleIndex, lessonIndex, { videoKey: prepareData.key });
      onToast("อัปโหลดคลิปสำเร็จ และเติม Video Key ให้แล้ว");
    } catch (error) {
      onToast(error instanceof Error ? error.message : "อัปโหลดคลิปไม่สำเร็จ", "error");
    } finally {
      setUploadingVideo(null);
    }
  };

  const handleVideoDelete = async (moduleIndex: number, lessonIndex: number) => {
    const lesson = form.modules[moduleIndex]?.lessons[lessonIndex];
    const videoKey = lesson?.videoKey?.trim() ?? "";
    if (!videoKey) {
      onToast("บทเรียนนี้ยังไม่มี Video Key", "error");
      return;
    }
    if (!window.confirm("ต้องการลบคลิปนี้ออกจาก R2 จริงๆ ใช่ไหม? การลบนี้ย้อนกลับไม่ได้")) return;

    const deleteKey = `${moduleIndex}-${lessonIndex}`;
    setUploadingVideo(deleteKey);
    try {
      const message = await deleteVideoObject(videoKey, form.id.trim(), lesson?.id.trim() ?? "");
      updateLesson(moduleIndex, lessonIndex, { videoKey: "", duration: "" });
      onToast(message);
    } catch (error) {
      onToast(error instanceof Error ? error.message : "ลบคลิปไม่สำเร็จ", "error");
    } finally {
      setUploadingVideo(null);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.id.trim() || !form.title.trim()) {
      onToast("กรุณากรอก Course ID และชื่อคอร์ส", "error");
      return;
    }

    const modules = sanitizeModules(form.modules);
    if (!modules.length) {
      onToast("กรุณาเพิ่มอย่างน้อย 1 โมดูล", "error");
      return;
    }
    const invalidModule = modules.findIndex((module) => !module.id || !module.title || !module.lessons.length);
    if (invalidModule >= 0) {
      onToast(`กรุณากรอก ID, ชื่อโมดูล และบทเรียนในโมดูลที่ ${invalidModule + 1}`, "error");
      return;
    }
    const invalidLessonModule = modules.findIndex((module) =>
      module.lessons.some((lesson) => !lesson.id || !lesson.title),
    );
    if (invalidLessonModule >= 0) {
      onToast(`กรุณากรอก ID และชื่อบทเรียนในโมดูลที่ ${invalidLessonModule + 1}`, "error");
      return;
    }
    const invalidResourceModule = modules.findIndex((module) =>
      module.lessons.some((lesson) =>
        lesson.resources.some((resource) => !resource.label || !resource.url),
      ),
    );
    if (invalidResourceModule >= 0) {
      onToast(`ลิงก์ประกอบในโมดูลที่ ${invalidResourceModule + 1} ต้องมีทั้งชื่อและ URL`, "error");
      return;
    }

    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      label: form.label.trim() || "คอร์สออนไลน์",
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      audience: form.audience.trim(),
      format: form.format.trim(),
      price: form.price.trim(),
      priceAmount: Number(form.priceAmount) || 0,
      originalPrice: form.originalPrice.trim(),
      duration: form.duration.trim(),
      students: form.students.trim(),
      image: form.image.trim(),
      cta: form.cta.trim(),
      href: form.href.trim(),
      paymentHref: form.paymentHref.trim(),
      status: form.status,
      hidden: form.hidden,
      instructor: form.instructor.trim(),
      points: form.pointsText
        .split("\n")
        .map((point) => point.trim())
        .filter(Boolean),
      modules,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/courses`, {
        method: editingCourse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (pendingVideoDeletes.length > 0) {
          try {
            await Promise.all(
              pendingVideoDeletes.map((item) =>
                deleteVideoObject(item.key, item.courseId, item.lessonId),
              ),
            );
            setPendingVideoDeletes([]);
          } catch (error) {
            onToast(
              error instanceof Error
                ? `บันทึกคอร์สแล้ว แต่ลบคลิปจาก R2 ไม่สำเร็จ: ${error.message}`
                : "บันทึกคอร์สแล้ว แต่ลบคลิปจาก R2 ไม่สำเร็จ",
              "error",
            );
            return;
          }
        }
        onToast(
          pendingVideoDeletes.length > 0
            ? `${data.message || (editingCourse ? "บันทึกคอร์สสำเร็จ" : "สร้างคอร์สสำเร็จ")} และลบคลิปจาก R2 แล้ว`
            : data.message || (editingCourse ? "บันทึกคอร์สสำเร็จ" : "สร้างคอร์สสำเร็จ"),
        );
        setSavedFormSnapshot(formSnapshot);
        setViewMode("list");
        setEditingCourse(null);
        await loadCourses();
      } else {
        onToast(data.error || "ไม่สามารถบันทึกคอร์สได้", "error");
      }
    } catch {
      onToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/courses?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onToast(data.message || "ลบคอร์สสำเร็จ");
        setDeleteTarget(null);
        await loadCourses();
      } else {
        onToast(data.error || "ไม่สามารถลบคอร์สได้", "error");
      }
    } catch {
      onToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex flex-col gap-4 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">Course DB</p>
              <h2 className="mt-1 text-2xl font-bold text-[#292725]">จัดการคอร์ส</h2>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ea721f] px-4 text-sm font-bold text-white transition hover:bg-[#d85f13]"
            >
              + สร้างคอร์ส
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ค้นหาจากชื่อคอร์ส, ID, ผู้สอน หรือสถานะ..."
            className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] placeholder-[#a3978c] shadow-sm focus:border-[#ea721f] focus:outline-none"
          />

          <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-[#71675f]">กำลังโหลดข้อมูลคอร์ส...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-12 text-center text-[#71675f]">ไม่พบข้อมูลคอร์ส</div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm text-[#303030]">
                    <thead className="border-b border-[#eadfce] bg-[#faf6f0] text-xs font-bold uppercase text-[#5c5148]">
                      <tr>
                        <th className="px-5 py-3.5">ID</th>
                        <th className="px-5 py-3.5">ชื่อคอร์ส</th>
                        <th className="px-5 py-3.5">ผู้สอน</th>
                        <th className="px-5 py-3.5">บทเรียน</th>
                        <th className="px-5 py-3.5">ราคา</th>
                        <th className="px-5 py-3.5">สถานะ</th>
                        <th className="px-5 py-3.5 text-right">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0dfc8]">
                      {filteredCourses.map((course) => (
                        <tr key={course.id} className="transition hover:bg-[#fcfaf7]">
                          <td className="px-5 py-4 font-mono font-bold text-[#ea721f]">{course.id}</td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-[#292725]">{course.title}</div>
                            <div className="text-xs text-[#71675f]">{course.subtitle}</div>
                          </td>
                          <td className="px-5 py-4 text-[#71675f]">{course.instructor || "-"}</td>
                          <td className="px-5 py-4 text-sm text-[#71675f]">
                            {course.modules.length} โมดูล / {totalLessons(course)} บท
                          </td>
                          <td className="px-5 py-4 font-bold text-[#ea721f]">{course.price || "-"}</td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${course.hidden ? "bg-slate-100 text-slate-600 border border-slate-200" : course.status === "open" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-700 border border-zinc-300"}`}>
                              {course.hidden ? "hidden" : course.status === "open" ? "open" : "soon"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(course)}
                                className="rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed]"
                              >
                                แก้ไข
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(course)}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                              >
                                ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="block divide-y divide-[#f0dfc8] md:hidden">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-sm font-bold text-[#ea721f]">{course.id}</div>
                          <div className="font-bold text-[#292725]">{course.title}</div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${course.hidden ? "bg-slate-100 text-slate-600 border border-slate-200" : course.status === "open" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-700 border border-zinc-300"}`}>
                          {course.hidden ? "hidden" : course.status === "open" ? "open" : "soon"}
                        </span>
                      </div>
                      <div className="text-xs text-[#71675f]">{course.instructor || "-"}</div>
                      <div className="text-xs text-[#71675f]">{course.modules.length} โมดูล / {totalLessons(course)} บท</div>
                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => openEdit(course)} className="flex-1 rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed]">แก้ไข</button>
                        <button type="button" onClick={() => setDeleteTarget(course)} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100">ลบ</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-[#eadfce] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">Course Editor</p>
              <h2 className="mt-1 text-2xl font-bold text-[#292725]">{editingCourse ? `แก้ไข ${editingCourse.id}` : "สร้างคอร์สใหม่"}</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={closeForm} className="rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed]">ยกเลิก</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-[#ea721f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d85f13] disabled:opacity-50">{submitting ? "กำลังบันทึก..." : "บันทึกคอร์ส"}</button>
            </div>
          </div>

          <div className="grid gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm sm:grid-cols-2">
            {[
              ["id", "Course ID"],
              ["title", "ชื่อคอร์ส"],
              ["label", "ป้ายคอร์ส"],
              ["subtitle", "คำโปรย"],
              ["audience", "กลุ่มเป้าหมาย"],
              ["format", "รูปแบบ"],
              ["price", "ราคา"],
              ["priceAmount", "ราคาแบบตัวเลข"],
              ["originalPrice", "ราคาเดิม"],
              ["duration", "ระยะเวลา"],
              ["students", "จำนวนผู้เรียน"],
              ["image", "ภาพคอร์ส"],
              ["cta", "ปุ่มเรียกการกระทำ"],
              ["href", "ลิงก์คอร์ส"],
              ["paymentHref", "ลิงก์ชำระเงิน"],
              ["instructor", "ผู้สอน"],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs font-bold uppercase text-[#5c5148]">{label}</span>
                <input
                  type="text"
                  value={form[key as keyof CourseForm] as string}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  readOnly={key === "id" && Boolean(editingCourse)}
                  className={`mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none ${key === "id" && editingCourse ? "bg-[#faf6f0] text-[#71675f]" : ""}`}
                />
              </label>
            ))}

            <label className="block">
              <span className="text-xs font-bold uppercase text-[#5c5148]">สถานะ</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as CourseForm["status"] }))}
                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
              >
                <option value="open">open</option>
                <option value="soon">soon</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-[#faf6f0] px-4 py-3">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(event) => setForm((current) => ({ ...current, hidden: event.target.checked }))}
                className="h-4 w-4 rounded border-[#cbb9a7] text-[#ea721f] focus:ring-[#ea721f]"
              />
              <span className="text-sm font-semibold text-[#5c5148]">ซ่อนคอร์สจากหน้า public</span>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase text-[#5c5148]">คำโปรย</span>
              <textarea
                rows={4}
                value={form.subtitle}
                onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white p-3 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-bold uppercase text-[#5c5148]">คำอธิบายคอร์ส</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white p-3 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase text-[#5c5148]">Points</span>
              <textarea
                rows={4}
                value={form.pointsText}
                onChange={(event) => setForm((current) => ({ ...current, pointsText: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white p-3 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                placeholder="ใส่ทีละบรรทัด"
              />
            </label>

            <section className="sm:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-[#5c5148]">Modules & Lessons</p>
                  <p className="mt-1 text-xs text-[#71675f]">แก้ชื่อหมวด บทเรียน วิดีโอ และลิงก์ประกอบได้จากช่องด้านล่าง</p>
                </div>
                <button
                  type="button"
                  onClick={addModule}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#292725] px-4 text-sm font-bold text-white transition hover:bg-[#c65018]"
                >
                  + เพิ่มโมดูล
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {form.modules.map((module, moduleIndex) => {
                  const isCollapsed = collapsedModules.has(moduleIndex);
                  const videoCount = module.lessons.filter((lesson) => Boolean(lesson.videoKey?.trim())).length;
                  return (
                  <div key={`${module.id}-${moduleIndex}`} className="overflow-hidden rounded-2xl border border-[#eadfce] bg-[#faf6f0]">
                    <div className="flex flex-col gap-3 border-b border-[#eadfce] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => toggleModuleCollapsed(moduleIndex)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        aria-expanded={!isCollapsed}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fff0e5] text-sm font-bold text-[#c65018]">
                          {isCollapsed ? "+" : "-"}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-[#292725]">
                            {module.title.trim() || `โมดูลที่ ${moduleIndex + 1}`}
                          </span>
                          <span className="mt-0.5 block text-xs text-[#71675f]">
                            {module.id || "ยังไม่มี ID"} · {module.lessons.length} บทเรียน · {videoCount} คลิป
                          </span>
                        </span>
                      </button>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => toggleModuleCollapsed(moduleIndex)}
                          className="min-h-10 rounded-xl border border-[#d9cbbb] bg-white px-3 text-xs font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]"
                        >
                          {isCollapsed ? "ขยาย" : "ย่อ"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeModule(moduleIndex)}
                          disabled={form.modules.length === 1}
                          className="min-h-10 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ลบโมดูล
                        </button>
                      </div>
                    </div>

                    {!isCollapsed ? (
                      <div className="p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                          <label className="block lg:w-44">
                            <span className="text-[11px] font-bold uppercase text-[#71675f]">Module ID</span>
                            <input
                              type="text"
                              value={module.id}
                              onChange={(event) => updateModule(moduleIndex, { id: event.target.value })}
                              className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                            />
                          </label>
                          <label className="block flex-1">
                            <span className="text-[11px] font-bold uppercase text-[#71675f]">ชื่อโมดูล</span>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(event) => updateModule(moduleIndex, { title: event.target.value })}
                              className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                            />
                          </label>
                        </div>

                    <div className="mt-4 space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isLessonCollapsed = collapsedLessons.has(lessonCollapseKey(moduleIndex, lessonIndex));
                        const hasVideo = Boolean(lesson.videoKey?.trim());
                        return (
                        <div key={`${lesson.id}-${lessonIndex}`} className="overflow-hidden rounded-2xl border border-[#e6d8c8] bg-white">
                          <div className="flex flex-col gap-3 border-b border-[#f0dfc8] bg-[#fffaf5] p-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() => toggleLessonCollapsed(moduleIndex, lessonIndex)}
                              className="flex min-w-0 flex-1 items-center gap-3 text-left"
                              aria-expanded={!isLessonCollapsed}
                            >
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-[#c65018]">
                                {isLessonCollapsed ? "+" : "-"}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-bold text-[#292725]">
                                  {lesson.id || `${moduleIndex + 1}.${lessonIndex + 1}`} · {lesson.title.trim() || "ยังไม่มีชื่อบทเรียน"}
                                </span>
                                <span className="mt-0.5 block text-xs text-[#71675f]">
                                  {lesson.duration.trim() || "ยังไม่ใส่เวลา"} · {hasVideo ? "มีคลิปแล้ว" : "ยังไม่มีคลิป"} · {lesson.resources.length} resources
                                </span>
                              </span>
                            </button>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                onClick={() => toggleLessonCollapsed(moduleIndex, lessonIndex)}
                                className="min-h-9 rounded-xl border border-[#d9cbbb] bg-white px-3 text-xs font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]"
                              >
                                {isLessonCollapsed ? "ขยาย" : "ย่อ"}
                              </button>
                              <button
                                type="button"
                                onClick={() => void removeLesson(moduleIndex, lessonIndex)}
                                disabled={module.lessons.length === 1}
                                className="min-h-9 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                ลบ
                              </button>
                            </div>
                          </div>

                          {!isLessonCollapsed ? (
                          <div className="p-4">
                          <div className="grid gap-3 lg:grid-cols-[120px_minmax(0,1fr)_120px_minmax(0,1fr)] lg:items-end">
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase text-[#71675f]">Lesson ID</span>
                              <input
                                type="text"
                                value={lesson.id}
                                onChange={(event) => updateLesson(moduleIndex, lessonIndex, { id: event.target.value })}
                                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase text-[#71675f]">ชื่อบทเรียน</span>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(event) => updateLesson(moduleIndex, lessonIndex, { title: event.target.value })}
                                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase text-[#71675f]">ระยะเวลา</span>
                              <input
                                type="text"
                                value={lesson.duration}
                                onChange={(event) => updateLesson(moduleIndex, lessonIndex, { duration: event.target.value })}
                                placeholder="เช่น 12 นาที"
                                className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase text-[#71675f]">Video Key</span>
                              <div className="mt-1.5 flex flex-wrap gap-2">
                                <input
                                  type="text"
                                  value={lesson.videoKey ?? ""}
                                  onChange={(event) => updateLesson(moduleIndex, lessonIndex, { videoKey: event.target.value })}
                                  placeholder="R2 object key"
                                  className="min-w-0 flex-1 rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                                />
                                <label className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border px-3 text-xs font-bold transition ${uploadingVideo === `${moduleIndex}-${lessonIndex}` ? "border-[#eadfce] bg-[#f7f3ed] text-[#8a7e75]" : "border-[#d9cbbb] bg-white text-[#514942] hover:border-[#c65018] hover:text-[#c65018]"}`}>
                                  {uploadingVideo === `${moduleIndex}-${lessonIndex}` ? "กำลังอัป..." : "อัปโหลด"}
                                  <input
                                    type="file"
                                    accept="video/*"
                                    disabled={Boolean(uploadingVideo)}
                                    onChange={(event) => {
                                      const file = event.target.files?.[0] ?? null;
                                      void handleVideoUpload(moduleIndex, lessonIndex, file);
                                      event.target.value = "";
                                    }}
                                    className="sr-only"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleVideoDelete(moduleIndex, lessonIndex)}
                                  disabled={Boolean(uploadingVideo) || !lesson.videoKey?.trim()}
                                  className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  ลบคลิป
                                </button>
                              </div>
                            </label>
                          </div>

                          <div className="mt-3 grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
                            <AdminVideoPreview
                              backendUrl={backendUrl}
                              videoKey={lesson.videoKey ?? ""}
                              onDurationDetected={(duration) => updateLesson(moduleIndex, lessonIndex, { duration })}
                            />

                            <div className="space-y-3">
                              <label className="block">
                                <span className="text-[11px] font-bold uppercase text-[#71675f]">คำอธิบายบทเรียน</span>
                                <textarea
                                  rows={4}
                                  value={lesson.description}
                                  onChange={(event) => updateLesson(moduleIndex, lessonIndex, { description: event.target.value })}
                                  className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white p-3 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                                />
                              </label>

                              <div className="rounded-2xl border border-[#f0dfc8] bg-[#fffaf5] p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-[11px] font-bold uppercase text-[#71675f]">Resources</p>
                                  <button
                                    type="button"
                                    onClick={() => addResource(moduleIndex, lessonIndex)}
                                    className="rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed]"
                                  >
                                    + เพิ่มลิงก์
                                  </button>
                                </div>
                                {lesson.resources.length > 0 ? (
                                  <div className="mt-3 space-y-2">
                                    {lesson.resources.map((resource, resourceIndex) => (
                                      <div key={`${resource.label}-${resourceIndex}`} className="grid gap-2 lg:grid-cols-[180px_minmax(0,1fr)_auto]">
                                        <input
                                          type="text"
                                          value={resource.label}
                                          onChange={(event) => updateResource(moduleIndex, lessonIndex, resourceIndex, { label: event.target.value })}
                                          placeholder="ชื่อไฟล์ / ชื่อลิงก์"
                                          className="rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                                        />
                                        <input
                                          type="text"
                                          value={resource.url}
                                          onChange={(event) => updateResource(moduleIndex, lessonIndex, resourceIndex, { url: event.target.value })}
                                          placeholder="URL"
                                          className="rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeResource(moduleIndex, lessonIndex, resourceIndex)}
                                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                        >
                                          ลบ
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="mt-3 text-xs text-[#8a7e75]">ยังไม่มีลิงก์ประกอบ</p>
                                )}
                              </div>
                            </div>
                          </div>
                          </div>
                          ) : null}
                        </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-[#d9cbbb] bg-white px-4 text-sm font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]"
                    >
                      + เพิ่มบทเรียน
                    </button>
                      </div>
                    ) : null}
                  </div>
                  );
                })}
              </div>
            </section>
          </div>
        </form>
      )}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#eadfce] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[#292725]">ลบคอร์ส</h3>
            <p className="mt-2 text-sm leading-6 text-[#71675f]">
              ต้องการลบ <strong className="text-[#ea721f]">{deleteTarget.title}</strong> ({deleteTarget.id}) ใช่ไหม
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-semibold text-[#5c5148]">ยกเลิก</button>
              <button type="button" onClick={handleDelete} disabled={submitting} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {submitting ? "กำลังลบ..." : "ลบคอร์ส"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
