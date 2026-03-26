import type { Metadata } from "next";
import ExpertApplicationForm from "@/components/expert/ExpertApplicationForm";

export const metadata: Metadata = {
  title: "전문가 지원하기 - BIZSCHOOL",
  description: "BIZSCHOOL에서 전문가로 활동하며 강의를 제작하고 판매해보세요.",
};

export default function ExpertPage() {
  return <ExpertApplicationForm />;
}
