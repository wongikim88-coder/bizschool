import Link from "next/link";

const footerLinks = [
  {
    title: "더존비즈스쿨",
    links: [
      { label: "비즈스쿨 소개", href: "/about" },
      { label: "연혁 및 교육실적", href: "/history" },
      { label: "찾아오시는 길", href: "/directions" },
    ],
  },
  {
    title: "강의",
    links: [
      { label: "전체강의", href: "/" },
      { label: "추천강의", href: "/?filter=recommended" },
      { label: "신규강의", href: "/?filter=new" },
      { label: "무료강의", href: "/?filter=free" },
    ],
  },
  {
    title: "도서",
    links: [
      { label: "전체도서", href: "/books" },
      { label: "추천도서", href: "/books?filter=recommended" },
      { label: "신간도서", href: "/books?filter=new" },
      { label: "베스트셀러", href: "/books?filter=best" },
    ],
  },
  {
    title: "고객지원",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "1:1 문의", href: "/contact" },
      { label: "공지사항", href: "/notice" },
    ],
  },
];

const legalLinks = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "저작권 정책", href: "/copyright" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark-navy)] text-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Logo & Description */}
          <div className="col-span-2">
            <span className="font-logo text-xl text-white">BIZSCHOOL</span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              비즈니스 성장을 위한 온라인 교육 플랫폼.
              <br />
              전문가가 직접 전하는 실무 중심의 강의와 도서로
              <br />
              당신의 커리어를 한 단계 업그레이드하세요.
            </p>

            {/* SNS Links */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://blog.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Blog"
              >
                B
              </a>
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold text-white/80">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          {/* Legal links */}
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs transition-colors hover:text-white/80 ${
                  link.label === "개인정보처리방침"
                    ? "font-semibold text-white/70"
                    : "text-white/40"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company info */}
          <div className="mt-4 text-xs leading-relaxed text-white/30">
            <p>
              (주)비즈스쿨 | 대표: 홍길동 | 사업자등록번호: 123-45-67890
            </p>
            <p className="mt-1">
              통신판매업 신고번호: 제2026-서울강남-12345호 | 이메일: support@bizschool.co.kr
            </p>
            <p className="mt-1">
              주소: 서울특별시 강남구 테헤란로 123, 비즈타워 10층
            </p>
          </div>

          {/* Copyright */}
          <p className="mt-4 text-xs text-white/30">
            &copy; 2026 BIZSCHOOL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
