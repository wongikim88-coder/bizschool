"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Menu, X, GraduationCap, UserCircle, FileText, LogIn, UserPlus, Plus, ChevronDown, Search } from "lucide-react";
import type { MenuItem } from "@/types";
import UserMenu from "@/components/auth/UserMenu";

const menuItems: MenuItem[] = [
  { label: "강의", href: "/" },
  { label: "교육일정", href: "/education" },
  { label: "근로자 주도훈련", href: "/training" },
  { label: "도서", href: "/books" },
  { label: "전문가상담", href: "/expert-consultation" },
  { label: "커뮤니티", href: "/community" },
];

function DropdownMenu({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };
  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={item.href}
        className="flex items-center gap-1 text-base font-medium text-[var(--color-dark)] transition-colors hover:text-[var(--color-primary)]"
      >
        {item.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block whitespace-nowrap px-5 py-2.5 text-sm text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-primary)]"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDropdown({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-3 text-base font-medium text-[var(--color-dark)]"
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-1 pl-4">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
              onClick={onClose}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ showSearchInHeader = false }: { showSearchInHeader?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearchValue, setHeaderSearchValue] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Rotating placeholder
  const headerPlaceholderTexts: Record<string, string[]> = {
    "/": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/education": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/training": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/books": ["도서명 또는 저자를 검색하세요.", "관심있는 주제를 검색해보세요."],
    "/community": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
  };
  const headerTexts = headerPlaceholderTexts[pathname] || headerPlaceholderTexts["/"];
  const [hPlaceholderIndex, setHPlaceholderIndex] = useState(0);
  const [hIsAnimating, setHIsAnimating] = useState(false);

  useEffect(() => {
    if (headerTexts.length <= 1) return;
    const interval = setInterval(() => {
      setHIsAnimating(true);
      setTimeout(() => {
        setHPlaceholderIndex((prev) => (prev + 1) % headerTexts.length);
        setHIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [headerTexts]);

  const handleHeaderSearch = () => {
    const q = headerSearchValue.trim();
    if (!q) return;
    router.push(`/books?search=${encodeURIComponent(q)}&page=1`);
    setHeaderSearchValue("");
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-[border-color] duration-300 ${showSearchInHeader ? "border-b border-[var(--color-border)]" : "border-b border-transparent"}`}>
      <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="relative z-10 shrink-0 font-logo text-2xl text-[var(--color-dark)]">
          BIZSCHOOL
        </Link>

        {/* Slide container: Nav ↔ Search (desktop only) — absolutely centered on page */}
        <div className="absolute inset-x-0 top-0 hidden h-16 overflow-hidden md:block">
          <div
            className={`transition-transform duration-300 ease-in-out ${
              showSearchInHeader ? "-translate-y-16" : "translate-y-0"
            }`}
          >
            {/* Row 1: Navigation */}
            <div className={`flex h-16 items-center justify-center transition-opacity duration-300 ${showSearchInHeader ? "opacity-0" : "opacity-100"}`}>
              <nav className="flex items-center gap-8">
                {menuItems.map((item) =>
                  item.children ? (
                    <DropdownMenu key={item.label} item={item} />
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap text-base font-medium text-[var(--color-dark)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </div>
            {/* Row 2: Search bar */}
            <div className={`flex h-16 items-center justify-center ${showSearchInHeader ? "opacity-100 visible transition-opacity duration-300" : "opacity-0 invisible"}`}>
              <div className="group relative w-[620px]">
                <input
                  type="text"
                  value={headerSearchValue}
                  onChange={(e) => setHeaderSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleHeaderSearch();
                  }}
                  className="w-full rounded-full border border-gray-400 bg-[var(--color-light-bg)] py-2.5 pl-6 pr-14 text-base text-[var(--color-dark)] transition-all duration-200 group-focus-within:border-[var(--color-dark)] group-focus-within:bg-white focus:outline-none"
                />
                {!headerSearchValue && (
                  <span
                    className={`pointer-events-none absolute left-6 top-1/2 text-base text-[var(--color-muted)] transition-all duration-300 ${
                      hIsAnimating ? "-translate-y-[calc(50%+8px)] opacity-0" : "-translate-y-1/2 opacity-100"
                    }`}
                  >
                    {headerTexts[hPlaceholderIndex]}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleHeaderSearch}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-dark)] text-white transition-all hover:opacity-90"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="relative z-10 hidden shrink-0 items-center gap-6 md:flex">
          {status === "authenticated" && (
            <Link
              href="/rate-table"
              className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
            >
              <FileText size={18} />
              <span>조견표 신청</span>
            </Link>
          )}
          {session?.user?.role === "expert" ? (
            <Link
              href="/expert/upload"
              className="flex items-center gap-1 rounded-full border border-[var(--color-dark)] px-3 py-2 text-xs font-medium text-[var(--color-dark)] transition-colors hover:bg-[var(--color-dark)] hover:text-white"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="text-sm">콘텐츠 업로드</span>
            </Link>
          ) : status === "authenticated" ? (
            <Link
              href="/expert"
              className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
            >
              <GraduationCap size={18} />
              <span>전문가지원</span>
            </Link>
          ) : null}
          {status === "authenticated" && session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg bg-[var(--color-dark)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-dark-deep)]"
                >
                  로그인
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
                >
                  회원가입
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="relative z-10 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--color-border)] bg-white md:hidden">
          <nav className="mx-auto max-w-[1440px] px-4 py-4">
            {menuItems.map((item) =>
              item.children ? (
                <MobileDropdown key={item.label} item={item} onClose={() => setMobileMenuOpen(false)} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 text-base font-medium text-[var(--color-dark)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-4 flex gap-6 border-t border-[var(--color-border)] pt-4">
              {status === "authenticated" && (
                <Link href="/rate-table" className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]" onClick={() => setMobileMenuOpen(false)}>
                  <FileText size={18} />
                  <span>조견표 신청</span>
                </Link>
              )}
              {session?.user?.role === "expert" ? (
                <Link href="/expert/upload" className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]" onClick={() => setMobileMenuOpen(false)}>
                  <Plus size={18} />
                  <span>콘텐츠 업로드</span>
                </Link>
              ) : status === "authenticated" ? (
                <Link href="/expert" className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]" onClick={() => setMobileMenuOpen(false)}>
                  <GraduationCap size={18} />
                  <span>전문가지원</span>
                </Link>
              ) : null}
              {status === "authenticated" && session?.user ? (
                <>
                  <Link href="/mypage" className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]" onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle size={18} />
                    <span>마이페이지</span>
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-[var(--color-muted)]"
                  >
                    <LogIn size={18} />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn size={18} />
                    <span>로그인</span>
                  </Link>
                  <Link href="/login?mode=signup" className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]" onClick={() => setMobileMenuOpen(false)}>
                    <UserPlus size={18} />
                    <span>회원가입</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
