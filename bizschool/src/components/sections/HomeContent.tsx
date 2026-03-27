"use client";

import { useState, useRef } from "react";
import MainBanner from "@/components/sections/MainBanner";
import RecommendedCourses from "@/components/sections/RecommendedCourses";
import RecommendedBooks from "@/components/sections/RecommendedBooks";
import OnlineCourses from "@/components/sections/OnlineCourses";
import type { Course } from "@/types";
import type { Book } from "@/types";

interface HomeContentProps {
  courses: Course[];
  books: Book[];
}

export default function HomeContent({ courses, books }: HomeContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={topRef}>
      {/* 섹션 1: 메인 배너 */}
      <div className="mx-auto max-w-[1440px] px-4">
        <MainBanner />
      </div>

      {/* 섹션 2~3: 1페이지에서만 표시 */}
      {currentPage === 1 && (
        <>
          <RecommendedCourses courses={courses} />
          <RecommendedBooks books={books} />
        </>
      )}

      {/* 섹션 4: 온라인 강의 (항상 표시) */}
      <OnlineCourses
        courses={courses}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
