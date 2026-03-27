# 헤더 알림 시스템 기능 개선 Planning Document

> **Summary**: 헤더 벨 아이콘 알림 드롭다운에 개별 삭제, 알림 타입 확장, 빈 상태 UX 등 사용성 중심 기능을 추가한다.
>
> **Project**: BizSchool
> **Version**: 1.0
> **Author**: Product Manager
> **Date**: 2026-03-27
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

현재 알림 시스템은 AI 답변 도착 알림 하나만 지원하며, 읽은 알림을 지울 방법이 없다. 사용자가 알림 목록을 스스로 관리하고, 더 다양한 서비스 이벤트를 알림으로 수신할 수 있도록 사용성을 개선한다.

### 1.2 Background

- 알림은 React Context(메모리 기반)로 관리되며 새로고침 시 초기화된다.
- 현재 알림 타입은 `"ai-answer"` 하나뿐이고, 드롭다운은 읽음 처리만 지원한다.
- 사용자가 알림을 누적해서 쌓아두면 목록이 지저분해지는 문제가 있다.
- 알림 발생 지점이 ExpertWriteForm 한 곳뿐이어서 실용적 확장 가능성이 제한적이다.

### 1.3 현재 구현 상태 요약

| 기능 | 구현 여부 |
|------|:--------:|
| 벨 아이콘 클릭 시 드롭다운 표시 | 완료 |
| 읽지 않은 뱃지 카운트 | 완료 |
| 알림 클릭 시 해당 페이지 이동 + 읽음 처리 | 완료 |
| 모두 읽음 버튼 (미읽음 있을 때만) | 완료 |
| AI 답변 도착 알림 생성 (ExpertWriteForm) | 완료 |
| 개별 알림 삭제 | **미구현** |
| 알림 전체 삭제 | **미구현** |
| 알림 타입 확장 | **미구현** |
| 읽은 알림 자동 정리 | **미구현** |

### 1.4 Related Documents

- 관련 소스: `src/contexts/NotificationContext.tsx`
- 관련 소스: `src/components/layout/Header.tsx` (벨 드롭다운 UI)
- 관련 소스: `src/components/mypage/expert-consultation/ExpertWriteForm.tsx`

---

## 2. Scope

### 2.1 In Scope

- [ ] 개별 알림 삭제 버튼 추가 (Must)
- [ ] 알림 전체 삭제 버튼 추가 (Should)
- [ ] 알림 타입 확장: 커뮤니티 답글 도착 알림 (Should)
- [ ] 드롭다운 하단 "알림 전체 보기" 링크 (Could)
- [ ] 읽은 알림 시각적 구분 유지 및 자동 정리 없음 (범위 내 정책 결정)

### 2.2 Out of Scope

- 서버 사이드 알림 저장 / DB 연동 (백엔드 없는 mock 기반 프로젝트)
- 브라우저 Push Notification (Web Push API)
- 이메일 또는 SMS 알림 발송
- 알림 설정 페이지 (수신 ON/OFF 토글)
- 페이지네이션 또는 무한 스크롤 (최대 20건 제한으로 대응)
- 실시간 WebSocket 기반 알림 수신

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | 요구사항 | 우선순위 | 상태 |
|----|---------|:--------:|------|
| FR-01 | 알림 항목마다 삭제(X) 버튼을 표시하고, 클릭 시 해당 알림이 목록에서 제거된다. | Must | Pending |
| FR-02 | 삭제 버튼은 알림 항목에 마우스 오버 시에만 표시되어 평상시 UI가 복잡해지지 않도록 한다. | Must | Pending |
| FR-03 | NotificationContext에 `removeNotification(id)` 함수를 추가하고 Header에서 호출한다. | Must | Pending |
| FR-04 | 알림 목록이 1개 이상일 때 드롭다운 헤더 영역에 "전체 삭제" 버튼을 표시한다. | Should | Pending |
| FR-05 | "전체 삭제" 클릭 시 별도 confirm 없이 즉시 전체 삭제한다 (mock 기반, 복구 불필요). | Should | Pending |
| FR-06 | 커뮤니티 게시글에 답글이 달렸을 때 알림 타입 `"community-reply"`로 알림을 생성한다. | Should | Pending |
| FR-07 | 알림 타입별로 다른 아이콘을 드롭다운 항목에 표시한다 (ai-answer: Bot, community-reply: MessageCircle). | Should | Pending |
| FR-08 | 알림 최대 보관 건수를 20건으로 제한하고, 초과 시 가장 오래된 알림을 자동으로 제거한다. | Should | Pending |
| FR-09 | 드롭다운 하단에 "전체 알림 보기" 링크를 표시하고, 링크 클릭 시 `/mypage?tab=notifications` 로 이동한다. | Could | Pending |

