"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  FileText,
  Check,
  CloudUpload,
  X,
  Download,
  Trash2,
  Info,
  Save,
  Eye,
  Sparkles,
  Send,
  Loader2,
  ChevronRight,
} from "lucide-react";
import type { LectureDetail } from "@/types";
import ContentTypeCard from "@/components/expert/ContentTypeCard";
import type { RichTextEditorHandle } from "@/components/expert/RichTextEditor";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/expert/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

type ContentType = "lecture" | "column";

interface CategoryItem {
  main: string;
  sub: string;
}

interface LessonInfo {
  fileId: string;
  fileName: string;
  lessonTitle: string;
}

const CONTENT_TYPES = [
  {
    type: "lecture" as const,
    title: "강의",
    subtitle: "체계적인 커리큘럼으로 전달하는 실무 노하우",
    description:
      "세무, 회계, 인사 등 전문 분야의 지식을 영상 강의로 구성하여 수강생에게 깊이 있는 학습 경험을 제공합니다.",
    tags: ["온라인 강의", "커리큘럼"],
    icon: <Video size={22} />,
  },
  {
    type: "column" as const,
    title: "컬럼",
    subtitle: "실무에서 바로 쓸 수 있는 전문가 인사이트",
    description:
      "법 개정 해설, 실무 팁, 사례 분석 등을 글과 자료로 정리하여 현장에서 즉시 활용할 수 있는 콘텐츠를 만들어보세요.",
    tags: ["실무 자료", "전문 해설", "사례 분석"],
    icon: <FileText size={22} />,
  },
];

const CATEGORY_TREE = [
  {
    main: "세무",
    subs: ["법인세", "소득세", "부가가치세", "양도소득세", "상속세", "증여세", "지방세", "연말정산", "절세 전략", "조세 불복", "세무조사 대응"],
  },
  {
    main: "회계",
    subs: ["계정과목", "전표분개", "증빙", "장부", "결산", "관리회계", "재무제표 분석", "업종별 회계", "회계감사 대응"],
  },
  {
    main: "총무",
    subs: ["자산·비품", "시설·보안", "의전·행사", "법규·계약", "ESG·산업안전"],
  },
  {
    main: "인사",
    subs: ["채용·온보딩", "평가·보상", "교육·조직문화", "노무관리", "퇴직 관리"],
  },
  {
    main: "4대보험",
    subs: ["취득·상실신고", "보수총액 신고", "건강보험 정산", "일자리 안정자금·지원금", "현지조사·공단심사"],
  },
];

const AGREEMENT_ITEMS = [
  {
    id: "copyright",
    title: "콘텐츠 저작권 및 독창성",
    details: [
      "업로드하는 모든 콘텐츠(영상, 자료, 이미지 등)는 본인이 직접 제작하였거나 적법한 사용 권한을 보유해야 합니다.",
      "타인의 저작물을 무단으로 사용할 경우 관련 법적 책임은 전적으로 업로더에게 있습니다.",
      "저작권 위반이 확인될 경우 사전 통보 없이 콘텐츠가 비공개 처리될 수 있습니다.",
    ],
  },
  {
    id: "quality",
    title: "콘텐츠 품질 기준",
    details: [
      "강의 영상은 최소 720p 이상의 해상도를 권장하며, 음질이 명확해야 합니다.",
      "각 강의 섹션에는 학습 목표와 요약이 포함되어야 합니다.",
      "부적절하거나 불완전한 콘텐츠는 심사 과정에서 반려될 수 있습니다.",
    ],
  },
  {
    id: "revenue",
    title: "수익 정산 및 운영 정책",
    details: [
      "강의 판매 수익은 플랫폼 수수료를 제외한 금액이 매월 정산됩니다.",
      "수강생 환불 요청 시 플랫폼 환불 정책에 따라 처리되며, 정산 금액에서 차감될 수 있습니다.",
      "플랫폼은 서비스 운영을 위해 강의 소개 페이지, 프로모션 등에 콘텐츠 일부를 활용할 수 있습니다.",
    ],
  },
  {
    id: "responsibility",
    title: "강의 운영 책임",
    details: [
      "수강생의 질문 및 문의에 대해 영업일 기준 3일 이내 답변을 권장합니다.",
      "강의 내용에 법령 변경 등 중요 업데이트가 발생할 경우 적시에 반영해야 합니다.",
      "장기간 미활동 시 플랫폼에서 강의 노출이 제한될 수 있습니다.",
    ],
  },
];

