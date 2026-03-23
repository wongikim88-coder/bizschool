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
  preview?: BookPreview;
  reviews?: BookReview[];
  specs?: BookSpecs;
}

export interface BookSpecs {
  pages?: number;
  size?: string;
  isbn?: string;
  binding?: string;
  weight?: string;
}

// ── 도서 리뷰 ──

export interface BookReview {
  reviewer: string;
  rating: number;
  content: string;
  date: string;
}

// ── 도서 미리보기 ──

export type PreviewViewMode = "spread" | "single" | "grid";

export interface BookTocItem {
  chapter: string;
  title: string;
  page: number;
}

export interface BookPreviewPage {
  pageNumber: number;
  label?: string;
}

export interface BookPreview {
  toc: BookTocItem[];
  totalPages: number;
  pages: BookPreviewPage[];
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

export type MypageTab = "profile" | "inquiry" | "courses" | "purchases" | "claims";

// ── 취소/반품/교환/환불내역 ──

export type ClaimType = "cancel" | "return" | "exchange";
export type ClaimStatus =
  | "취소완료"
  | "취소접수"
  | "반품"
  | "반품완료"
  | "교환진행"
  | "교환완료"
  | "교환철회";

export type ClaimSubTab = "claims" | "bankRefund";

export type CancelReason =
  | "wrong-address"
  | "not-satisfied"
  | "reorder";

export type CancelResolution =
  | "change-address"
  | "cancel";

export type PickupRequestLocation = "door" | "security" | "other";

export interface ClaimItem {
  id: string;
  claimType: ClaimType;
  claimStatus: ClaimStatus;
  claimDate: string;
  orderDate: string;
  orderNumber: string;
  product: {
    name: string;
    description: string;
    imageUrl: string;
    quantity: number;
    price: number;
  };
  refundExpectedDescription?: string;
  refundMethod?: string;
}

export interface CancelDetailInfo {
  claimItem: ClaimItem;
  cancelReceiptDate: string;
  cancelReceiptNumber: string;
  cancelCompleteDate?: string;
  cancelReason: string;
  refund: RefundInfo;
}

export interface ReturnDetailInfo {
  claimItem: ClaimItem;
  returnReceiptDate: string;
  returnReceiptNumber: string;
  pickupInfo: PickupInfo;
  shippingInfo: ShippingReturnInfo;
  pickupSchedule: PickupScheduleInfo;
  returnReason: string;
  refund: RefundInfo;
}

export interface ExchangeDetailInfo {
  claimItem: ClaimItem;
  exchangeReceiptDate: string;
  exchangeReceiptNumber: string;
  exchangeDeliveryInfo: {
    deliveryStatus: string;
    deliveryCarrier: string;
  };
  pickupInfo: PickupInfo;
  shippingInfo: ShippingReturnInfo;
  pickupSchedule: PickupScheduleInfo;
  exchangeReason: string;
}

export interface RefundInfo {
  productAmount: number;
  shippingFee: number;
  returnFee: number;
  refundMethod: string;
  refundAmount: number;
  isCompleted: boolean;
}

export interface PickupInfo {
  pickupPerson: string;
  phone: string;
  contact: string;
  address: string;
}

export interface ShippingReturnInfo {
  carrier: string;
  trackingNumber: string;
}

export interface PickupScheduleInfo {
  pickupDate: string;
  pickupRequest: PickupRequestLocation;
  pickupRequestText?: string;
}

export interface CancelWizardFormState {
  selectedOrderIds: string[];
  cancelReason: CancelReason | null;
  resolution: CancelResolution | null;
  addToCart: boolean;
}

export interface CancelReceiptInfo {
  productCancelAmount: number;
  discountDeduction: number;
  shippingFee: number;
  totalRefundAmount: number;
  receiptMethod: string;
  receiptAmount: number;
}

// ── 내 학습 (수강내역) ──

export type CourseCategory = "온라인 강의" | "현장 강의" | "인재키움 프리미엄 훈련";

export type MyLearningTab = CourseCategory | "강의 Q&A" | "수료증";

export type CourseLearningStatus = "수강 전" | "수강 중" | "수강완료";

export type CourseLearningStatusFilter = "전체" | CourseLearningStatus;

export interface MyCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  category: CourseCategory;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  learningStatus: CourseLearningStatus;
  periodLabel: string;
  isReviewable?: boolean;
  isExpired?: boolean;
  instructorName?: string;
}

// ── 현장 강의 / 인재키움 프리미엄 훈련 (내 학습) ──

export type OfflineCourseStatus = "수강 전" | "수강 중" | "수강완료";

export type OfflineCourseStatusFilter = "전체" | OfflineCourseStatus;

export type OfflineCourseCategory = "현장 강의" | "인재키움 프리미엄 훈련";

export interface OfflineCourseVenue {
  name: string;
  address?: string;
  mapUrl?: string;
}

export interface GovernmentTrainingInfo {
  trainingOrg: string;
  courseCode: string;
  fullFee: number;
  subsidyAmount: number;
  selfPayAmount: number;
}

export type AttendanceStatus = "출석" | "결석" | "미진행";

export interface CourseSession {
  date: string;                  // ISO "2026-04-01"
  label: string;                 // "4/1(화)" 표시용
  attendance: AttendanceStatus;
}

export interface MyOfflineCourse {
  id: string;
  category: OfflineCourseCategory;
  title: string;
  instructorName?: string;
  status: OfflineCourseStatus;
  dateRangeLabel: string;
  timeLabel: string;
  venue: OfflineCourseVenue;
  enrollmentDeadline?: string;
  totalSeats?: number;
  remainingSeats?: number;
  enrolledAt: string;
  paidAmount: number;
  governmentTraining?: GovernmentTrainingInfo;
  certificateUrl?: string;
  sessions?: CourseSession[];
}

