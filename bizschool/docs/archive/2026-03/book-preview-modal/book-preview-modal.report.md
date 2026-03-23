# PDCA Report: book-preview-modal

> Feature: 도서 미리보기 모달 - 확대/드래그 팬/미니맵/여백 개선
> Date: 2026-03-23
> Phase: Completed (Archive)

---

## 1. Summary

도서 미리보기 모달에 줌 확대 시 드래그 팬(pan), 미니맵, 일관된 여백 시스템을 구현하고, sticky 구매바와의 z-index 충돌 및 모달 외부 클릭 닫힘 동작을 수정함.

---

## 2. Scope of Changes

### Modified Files

| File | Changes |
|------|---------|
| `src/components/books/BookPreviewViewer.tsx` | 전면 재작성 - 드래그 팬, 미니맵, 컨테이너 기반 페이지 사이징 |
| `src/components/books/BookPreviewModal.tsx` | z-index 수정, overflow 변경, 외부 클릭 닫힘 제거, 페이지 넘김 버튼 세로 중앙 정렬 |

---

## 3. Implementation Details

### 3.1 드래그 팬 (Drag Pan)

- **조건**: `zoomLevel > 100` 일 때만 활성화
- **방식**: `overflow: hidden` + `scrollLeft/scrollTop` 프로그래매틱 제어
- **커서**: hover 시 `grab`, 드래그 중 `grabbing`
- **구현**:
  - `isDraggingRef` (ref) - mousemove 핸들러에서 stale closure 방지
  - `isDragging` (state) - 커서 시각 표현용
  - Global `mousemove`/`mouseup` 리스너는 드래그 중에만 등록 (`useEffect` keyed on `isDragging`)
- **터치 지원**: `touchstart`/`touchmove`/`touchend` - 확대 시 팬, 축소 시 스와이프 페이지 이동

### 3.2 미니맵 (Minimap)

- **위치**: 좌측 상단 고정 (120x90px)
- **표시 조건**: `zoomLevel > 100`
- **기능**: 현재 뷰포트를 반투명 파란색 사각형으로 표시, 클릭 시 해당 위치로 이동
- **업데이트**: `scroll` 이벤트 + `setTimeout` 딜레이로 레이아웃 변경 후 재계산
- **고정 렌더링**: 스크롤 컨테이너 밖에 배치하여 드래그 시에도 위치 고정

### 3.3 컨테이너 기반 페이지 사이징 (Container-Relative Sizing)

**기존 문제**: `vh` 단위 사용으로 브라우저 창이 세로로 길면 페이지가 뷰어 컨테이너를 초과하여 하단 여백 소멸.

**해결 방식**:
- `ResizeObserver`로 컨테이너 실제 크기 추적
- `matchMedia("(min-width: 768px)")`으로 spread 레이아웃 판단
- `useLayoutEffect`로 마운트 시 즉시 크기 측정 (첫 프레임 깜빡임 방지)

**핵심 사이징 로직**:
```tsx
const MIN_PAD = 24;
const availH = containerSize.h - 2 * MIN_PAD;
const availW = containerSize.w - 2 * MIN_PAD;
const showTwoPages = viewMode === "spread" && isMd;
const maxByWidth = showTwoPages ? (availW - 2) / 1.5 : availW / 0.75;
const basePageH = Math.min(availH, maxByWidth);
const pageH = basePageH * scalePercent / 100;
const pageW = pageH * 0.75;
```

**패딩 공식**: `Math.max(24, Math.round((scalePercent - 100) * 0.96))`
- 100% → 24px, 125% → 24px, 150% → 48px, 200% → 96px

### 3.4 z-index 충돌 해결

- **문제**: 도서 상세 페이지의 sticky 구매바(`z-50`, 77px 높이)가 미리보기 모달(`z-50`)과 동일 z-index로 DOM 순서에 의해 모달 위에 렌더링
- **해결**: 모달 z-index를 `z-50` → `z-[60]`으로 상향

### 3.5 외부 클릭 닫힘 제거

- **변경**: 모달 backdrop의 `onClick` 핸들러 제거
- **닫기 방법**: X 버튼 또는 Escape 키만 지원

### 3.6 페이지 넘김 버튼 세로 중앙 정렬

- **변경**: 좌/우 `ChevronLeft`/`ChevronRight` 버튼에 `top-1/2 -translate-y-1/2` 추가
- **결과**: 뷰어 영역(페이지 세로)을 기준으로 정확히 가운데에 위치

---

## 4. Verification Results

### 여백 측정 (브라우저 테스트)

| View Mode | Zoom | Top | Bottom | Left | Right | Page Height |
|-----------|------|-----|--------|------|-------|-------------|
| Spread | 100% | 113px | 113px | 24px | 24px | 633px |
| Spread | 150% | 48px | 48px | 48px | 48px | 950px |
| Spread | 200% | 96px | 96px | 96px | 96px | 1267px |
| Single | 100% | 24px | 24px | 196px | 196px | 812px |
| Single | 150% | 48px | 48px | 48px | 48px | - |
| Single | 200% | 96px | 95px | 96px | 96px | - |
| Grid | - | scrollable | - | - | - | thumbnails |

### 기능 검증

- [x] 100% 줌에서 모든 뷰 모드 하단 여백 표시
- [x] 200% 줌에서 드래그 팬 정상 동작
- [x] 미니맵 고정 위치 + 뷰포트 표시
- [x] Sticky 구매바가 모달 뒤에 렌더링
- [x] 모달 외부 클릭 시 닫히지 않음
- [x] Spread/Single/Grid 모드 전환 정상
- [x] 페이지 넘김 버튼 뷰어 세로 가운데 배치

---

## 5. Architecture Notes

- CSS `vh` 단위 대신 JS 컨테이너 기반 사이징 → 뷰포트 독립적
- `MockPage` 컴포넌트: `size="full"` 시 `h-full w-full`, `size="thumb"` 시 `aspect-[3/4] w-full`
- Centering `useEffect`: 비확대 상태에서 콘텐츠가 컨테이너를 약간 초과할 때 자동 센터링
