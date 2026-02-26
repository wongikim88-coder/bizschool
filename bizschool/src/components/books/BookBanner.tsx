export default function BookBanner() {
  return (
    <section className="relative mt-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--color-dark-navy)] to-[var(--color-dark-deep)] px-8 py-12 md:px-16 md:py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white md:text-3xl">BIZSCHOOL BOOKS</h1>
        <p className="mt-2 text-sm text-white/70 md:text-base">
          비즈니스 성장을 위한 전문 도서를 만나보세요
        </p>
      </div>
    </section>
  );
}
