"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserCircle, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import type { Session } from "next-auth";

interface UserMenuProps {
  user: Session["user"];
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="계정 메뉴"
        className="flex h-9 w-9 cursor-pointer items-center justify-center"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "프로필"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle size={28} className="text-[var(--color-dark)]" />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-[var(--color-border)] bg-white py-1 shadow-lg"
        >
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-[var(--color-dark)] truncate">
                {user.name || "사용자"}
              </p>
              {user.role === "expert" && (
                <span className="shrink-0 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-bold leading-none text-white">
                  전문가
                </span>
              )}
            </div>
            {user.email && (
              <p className="mt-0.5 text-xs text-[var(--color-muted)] truncate">
                {user.email}
              </p>
            )}
          </div>

          <Link
            href="/mypage"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-dark)] hover:bg-[var(--color-light-bg)]"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={15} className="text-[var(--color-muted)]" />
            마이페이지
          </Link>
          {user.role === "expert" && (
            <Link
              href="/expert/center"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-dark)] hover:bg-[var(--color-light-bg)]"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap size={15} className="text-[var(--color-muted)]" />
              전문가 스튜디오
            </Link>
          )}
          <div className="my-1 border-t border-[var(--color-border)]" />
          <button
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[var(--color-dark)] hover:bg-[var(--color-light-bg)]"
          >
            <LogOut size={15} className="text-[var(--color-muted)]" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
