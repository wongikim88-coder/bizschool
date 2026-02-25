"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap, LogIn } from "lucide-react";
import type { MenuItem } from "@/types";

const menuItems: MenuItem[] = [
  { label: "강의", href: "/courses" },
  { label: "도서", href: "/books" },
  { label: "전문가상담", href: "/consulting" },
  { label: "커뮤니티", href: "/community" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 font-logo text-2xl text-[--color-dark]">
          BIZSCHOOL
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-[--color-dark] transition-colors hover:text-[--color-primary]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/expert"
            className="flex items-center gap-1.5 text-sm text-[--color-muted] transition-colors hover:text-[--color-dark]"
          >
            <GraduationCap size={18} />
            <span>전문가지원</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-[--color-muted] transition-colors hover:text-[--color-dark]"
          >
            <LogIn size={18} />
            <span>로그인</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[--color-border] bg-white md:hidden">
          <nav className="mx-auto max-w-[1200px] px-4 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-[15px] font-medium text-[--color-dark]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-6 border-t border-[--color-border] pt-4">
              <Link href="/expert" className="flex items-center gap-1.5 text-sm text-[--color-muted]">
                <GraduationCap size={18} />
                <span>전문가지원</span>
              </Link>
              <Link href="/login" className="flex items-center gap-1.5 text-sm text-[--color-muted]">
                <LogIn size={18} />
                <span>로그인</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
