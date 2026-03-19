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

// ── 나의 강의실 (수강내역) ──

export type CourseGroupType = "online" | "public" | "completed";
export type CoursePaymentStatus = "결제완료" | "미결제";

export interface MyCourse {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  paymentStatus: CoursePaymentStatus;
  isInsuranceRefund?: boolean;
  groupType: CourseGroupType;
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
  paidAmount: number;
}

export interface BookOrderPointsInfo {
  earnedPoints: number;
  usedPoints: number;
}

export interface BookOrderDetail extends BookOrder {
  shipping: BookOrderShippingInfo;
  payment: BookOrderPaymentDetail;
  points: BookOrderPointsInfo;
  trackingNumber?: string;
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

export type CourseOrderStatus = "결제대기" | "결제완료" | "수강중" | "수강완료";

export interface CourseOrder {
  id: string;
  orderedAt: string;
  courseTitle: string;
  courseType: "온라인" | "공개교육";
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "결제완료" | "결제대기";
  orderStatus: CourseOrderStatus;
}

export type CourseOrderStatusFilter = "전체" | CourseOrderStatus;

export interface CourseOrderFilter {
  periodPreset: PeriodPreset;
  dateFrom: string;
  dateTo: string;
  orderStatus: CourseOrderStatusFilter;
  searchKeyword: string;
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
