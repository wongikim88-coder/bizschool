import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PostCard from "./PostCard";
import WeeklyTopUsers from "./WeeklyTopUsers";
import {
  courseQuestions,
  consultationCases,
  discussionPosts,
  weeklyTopUsers,
  HOME_POSTS_PER_SECTION,
} from "@/data/community";

const popularQuestions = [...courseQuestions]
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, HOME_POSTS_PER_SECTION);

const popularCases = [...consultationCases]
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, HOME_POSTS_PER_SECTION);

const popularDiscussions = [...discussionPosts]
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, HOME_POSTS_PER_SECTION);

interface SectionProps {
  title: string;
  icon: string;
  tabKey: string;
  children: React.ReactNode;
}

function Section({ title, icon, tabKey, children }: SectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-bold text-[var(--color-dark)]">
          {icon} {title}
        </h2>
        <Link
          href={`/community?tab=${tabKey}`}
          className="flex items-center gap-0.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          더보기
          <ChevronRight size={14} />
        </Link>
      </div>
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
        {children}
      </div>
    </section>
  );
}

export default function HomeTab() {
  return (
    <div className="flex gap-6">
      {/* 좌측 메인 콘텐츠 */}
      <div className="min-w-0 flex-1">
        <Section title="인기 강의질문" icon="🔥" tabKey="questions">
          {popularQuestions.map((post) => (
            <PostCard key={post.id} post={post} showTabTag />
          ))}
        </Section>

        <Section title="인기 상담사례" icon="📋" tabKey="cases">
          {popularCases.map((post) => (
            <PostCard key={post.id} post={post} showTabTag />
          ))}
        </Section>

        <Section title="인기 소통공간" icon="💬" tabKey="discussion">
          {popularDiscussions.map((post) => (
            <PostCard key={post.id} post={post} showTabTag />
          ))}
        </Section>
      </div>

      {/* 우측 패널 - 데스크톱 */}
      <div className="hidden w-[280px] shrink-0 pt-4 lg:block">
        <WeeklyTopUsers users={weeklyTopUsers} />
      </div>

      {/* 모바일/태블릿용 TOP 10 - 하단 가로 스크롤 */}
      <div className="hidden" aria-hidden="true">
        {/* HomeTab 전체가 flex이므로 모바일 TOP10은 page.tsx에서 처리 */}
      </div>
    </div>
  );
}
