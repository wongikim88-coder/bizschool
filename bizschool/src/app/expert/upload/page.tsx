"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Video,
  FileText,
  Check,
  CloudUpload,
  X,
  Download,
  Trash2,
} from "lucide-react";
import ContentTypeCard from "@/components/expert/ContentTypeCard";

type ContentType = "lecture" | "column";

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

const TOTAL_STEPS = 5;

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allAgreed = AGREEMENT_ITEMS.every((item) => agreements[item.id]);

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

  const removeFile = useCallback((file: UploadedFile) => {
    // 업로드 중이면 취소
    if (file.status === "uploading" && file.xhr) {
      file.xhr.abort();
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
      return;
    }
    // 완료된 파일은 서버에서도 삭제
    if (file.status === "complete") {
      fetch("/api/expert/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id }),
      }).catch(() => {});
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
  }, []);

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

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-16">
      {currentStep === 1 && (
        <>
          {/* Greeting */}
          <h1 className="text-center text-3xl font-bold text-[var(--color-dark)]">
            안녕하세요. {session.user.name}님
          </h1>
          <p className="mt-2 text-center text-base text-[var(--color-muted)]">
            업로드할 컨텐츠를 선택해주세요.
          </p>

          {/* Content type cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
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

      {currentStep >= 3 && (
        <>
          <h1 className="text-center text-3xl font-bold text-[var(--color-dark)]">
            영상 일괄 업로드
          </h1>
          <p className="mt-2 text-center text-base text-[var(--color-muted)]">
            강의에 사용할 영상 파일을 업로드 해주세요.
          </p>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-8 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-8 py-10 transition-colors ${
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

          {/* File list */}
          <div className="mt-8">
            {/* File table */}
            {uploadedFiles.length > 0 && (
              <table className="mt-2 w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-[var(--color-muted)]">
                    <th className="py-2.5 pl-3 pr-2 font-medium">파일명</th>
                    <th className="py-2.5 pr-3 text-right font-medium">
                      업로드일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 pl-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          {file.status === "uploading" ? (
                            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--color-primary)]" />
                          ) : (
                            <div className="h-4 w-4 shrink-0 rounded-full bg-[var(--color-primary)]" />
                          )}
                          <span className="truncate text-[var(--color-dark)]">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center justify-end gap-2">
                          {file.status === "uploading" ? (
                            <>
                              <span className="text-xs font-medium text-[var(--color-primary)]">
                                {file.progress}%
                              </span>
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(file)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-[var(--color-muted)]">
                                {file.uploadDate}
                              </span>
                              <a
                                href={`/api/expert/upload/${encodeURIComponent(file.id)}`}
                                download
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Download size={16} />
                              </a>
                              <button
                                type="button"
                                onClick={() => removeFile(file)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          {/* Step 2 Header */}
          <h1 className="text-center text-3xl font-bold text-[var(--color-dark)]">
            강의 업로드 안내
          </h1>
          <p className="mt-2 text-center text-base text-[var(--color-muted)]">
            아래 내용을 확인하고 동의해주세요.
          </p>

          {/* Agreement Section */}
          <div className="mt-8">
            {/* Select All */}
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

            {/* Divider */}
            <div className="my-4 border-t border-gray-200" />

            {/* Individual items */}
            <div className="space-y-3">
              {AGREEMENT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white"
                >
                  {/* Item header — click to toggle checkbox */}
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

                  {/* Details — always visible */}
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

      {/* Step indicator */}
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

      {/* Navigation buttons */}
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
          disabled={currentStep === 2 && !allAgreed}
          onClick={() => {
            if (currentStep < 3) setCurrentStep((s) => s + 1);
          }}
          className={`rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-colors ${
            currentStep === 2 && !allAgreed
              ? "cursor-not-allowed bg-gray-300"
              : "bg-[var(--color-primary)] hover:opacity-90"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
