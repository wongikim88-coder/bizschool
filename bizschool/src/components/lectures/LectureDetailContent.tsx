"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  Users,
  BookOpen,
  Signal,
  CircleCheck,
  ChevronRight,
  ChevronDown,
  Play,
  Heart,
  Share2,
  Clock,
  Award,
  Calendar,
  ChevronLeft,
  Lock,
} from "lucide-react";
import DOMPurify from "dompurify";
import type { LectureDetail, LectureTab } from "@/types";

const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

interface LectureDetailContentProps {
  lecture: LectureDetail;
}

const TABS: { id: LectureTab; label: string; countKey?: keyof LectureDetail }[] = [
  { id: "intro", label: "강의소개" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "reviews", label: "리뷰" },
  { id: "faq", label: "수강전 FAQ" },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`평점 ${rating}점`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? "fill-yellow-400 text-yellow-400"
                : half
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-gray-300"
            }
          />
        );
      })}
    </span>
  );
}

export default function LectureDetailContent({
  lecture,
}: LectureDetailContentProps) {
  const [activeTab, setActiveTab] = useState<LectureTab>("intro");
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);

  const introRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<LectureTab, React.RefObject<HTMLDivElement | null>> = {
    intro: introRef,
    curriculum: curriculumRef,
    reviews: reviewsRef,
    faq: faqRef,
  };

  // IntersectionObserver for active tab
  useEffect(() => {
    const refs = [
      { id: "intro" as const, ref: introRef },
      { id: "curriculum" as const, ref: curriculumRef },
      { id: "reviews" as const, ref: reviewsRef },
      { id: "faq" as const, ref: faqRef },
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

  const toggleFaq = useCallback((index: number) => {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const hasDiscount = lecture.originalPrice && lecture.discountRate;

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      {/* ── 히어로 영역 ── */}
      <section className="bg-gradient-to-br from-[var(--color-dark-navy)] to-[var(--color-dark-deep)]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:py-14">
          {/* 뒤로가기 + Breadcrumb */}
          <div className="mb-4 flex items-center gap-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              aria-label="홈으로"
            >
              <ChevronLeft size={20} />
            </Link>
            <nav className="text-sm text-white/50">
              {lecture.categories.map((cat, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1.5">·</span>}
                  {cat.main} &gt; {cat.sub}
                </span>
              ))}
            </nav>
          </div>

          {/* 제목 */}
          <h1 className="text-xl font-bold text-white md:text-3xl">
            {lecture.title}
          </h1>

          {/* 설명 */}
          <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base line-clamp-2">
            {lecture.description}
          </p>

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

            {/* 추천 대상 */}
            {lecture.targetAudience.length > 0 && (
              <div className="mt-8 rounded-2xl border border-[var(--color-border)] p-6">
                <h2 className="text-lg font-bold text-[var(--color-dark)]">
                  이런 분들께 추천해요
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
            )}

            {/* 강의 상세정보 */}
            {lecture.detail && (
              <div className="mt-8">
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

            {/* 강사 소개 */}
            <div className="mt-8 rounded-2xl border border-[var(--color-border)] p-6">
              <h2 className="text-lg font-bold text-[var(--color-dark)]">
                강사 소개
              </h2>
              <div className="mt-4 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-lg font-bold text-[var(--color-primary)]">
                  {lecture.instructor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[var(--color-dark)]">
                    {lecture.instructor.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                    {lecture.instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 커리큘럼 ── */}
          <div
            ref={curriculumRef}
            id="curriculum"
            className="mt-12 scroll-mt-[60px]"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-[var(--color-dark)]">
                커리큘럼
              </h2>
              <span className="text-sm text-[var(--color-muted)]">
                총 {lecture.lessonCount}개 수업 · {lecture.totalDuration}
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <ul className="divide-y divide-[var(--color-border)]">
                {lecture.curriculum.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[var(--color-muted)]">
                      {i + 1}
                    </span>
                    <Lock size={14} className="shrink-0 text-gray-300" />
                    <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-dark)]">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--color-muted)]">
                      {item.duration}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── 리뷰 ── */}
          <div ref={reviewsRef} id="reviews" className="mt-12 scroll-mt-[60px]">
            <h2 className="text-lg font-bold text-[var(--color-dark)]">
              수강생 리뷰
              <span className="ml-2 text-base font-normal text-[var(--color-muted)]">
                ({lecture.reviewCount})
              </span>
            </h2>

            {/* 평균 평점 */}
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[var(--color-light-bg)] p-5">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-dark)]">
                  {lecture.rating}
                </div>
                <StarRating rating={lecture.rating} size={18} />
              </div>
              <div className="text-sm text-[var(--color-muted)]">
                총 {lecture.reviewCount}개의 리뷰
              </div>
            </div>

            {/* 리뷰 목록 */}
            {lecture.reviews.length > 0 ? (
              <ul className="mt-6 divide-y divide-[var(--color-border)]">
                {lecture.reviews.map((review, idx) => (
                  <li key={idx} className="py-5 first:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[var(--color-dark)]">
                        {review.reviewer}
                      </span>
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-[var(--color-muted)]">
                        {review.date.replace(/-/g, ".")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                      {review.content}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-[var(--color-muted)]">
                아직 작성된 리뷰가 없습니다.
              </p>
            )}
          </div>

          {/* ── 수강전 FAQ ── */}
          <div ref={faqRef} id="faq" className="mt-12 scroll-mt-[60px]">
            <h2 className="text-lg font-bold text-[var(--color-dark)]">
              수강전 FAQ
            </h2>

            {lecture.faqs.length > 0 ? (
              <div className="mt-4 space-y-2">
                {lecture.faqs.map((faq, idx) => {
                  const isOpen = expandedFaqs.has(idx);
                  return (
                    <div
                      key={idx}
                      className={`overflow-hidden rounded-xl border transition-colors ${
                        isOpen
                          ? "border-[var(--color-primary)]/30 bg-[var(--color-light-bg)]"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${idx}`}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium text-[var(--color-dark)]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[var(--color-muted)] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div
                          id={`faq-answer-${idx}`}
                          className="border-t border-[var(--color-border)] px-5 py-4"
                        >
                          <p className="text-sm leading-relaxed text-[var(--color-body)]">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                등록된 FAQ가 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* ── 우측 사이드바 (데스크톱) ── */}
        <aside className="hidden w-[340px] shrink-0 lg:block">
          <div className="sticky top-[60px] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* 썸네일 placeholder */}
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-dark-navy)]/30">
              <Play size={32} className="text-white/60" />
            </div>

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

            {/* 수강신청 버튼 */}
            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              수강신청하기
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
            className="flex-1 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            수강신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