### 3.2 Non-Functional Requirements

| 카테고리 | 기준 | 측정 방법 |
|---------|------|---------|
| 성능 | 알림 삭제/추가 조작 후 드롭다운 리렌더링 시간 < 100ms | 브라우저 Performance 탭 육안 확인 |
| 접근성 | 삭제 버튼에 `aria-label="알림 삭제"` 부여 | 코드 리뷰 |
| UX | 삭제 버튼이 알림 텍스트 클릭 영역과 겹치지 않아야 함 | 화면 확인 |

---

## 4. 우선순위별 기능 정리 (MoSCoW)

### Must — 현재 이터레이션에 반드시 포함

#### M-1. 개별 알림 삭제 (FR-01, FR-02, FR-03)

**필요성**: 사용자가 읽은 알림을 지울 방법이 없어 목록이 계속 쌓인다. 특히 AI 답변은 읽고 나면 더 이상 목록에 남겨둘 이유가 없다.

**사용자 시나리오**:
1. 사용자가 전문가상담을 제출한다.
2. AI 답변 도착 알림이 생성된다.
3. 사용자가 알림을 클릭해 답변을 확인한다.
4. 드롭다운을 다시 열면 이미 읽은 알림이 남아있다.
5. 항목 위에 마우스를 올리면 X 버튼이 나타나고, 클릭하면 해당 알림이 즉시 사라진다.

**구현 범위**:
- `NotificationContext`에 `removeNotification(id: string)` 추가
- `Header.tsx` 알림 항목에 `group` hover 클래스 활용한 X 버튼 추가
- X 버튼 클릭 시 `e.stopPropagation()` 처리 (페이지 이동 방지)

---

### Should — 시간이 허용되면 포함

#### S-1. 전체 삭제 버튼 (FR-04, FR-05)

**필요성**: 알림이 여러 개 쌓였을 때 하나씩 지우는 것은 번거롭다. "모두 읽음"과 나란히 놓여 일관된 관리 UX를 제공한다.

**사용자 시나리오**:
1. 알림이 5개 이상 쌓여 있다.
2. 드롭다운 헤더의 "전체 삭제" 클릭.
3. 목록이 즉시 비워지고 "알림이 없습니다" 상태로 전환된다.

**구현 범위**:
- `NotificationContext`에 `clearAll()` 함수 추가
- 드롭다운 헤더에 "전체 삭제" 버튼 추가 (알림 1개 이상일 때만 노출)
- "모두 읽음"과 "전체 삭제"가 함께 표시될 때는 `|` 구분자로 구분

#### S-2. 커뮤니티 답글 알림 타입 추가 (FR-06, FR-07)

**필요성**: 현재 알림은 전문가상담 AI 답변 하나뿐이다. 커뮤니티 답글 알림을 추가하면 알림 시스템의 실용적 가치가 높아진다.

**사용자 시나리오**:
1. 사용자가 커뮤니티에 게시글을 작성한다.
2. 다른 사용자(또는 mock 동작)가 답글을 달면 `"community-reply"` 타입 알림이 생성된다.
3. 드롭다운에서 MessageCircle 아이콘과 함께 "새 답글이 달렸습니다" 메시지를 확인한다.
4. 클릭 시 해당 게시글로 이동한다.

**구현 범위**:
- `Notification` 타입의 `type` 필드에 `"community-reply"` 추가
- 알림 아이콘 매핑 로직 추가 (타입 → 아이콘 컴포넌트)
- 커뮤니티 답글 등록 시 `addNotification` 호출 (WritePostFAB 또는 답글 폼)

#### S-3. 알림 최대 건수 20건 제한 (FR-08)

**필요성**: mock 기반 메모리 상태이므로 무한 누적 방지. 오래된 알림은 자동 제거하여 목록 길이를 일정하게 유지한다.

**구현 범위**:
- `addNotification` 내부에서 누적 후 배열 길이가 20 초과 시 `slice(0, 20)` 처리

---

### Could — 다음 이터레이션으로 미룰 수 있는 기능

