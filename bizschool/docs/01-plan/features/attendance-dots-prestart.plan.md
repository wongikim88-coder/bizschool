# 수강 전 강의 출석 도트 표시 여부 Planning Document

> **Summary**: 오프라인 강의 카드에서 "수강 전" 상태일 때 출석 도트(○○○○○) 표시 여부를 결정하고, 수강 전 단계에서 전달해야 할 정보 계층 구조를 정의한다.
>
> **Project**: BIZSCHOOL
> **Author**: Product Manager
> **Date**: 2026-03-20
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

현재 `AttendanceStatus.tsx`는 `status === "수강 전"` 일 때 출석 도트를 완전히 숨긴다.
사용자 질문: 수강 전 상태에서도 `○ ○ ○ ○ ○  0/5회 출석` 형태로 도트를 표시해야 하는가?

이 문서는 해당 결정의 제품적 근거를 분석하고 최종 권고안을 도출한다.

### 1.2 Background

**현재 동작 코드 (`AttendanceStatus.tsx` line 44):**
```typescript
if (status === "수강 전") return null;
```

**현재 3단계 표시 방식:**

| 상태 | 도트 표시 | 예시 |
|------|-----------|------|
| 수강 전 | 없음 (null) | — |
| 수강 중 | 출석/결석/미진행 도트 | ● ● ○ ○ ○  2/5회 출석 |
| 수강완료 | 모든 도트 채워짐 | ● ● ● ● ●  5/5회 출석 |

**도트 색상 체계:**
- Blue (`var(--color-primary)`): 출석
- Red (`red-500`): 결석
- Gray (`gray-300`): 미진행(아직 안 한 회차)

### 1.3 Related Documents

- 현재 컴포넌트: `src/components/mypage/my-learning/AttendanceStatus.tsx`
- 카드 컴포넌트: `src/components/mypage/my-learning/OfflineCourseCard.tsx`
- 타입 정의: `src/types/index.ts` (`AttendanceStatus`, `CourseSession`, `MyOfflineCourse`)
- 관련 Plan: `docs/01-plan/features/my-learning-ui-revamp.plan.md`

---

## 2. Product Analysis

### 2.1 사용자 니즈 분석

수강 전 학습자가 카드를 보는 맥락:
- **알고 싶은 것 1**: 이 강의가 몇 회차인가? (커리큘럼 규모 파악)
- **알고 싶은 것 2**: 언제 시작하는가? (날짜/기간)
- **알고 싶은 것 3**: 장소는 어디인가?
- **알고 싶은 것 4 (낮음)**: 진행률 / 출석 현황

수강 전 상태에서는 **커리큘럼 규모 파악(총 회차 수)** 이 출석률보다 훨씬 높은 우선순위다.
`0/5회 출석`이라는 숫자는 "아직 시작 안 했다"는 정보를 한번 더 반복할 뿐이며, 수강 전 사용자에게 직접적인 행동 가이드(actionable insight)를 제공하지 못한다.

### 2.2 혼란 가능성 (UX 리스크)

| 리스크 | 설명 | 심각도 |
|--------|------|--------|
| 결석 오인 | 회색 도트 ○○○○○가 "아직 시작 안 했다"가 아닌 "5번 결석했다"로 오해될 가능성 | **높음** |
| 0/5회 출석 텍스트의 부정적 인상 | "0회 출석"은 수치처럼 느껴질 수 있다. 수강도 안 했는데 "0회"라는 숫자 표시 | 중간 |
| 컬러 코드 혼동 | gray = 미진행이지만, 사용자가 처음 보면 gray가 "결석"으로 인식하는 빈도 높음 | 중간 |

특히 **회색 도트와 결석 오인 문제**는 국내 사용자 리서치에서 자주 등장하는 패턴이다. 도트 UI는 "이미 무언가가 일어났고, 그 결과를 색으로 표현한다"는 멘탈 모델을 유발하기 때문에, 아무것도 일어나지 않은 상태(수강 전)에서 도트를 보여주면 혼란이 생긴다.

### 2.3 총 회차 수 정보의 가치 (별도 고려)

사용자가 수강 전에 "총 몇 회차인가"를 알고 싶다는 니즈는 유효하다.
그러나 이 정보를 표현하는 방식은 **도트가 아닌 텍스트**가 더 적합하다.

예시 대안:
```
총 5회 과정  (수강 전 상태에서)
● ● ○ ○ ○  2/5회 출석  (수강 중 상태에서)
● ● ● ● ●  5/5회 출석  (수강완료 상태에서)
```

이 방식은:
- 총 회차 정보를 명확히 전달
- 도트 UI는 출석 기록이 실제로 존재할 때만 등장 → 혼동 없음
- 수강 전 → 수강 중 전환 시 UI가 자연스럽게 출석 도트로 교체

