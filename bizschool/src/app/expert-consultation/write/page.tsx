import type { Metadata } from "next";
import ExpertWriteForm from "@/components/community/ExpertWriteForm";

export const metadata: Metadata = {
  title: "상담 등록 - 전문가상담 - BIZSCHOOL",
  description: "전문가에게 회계, 세무, 4대보험, 인사, 총무 관련 상담을 등록하세요.",
};

export default function ExpertWritePage() {
  return <ExpertWriteForm />;
}
