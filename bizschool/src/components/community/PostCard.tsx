import { Eye, MessageCircle, CheckCircle, CircleAlert, ThumbsUp } from "lucide-react";
import type { CourseQuestion, ConsultationCase, DiscussionPost } from "@/types";

interface PostCardProps {
  post: CourseQuestion | ConsultationCase | DiscussionPost;
  showTabTag?: boolean;
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

export default function PostCard({ post, showTabTag = false }: PostCardProps) {
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
