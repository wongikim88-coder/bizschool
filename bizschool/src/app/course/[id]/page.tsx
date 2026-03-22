import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockMyCourses } from "@/data/mypage";
import { getCourseSections, getCourseMaterials } from "@/data/course-detail";
import CoursePlayerLayout from "@/components/course/CoursePlayerLayout";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = mockMyCourses.find((c) => c.id === id);
  if (!course) {
    return { title: "강의를 찾을 수 없습니다 | BIZSCHOOL" };
  }
  return {
    title: `${course.title} | BIZSCHOOL`,
    description: `${course.title} 강의 수강 페이지`,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = mockMyCourses.find(
    (c) => c.id === id && c.category === "온라인 강의"
  );

  if (!course) {
    notFound();
  }

  const sections = getCourseSections(id);
  const materials = getCourseMaterials(id);

  return (
    <CoursePlayerLayout
      course={course}
      sections={sections}
      materials={materials}
    />
  );
}
