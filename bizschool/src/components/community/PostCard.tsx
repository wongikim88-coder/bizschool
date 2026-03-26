import { Eye, MessageCircle, CheckCircle, CircleAlert, ThumbsUp } from "lucide-react";
import type { CourseQuestion, ConsultationCase, DiscussionPost, ExpertColumn } from "@/types";

interface PostCardProps {
  post: CourseQuestion | ConsultationCase | DiscussionPost | ExpertColumn;
  showTabTag?: boolean;
  variant?: "compact" | "feed";
}

function formatViewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

function getCategoryLabel(post: CourseQuestion | ConsultationCase | DiscussionPost | ExpertColumn): string {
  if (post.type === "discussion") {
    return post.subCategory;
  }
  return post.category;
}

function getTabTag(post: CourseQuestion | ConsultationCase | DiscussionPost | ExpertColumn): string | null {
  switch (post.type) {
    case "question":
      return "강의질문";
    case "consultation":
      return "상담사례";
    case "discussion":
      return "소통공간";
    case "column":
      return "전문가 컬럼";
    default:
      return null;
  }
}

const tagStyles: Record<string, string> = {
  question: "bg-blue-50 text-blue-600",
  consultation: "bg-emerald-50 text-emerald-600",
  discussion: "bg-sky-50 text-sky-600",
  column: "bg-orange-50 text-orange-600",
};

export default function PostCard({ post, showTabTag = false, variant = "compact" }: PostCardProps) {
  if (variant === "feed") {
    return (
      <article className="cursor-pointer px-5 py-5 transition-colors hover:bg-[var(--color-light-bg)]">
        {/* 카테고리 태그 */}
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${tagStyles[post.type]}`}
        >
          {getTabTag(post)}
        </span>

        {/* 제목 */}
        <h3 className="mt-2 text-base font-bold text-[var(--color-dark)] line-clamp-1">
          {post.title}
        </h3>

        {/* 본문 미리보기 */}
        <p className="mt-1.5 min-h-[2.5rem] text-sm text-[var(--color-muted)] line-clamp-2">
          {post.content}
        </p>

        {/* 메타 정보 */}
        <div className="mt-3 flex items-center justify-between text-sm text-[var(--color-muted)]">
          <div className="flex items-center gap-1.5">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Eye size={14} />
            <span>{formatViewCount(post.viewCount)}</span>
          </div>
        </div>
      </article>
    );
  }

  // variant="compact" — feed와 동일한 높이 구조
  const tabTag = showTabTag ? getTabTag(post) : null;

  return (
    <article className="cursor-pointer px-5 py-5 transition-colors hover:bg-[var(--color-light-bg)]">
      {/* 카테고리 태그 */}
      <div className="flex items-center gap-1.5">
        {tabTag && (
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-gray-100 text-[var(--color-muted)]">
            {tabTag}
          </span>
        )}
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${tagStyles[post.type]}`}>
          {getCategoryLabel(post)}
        </span>
      </div>

      {/* 제목 */}
      <h3 className="mt-2 flex items-center justify-between gap-3 text-base font-bold text-[var(--color-dark)] line-clamp-1">
        <span className="line-clamp-1">{post.title}</span>
        <div className="hidden shrink-0 items-center gap-1 text-sm font-normal text-[var(--color-muted)] sm:flex">
          <Eye size={14} />
          <span>{formatViewCount(post.viewCount)}</span>
        </div>
      </h3>

      {/* 본문 미리보기 */}
      <p className="mt-1.5 min-h-[2.5rem] text-sm text-[var(--color-muted)] line-clamp-2">
        {post.content}
      </p>

      {/* 메타 정보 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-1.5 text-sm text-[var(--color-muted)]">
        {post.type === "question" && (
          <>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
            <span>·</span>
            <span>답변 {post.answerCount}</span>
            <span className="ml-1.5">
              {post.isAnswered ? (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <CheckCircle size={12} />
                  답변완료
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-red)]">
                  <CircleAlert size={12} />
                  미답변
                </span>
              )}
            </span>
          </>
        )}

        {post.type === "consultation" && (
          <>
            <span>AI답변</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
              <CheckCircle size={12} />
              전문가검증
            </span>
            <span>·</span>
            <span>{post.createdAt}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5">
              <ThumbsUp size={12} />
              도움됐어요 {post.helpfulCount}
            </span>
          </>
        )}

        {post.type === "discussion" && (
          <>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5">
              <MessageCircle size={12} />
              {post.commentCount}
            </span>
          </>
        )}

        {post.type === "column" && (
          <>
            <span className="font-medium text-slate-700">{post.expertName}</span>
            <span>·</span>
            <span className="text-xs text-gray-400">{post.expertTitle}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
          </>
        )}
      </div>
    </article>
  );
}