// AI 컨셉 → 수업 정보 생성 (데모용 — 실제로는 AI API 호출)
function generateFromConcept(concept: string, lessonCount: number) {
  const keywords = concept.replace(/[^\w가-힣\s]/g, "").split(/\s+/).filter(Boolean);
  const mainKeyword = keywords.slice(0, 3).join(" ") || concept.slice(0, 20);

  // 커리큘럼 수업 제목 생성
  const lessonTitleTemplates = [
    `${mainKeyword} 개요와 학습 로드맵`,
    `핵심 용어와 기본 개념 정리`,
    `실무 프로세스 단계별 이해`,
    `자주 발생하는 실수와 주의사항`,
    `사례로 배우는 실전 적용법`,
    `최신 법령 및 제도 변경 사항`,
    `고급 테크닉과 효율화 전략`,
    `실무 서식 작성 및 활용법`,
    `Q&A — 현장에서 자주 묻는 질문`,
    `총정리 및 핵심 체크리스트`,
  ];
  const lessonTitles = Array.from({ length: lessonCount }, (_, i) =>
    i < lessonTitleTemplates.length
      ? `${i + 1}강. ${lessonTitleTemplates[i]}`
      : `${i + 1}강. ${mainKeyword} 심화 학습 ${i + 1 - lessonTitleTemplates.length + 1}`
  );

  return {
    title: `${mainKeyword} — 실무 완전정복 강의`,
    description: `${concept}에 대한 핵심 실무 지식을 체계적으로 정리한 강의입니다. 현장에서 바로 적용할 수 있는 실전 노하우를 단계별로 알려드립니다. 초보자도 쉽게 따라올 수 있도록 기초부터 심화까지 구성했습니다.`,
    learningPoints: [
      `${mainKeyword} 핵심 개념과 최신 법령 이해`,
      `실무에서 자주 발생하는 실수와 대응 방법 습득`,
      `실전 사례를 통한 문제 해결 능력 향상`,
    ],
    targetAudience: [
      `${mainKeyword} 업무를 처음 맡게 된 실무자`,
      `관련 지식을 체계적으로 정리하고 싶은 경력자`,
      `시험 준비 또는 자격증 취득을 목표로 하는 분`,
    ],
    tags: keywords.slice(0, 5).concat(["실무", "강의"]).filter((v, i, a) => a.indexOf(v) === i),
    courseDetail: `<h3>강의 소개</h3><p>${concept}에 대해 현장 실무자가 반드시 알아야 할 핵심 내용을 체계적으로 다룹니다.</p><h3>커리큘럼 구성</h3><ul>${lessonTitles.map((t) => `<li>${t}</li>`).join("")}</ul><h3>수강 전 안내</h3><ul><li>별도의 사전 지식 없이도 수강 가능합니다.</li><li>실무 서식 및 참고 자료를 함께 제공합니다.</li><li>각 강의 후 핵심 정리 자료가 포함되어 있습니다.</li></ul>`,
    lessonTitles,
  };
}

const TOTAL_STEPS = 5;

const STEP_GROUPS = [
  {
    groupTitle: "강의 기본 정보",
    steps: [
      { step: 1, label: "유형 선택" },
      { step: 2, label: "업로드 안내" },
      { step: 3, label: "영상 업로드" },
      { step: 4, label: "수업 정보" },
    ],
  },
  {
    groupTitle: "강의 설정",
    steps: [{ step: 5, label: "가격 설정" }],
  },
];

const ALL_STEPS = STEP_GROUPS.flatMap((g) => g.steps);

