import MainBanner from "@/components/sections/MainBanner";
import RecommendedCourses from "@/components/sections/RecommendedCourses";
import RecommendedBooks from "@/components/sections/RecommendedBooks";
import OnlineCourses from "@/components/sections/OnlineCourses";
import { sampleCourses } from "@/data/courses";
import { sampleBooks } from "@/data/books";

export default function Home() {
  return (
    <div>
      {/* 섹션 1: 메인 배너 (기존 캐러셀) */}
      <div className="mx-auto max-w-[1440px] px-4">
        <MainBanner />
      </div>

      {/* 섹션 2: 추천강의 (4개/1줄) */}
      <RecommendedCourses courses={sampleCourses} />

      {/* 섹션 3: 추천도서 (5개/1줄) */}
      <RecommendedBooks books={sampleBooks} />

      {/* 섹션 4: 온라인 강의 (16개/페이지 + 페이지네이션) */}
      <OnlineCourses courses={sampleCourses} />
    </div>
  );
}
