import { Eye, MessageCircle, CheckCircle, CircleAlert, ThumbsUp } from "lucide-react";
import type { CourseQuestion, ConsultationCase, DiscussionPost } from "@/types";

interface PostCardProps {
  post: CourseQuestion | ConsultationCase | DiscussionPost;
  showTabTag?: boolean;
  variant?: "compact" | "feed";
}

function formatViewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

function getCategoryLabel(post: CourseQuestion | ConsultationCase | DiscussionPost): string {
  if (post.type === "discussion") {
    return post.subCategory;
  }
  return post.category;
}

function getTabTag(post: CourseQuestion | ConsultationCase | DiscussionPost): string | null {
  switch (post.type) {
    case "question":
      return "강의질문";
    case "consultation":
      return "상담사례";
    case "discussion":
      return "소통공간";
    default:
      return null;
  }
}

const tagStyles: Record<string, string> = {
  question: "bg-blue-50 text-blue-600",
  consultation: "bg-emerald-50 text-emerald-600",
  discussion: "bg-purple-50 text-purple-600",
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
        <p className="mt-1.5 text-sm text-[var(--color-muted)] line-clamp-2">
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

  // variant="compact" (기존 레이아웃)
  const tabTag = showTabTag ? getTabTag(post) : null;

  return (
    <article className="cursor-pointer px-4 py-4 transition-colors hover:bg-[var(--color-light-bg)]">
      {/* 첫째 줄: 카테고리 + 제목 + 조회수 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1">
            {tabTag && (
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-[var(--color-muted)]">
                {tabTag}
              </span>
            )}
            <span className="inline-flex items-center rounded bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
              {getCategoryLabel(post)}
            </span>
            <h3 className="ml-1 truncate text-[15px] font-medium text-[var(--color-dark)]">
              {post.title}
            </h3>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-1 text-sm text-[var(--color-muted)] sm:flex">
          <Eye size={14} />
          <span>{formatViewCount(post.viewCount)}</span>
        </div>
      </div>

      {/* 둘째 줄: 메타 정보 */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-sm text-[var(--color-muted)]">
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
      </div>
    </article>
  );
}
