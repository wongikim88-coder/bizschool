"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  badge: string;
  gradient: string;
  href: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: "b1",
    title: "비즈니스 데이터 분석 입문",
    subtitle: "엑셀부터 파이썬까지, 데이터로 의사결정하는 법",
    instructor: "김데이터",
    badge: "베스트",
    gradient: "from-[#155dfc] to-[#0d3b9e]",
    href: "/courses/c1",
  },
  {
    id: "b2",
    title: "MBA 핵심 전략경영",
    subtitle: "하버드 케이스 스터디로 배우는 전략적 사고",
    instructor: "이전략",
    badge: "New",
    gradient: "from-[#7c3aed] to-[#4c1d95]",
    href: "/courses/c2",
  },
  {
    id: "b3",
    title: "실무 재무제표 분석",
    subtitle: "투자자의 눈으로 읽는 기업의 숨은 가치",
    instructor: "박재무",
    badge: "베스트",
    gradient: "from-[#059669] to-[#064e3b]",
    href: "/courses/c3",
  },
  {
    id: "b4",
    title: "디지털 마케팅 A to Z",
    subtitle: "퍼포먼스 마케팅 실전 노하우 완벽 정리",
    instructor: "최마케팅",
    badge: "인기",
    gradient: "from-[#ea580c] to-[#9a3412]",
    href: "/courses/c4",
  },
  {
    id: "b5",
    title: "스타트업 창업 바이블",
    subtitle: "아이디어부터 투자유치까지 한 번에",
    instructor: "정창업",
    badge: "베스트",
    gradient: "from-[#0891b2] to-[#164e63]",
    href: "/courses/c5",
  },
];

export default function MainBanner() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent((index + bannerSlides.length) % bannerSlides.length);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-2 pb-2">
      <div
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides container */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <Link
              key={slide.id}
              href={slide.href}
              className={`relative flex w-full flex-shrink-0 flex-col justify-center bg-gradient-to-br ${slide.gradient} px-8 py-12 md:px-16 md:py-16`}
            >
              {/* Background decoration */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 rounded-full bg-white/5" />

              <div className="relative z-10 max-w-lg">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {slide.badge}
                </span>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">
                  {slide.subtitle}
                </p>
                <p className="mt-4 text-xs text-white/50">
                  {slide.instructor} 강사
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Arrow navigation */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prev();
          }}
          className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            next();
          }}
          className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                goTo(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
