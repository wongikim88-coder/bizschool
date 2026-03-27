"use client";

import { Suspense, useState, useEffect } from "react";
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
  const hideFooter = pathname.startsWith("/expert/upload");
  const hideSearchBar = pathname === "/login" || pathname === "/about" || pathname === "/directions" || pathname === "/venue" || pathname === "/mypage" || pathname === "/expert" || pathname.startsWith("/notice") || pathname.startsWith("/resources") || pathname.startsWith("/expert-consultation") || pathname.startsWith("/expert/center") || pathname.startsWith("/expert/upload") || /^\/books\/.+/.test(pathname);

  const [searchInHeader, setSearchInHeader] = useState(false);

  useEffect(() => {
    if (hideSearchBar) return;
    const handleScroll = () => {
      setSearchInHeader(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideSearchBar]);

  // 헤더/푸터 없이 전체 화면: 강의 플레이어, 로그인 페이지
  if (isCoursePlayer || pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header showSearchInHeader={!hideSearchBar && searchInHeader} />
      {!hideSearchBar && (
        <Suspense>
          <SearchBar />
        </Suspense>
      )}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