### 2.4 정보 계층 구조 (Information Hierarchy)

상태별로 사용자에게 중요한 정보의 우선순위가 다르다:

**수강 전 (가장 중요한 정보 순서):**
1. 강의명 (무슨 강의인가)
2. 날짜/시간 (언제인가)
3. 장소 (어디인가)
4. 총 회차 수 (몇 번 나가야 하는가)
5. 강사명
→ 출석 현황: **불필요** (기록 자체가 없음)

**수강 중 (가장 중요한 정보 순서):**
1. 현재 출석 현황 (몇 번 나갔는가, 다음 수업은 언제인가)
2. 강의명
3. 날짜/시간
4. 장소
→ 출석 도트: **핵심 정보**

**수강완료 (가장 중요한 정보 순서):**
1. 수료 여부 / 최종 출석률
2. 강의명
3. 수료증 다운로드 여부
→ 출석 도트: **완료 확인 정보**

### 2.5 한국 유사 플랫폼 벤치마크

| 플랫폼 | 수강 전 상태 처리 방식 |
|--------|----------------------|
| HRD-Net | 수강 신청 후 상태를 "대기중"으로 표시. 출석 정보 없음. 시작일만 표시. |
| 클래스101 | 오프라인 클래스는 날짜/장소/회차 수 텍스트 표시. 도트 UI 없음. |
| 인프런 (온라인) | 온라인이라 출석 도트 개념 없음. 진행률 바를 0%로 표시. |
| 패스트캠퍼스 | 오프라인 클래스는 날짜 기반 리스트. 출석 도트 없음. |

**공통 패턴**: 수강 전 상태에서 출석 관련 UI(도트, 진행률 바)를 보여주는 플랫폼은 거의 없다. 대신 날짜/총 회차 정보를 텍스트로 표시한다.

---

## 3. Recommendation

### 3.1 권고안: 수강 전에 출석 도트를 표시하지 않는다 (현행 유지 + 총 회차 텍스트 추가)

**결론: `if (status === "수강 전") return null` 로직을 유지한다.**

대신 수강 전 상태에서 총 회차 수를 텍스트로 표시하는 별도 UI 요소를 추가한다.

### 3.2 근거 요약

1. **혼란 최소화**: 회색 도트 ○○○○○는 사용자에게 결석 또는 미확인 상태로 오인될 위험이 높다.
2. **정보 계층 준수**: 수강 전 단계에서 출석 현황은 불필요한 정보다. 사용자는 날짜/장소/회차 수가 더 필요하다.
3. **도트 UI의 의미 보존**: 도트가 출석 기록이 있을 때만 등장하면, 도트 자체가 "수강이 시작됐다"는 신호가 된다. 이는 UI 언어의 일관성을 높인다.
4. **업계 관행 일치**: 한국 교육 플랫폼 중 수강 전 상태에서 출석 도트를 표시하는 사례가 없다.

### 3.3 추가 권고: 수강 전 카드에 총 회차 수 텍스트 표시

현재 수강 전 카드에는 총 회차 수가 전혀 노출되지 않는다.
이는 정보 부족 문제이므로, 도트 대신 다음 방식으로 총 회차를 표시할 것을 권고한다.

**제안 UI (수강 전 상태):**
```
총 N회 과정
```

**위치**: `AttendanceStatus` 컴포넌트가 렌더링하는 영역 (`mt-3` 블록)
**조건**: `sessions`가 존재하고 `sessions.length > 1`인 경우 (기존 조건과 동일)

---

## 4. Scope

### 4.1 In Scope

- [x] "수강 전" 상태에서 출석 도트를 숨기는 현행 로직 유지 결정
- [x] 수강 전 카드에 총 회차 수를 텍스트로 표시하는 기능 추가 (`AttendanceStatus.tsx` 수정)
- [x] 수강 중 / 수강완료 상태의 기존 도트 UI는 변경 없음

### 4.2 Out of Scope

- 도트 색상 체계 변경 (Blue/Red/Gray)
- 수강 중/수강완료 도트 UI 변경
- 출석률 기반 경고 UI (예: 결석 초과 시 경고)
- 온라인 강의 카드의 진행률 표시 방식 (별도 컴포넌트)

---

## 5. Requirements

### 5.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | "수강 전" 상태에서 출석 도트(○○○)를 표시하지 않는다 | High | Decided (현행 유지) |
| FR-02 | "수강 전" 상태에서 `sessions`이 있을 때 "총 N회 과정" 텍스트를 표시한다 | Medium | Pending |
| FR-03 | "수강 중" 상태: 기존 출석 도트 + N/M회 출석 텍스트를 그대로 유지한다 | High | Done (현행 유지) |
| FR-04 | "수강완료" 상태: 기존 출석 도트 + N/M회 출석 텍스트를 그대로 유지한다 | High | Done (현행 유지) |
| FR-05 | `sessions`가 없거나 `sessions.length <= 1`이면 어떤 상태에서도 아무것도 표시하지 않는다 | High | Done (현행 유지) |

