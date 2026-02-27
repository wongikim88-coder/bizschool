import PostCard from "./PostCard";
import CommunityPagination from "./CommunityPagination";
import { courseQuestions, POSTS_PER_PAGE } from "@/data/community";

interface QuestionsTabProps {
  page: number;
}

export default function QuestionsTab({ page }: QuestionsTabProps) {
  const totalPosts = courseQuestions.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = courseQuestions.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div>
      <p className="py-3 text-sm text-[var(--color-muted)]">총 {totalPosts}개의 강의질문</p>
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <CommunityPagination currentPage={page} totalPages={totalPages} currentTab="questions" />
    </div>
  );
}
