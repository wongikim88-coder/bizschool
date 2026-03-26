# Header Search Scroll Effect - Completion Report

## Feature Overview
- **Feature**: header-search-scroll (헤더 검색창 스크롤 효과)
- **Phase**: Do (Implementation Complete)
- **Date**: 2026-03-26

## Summary

스크롤 다운 시 본문의 검색창(SearchBar)이 헤더 영역 안으로 슬라이드되며, 네비게이션 메뉴가 위로 밀려 사라지는 인프런 스타일 스크롤 효과 구현. 스크롤 업 시 검색창이 다시 본문으로 돌아가고 네비게이션이 복원됨.

## Implementation Details

### Architecture

3개 파일 수정으로 구현:
- `LayoutContent.tsx` - 스크롤 감지 및 상태 관리
- `Header.tsx` - 슬라이드 애니메이션 및 조건부 구분선
- `SearchBar.tsx` - 검색창 너비 조정

### LayoutContent.tsx (스크롤 감지)

```tsx
const [searchInHeader, setSearchInHeader] = useState(false);

useEffect(() => {
  if (hideSearchBar) return;
  const handleScroll = () => {
    setSearchInHeader(window.scrollY > 60);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [hideSearchBar]);
```

- `window.scrollY > 60` 기준으로 상태 전환
- `hideSearchBar` 페이지에서는 스크롤 감지 비활성화
- `showSearchInHeader` prop을 Header에 전달

### Header.tsx (슬라이드 애니메이션)

**핵심 구조**: 2행 슬라이드 컨테이너
```
<div class="h-16 overflow-hidden">        ← 클리핑 컨테이너
  <div class="transition-transform">      ← 슬라이드 래퍼 (-translate-y-16 토글)
    <div class="h-16">Row 1: 네비게이션</div>
    <div class="h-16">Row 2: 검색창</div>
  </div>
</div>
```

- Row 1(네비)과 Row 2(검색창)를 수직으로 쌓고, 래퍼를 `-translate-y-16`으로 전환
- `overflow-hidden`으로 보이지 않는 행을 클리핑
- 네비가 flow에 있어 컨테이너의 자연 너비를 유지 (absolute 사용 시 컨테이너 붕괴 문제 해결)

**잔상 제거**:
- Row 1 (Nav): `transition-opacity duration-300` + 조건부 `opacity-0`/`opacity-100`
- Row 2 (Search): 나타날 때만 `transition-opacity duration-300`, 사라질 때 `invisible` (즉시 숨김)

**조건부 헤더 구분선**:
```tsx
<header className={`... ${showSearchInHeader
  ? "border-b border-[var(--color-border)]"
  : "border-b border-transparent"}`}>
```
- 검색창이 헤더 안에 있을 때만 하단 구분선 표시
- `transition-[border-color] duration-300`으로 부드러운 전환

**헤더 내 검색창**:
- 너비: `w-[600px]` (본문 SearchBar와 동일)
- placeholder: "배우고 싶은 강의를 검색해보세요"
- Enter 키로 `/books?search=` 검색 실행

### SearchBar.tsx (너비)
- `max-w-[600px]` + `w-full`로 컨테이너 너비 설정

## Key Decisions & Problem Solving

### 1. max-w vs w-full
- `max-w-[600px]`만으로는 컨테이너가 확장되지 않음 (컨텐츠 크기로 축소)
- `w-full`을 함께 사용하여 부모를 채운 후 `max-w`로 제한

### 2. absolute vs flow 레이아웃
- 처음 absolute 포지셔닝 시도 → 컨테이너 높이 붕괴로 네비 사라짐
- flow 레이아웃(두 행 쌓기 + 래퍼 translate)으로 해결

### 3. 잔상(afterimage) 제거
- opacity transition만으로 부족 (전환 중 미세한 플래시 발생)
- `invisible` (visibility: hidden) 추가로 완전히 제거
- 나타날 때만 transition, 사라질 때는 즉시 숨김

### 4. 헤더 구분선 조건부 표시
- 검색창이 밖에 있을 때 구분선 숨김 → 본문 검색창과 자연스럽게 연결
- `border-transparent`로 레이아웃 변동 없이 구분선만 토글

## Modified Files

| File | Changes |
|------|---------|
| `src/components/layout/LayoutContent.tsx` | 스크롤 감지, `showSearchInHeader` prop 전달 |
| `src/components/layout/Header.tsx` | 슬라이드 컨테이너, 헤더 내 검색창, 조건부 구분선, 잔상 제거 |
| `src/components/layout/SearchBar.tsx` | `w-full max-w-[600px]` 너비 설정 |

## Behavior Summary

| 상태 | 네비게이션 | 검색창 위치 | 헤더 구분선 |
|------|-----------|-----------|-----------|
| 스크롤 Y ≤ 60 | 표시 | 헤더 아래 본문 | 숨김 |
| 스크롤 Y > 60 | 슬라이드 아웃 | 헤더 안 | 표시 |

## hideSearchBar 적용 페이지
`/login`, `/about`, `/directions`, `/venue`, `/mypage`, `/expert`, `/notice/*`, `/resources/*`, `/expert-consultation/*`, `/expert/center/*`, `/books/*` (상세)