### 5.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| UX 일관성 | 도트 UI는 실제 출석 기록이 있을 때만 등장 | 코드 리뷰 |
| 접근성 | `aria-label`로 총 회차 수 전달 | 수동 검증 |
| 한국어 자연스러움 | "총 N회 과정" 표현이 국내 교육 서비스 맥락에서 자연스럽게 읽힘 | 팀 내부 리뷰 |

---

## 6. Implementation Guide

### 6.1 변경 대상

- **파일**: `src/components/mypage/my-learning/AttendanceStatus.tsx`
- **범위**: `AttendanceStatus` 컴포넌트의 `"수강 전"` 분기 처리만 수정

### 6.2 현재 코드 (변경 전)

```typescript
export default function AttendanceStatus({ course }: AttendanceStatusProps) {
  const { sessions, status } = course;

  if (!sessions || sessions.length <= 1) return null;
  if (status === "수강 전") return null;   // ← 현행: 완전히 숨김

  return (
    <div className="mt-3">
      <DotSequence sessions={sessions} />
    </div>
  );
}
```

### 6.3 권고 변경 후 코드

```typescript
export default function AttendanceStatus({ course }: AttendanceStatusProps) {
  const { sessions, status } = course;

  if (!sessions || sessions.length <= 1) return null;

  // 수강 전: 총 회차 수만 텍스트로 표시 (도트 없음)
  if (status === "수강 전") {
    return (
      <div className="mt-3">
        <p
          className="text-xs text-[var(--color-muted)]"
          aria-label={`총 ${sessions.length}회 과정`}
        >
          총 {sessions.length}회 과정
        </p>
      </div>
    );
  }

  // 수강 중 / 수강완료: 기존 도트 표시
  return (
    <div className="mt-3">
      <DotSequence sessions={sessions} />
    </div>
  );
}
```

### 6.4 UI 비교

| 상태 | 현재 | 변경 후 |
|------|------|--------|
| 수강 전 | (아무것도 없음) | `총 5회 과정` |
| 수강 중 | `● ● ○ ○ ○  2/5회 출석` | `● ● ○ ○ ○  2/5회 출석` (변경 없음) |
| 수강완료 | `● ● ● ● ●  5/5회 출석` | `● ● ● ● ●  5/5회 출석` (변경 없음) |

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] "수강 전" 카드에서 출석 도트가 표시되지 않음을 확인
- [ ] "수강 전" 카드에서 `sessions`이 있을 때 "총 N회 과정" 텍스트가 표시됨
- [ ] "수강 중" / "수강완료" 카드의 도트 UI가 기존과 동일하게 작동함
- [ ] 팀 내부 한국어 UX 리뷰 통과 ("총 N회 과정" 표현 확인)

### 7.2 Quality Criteria

- [ ] 기존 `DotSequence` 로직은 수정하지 않음
- [ ] 타입스크립트 오류 없음
- [ ] Zero lint errors

---

## 8. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| "총 N회 과정" 텍스트가 날짜/장소 정보와 시각적으로 구분이 안 될 수 있음 | Low | Low | 색상 `var(--color-muted)` 사용으로 보조 정보임을 명시. 필요시 아이콘(📋) 추가 검토 |
| `sessions` 필드가 없는 기존 mock 데이터에서 조건 미충족 | Low | Medium | 기존 `sessions.length <= 1` 가드가 그대로 적용되므로 문제 없음 |

---

## 9. Architecture Considerations

### 9.1 Project Level

현재 프로젝트는 **Dynamic** 레벨로 분류됨. 이 변경은 단일 컴포넌트의 조건 분기 수정이므로 아키텍처 결정 사항이 아님.

### 9.2 Key Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 수강 전 출석 도트 표시 | 표시 / 미표시 | 미표시 | 결석 오인 리스크, 불필요한 정보, 업계 관행 |
| 수강 전 총 회차 표현 방식 | 도트 UI / 텍스트 | 텍스트 | 정보 명확성, 혼동 방지 |
| 변경 컴포넌트 범위 | AttendanceStatus.tsx만 / 카드 전체 | AttendanceStatus.tsx만 | 최소 변경 원칙, 카드 레이아웃 영향 없음 |

---

## 10. Next Steps

1. [ ] CTO(팀 리드) 검토 및 승인
2. [ ] 승인 시 `AttendanceStatus.tsx` 수정 구현 (FR-02)
3. [ ] mock 데이터에 수강 전 강의의 `sessions` 필드가 있는지 확인 (없으면 추가)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-20 | Initial draft | Product Manager |
