import { CheckCircle, Clock } from "lucide-react";
import type { ExpertVerification } from "@/types";

interface ExpertBadgeProps {
  verification: ExpertVerification;
}

export default function ExpertBadge({ verification }: ExpertBadgeProps) {
  if (verification.status === "none") return null;

  if (verification.status === "pending") {
    return (
      <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-2 text-sm text-yellow-800">
        <Clock size={16} />
        <span>전문가 검증 대기 중...</span>
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-800">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} />
        <span className="font-medium">전문가 검증 완료</span>
      </div>
      {verification.expertName && (
        <p className="mt-1 text-xs text-green-700">
          검증: {verification.expertName}
          {verification.verifiedAt &&
            ` | ${new Date(verification.verifiedAt).toLocaleDateString("ko-KR")}`}
        </p>
      )}
    </div>
  );
}
