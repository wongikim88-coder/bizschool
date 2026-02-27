"use client";

import { useState, useEffect, useRef } from "react";
import PostCard from "./PostCard";
import WeeklyTopUsers from "./WeeklyTopUsers";
import { getShuffledFeed, weeklyTopUsers, FEED_BATCH_SIZE } from "@/data/community";
import { Loader2 } from "lucide-react";

const allPosts = getShuffledFeed();

export default function HomeTab() {
  const [displayCount, setDisplayCount] = useState(FEED_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visiblePosts = allPosts.slice(0, displayCount);
  const hasMore = displayCount < allPosts.length;

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => Math.min(prev + FEED_BATCH_SIZE, allPosts.length));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [displayCount, hasMore]);

  return (
    <div className="flex gap-6">
      {/* 메인 피드 */}
      <div className="min-w-0 flex-1">
        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} variant="feed" />
          ))}
        </div>

        {/* Sentinel & Status */}
        {hasMore ? (
          <div ref={sentinelRef} className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[var(--color-muted)]" />
            <span className="sr-only">게시물을 불러오는 중입니다</span>
          </div>
        ) : (
          <p
            role="status"
            aria-live="polite"
            className="py-8 text-center text-sm text-[var(--color-muted)]"
          >
            모든 게시물을 확인했습니다
          </p>
        )}

        {/* 모바일/태블릿용 TOP 10 - 피드 끝에 표시 */}
        {!hasMore && (
          <div className="mt-6 lg:hidden">
            <WeeklyTopUsers users={weeklyTopUsers} layout="horizontal" />
          </div>
        )}
      </div>

      {/* 우측 사이드바 - 데스크톱 */}
      <div className="hidden w-[280px] shrink-0 lg:block">
        <WeeklyTopUsers users={weeklyTopUsers} />
      </div>
    </div>
  );
}
