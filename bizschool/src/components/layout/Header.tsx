"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Menu, X, GraduationCap, UserCircle, FileText, LogIn, UserPlus, Plus, ChevronDown, Search, Bell, ShoppingCart, Bot, MessageCircle, MoreVertical, Trash2, CheckCheck } from "lucide-react";
import type { MenuItem } from "@/types";
import UserMenu from "@/components/auth/UserMenu";
import { useNotifications } from "@/contexts/NotificationContext";

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
        className="flex items-center gap-1 text-base font-medium text-black transition-colors hover:text-[var(--color-primary)]"
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
        className="flex w-full items-center justify-between py-3 text-base font-medium text-black"
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

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "방금 전";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  return `${day}일 전`;
}

export default function Header({ showSearchInHeader = false }: { showSearchInHeader?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearchValue, setHeaderSearchValue] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notifMenuId, setNotifMenuId] = useState<string | null>(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();

  // Close bell dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    if (bellOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      setNotifMenuId(null);
      setHeaderMenuOpen(false);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bellOpen]);

  // Rotating placeholder
  const headerPlaceholderTexts: Record<string, string[]> = {
    "/": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/education": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/training": ["근로자 주도훈련 과정을 검색해보세요.", "관심있는 주제를 검색해보세요."],
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

  // 결제 회원은 전문가상담 대시보드로 이동
  const getMenuHref = (item: MenuItem) => {
    if (item.href === "/expert-consultation" && session?.user?.hasPurchasedConsultation) {
      return "/mypage?tab=expert";
    }
    return item.href;
  };

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
        <Link href="/" className="relative z-10 flex shrink-0 items-center gap-2">
          <img src="/images/logo.svg" alt="BIZSCHOOL" width={36} height={36} />
          <span className="font-logo text-3xl text-[var(--color-dark)]">BIZSCHOOL</span>
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
                      href={getMenuHref(item)}
                      className="whitespace-nowrap text-base font-medium text-black transition-colors hover:text-[var(--color-primary)]"
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
        <div className="relative z-10 hidden shrink-0 items-center gap-3 md:flex">
          {/* 텍스트 링크 그룹 */}
          {status === "authenticated" && (
            <div className="flex items-center gap-4">
              {session?.user?.role === "expert" ? (
                <Link
                  href="/expert/upload"
                  className="flex items-center gap-1 rounded-full border border-[var(--color-dark)] px-3 py-2 text-xs font-medium text-[var(--color-dark)] transition-colors hover:bg-[var(--color-dark)] hover:text-white"
                >
                  <Plus size={20} strokeWidth={2.5} />
                  <span className="text-sm">콘텐츠 업로드</span>
                </Link>
              ) : (
                <Link
                  href="/expert"
                  className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
                >
                  <GraduationCap size={18} />
                  <span>전문가지원</span>
                </Link>
              )}
            </div>
          )}
          {/* 아이콘 버튼 그룹 */}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setBellOpen((o) => !o)}
                  className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
                  aria-label="알림"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                      <span className="text-sm font-bold text-[var(--color-dark)]">알림</span>
                      {notifications.length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() => setHeaderMenuOpen((o) => !o)}
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-gray-200 ${headerMenuOpen ? "bg-gray-200" : ""}`}
                            aria-label="알림 더보기"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {headerMenuOpen && (
                            <div className="absolute right-0 top-full z-10 mt-1 w-28 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
                              {unreadCount > 0 && (
                                <button
                                  onClick={() => { markAllAsRead(); setHeaderMenuOpen(false); }}
                                  className="flex w-full items-center gap-1.5 px-3 py-2 text-xs text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                                >
                                  <CheckCheck size={13} />
                                  모두 읽음
                                </button>
                              )}
                              <button
                                onClick={() => { setShowClearConfirm(true); setHeaderMenuOpen(false); }}
                                className="flex w-full items-center gap-1.5 px-3 py-2 text-xs text-red-500 transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                <Trash2 size={13} />
                                전체 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
                          알림이 없습니다.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id}>
                            <div
                              className="group flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-light-bg)]"
                              onClick={() => {
                                markAsRead(n.id);
                                setBellOpen(false);
                                setNotifMenuId(null);
                                if (n.href) router.push(n.href);
                              }}
                            >
                              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.type === "community-reply" ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600"}`}>
                                {n.type === "community-reply" ? <MessageCircle size={16} /> : <Bot size={16} />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm ${!n.read ? "font-semibold text-[var(--color-dark)]" : "text-[var(--color-body)]"}`}>
                                  {n.title}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">
                                  {n.message}
                                </p>
                                <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                                  {formatTimeAgo(n.createdAt)}
                                </p>
                              </div>
                              {!n.read && notifMenuId !== n.id && (
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500 group-hover:hidden" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifMenuId(notifMenuId === n.id ? null : n.id);
                                }}
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-gray-200 ${notifMenuId === n.id ? "bg-gray-200" : "opacity-0 group-hover:opacity-100"}`}
                                aria-label="더보기"
                              >
                                <MoreVertical size={14} />
                              </button>
                            </div>
                            {notifMenuId === n.id && (
                              <div
                                className="flex items-center divide-x divide-gray-200 border-y border-gray-200 bg-gray-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {!n.read && (
                                  <button
                                    onClick={() => { markAsRead(n.id); setNotifMenuId(null); }}
                                    className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-white hover:text-[var(--color-primary)]"
                                  >
                                    <CheckCheck size={13} />
                                    읽음 처리
                                  </button>
                                )}
                                <button
                                  onClick={() => { removeNotification(n.id); setNotifMenuId(null); }}
                                  className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-white hover:text-red-600"
                                >
                                  <Trash2 size={13} />
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <Link
                        href="/mypage?tab=expert"
                        onClick={() => setBellOpen(false)}
                        className="block border-t border-[var(--color-border)] px-4 py-2.5 text-center text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-primary)]"
                      >
                        전체 알림 보기
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <button
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
                aria-label="장바구니"
              >
                <ShoppingCart size={22} />
              </button>
              <UserMenu user={session.user} />
            </div>
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
                  href={getMenuHref(item)}
                  className="block py-3 text-base font-medium text-black"
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
      {/* 전체 삭제 확인 모달 */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="mx-4 w-full max-w-xs rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <p className="mb-2 text-center font-medium text-[var(--color-dark)]">
              알림을 모두 삭제하시겠습니까?
            </p>
            <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
              삭제된 알림은 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
