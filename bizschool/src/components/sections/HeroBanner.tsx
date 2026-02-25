import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-dark-navy)] px-8 py-12 md:px-16 md:py-16">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 rounded-full bg-white/5" />

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-medium text-white/70">BIZSCHOOL에서</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-white md:text-4xl">
            비즈니스 역량을
            <br />
            키워보세요
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
            전문가가 직접 전하는 실무 중심의 강의와 도서
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-gray-100"
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