// ── 도서 주문내역 (구매내역) ──

export type OrderStatus = "상품준비" | "배송준비" | "배송중" | "배송완료" | "취소" | "반품접수" | "반품완료";
export type PaymentMethod = "신용카드" | "무통장입금" | "카카오페이" | "네이버페이";

export interface BookOrder {
  id: string;
  orderedAt: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  quantity: number;
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "결제완료";
  orderStatus: OrderStatus;
  exchangeInfo?: {
    claimId: string;
    status: "교환진행" | "교환완료" | "교환철회";
  };
}

export type PeriodPreset = "1m" | "3m" | "6m" | "custom";
export type OrderStatusFilter = "전체" | OrderStatus;

export interface BookOrderFilter {
  periodPreset: PeriodPreset;
  dateFrom: string;
  dateTo: string;
  orderStatus: OrderStatusFilter;
  searchKeyword: string;
}

// ── 도서 주문 상세 ──

export interface BookOrderShippingInfo {
  recipientName: string;
  phone: string;
  address: string;
  memo?: string;
}

export interface BookOrderPaymentDetail {
  productTotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDetail?: string;
  paidAmount: number;
}

export interface BookOrderPointsInfo {
  earnedPoints: number;
  usedPoints: number;
}

export interface BookOrderReceiptInfo {
  cardType: string;
  transactionType: string;
  installment: string;
  cardNumber: string;
  transactionDatetime: string;
  approvalNumber: string;
}

export interface BookOrderDetail extends BookOrder {
  shipping: BookOrderShippingInfo;
  payment: BookOrderPaymentDetail;
  points: BookOrderPointsInfo;
  trackingNumber?: string;
  receipt?: BookOrderReceiptInfo;
}

// ── 배송 추적 ──

export interface ShippingTrackingStep {
  datetime: string;
  location: string;
  status: string;
}

export interface ShippingTrackingInfo {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  deliveryRequest?: string;
  deliveryMethod: string;
  currentStatus: string;
  statusMessage: string;
  completedDate?: string;
  steps: ShippingTrackingStep[];
}

// ── 강의 구매내역 ──

export type PurchaseSubTab = "books" | "courses";

export type CourseOrderPaymentStatus = "결제대기" | "결제완료";
export type CourseEnrollStatus = "수강전" | "수강중" | "수강완료";
export type CourseClaimStatus = "환불신청" | "환불완료" | "취소";

export interface CourseOrder {
  id: string;
  orderedAt: string;
  courseTitle: string;
  courseType: "온라인" | "공개교육";
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: CourseOrderPaymentStatus;
  enrollStatus: CourseEnrollStatus | null;
  claimStatus: CourseClaimStatus | null;
}

export type CourseUnifiedStatus = "결제대기" | "수강전" | "수강중" | "수강완료" | "환불신청" | "환불완료" | "취소";

export type CourseOrderStatusFilter = "전체" | CourseUnifiedStatus;

export interface CourseOrderFilter {
  periodPreset: PeriodPreset;
  dateFrom: string;
  dateTo: string;
  statusFilter: CourseOrderStatusFilter;
  searchKeyword: string;
}

export interface CourseOrderDetailType extends CourseOrder {
  orderedTime: string;
  coursePeriodStart?: string;
  coursePeriodEnd?: string;
  paymentMethodDetail?: string;
  payment: {
    courseFee: number;
    discountAmount: number;
    totalAmount: number;
    paidAt?: string;
  };
  receipt?: BookOrderReceiptInfo;
  refund?: {
    requestedAt: string;
    reason: string;
    refundAmount: number;
    completedAt?: string;
  };
  cancelledAt?: string;
  cancelReason?: string;
}

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

// ── 강의 Q&A ──

export type QnaAnswerStatus = "답변대기" | "답변완료";

export type QnaAnswerStatusFilter = "전체" | QnaAnswerStatus;

export type QnaCategoryFilter = "전체" | CourseCategory;

export interface CourseQna {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCategory: CourseCategory;
  title: string;
  content: string;
  createdAt: string;
  answerStatus: QnaAnswerStatus;
  answer?: CourseQnaAnswer;
}

export interface CourseQnaAnswer {
  content: string;
  answeredAt: string;
  instructorName: string;
}

// ── 공지사항 ──

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  isImportant: boolean;
}

// ── 수료증 ──

export interface CertificateCourse {
  id: string;
  title: string;
  category: "온라인 강의" | "현장 강의" | "인재키움 프리미엄 훈련";
  instructorName?: string;
  periodLabel: string;
  thumbnailUrl: string;
}

// ── 강의 상세 (플레이어) ──

export type CoursePlayerTab = "curriculum" | "qna" | "materials";

export interface CourseSection {
  id: string;
  title: string;
  totalDuration: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  fileType: "PDF" | "XLSX" | "HWP" | "ZIP" | "PPTX";
  fileSize: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

// ── 자료실 ──

export type ResourceCategory = "신청서·양식" | "정오표" | "교육자료" | "참고자료";

export type ResourceFileType = "PDF" | "XLSX" | "HWP" | "ZIP" | "PPTX";

export type ResourceCategoryFilter = "전체" | ResourceCategory;

export interface Resource {
  id: number;
  title: string;
  category: ResourceCategory;
  content: string;
  fileType: ResourceFileType;
  fileSize: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}