#### C-1. 드롭다운 하단 "전체 알림 보기" 링크 (FR-09)

**필요성**: 알림이 많아져 드롭다운에서 모두 확인하기 어려울 때 전용 페이지로 이동하는 경로를 제공한다.

**사용자 시나리오**:
1. 드롭다운을 열었는데 알림이 여러 개라 스크롤이 필요하다.
2. 하단 "전체 알림 보기" 클릭 → `/mypage?tab=notifications`로 이동.

**비고**: 마이페이지에 알림 탭이 현재 존재하지 않으므로, 해당 탭 구현이 선행되어야 한다. 단독으로 구현 시 404 상황이 발생할 수 있어 현재 이터레이션에서는 보류.

---

### Won't — 현재 범위 외

| 기능 | 제외 이유 |
|------|---------|
| 알림 수신 설정 페이지 (ON/OFF) | mock 기반에서 설정 저장 불가, 과도한 UX 복잡성 |
| 브라우저 Push Notification | 백엔드 연동 필요, 현재 프로젝트 범위 초과 |
| 알림 카테고리 필터 탭 | 알림 타입이 아직 2종으로 탭 UI 도입 시 YAGNI |
| 읽은 후 N일 지나면 자동 삭제 | 메모리 기반이므로 새로고침 시 어차피 초기화됨 |

---

## 5. Success Criteria

### 5.1 Definition of Done

- [ ] FR-01~FR-03 (개별 삭제) 구현 완료 및 정상 동작 확인
- [ ] FR-04~FR-05 (전체 삭제) 구현 완료 및 정상 동작 확인
- [ ] FR-06~FR-07 (커뮤니티 답글 타입) 구현 완료
- [ ] FR-08 (20건 제한) 구현 완료
- [ ] X 버튼이 알림 클릭(페이지 이동) 이벤트와 독립적으로 동작함
- [ ] TypeScript 에러 없음, lint 에러 없음

### 5.2 Quality Criteria

- [ ] 삭제 후 unreadCount가 올바르게 감소함
- [ ] 모두 읽음 처리 후 전체 삭제 시 뱃지가 0으로 사라짐
- [ ] 알림 0건일 때 "알림이 없습니다" 빈 상태 표시가 정상 작동함

---

## 6. Risks and Mitigation

| 리스크 | 영향도 | 발생 가능성 | 대응 방안 |
|--------|:-----:|:---------:|---------|
| X 버튼 클릭이 알림 항목(페이지 이동) 이벤트와 충돌 | High | Medium | `e.stopPropagation()` 처리로 이벤트 버블링 차단 |
| "전체 삭제"와 "모두 읽음" 버튼이 헤더에 겹쳐 복잡해 보임 | Medium | Medium | 두 버튼을 `|` 구분자로 나란히 배치하거나 읽은 알림이 없을 땐 "전체 삭제"만 표시 |
| 커뮤니티 답글 알림 발생 지점이 불명확 (mock 데이터 기반) | Medium | High | WritePostFAB 또는 답글 제출 폼에서 임의 트리거로 구현 |

---

## 7. Architecture Considerations

### 7.1 Project Level

**Dynamic** — 기존 프로젝트 구조 유지. Context 기반 상태 관리 유지.

### 7.2 Key Architectural Decisions

| 결정 사항 | 선택 | 이유 |
|---------|------|-----|
| 알림 상태 관리 | React Context 유지 | 기존 NotificationContext 확장, 백엔드 없는 mock 환경에 적합 |
| 알림 타입 정의 | Union type 확장 (`"ai-answer" \| "community-reply"`) | 타입 안전성 유지 |
| 아이콘 매핑 | 타입 → 아이콘 객체 매핑 (`Record<type, ReactNode>`) | 드롭다운 내 타입별 아이콘 분기 단순화 |

### 7.3 영향 받는 파일

```
src/
  contexts/
    NotificationContext.tsx      // removeNotification, clearAll 추가, 타입 확장
  components/
    layout/
      Header.tsx                 // 삭제 버튼 UI, 전체 삭제 버튼 UI
    community/
      (답글 폼 컴포넌트)          // addNotification("community-reply") 호출 추가
```

---

## 8. Next Steps

1. [ ] Design 문서 작성 (`notification-enhancements.design.md`)
2. [ ] CTO(팀 리드) Plan 검토 및 승인
3. [ ] 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-27 | Initial draft | Product Manager |
