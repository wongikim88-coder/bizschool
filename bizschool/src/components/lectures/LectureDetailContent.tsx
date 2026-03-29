"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Users,
  BookOpen,
  Signal,
  CircleCheck,
  ChevronRight,
  Play,
  Heart,
  Share2,
  Clock,
  Award,
  Calendar,
  ChevronLeft,
  Lock,
  LockOpen,
  X,
  SkipBack,
  SkipForward,
  Volume2,
  Subtitles,
  Settings,
  Maximize,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import DOMPurify from "dompurify";
import type { LectureDetail, LectureTab } from "@/types";

const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

interface LectureDetailContentProps {
  lecture: LectureDetail;
  hideBackButton?: boolean;
  isPurchased?: boolean;
}

const TABS: { id: LectureTab; label: string; countKey?: keyof LectureDetail }[] = [
  { id: "curriculum", label: "커리큘럼" },
];

export default function LectureDetailContent({
  lecture,
  hideBackButton = false,
  isPurchased = false,
}: LectureDetailContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LectureTab>("intro");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isDescClamped, setIsDescClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const introRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const sectionRefs: Record<LectureTab, React.RefObject<HTMLDivElement | null>> = {
    intro: introRef,
    curriculum: curriculumRef,
    reviews: introRef,
    faq: introRef,
  };

  // IntersectionObserver for active tab
  useEffect(() => {
    const refs = [
      { id: "intro" as const, ref: introRef },
      { id: "curriculum" as const, ref: curriculumRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = refs.find((r) => r.ref.current === entry.target);
            if (match) setActiveTab(match.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    refs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // ESC key + body scroll lock for video modal
  useEffect(() => {
    if (!showVideoModal) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideoModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showVideoModal]);

  // ESC key + body scroll lock for purchase modal
  useEffect(() => {
    if (!showPurchaseModal) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPurchaseModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showPurchaseModal]);

  // Check if description is clamped (overflows 3 lines)
  useEffect(() => {
    const el = descRef.current;
    if (el) setIsDescClamped(el.scrollHeight > el.clientHeight);
  }, [lecture.description]);

  // Track scroll for shadow on tab bar
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = useCallback((tab: LectureTab) => {
    setActiveTab(tab);
    sectionRefs[tab].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const hasDiscount = lecture.originalPrice && lecture.discountRate;

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      {/* ── 히어로 영역 ── */}
      <section className="bg-gradient-to-br from-[var(--color-dark-navy)] to-[var(--color-dark-deep)]">
        <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-20">
          {/* 뒤로가기 + Breadcrumb */}
          <div className="mb-4 flex items-center gap-3">
            {!hideBackButton && (
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
                aria-label="홈으로"
              >
                <ChevronLeft size={20} />
              </Link>
            )}
            <nav className="text-sm text-white/50">
              {lecture.categories.map((cat, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1.5">·</span>}
                  {cat.main} &gt; {cat.sub}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-start gap-10">
            {/* 좌측: 텍스트 정보 */}
            <div className="min-w-0 flex-1">
              {/* 제목 */}
              <h1 className="text-xl font-bold text-white md:text-3xl">
                {lecture.title}
              </h1>

              {/* 설명 */}
              <p
                ref={descRef}
                className={`mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70 md:text-base ${isDescExpanded ? "" : "line-clamp-3"}`}
              >
                {lecture.description}
              </p>
              {isDescClamped && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded((v) => !v)}
                  className="mt-1.5 cursor-pointer text-sm font-medium text-white/50 transition-colors hover:text-white/80"
                >
                  {isDescExpanded ? "접기 \u25B4" : "더보기 \u25BE"}
                </button>
              )}

              {/* 메타 정보 */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-white/90">{lecture.rating}</span>
                  <span>({lecture.reviewCount})</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  수강생 {lecture.studentCount.toLocaleString()}명
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} />
                  총 {lecture.lessonCount}개 수업
                </span>
                <span className="flex items-center gap-1">
                  <Signal size={14} />
                  {lecture.level}
                </span>
              </div>

              {/* 강사 */}
              <p className="mt-3 text-sm text-white/50">
                강사: <span className="text-white/70">{lecture.instructor.name}</span>
              </p>

              {/* 태그 */}
              {lecture.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {lecture.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 우측: 미리보기 영상 */}
            <div className="hidden w-[380px] shrink-0 lg:block">
              <div
                onClick={() => setShowVideoModal(true)}
                className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-white/15 bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <Play size={28} className="text-white/80" />
                </div>
                <span className="text-xl font-semibold text-white/80">샘플강의 미리보기</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky 탭 네비게이션 ── */}
      <div
        className={`sticky top-0 z-30 border-b border-[var(--color-border)] bg-white transition-shadow ${
          isScrolled ? "shadow-sm" : ""
        }`}
        role="tablist"
      >
        <div className="mx-auto flex max-w-[1200px] overflow-x-auto px-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            let label = tab.label;
            if (tab.id === "curriculum") label += `(${lecture.lessonCount})`;
            if (tab.id === "reviews") label += `(${lecture.reviewCount})`;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => scrollToSection(tab.id)}
                className={`shrink-0 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-dark)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 본문 (2-column) ── */}
      <div className="mx-auto flex max-w-[1200px] gap-8 px-4 py-8">
        {/* 좌측: 메인 콘텐츠 */}
        <div className="min-w-0 flex-1">
          {/* ── 강의소개 ── */}
          <div ref={introRef} id="intro" className="scroll-mt-[60px]">
            {/* 배우는 것들 */}
            {lecture.learningPoints.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] p-6">
                <h2 className="text-lg font-bold text-[var(--color-dark)]">
                  이 강의에서 배우는 것들
                </h2>
                <ul className="mt-4 space-y-3">
                  {lecture.learningPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CircleCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                      />
                      <span className="text-sm text-[var(--color-body)]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 강의 상세정보 */}
            {lecture.detail && (
              <div className="mt-8 border-t border-[var(--color-border)] px-6 pt-8 pb-8">
                <h2 className="text-lg font-bold text-[var(--color-dark)]">
                  강의 상세정보
                </h2>
                {isHtml(lecture.detail) ? (
                  <div
                    className="lecture-detail-html mt-4 text-sm leading-relaxed text-[var(--color-body)]"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(lecture.detail, {
                        ALLOWED_TAGS: [
                          "p", "h2", "h3", "strong", "em", "u", "s",
                          "table", "thead", "tbody", "tr", "td", "th",
                          "img", "a", "ul", "ol", "li", "br", "hr", "span",
                        ],
                        ALLOWED_ATTR: [
                          "href", "src", "alt", "style", "colspan", "rowspan", "class", "target",
                        ],
                      }),
                    }}
                  />
                ) : (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--color-body)]">
                    {lecture.detail}
                  </p>
                )}
              </div>
            )}

            {/* 추천 대상 */}
            {lecture.targetAudience.length > 0 && (
              <div className="mt-8 border-t border-[var(--color-border)] pt-8">
              <div className="rounded-2xl border border-[var(--color-border)] p-6">
                <h2 className="text-lg font-bold text-[var(--color-dark)]">
                  추천 수강 대상
                </h2>
                <ul className="mt-4 space-y-3">
                  {lecture.targetAudience.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                      />
                      <span className="text-sm text-[var(--color-body)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            )}

          </div>

          {/* ── 커리큘럼 ── */}
          <div
            ref={curriculumRef}
            id="curriculum"
            className="mt-8 scroll-mt-[60px] border-t border-[var(--color-border)] px-6 pt-8 pb-8"
          >
            <h2 className="text-lg font-bold text-[var(--color-dark)]">
              커리큘럼
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              총 {lecture.lessonCount}강 · {lecture.totalDuration}
            </p>

            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)]">
              <ul className="divide-y divide-[var(--color-border)]">
                {lecture.curriculum.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      if (!lecture.courseId) return;
                      if (i === 0 || isPurchased) {
                        const url = lecture.courseId === "mc-preview"
                          ? "/course/preview"
                          : `/course/${lecture.courseId}`;
                        router.push(url);
                      } else {
                        setShowPurchaseModal(true);
                      }
                    }}
                    className="flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[var(--color-muted)]">
                      {i + 1}
                    </span>
                    {i === 0 ? (
                      <LockOpen size={14} className="shrink-0 text-[var(--color-primary)]" />
                    ) : (
                      <Lock size={14} className="shrink-0 text-gray-300" />
                    )}
                    <span className={`min-w-0 flex-1 truncate text-sm ${i === 0 ? "font-semibold text-[var(--color-dark)]" : "text-[var(--color-dark)]"}`}>
                      {item.title}
                    </span>
                    {i === 0 && (
                      <span className="shrink-0 rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
                        미리보기
                      </span>
                    )}
                    <span className="shrink-0 text-xs text-[var(--color-muted)]">
                      {item.duration}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* ── 우측 사이드바 (데스크톱) ── */}
        <aside className="hidden w-[340px] shrink-0 lg:block">
          <div className="sticky top-[60px] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* 가격 */}
            <div className="mt-5">
              {hasDiscount ? (
                <>
                  <div className="text-sm text-[var(--color-muted)]">
                    정가:{" "}
                    <span className="line-through">
                      {lecture.originalPrice!.toLocaleString()}원
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--color-dark)]">
                      {lecture.price.toLocaleString()}원
                    </span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      {lecture.discountRate}%
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold text-[var(--color-dark)]">
                  {lecture.price.toLocaleString()}원
                </span>
              )}
            </div>

            {/* 구매 버튼 */}
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <CreditCard size={16} />
              바로구매
            </button>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] bg-white py-3.5 text-sm font-bold text-[var(--color-primary)] transition-opacity hover:opacity-90"
            >
              <ShoppingCart size={16} />
              장바구니
            </button>

            {/* 구분선 + 강의 요약 */}
            <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 text-sm">
                <BookOpen size={16} className="shrink-0 text-[var(--color-muted)]" />
                <span className="text-[var(--color-body)]">
                  총 {lecture.lessonCount}개 수업
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="shrink-0 text-[var(--color-muted)]" />
                <span className="text-[var(--color-body)]">
                  총 수업시간 {lecture.totalDuration}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Signal size={16} className="shrink-0 text-[var(--color-muted)]" />
                <span className="text-[var(--color-body)]">
                  난이도: {lecture.level}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="shrink-0 text-[var(--color-muted)]" />
                <span className="text-[var(--color-body)]">수강기한: 무제한</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award size={16} className="shrink-0 text-[var(--color-muted)]" />
                <span className="text-[var(--color-body)]">수료증 발급</span>
              </div>
            </div>

            {/* 구분선 + 찜/공유 */}
            <div className="mt-5 flex gap-2 border-t border-gray-100 pt-5">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                <Heart size={16} />
                찜하기
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                <Share2 size={16} />
                공유하기
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── 강의 미리보기 모달 ── */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
          onClick={(e) => { if (e.target === e.currentTarget) setShowVideoModal(false); }}
        >
          <div className="w-full max-w-[800px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
              <span className="text-base font-semibold text-[var(--color-dark)]">
                강의 미리보기
              </span>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="닫기"
              >
                <X size={22} />
              </button>
            </div>

            {/* 영상 영역 — 히어로 미리보기와 동일 */}
            <div className="relative">
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-b-2xl bg-black/30 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <Play size={28} className="text-white/80" />
                </div>
                <span className="text-xl font-semibold text-white/80">샘플강의 미리보기</span>
              </div>

              {/* 프로그레스 바 */}
              <div className="absolute bottom-10 left-0 right-0 flex items-center gap-2 px-3">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <div className="h-1 flex-1 rounded-full bg-white/30">
                  <div className="h-full w-0 rounded-full bg-white" />
                </div>
              </div>

              {/* 컨트롤 바 */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6">
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <SkipBack size={18} />
                </button>
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <Play size={18} />
                </button>
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <SkipForward size={18} />
                </button>
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <Volume2 size={18} />
                </button>
                <div className="mx-1 h-1 w-16 rounded-full bg-white/30">
                  <div className="h-full w-3/4 rounded-full bg-white" />
                </div>
                <span className="ml-auto text-xs text-white/80">00:00 / 14:10</span>
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <Subtitles size={18} />
                </button>
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <Settings size={18} />
                </button>
                <button type="button" className="p-1.5 text-white/80 hover:text-white">
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 구매 안내 모달 ── */}
      {showPurchaseModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPurchaseModal(false); }}
        >
          <div className="mx-4 w-full max-w-[360px] rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Lock size={24} className="text-gray-400" />
            </div>
            <p className="mt-4 text-base font-semibold text-[var(--color-dark)]">
              강의 구매 후 이용 가능합니다
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              해당 강의를 수강하시려면 먼저 구매해 주세요.
            </p>
            <button
              type="button"
              onClick={() => setShowPurchaseModal(false)}
              className="mt-5 w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* ── 모바일 하단 Sticky Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-[600px] items-center gap-3">
          <div className="flex-1">
            {hasDiscount && (
              <span className="text-xs text-[var(--color-muted)] line-through">
                {lecture.originalPrice!.toLocaleString()}원
              </span>
            )}
            <p className="text-lg font-bold text-[var(--color-dark)]">
              {lecture.price.toLocaleString()}원
              {hasDiscount && (
                <span className="ml-1.5 text-sm font-bold text-[var(--color-primary)]">
                  {lecture.discountRate}%
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-primary)] bg-white py-3 text-sm font-bold text-[var(--color-primary)] transition-opacity hover:opacity-90"
          >
            <ShoppingCart size={16} />
            장바구니
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <CreditCard size={16} />
            바로구매
          </button>
        </div>
      </div>
    </div>
  );
}
