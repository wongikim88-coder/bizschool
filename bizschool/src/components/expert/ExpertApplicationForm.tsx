"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, CheckCircle, GraduationCap, Sparkles } from "lucide-react";

const PREDEFINED_TAGS = [
  "회계",
  "세무",
  "4대보험",
  "인사·총무",
  "경영전략",
  "마케팅",
  "재무관리",
  "IT/디지털",
];

const MAX_PROFILE_LENGTH = 1000;
const MAX_COURSE_LENGTH = 2000;
const VERIFICATION_TIMEOUT = 180; // 3 minutes in seconds

export default function ExpertApplicationForm() {
  const router = useRouter();

  // ── Form fields ──
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileIntro, setProfileIntro] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  // ── Phone verification ──
  const [verificationStep, setVerificationStep] = useState<
    "idle" | "sent" | "verified"
  >("idle");
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(0);

  // ── UI state ──
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ── Timer countdown ──
  useEffect(() => {
    if (verificationStep !== "sent" || timer <= 0) return;
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [verificationStep, timer]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ── Draft detection ──
  const hasDraft =
    name.trim() !== "" ||
    phone.trim() !== "" ||
    profileIntro.trim() !== "" ||
    tags.length > 0 ||
    courseDescription.trim() !== "";

  // ── Validation ──
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "실명을 입력해주세요";
    if (!phone.trim()) newErrors.phone = "연락처를 입력해주세요";
    else if (verificationStep !== "verified")
      newErrors.phone = "본인인증을 완료해주세요";
    if (!profileIntro.trim())
      newErrors.profileIntro = "프로필 소개를 입력해주세요";
    if (profileIntro.length > MAX_PROFILE_LENGTH)
      newErrors.profileIntro = `프로필 소개는 ${MAX_PROFILE_LENGTH}자 이내로 작성해주세요`;
    if (tags.length === 0)
      newErrors.tags = "강의 주제를 1개 이상 선택해주세요";
    if (!courseDescription.trim())
      newErrors.courseDescription = "강의 설명을 입력해주세요";
    if (courseDescription.length > MAX_COURSE_LENGTH)
      newErrors.courseDescription = `강의 설명은 ${MAX_COURSE_LENGTH}자 이내로 작성해주세요`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, phone, verificationStep, profileIntro, tags, courseDescription]);

  // ── Handlers ──
  const handleSendCode = () => {
    if (!phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "연락처를 입력해주세요" }));
      return;
    }
    setVerificationStep("sent");
    setTimer(VERIFICATION_TIMEOUT);
    setVerificationCode("");
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      setVerificationStep("verified");
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setErrors((prev) => ({ ...prev, tags: "" }));
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
    setCustomTag("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleCancel = () => {
    if (hasDraft) {
      setShowLeaveModal(true);
    } else {
      router.push("/");
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setShowSuccessModal(true);
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div>
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#101828] via-[#1e2839] to-[#155dfc] px-6 pb-10 pt-14 text-center sm:px-12 sm:pb-14 sm:pt-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#155dfc]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#2b7fff]/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-white/90" />
          <Sparkles className="h-5 w-5 text-yellow-300/80" />
        </div>

        <h1 className="relative mt-4 text-3xl font-bold leading-snug text-white sm:text-4xl">
          전문가로 지원하기
        </h1>
        <p className="relative mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
          BIZSCHOOL에서 강의를 제작하고 판매해보세요.
          <br className="sm:hidden" /> 전문 지식을 나누며 수익을 창출할 수 있습니다.
        </p>

        <div className="relative mt-7 flex flex-wrap justify-center gap-2">
          {["강의 제작", "수익 창출", "전문가 브랜딩"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Form Container ── */}
      <div className="mx-auto max-w-[800px] px-4 py-8 sm:py-12">
        <h2 className="text-xl font-bold text-[var(--color-dark)]">
          지원서 작성
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          <span className="text-[var(--color-red)]">*</span> 표시는 필수 항목입니다
        </p>
        <hr className="my-6 border-[var(--color-border)]" />

        <div className="space-y-7">
          {/* ── 1. 실명 ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              실명 <span className="text-[var(--color-red)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              placeholder="실명을 입력해주세요"
              className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-[var(--color-red)]">
                {errors.name}
              </p>
            )}
          </div>

          {/* ── 2. 연락처 + 본인인증 ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              연락처 <span className="text-[var(--color-red)]">*</span>
            </label>

            {/* Phone input + send button */}
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearFieldError("phone");
                }}
                placeholder="010-0000-0000"
                disabled={verificationStep === "verified"}
                className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:bg-gray-50 disabled:text-[var(--color-muted)]"
              />
              {verificationStep !== "verified" && (
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="shrink-0 rounded-lg bg-[var(--color-dark-navy)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-dark-deep)]"
                >
                  {verificationStep === "sent"
                    ? "재발송"
                    : "인증번호 발송"}
                </button>
              )}
            </div>

            {/* Verification code input */}
            {verificationStep === "sent" && (
              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setVerificationCode(val);
                    }}
                    placeholder="인증번호 6자리"
                    maxLength={6}
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  {timer > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-red)]">
                      {formatTimer(timer)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || timer === 0}
                  className="shrink-0 rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  확인
                </button>
              </div>
            )}

            {/* Verified badge */}
            {verificationStep === "verified" && (
              <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <CheckCircle size={16} />
                인증 완료
              </div>
            )}

            {errors.phone && (
              <p className="mt-1.5 text-xs text-[var(--color-red)]">
                {errors.phone}
              </p>
            )}
          </div>

          {/* ── 3. 프로필 소개 ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              프로필 소개 <span className="text-[var(--color-red)]">*</span>
            </label>
            <p className="mb-2 text-xs text-[var(--color-muted)]">
              경력, 전문 분야 등 수강생에게 어필할 수 있는 소개를 작성해주세요
            </p>
            <div className="relative">
              <textarea
                value={profileIntro}
                onChange={(e) => {
                  setProfileIntro(e.target.value);
                  clearFieldError("profileIntro");
                }}
                placeholder="전문 분야, 경력, 자격증 등을 자유롭게 소개해주세요"
                className="min-h-[140px] w-full resize-y rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <span className="absolute bottom-3 right-3 text-sm text-[var(--color-muted)]">
                {profileIntro.length}/{MAX_PROFILE_LENGTH}
              </span>
            </div>
            {errors.profileIntro && (
              <p className="mt-1.5 text-xs text-[var(--color-red)]">
                {errors.profileIntro}
              </p>
            )}
          </div>

          {/* ── 4. 강의 주제/관심 분야 ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              강의 주제 / 관심 분야{" "}
              <span className="text-[var(--color-red)]">*</span>
            </label>
            <p className="mb-3 text-xs text-[var(--color-muted)]">
              1개 이상 선택하거나 직접 입력해주세요
            </p>

            {/* Predefined tags */}
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    tags.includes(tag)
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-body)] hover:border-gray-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom tag input */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                placeholder="직접 입력"
                className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="shrink-0 rounded-lg border border-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                추가
              </button>
            </div>

            {/* Selected tags (removable pills) */}
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-primary)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[var(--color-primary)]/20"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {errors.tags && (
              <p className="mt-1.5 text-xs text-[var(--color-red)]">
                {errors.tags}
              </p>
            )}
          </div>

          {/* ── 5. 제작할 강의 설명 ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              제작할 강의 설명{" "}
              <span className="text-[var(--color-red)]">*</span>
            </label>
            <div className="relative">
              <textarea
                value={courseDescription}
                onChange={(e) => {
                  setCourseDescription(e.target.value);
                  clearFieldError("courseDescription");
                }}
                placeholder="제작하고 싶은 강의의 주제, 대상 수강생, 강의 구성 등을 설명해주세요"
                className="min-h-[200px] w-full resize-y rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <span className="absolute bottom-3 right-3 text-sm text-[var(--color-muted)]">
                {courseDescription.length}/{MAX_COURSE_LENGTH}
              </span>
            </div>
            {errors.courseDescription && (
              <p className="mt-1.5 text-xs text-[var(--color-red)]">
                {errors.courseDescription}
              </p>
            )}
          </div>

          {/* ── Buttons ── */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              지원서 제출
            </button>
          </div>
        </div>
      </div>

      {/* ── Leave Confirmation Modal ── */}
      {showLeaveModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowLeaveModal(false)}
          >
            <div
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <p className="mb-2 text-center font-medium text-[var(--color-dark)]">
                작성 중인 내용이 저장되지 않습니다.
              </p>
              <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
                페이지를 떠나시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                >
                  계속 작성
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                >
                  나가기
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── Success Modal ── */}
      {showSuccessModal &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/50">
            <div
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 text-center"
              role="dialog"
              aria-modal="true"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="mb-2 text-lg font-bold text-[var(--color-dark)]">
                지원서가 제출되었습니다
              </p>
              <p className="mb-6 text-sm text-[var(--color-muted)]">
                검토 후 등록하신 연락처로 결과를 안내드리겠습니다.
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                홈으로 이동
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
