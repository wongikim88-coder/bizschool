import HeroBanner from "@/components/sections/HeroBanner";
import RecommendedCourses from "@/components/sections/RecommendedCourses";
import RecommendedBooks from "@/components/sections/RecommendedBooks";
import { sampleCourses } from "@/data/courses";
import { sampleBooks } from "@/data/books";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <RecommendedCourses courses={sampleCourses} />
      <RecommendedBooks books={sampleBooks} />
    </>
  );
}
