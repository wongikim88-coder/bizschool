import HomeContent from "@/components/sections/HomeContent";
import { sampleCourses } from "@/data/courses";
import { sampleBooks } from "@/data/books";

export default function Home() {
  return <HomeContent courses={sampleCourses} books={sampleBooks} />;
}
