export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  badges?: Badge[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  badges?: Badge[];
  publisher?: string;
  publishDate?: string;
  description?: string;
  category?: string;
  isSoldOut?: boolean;
}

export interface Badge {
  label: string;
  variant: "primary" | "green" | "red" | "blue" | "gray";
}

export interface MenuItem {
  label: string;
  href: string;
}

// ── AI 전문가 상담 ──

export interface ConsultationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  expertVerification?: ExpertVerification;
}

export interface ExpertVerification {
  status: "none" | "pending" | "verified";
  expertName?: string;
  verifiedAt?: string;
  comment?: string;
}

// ── 커뮤니티 ──

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  content: string;
}

export interface CourseQuestion extends CommunityPost {
  type: "question";
  courseName: string;
  answerCount: number;
  isAnswered: boolean;
}

export interface ConsultationCase extends CommunityPost {
  type: "consultation";
  isVerified: boolean;
  verifiedBy?: string;
  helpfulCount: number;
}

export interface DiscussionPost extends CommunityPost {
  type: "discussion";
  subCategory: "잡담" | "정보공유" | "질문" | "후기";
}

export interface WeeklyActiveUser {
  rank: number;
  nickname: string;
  points: number;
  badge?: "gold" | "silver" | "bronze";
}

export type CommunityTab = "home" | "questions" | "cases" | "discussion";

// ── 마이페이지 ──

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

export interface Inquiry {
  id: number;
  category: InquiryCategory;
  title: string;
  content: string;
  status: "pending" | "answered";
  createdAt: string;
  answer?: InquiryAnswer;
}

export interface InquiryAnswer {
  content: string;
  answeredAt: string;
  answeredBy: string;
}

export type InquiryCategory = "강의" | "도서" | "결제" | "기술문제" | "기타";

export type InquiryFilter = "all" | "pending" | "answered";

export type MypageTab = "profile" | "inquiry" | "courses" | "purchases";

// ── 공개교육 ──

export interface EducationCourse {
  id: number;
  category: string;
  title: string;
  dateRange: string;
  timeRange: string;
  fee: number;
  instructor: string;
  status: "open" | "closed";
}
