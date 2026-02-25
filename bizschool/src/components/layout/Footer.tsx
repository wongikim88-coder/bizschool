import Link from "next/link";

const footerLinks = [
  {
    title: "강의",
    links: [
      { label: "전체강의", href: "/courses" },
      { label: "추천강의", href: "/courses?filter=recommended" },
      { label: "신규강의", href: "/courses?filter=new" },
      { label: "무료강의", href: "/courses?filter=free" },
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
      { label: "이용약관", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[--color-dark-navy] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <span className="font-logo text-xl text-white">BIZSCHOOL</span>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              비즈니스 성장을 위한
              <br />
              온라인 교육 플랫폼
            </p>
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

        {/* Divider & Copyright */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-xs text-white/30">
            &copy; 2026 BIZSCHOOL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
