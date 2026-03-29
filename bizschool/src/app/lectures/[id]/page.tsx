import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLectureById, allLectures } from "@/data/lectures";
import LectureDetailContent from "@/components/lectures/LectureDetailContent";

interface LecturePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LecturePageProps): Promise<Metadata> {
  const { id } = await params;
  const lecture = getLectureById(id);
  if (!lecture) {
    return { title: "강의를 찾을 수 없습니다 | BIZSCHOOL" };
  }
  return {
    title: `${lecture.title} | BIZSCHOOL`,
    description: lecture.description,
  };
}

export function generateStaticParams() {
  return allLectures.map((l) => ({ id: l.id }));
}

export default async function LecturePage({ params }: LecturePageProps) {
  const { id } = await params;
  const lecture = getLectureById(id);

  if (!lecture) {
    notFound();
  }

  return <LectureDetailContent lecture={lecture} />;
}
