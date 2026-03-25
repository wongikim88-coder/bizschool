import Link from "next/link";
import { Eye, CheckCircle, Clock } from "lucide-react";
import type { ExpertConsultation } from "@/types";

interface ExpertPostCardProps {
  post: ExpertConsultation;
}

function formatViewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

export default function ExpertPostCard({ post }: ExpertPostCardProps) {
  return (
    <Link href={`/expert-consultation/${post.id}`}>
      <article className="cursor-pointer px-4 py-4 transition-colors hover:bg-[var(--color-light-bg)]">
        {/* 첫째 줄: 카테고리 + 제목 + 조회수 */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm font-medium text-[var(--color-muted)]">
                {post.category}
              </span>
              <span className="text-gray-300">|</span>
              <h3 className="truncate text-[15px] font-medium text-[var(--color-dark)]">
                {post.title}
              </h3>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-1 text-sm text-[var(--color-muted)] sm:flex">
            <Eye size={14} />
            <span>{formatViewCount(post.viewCount)}</span>
          </div>
        </div>

        {/* 둘째 줄: 작성자 · 날짜 · 답변상태 */}
        <div className="mt-1.5 flex items-center justify-between text-sm text-[var(--color-muted)]">
          <div className="flex items-center gap-1.5">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
          </div>
          <span className="ml-2">
            {post.status === "answered" ? (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                <CheckCircle size={12} />
                답변완료
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-500">
                <Clock size={12} />
                대기중
              </span>
            )}
          </span>
        </div>
      </article>
    </Link>
  );
}