export default function ContentUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ContentType>("lecture");
  const [currentStep, setCurrentStep] = useState(1);
  const [agreements, setAgreements] = useState<Record<string, boolean>>(
    () => Object.fromEntries(AGREEMENT_ITEMS.map((item) => [item.id, false]))
  );

  interface UploadedFile {
    id: string;
    name: string;
    size: number;
    progress: number;
    status: "uploading" | "complete" | "error";
    uploadDate?: string;
    xhr?: XMLHttpRequest;
  }

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<UploadedFile | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4 state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [lessons, setLessons] = useState<LessonInfo[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryItem[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeCategoryMain, setActiveCategoryMain] = useState(CATEGORY_TREE[0].main);
  const [categoryLimitMsg, setCategoryLimitMsg] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [learningPoints, setLearningPoints] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState<string[]>([""]);
  const [courseDetail, setCourseDetail] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // AI 자동작성 패널
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiConcept, setAiConcept] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "안녕하세요! 수업 컨셉을 알려주시면 강의 정보를 자동으로 작성해 드릴게요.\n\n예시: \"중소기업 경리담당자를 위한 부가가치세 신고 실무 강의\"" },
  ]);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  const courseTitleRef = useRef<HTMLInputElement>(null);
  const lessonInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const richEditorRef = useRef<RichTextEditorHandle>(null);
  const previewWindowRef = useRef<Window | null>(null);

  // Derived
  const allSelected =
    uploadedFiles.length > 0 &&
    uploadedFiles.every((f) => selectedIds.has(f.id));

  const allAgreed = AGREEMENT_ITEMS.every((item) => agreements[item.id]);

  const isCourseInfoValid =
    courseTitle.trim() !== "" &&
    selectedCategories.length > 0 &&
    lessons.every((l) => l.lessonTitle.trim() !== "");

  const firstEmptyLessonIndex = lessons.findIndex(
    (l) => l.lessonTitle.trim() === ""
  );

  // Step 4 진입 시 lessons 초기화
  useEffect(() => {
    if (currentStep === 4) {
      setLessons(
        uploadedFiles
          .filter((f) => f.status === "complete")
          .map((f) => ({
            fileId: f.id,
            fileName: f.name,
            lessonTitle: "",
          }))
      );
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(uploadedFiles.map((f) => f.id)));
    }
  };

  const toggleAgreement = (id: string) => {
    setAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllAgreements = () => {
    const newValue = !allAgreed;
    setAgreements(
      Object.fromEntries(AGREEMENT_ITEMS.map((item) => [item.id, newValue]))
    );
  };

  // 페이지 진입 시 기존 업로드 파일 목록 로드
  useEffect(() => {
    if (currentStep >= 3) {
      fetch("/api/expert/upload")
        .then((res) => res.json())
        .then((files: Omit<UploadedFile, "progress" | "status">[]) => {
          setUploadedFiles(
            files.map((f) => ({ ...f, progress: 100, status: "complete" as const }))
          );
        })
        .catch(() => {});
    }
  }, [currentStep]);

  const uploadFile = useCallback((file: File, tempId: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === tempId ? { ...f, progress } : f))
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === tempId
              ? {
                  ...f,
                  id: result.id,
                  progress: 100,
                  status: "complete" as const,
                  uploadDate: result.uploadDate,
                  xhr: undefined,
                }
              : f
          )
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === tempId
              ? { ...f, status: "error" as const, xhr: undefined }
              : f
          )
        );
      }
    };

    xhr.onerror = () => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === tempId
            ? { ...f, status: "error" as const, xhr: undefined }
            : f
        )
      );
    };

    xhr.open("POST", "/api/expert/upload");
    xhr.send(formData);

    return xhr;
  }, []);

  const addFiles = useCallback(
    (files: FileList) => {
      const videoExts = [".mp4", ".mkv", ".m4v", ".mov"];
      Array.from(files)
        .filter((f) => videoExts.some((ext) => f.name.toLowerCase().endsWith(ext)))
        .forEach((f) => {
          const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const xhr = uploadFile(f, tempId);
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: tempId,
              name: f.name,
              size: f.size,
              progress: 0,
              status: "uploading" as const,
              xhr,
            },
          ]);
        });
    },
    [uploadFile]
  );

  const requestRemove = useCallback((file: UploadedFile) => {
    setConfirmTarget(file);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!confirmTarget) return;
    if (confirmTarget.status === "uploading" && confirmTarget.xhr) {
      confirmTarget.xhr.abort();
    } else if (confirmTarget.status === "complete") {
      fetch("/api/expert/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmTarget.id }),
      }).catch(() => {});
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== confirmTarget.id));
    setConfirmTarget(null);
  }, [confirmTarget]);

  const confirmBulkDelete = useCallback(() => {
    uploadedFiles.forEach((file) => {
      if (!selectedIds.has(file.id)) return;
      if (file.status === "uploading" && file.xhr) {
        file.xhr.abort();
      } else if (file.status === "complete") {
        fetch("/api/expert/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: file.id }),
        }).catch(() => {});
      }
    });
    setUploadedFiles((prev) => prev.filter((f) => !selectedIds.has(f.id)));
    setSelectedIds(new Set());
    setShowBulkDeleteConfirm(false);
  }, [uploadedFiles, selectedIds]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // AI 자동작성: 컨셉으로부터 수업 정보 생성
  const handleAiGenerate = useCallback(async () => {
    const concept = aiConcept.trim();
    if (!concept || aiGenerating) return;

    setAiMessages((prev) => [...prev, { role: "user", text: concept }]);
    setAiConcept("");
    setAiGenerating(true);

    // 스크롤
    setTimeout(() => aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    // 시뮬레이션: 실제 환경에서는 AI API 호출
    await new Promise((r) => setTimeout(r, 1800));

    // 생성된 데이터로 폼 자동 입력
    const generated = generateFromConcept(concept, lessons.length);
    setCourseTitle(generated.title);
    setCourseDescription(generated.description);
    setLearningPoints(generated.learningPoints);
    setTargetAudience(generated.targetAudience);
    setTags(generated.tags);
    setCourseDetail(generated.courseDetail);
    richEditorRef.current?.setContent(generated.courseDetail);
    // 커리큘럼 수업 제목 자동 입력
    setLessons((prev) =>
      prev.map((l, i) => ({
        ...l,
        lessonTitle: generated.lessonTitles[i] ?? l.lessonTitle,
      }))
    );

    const lessonInfo = lessons.length > 0 ? `\n✅ 커리큘럼 수업 제목 (${lessons.length}개)` : "";
    setAiMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: `수업 정보를 자동 작성했습니다!\n\n✅ 강의 제목\n✅ 강의 소개\n✅ 학습 결과 (${generated.learningPoints.length}개)\n✅ 추천 대상 (${generated.targetAudience.length}개)\n✅ 태그 (${generated.tags.length}개)\n✅ 강의 상세정보${lessonInfo}\n\n내용을 확인하고 필요한 부분을 수정해 주세요.`,
      },
    ]);
    setAiGenerating(false);
    setTimeout(() => aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [aiConcept, aiGenerating, lessons]);

  // 미리보기: 폼 데이터 → LectureDetail 변환 후 새 창 열기
  const handlePreview = useCallback(() => {
    const previewData: LectureDetail = {
      id: "preview",
      title: courseTitle.trim() || "강의 제목 미입력",
      description: courseDescription.trim() || "강의 소개 미입력",
      categories: selectedCategories,
      tags,
      learningPoints: learningPoints.filter((p) => p.trim()),
      targetAudience: targetAudience.filter((t) => t.trim()),
      detail: courseDetail,
      curriculum: lessons.map((l) => ({
        title: l.lessonTitle.trim() || "수업 제목 미입력",
        duration: "00:00",
      })),
      instructor: {
        name: session?.user?.name ?? "전문가",
        bio: "",
      },
      price: 0,
      rating: 0,
      reviewCount: 0,
      studentCount: 0,
      totalDuration: `${lessons.length}강`,
      lessonCount: lessons.length,
      level: "입문",
      updatedAt: new Date().toISOString().slice(0, 10),
      reviews: [],
      faqs: [],
    };
    sessionStorage.setItem("lecture-preview", JSON.stringify(previewData));
    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      previewWindowRef.current.location.reload();
      previewWindowRef.current.focus();
    } else {
      previewWindowRef.current = window.open("/lectures/preview", "_blank");
    }
  }, [courseTitle, courseDescription, selectedCategories, tags, learningPoints, targetAudience, courseDetail, lessons, session]);

  const handleStep4Next = useCallback(() => {
    if (courseTitle.trim() === "") {
      courseTitleRef.current?.focus();
      courseTitleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (firstEmptyLessonIndex >= 0) {
      lessonInputRefs.current[firstEmptyLessonIndex]?.focus();
      lessonInputRefs.current[firstEmptyLessonIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    // Step 5 미구현 — no-op
  }, [courseTitle, firstEmptyLessonIndex]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user?.role !== "expert") {
      router.replace("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
      </div>
    );
  }

  if (status !== "authenticated" || session?.user?.role !== "expert") {
    return null;
  }

  const currentStepLabel = ALL_STEPS.find((s) => s.step === currentStep)?.label ?? "";

  return (
    <div className="min-h-screen">
      {/* ── 업로드 전용 헤더 ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4">
          {/* 좌: 로고 */}
          <Link href="/" className="flex w-52 shrink-0 items-center gap-2">
            <img src="/images/logo.svg" alt="BIZSCHOOL" width={28} height={28} />
            <span className="font-logo text-2xl text-[var(--color-dark)]">BIZSCHOOL</span>
          </Link>
          {/* 중앙: 단계 표시 */}
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span className="font-bold text-[var(--color-primary)]">{currentStep}/{TOTAL_STEPS}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{currentStepLabel}</span>
          </div>
          {/* 우: 미리보기 + 임시저장 + 나가기 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <Eye size={15} />
              <span className="hidden sm:inline">미리보기</span>
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <Save size={15} />
              <span className="hidden sm:inline">임시저장</span>
            </button>
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]"
              aria-label="나가기"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── 나가기 확인 모달 ── */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-6 shadow-xl">
            <p className="text-center text-base font-medium text-[var(--color-dark)]">
              작업을 중단하고 나가시겠습니까?
            </p>
            <p className="mt-1 text-center text-sm text-[var(--color-muted)]">
              저장하지 않은 내용은 사라질 수 있습니다.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-[var(--color-dark)] hover:bg-gray-50"
              >
                계속 작업하기
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 rounded-lg bg-[var(--color-dark)] py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}

    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 lg:max-w-none">
      {/* ── Page heading ── */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-dark)]">
          {currentStep === 1
            ? `안녕하세요. ${session.user.name}님`
            : currentStep === 2
            ? "강의 업로드 안내"
            : currentStep === 3
            ? "영상 일괄 업로드"
            : "수업 정보 입력"}
        </h1>
        <p className="mt-2 text-base text-[var(--color-muted)]">
          {currentStep === 1
            ? "업로드할 컨텐츠를 선택해주세요."
            : currentStep === 2
            ? "아래 내용을 확인하고 동의해주세요."
            : currentStep === 3
            ? "강의에 사용할 영상 파일을 업로드 해주세요."
            : "강의 제목, 설명, 커리큘럼을 입력해주세요."}
        </p>
      </div>
      {/* ── Two-column layout ── */}
      <div className="relative mx-auto flex max-w-3xl items-stretch">
      {/* ── Left sidebar ── */}
      <aside className="absolute right-full mr-8 hidden w-52 shrink-0 lg:block">
        <div className="sticky top-[72px] rounded-2xl border border-gray-200 bg-white p-5">
          {STEP_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-6" : ""}>
              <p className="mb-3 text-sm font-bold text-[var(--color-dark)]">
                {group.groupTitle}
              </p>
              <div>
                {group.steps.map((s, si) => {
                  const isCompleted = s.step < currentStep;
                  const isActive = s.step === currentStep;
                  const isLast = si === group.steps.length - 1;
                  return (
                    <div key={s.step}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                            isCompleted
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : isActive
                              ? "border-[var(--color-primary)] bg-white text-[var(--color-primary)]"
                              : "border-gray-200 bg-white text-gray-400"
                          }`}
                        >
                          {isCompleted ? <Check size={14} /> : s.step}
                        </div>
                        <span
                          className={`text-sm ${
                            isActive
                              ? "font-bold text-[var(--color-dark)]"
                              : isCompleted
                              ? "font-medium text-[var(--color-primary)]"
                              : "text-gray-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {!isLast && (
                        <div className="ml-[15px] h-5 w-0.5 bg-gray-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right sidebar: AI 자동작성 (Step 4 only) ── */}
      {currentStep === 4 && (
        <aside className="absolute left-full ml-8 hidden h-full lg:block">
          <div className="sticky top-[160px]">
            <button
              type="button"
              onClick={() => setShowAiPanel(true)}
              className={`flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#155dfc] to-[#3db5b5] py-3 pl-4 pr-5 text-white transition-all hover:scale-105 active:scale-95 ${
                showAiPanel ? "pointer-events-none opacity-0" : ""
              }`}
              aria-label="AI 자동작성"
            >
              <Sparkles size={18} />
              <span className="whitespace-nowrap text-sm font-bold">AI 자동작성</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── Main content ── */}
      <div className="w-full">
      {/* ── Step 1: 콘텐츠 유형 선택 ── */}
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CONTENT_TYPES.map((ct) => (
              <ContentTypeCard
                key={ct.type}
                icon={ct.icon}
                title={ct.title}
                subtitle={ct.subtitle}
                description={ct.description}
                tags={ct.tags}
                isSelected={selectedType === ct.type}
                onSelect={() => setSelectedType(ct.type)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Step 2: 동의 ── */}
      {currentStep === 2 && (
        <>
          <div>
            <button
              type="button"
              onClick={toggleAllAgreements}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left"
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  allAgreed
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {allAgreed && <Check size={14} className="text-white" />}
              </div>
              <span className="text-base font-bold text-[var(--color-dark)]">
                전체 동의
              </span>
            </button>

            <div className="my-4 border-t border-gray-200" />

            <div className="space-y-3">
              {AGREEMENT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleAgreement(item.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        agreements[item.id]
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {agreements[item.id] && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-dark)]">
                      {item.title}{" "}
                      <span className="text-xs text-[var(--color-primary)]">
                        (필수)
                      </span>
                    </span>
                  </button>

                  <div className="border-t border-gray-100 px-5 pb-4 pt-3">
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm leading-relaxed text-[var(--color-muted)]"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Step 3: 영상 업로드 ── */}
      {currentStep === 3 && (
        <>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-8 py-10 transition-colors ${
              isDragging
                ? "border-[var(--color-primary)] bg-[#f0fdf7]"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8faf3]">
              <CloudUpload size={24} className="text-[var(--color-primary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-dark)]">
              파일을 여기에 드래그하거나 클릭하세요.
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              파일당 최대 크기 5GB, .mp4, .mkv, .m4v, .mov 형식 파일만 가능, 최소
              해상도 720p 이상
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mkv,.m4v,.mov"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          <div className="mt-8">
            {uploadedFiles.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200 text-left text-xs text-[var(--color-muted)]">
                      <th className="w-10 py-2.5 pl-4 pr-0">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
                        />
                      </th>
                      <th className="py-2.5 pl-2 pr-2 font-medium">파일명</th>
                      <th className="py-2.5 pl-2 pr-[90px] text-right font-medium">업로드일시</th>
                      <th className="w-24 py-2.5 pr-4 text-right font-medium">
                        {selectedIds.size > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowBulkDeleteConfirm(true)}
                            className="cursor-pointer text-xs font-medium text-red-500 hover:text-red-600"
                          >
                            선택 삭제 ({selectedIds.size})
                          </button>
                        )}
                      </th>
                    </tr>
                  </thead>
                </table>
                <div className="max-h-[440px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {uploadedFiles.map((file) => (
                        <tr
                          key={file.id}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="w-10 py-3 pl-4 pr-0">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(file.id)}
                              onChange={() => toggleSelect(file.id)}
                              className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
                            />
                          </td>
                          <td className="py-3 pl-2 pr-2">
                            <div className="flex items-center gap-2.5">
                              {file.status === "uploading" && (
                                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--color-primary)]" />
                              )}
                              <span className="truncate text-[var(--color-dark)]">
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pl-2 pr-4">
                            {file.status === "uploading" ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-[var(--color-primary)]">
                                  {file.progress}%
                                </span>
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-[var(--color-muted)]">
                                {file.uploadDate}
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {file.status === "uploading" ? (
                              <button
                                type="button"
                                onClick={() => requestRemove(file)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X size={16} />
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-4">
                                <a
                                  href={`/api/expert/upload/${encodeURIComponent(file.id)}`}
                                  download
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Download size={16} />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => requestRemove(file)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Step 4: 수업 정보 입력 ── */}
      {currentStep === 4 && (
        <>
          <div className="space-y-6">
            {/* 폼 영역 */}
              <>
                {/* 강의 제목 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    강의 제목 <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={courseTitleRef}
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="강의 제목을 입력해주세요."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <hr className="border-gray-200" />

                {/* 강의 소개 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    강의 소개 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setCourseDescription(e.target.value);
                      }
                    }}
                    rows={6}
                    placeholder="강의 소개를 입력해주세요."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  <p className="mt-1 text-right text-xs text-[var(--color-muted)]">
                    {courseDescription.length} / 500자
                  </p>
                </div>

                <hr className="border-gray-200" />

                {/* 카테고리 선택 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    카테고리 (최소 1개) <span className="text-red-400">*</span>
                  </label>
                  <p className="mb-2 text-xs text-[var(--color-muted)]">
                    카테고리를 최소 1개 이상 추가해주세요.
                  </p>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="min-w-[60px] cursor-pointer rounded-lg border border-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                    >
                      {selectedCategories.length > 0 ? "수정" : "+ 추가"}
                    </button>
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {selectedCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                        >
                          {cat.main} &gt; {cat.sub}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="opacity-60 hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* 강의를 들음으로써 얻게 되는 것들 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    강의를 들음으로써 얻게 되는 것들 (최소 1개) <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {learningPoints.map((point, idx) => (
                      <div key={idx} className="relative">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) =>
                            setLearningPoints((prev) =>
                              prev.map((p, i) => (i === idx ? e.target.value : p))
                            )
                          }
                          placeholder={`학습 결과 ${idx + 1}`}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setLearningPoints((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setLearningPoints((prev) => [...prev, ""])}
                      className="cursor-pointer rounded-lg border border-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                    >
                      + 추가
                    </button>
                  </div>
                </div>
                <hr className="border-gray-200" />

                {/* 강의를 추천할 대상 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    강의를 추천할 대상 (최소 1개) <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {targetAudience.map((item, idx) => (
                      <div key={idx} className="relative">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            setTargetAudience((prev) =>
                              prev.map((p, i) => (i === idx ? e.target.value : p))
                            )
                          }
                          placeholder={`추천 대상 ${idx + 1}`}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setTargetAudience((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setTargetAudience((prev) => [...prev, ""])}
                      className="cursor-pointer rounded-lg border border-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                    >
                      + 추가
                    </button>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* 강의 상세정보 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    강의 상세정보
                  </label>
                  <RichTextEditor
                    ref={richEditorRef}
                    content={courseDetail}
                    onChange={(html) => setCourseDetail(html)}
                    placeholder="수강생이 알아야 할 강의의 상세 내용을 입력해주세요. (커리큘럼 구성, 실습 환경, 사전 지식 등)"
                  />
                </div>

                <hr className="border-gray-200" />

                {/* 태그 입력 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-dark)]">
                    태그
                  </label>
                  {tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-[var(--color-dark)]"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() =>
                              setTags((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const trimmed = tagInput.trim().replace(/^#/, "");
                        if (trimmed && !tags.includes(trimmed)) {
                          setTags((prev) => [...prev, trimmed]);
                        }
                        setTagInput("");
                      }
                    }}
                    placeholder="태그 입력 후 Enter (예: 세금신고, 연말정산)"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Enter 또는 쉼표(,)로 태그를 추가할 수 있습니다.
                  </p>
                </div>

                <hr className="border-gray-200" />

                {/* 커리큘럼 */}
                <div>
                  <p className="mb-3 text-sm font-medium text-[var(--color-dark)]">
                    커리큘럼
                  </p>
                  {lessons.length === 0 ? (
                    <p className="text-sm text-[var(--color-muted)]">
                      업로드된 영상이 없습니다. 이전 단계에서 영상을 업로드해주세요.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {lessons.map((lesson, idx) => (
                        <div
                          key={lesson.fileId}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="shrink-0 text-xs font-bold text-[var(--color-muted)]">
                              {idx + 1}
                            </span>
                            <span className="flex-1 truncate text-xs text-[var(--color-muted)]">
                              {lesson.fileName}
                            </span>
                            {lesson.lessonTitle.trim() === "" && (
                              <span className="text-xs text-gray-400">미입력</span>
                            )}
                          </div>
                          <input
                            ref={(el) => { lessonInputRefs.current[idx] = el; }}
                            type="text"
                            value={lesson.lessonTitle}
                            onChange={(e) => {
                              setLessons((prev) =>
                                prev.map((l, i) =>
                                  i === idx
                                    ? { ...l, lessonTitle: e.target.value }
                                    : l
                                )
                              );
                            }}
                            placeholder="수업 제목을 입력해주세요."
                            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
          </div>

          {/* ── AI 자동작성 사이드 패널 ── */}
          {/* 패널 */}
          <div
            className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ${
              showAiPanel ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* 패널 헤더 */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#155dfc] to-[#3db5b5]">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-dark)]">AI 자동작성</h3>
                  <p className="text-xs text-[var(--color-muted)]">수업 컨셉을 입력해주세요</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiPanel(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* 채팅 영역 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-[var(--color-primary)] text-white rounded-br-md"
                          : "bg-gray-100 text-[var(--color-dark)] rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {aiGenerating && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm text-[var(--color-muted)]">
                      <Loader2 size={16} className="animate-spin" />
                      수업 정보를 생성하고 있어요...
                    </div>
                  </div>
                )}
                <div ref={aiChatEndRef} />
              </div>
            </div>

            {/* 입력 영역 */}
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={aiConcept}
                  onChange={(e) => setAiConcept(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAiGenerate();
                    }
                  }}
                  placeholder="예: 중소기업 경리담당자를 위한 부가가치세 신고 실무 강의"
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--color-dark)] outline-none placeholder:text-gray-400 focus:border-[#155dfc] focus:ring-1 focus:ring-[#155dfc]"
                />
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={!aiConcept.trim() || aiGenerating}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    aiConcept.trim() && !aiGenerating
                      ? "bg-gradient-to-r from-[#155dfc] to-[#3db5b5] text-white hover:opacity-90 cursor-pointer"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
                Enter로 전송 · Shift+Enter로 줄바꿈
              </p>
            </div>
          </div>

          {/* 카테고리 설정 모달 */}
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="flex h-[540px] w-full max-w-[520px] flex-col rounded-2xl bg-white shadow-2xl">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-[var(--color-dark)]">카테고리 설정</h2>
                  <button
                    type="button"
                    onClick={() => { setShowCategoryModal(false); setCategoryLimitMsg(false); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 모달 바디: 대분류 | 소분류 */}
                <div className="flex flex-1 overflow-hidden">
                  {/* 대분류 */}
                  <div className="w-[160px] shrink-0 space-y-1 overflow-y-auto p-3">
                    {CATEGORY_TREE.map((group) => {
                      const count = selectedCategories.filter((c) => c.main === group.main).length;
                      return (
                        <button
                          key={group.main}
                          type="button"
                          onClick={() => setActiveCategoryMain(group.main)}
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-5 py-3 text-left text-sm font-medium transition-colors ${
                            activeCategoryMain === group.main
                              ? "bg-[var(--color-primary-light)] font-bold text-[var(--color-primary)]"
                              : "text-[var(--color-dark)] hover:bg-gray-100"
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            count > 0 ? "bg-[var(--color-primary)] text-white" : ""
                          }`}>
                            {count > 0 ? count : ""}
                          </span>
                          <span className="flex h-7 items-center">{group.main}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 소분류 */}
                  <div className="flex-1 space-y-2 overflow-y-auto p-3">
                    {CATEGORY_TREE.find((g) => g.main === activeCategoryMain)?.subs.map((sub) => {
                      const isSelected = selectedCategories.some(
                        (c) => c.main === activeCategoryMain && c.sub === sub
                      );
                      const isDisabled = !isSelected && selectedCategories.length >= 3;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategories((prev) =>
                                prev.filter(
                                  (c) => !(c.main === activeCategoryMain && c.sub === sub)
                                )
                              );
                              setCategoryLimitMsg(false);
                            } else if (isDisabled) {
                              setCategoryLimitMsg(true);
                            } else {
                              setSelectedCategories((prev) => [
                                ...prev,
                                { main: activeCategoryMain, sub },
                              ]);
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                            isDisabled
                              ? "cursor-not-allowed border-gray-200"
                              : isSelected
                              ? "cursor-pointer border-[var(--color-primary)] bg-white hover:bg-gray-50"
                              : "cursor-pointer border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`text-sm ${isSelected ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-dark)]"}`}>
                            <span className="mr-1.5 text-[var(--color-muted)]">#</span>
                            {sub}
                          </span>
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isSelected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                                : "border-gray-300 text-gray-400"
                            }`}
                          >
                            {isSelected ? <Check size={13} /> : <span className="text-base leading-none">+</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 모달 푸터 */}
                <div className="border-t border-gray-100 px-6 py-4">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-[var(--color-dark)]">
                      선택한 카테고리{" "}
                      <span className={selectedCategories.length > 0 ? "text-[var(--color-primary)]" : ""}>
                        {selectedCategories.length}
                      </span>
                      /3
                      {categoryLimitMsg && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-xs font-normal text-red-400">
                          <Info size={12} />
                          더 이상 선택할 수 없어요.
                        </span>
                      )}
                    </p>
                    {selectedCategories.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-light)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]"
                      >
                        {cat.main} &gt; {cat.sub}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategories((prev) => prev.filter((_, i) => i !== idx));
                            setCategoryLimitMsg(false);
                          }}
                          className="opacity-60 hover:opacity-100"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    </div>}
                  </div>
                  <button
                    type="button"
                    disabled={selectedCategories.length === 0}
                    onClick={() => { setShowCategoryModal(false); setCategoryLimitMsg(false); }}
                    className={`w-full rounded-xl py-3 text-sm font-bold transition-colors ${
                      selectedCategories.length > 0
                        ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                        : "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                  >
                    선택 완료
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}

      {/* ── Step indicator ── */}
      <div className="mt-12 flex items-center justify-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full ${
              i < currentStep ? "bg-[var(--color-primary)]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* ── Navigation buttons ── */}
      <div className="mt-6 flex justify-center gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            className="rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-gray-50"
          >
            이전
          </button>
        )}
        <button
          type="button"
          disabled={
            (currentStep === 2 && !allAgreed) ||
            (currentStep === 4 && !isCourseInfoValid)
          }
          onClick={() => {
            if (currentStep === 4) {
              handleStep4Next();
              return;
            }
            if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
          }}
          className={`rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-colors ${
            (currentStep === 2 && !allAgreed) ||
            (currentStep === 4 && !isCourseInfoValid)
              ? "cursor-not-allowed bg-gray-300"
              : "bg-[var(--color-primary)] hover:opacity-90"
          }`}
        >
          다음
        </button>
      </div>


      {/* ── 개별 삭제 확인 모달 ── */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-6 shadow-xl">
            <p className="text-center text-base font-medium text-[var(--color-dark)]">
              {confirmTarget.status === "uploading"
                ? "업로드를 중단할까요?"
                : "파일을 삭제할까요?"}
            </p>
            <p className="mt-1 truncate text-center text-sm text-[var(--color-muted)]">
              {confirmTarget.name}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-[var(--color-dark)] hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 일괄 삭제 확인 모달 ── */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-6 shadow-xl">
            <p className="text-center text-base font-medium text-[var(--color-dark)]">
              선택한 파일을 삭제할까요?
            </p>
            <p className="mt-1 text-center text-sm text-[var(--color-muted)]">
              총 {selectedIds.size}개의 파일이 삭제됩니다.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-[var(--color-dark)] hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      </div>{/* ── /Main content ── */}
      </div>{/* ── /Two-column layout ── */}
    </div>
    </div>
  );
}
