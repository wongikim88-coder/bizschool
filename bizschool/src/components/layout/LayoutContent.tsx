"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCoursePlayer = pathname.startsWith("/course/");
  const isConsulting = pathname === "/consulting";
  const hideSearchBar = isConsulting || pathname === "/about" || pathname === "/directions" || pathname === "/venue" || pathname === "/mypage" || pathname.startsWith("/notice");

  // 강의 플레이어 페이지: 헤더/푸터 없이 전체 화면
  if (isCoursePlayer) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {!hideSearchBar && (
        <Suspense>
          <SearchBar />
        </Suspense>
      )}
      <main className="flex-1">{children}</main>
      {!isConsulting && <Footer />}
    </div>
  );
}
