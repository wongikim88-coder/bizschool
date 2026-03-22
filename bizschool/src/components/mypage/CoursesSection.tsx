"use client";

import { useState, useMemo } from "react";
import type {
  MyLearningTab,
  CourseCategory,
  CourseLearningStatusFilter,
  OfflineCourseCategory,
  OfflineCourseStatusFilter,
} from "@/types";

import {
  mockMyCourses,
  mockMyOfflineCourses,
  courseCategories,
} from "@/data/mypage";
import MyLearningTabs from "./my-learning/MyLearningTabs";
import CourseFilterBar from "./my-learning/CourseFilterBar";
import CourseCard from "./my-learning/CourseCard";
import OfflineCourseFilterBar from "./my-learning/OfflineCourseFilterBar";
import OfflineCourseCard from "./my-learning/OfflineCourseCard";
import QnaSection from "./my-learning/QnaSection";
import CertificateSection from "./my-learning/certificate/CertificateSection";

const offlineCategories: OfflineCourseCategory[] = ["현장 강의", "인재키움 프리미엄 훈련"];

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState<MyLearningTab>("온라인 강의");

  const handleTabChange = (tab: MyLearningTab) => {
    setActiveTab(tab);
  };

  // Online filters
  const [onlineStatusFilter, setOnlineStatusFilter] =
    useState<CourseLearningStatusFilter>("전체");
  const [onlineSearch, setOnlineSearch] = useState("");

  // Offline filters
  const [offlineStatusFilter, setOfflineStatusFilter] =
    useState<OfflineCourseStatusFilter>("전체");
  const [offlineSearch, setOfflineSearch] = useState("");

  const isOnlineTab = activeTab === "온라인 강의";
  const isOfflineTab = (offlineCategories as readonly string[]).includes(activeTab);

  const filteredOnlineCourses = useMemo(() => {
    if (!isOnlineTab) return [];
    let courses = mockMyCourses.filter((c) => c.category === "온라인 강의");
    if (onlineStatusFilter !== "전체") {
      courses = courses.filter((c) => c.learningStatus === onlineStatusFilter);
    }
    if (onlineSearch.trim()) {
      const kw = onlineSearch.trim().toLowerCase();
      courses = courses.filter((c) => c.title.toLowerCase().includes(kw));
    }
    return courses;
  }, [isOnlineTab, onlineStatusFilter, onlineSearch]);

  const filteredOfflineCourses = useMemo(() => {
    if (!isOfflineTab) return [];
    let courses = mockMyOfflineCourses.filter(
      (c) => c.category === (activeTab as OfflineCourseCategory)
    );
    if (offlineStatusFilter !== "전체") {
      courses = courses.filter((c) => c.status === offlineStatusFilter);
    }
    if (offlineSearch.trim()) {
      const kw = offlineSearch.trim().toLowerCase();
      courses = courses.filter((c) => c.title.toLowerCase().includes(kw));
    }
    return courses;
  }, [activeTab, isOfflineTab, offlineStatusFilter, offlineSearch]);

  return (
    <div>
      <MyLearningTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 온라인 강의 */}
      {isOnlineTab && (
        <>
          <CourseFilterBar
            statusFilter={onlineStatusFilter}
            onStatusFilterChange={setOnlineStatusFilter}
            searchKeyword={onlineSearch}
            onSearchKeywordChange={setOnlineSearch}
          />
          {filteredOnlineCourses.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[var(--color-muted)]">
                해당하는 강의가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filteredOnlineCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </>
      )}

      {/* 현장 강의 / 인재키움 프리미엄 훈련 */}
      {isOfflineTab && (
        <>
          <OfflineCourseFilterBar
            statusFilter={offlineStatusFilter}
            onStatusFilterChange={setOfflineStatusFilter}
            searchKeyword={offlineSearch}
            onSearchKeywordChange={setOfflineSearch}
          />
          {filteredOfflineCourses.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[var(--color-muted)]">
                해당하는 강의가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredOfflineCourses.map((course) => (
                <OfflineCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </>
      )}

      {/* 강의 Q&A */}
      {activeTab === "강의 Q&A" && <QnaSection />}

      {/* 수료증 */}
      {activeTab === "수료증" && <CertificateSection />}
    </div>
  );
}
