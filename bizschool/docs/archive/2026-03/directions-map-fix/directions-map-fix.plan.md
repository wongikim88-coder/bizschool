# Plan: directions-map-fix

## 1. Overview
| Item | Detail |
|------|--------|
| Feature | Kakao Map 클라이언트 사이드 네비게이션 시 렌더링 실패 버그 수정 |
| Type | Bug Fix |
| Priority | High |
| Estimated Scope | 1 file (KakaoMap.tsx) |

## 2. Problem Statement

### 현상
- 처음 `/directions` 페이지 접속 시 카카오 지도가 정상 표시됨
- 다른 페이지로 이동 후 클라이언트 사이드 네비게이션으로 다시 `/directions` 접속 시 지도가 표시되지 않음 (빈 흰색 영역)
- 브라우저 새로고침(full page reload)을 해야만 지도가 다시 표시됨

### 근본 원인
`KakaoMap.tsx`에서 Next.js `<Script>` 컴포넌트의 `onLoad` 콜백에 의존하여 SDK 로드 상태를 추적하고 있음.

```
초기 로드: Script 삽입 → onLoad 실행 → sdkLoaded=true → useEffect → 지도 초기화 ✅
재방문:    Script 이미 존재 → onLoad 미실행 → sdkLoaded=false 유지 → 지도 초기화 안 됨 ❌
```

Next.js `<Script strategy="afterInteractive">`는 스크립트가 이미 DOM에 존재하면 다시 로드하지 않으며, `onLoad` 콜백도 다시 실행하지 않음.

### 영향 범위
- `src/components/directions/KakaoMap.tsx` (유일한 수정 대상)

## 3. Solution

### 접근 방식
컴포넌트 마운트 시 `window.kakao.maps`가 이미 존재하는지 확인하여, SDK가 이미 로드된 상태라면 `onLoad`를 기다리지 않고 즉시 지도를 초기화한다.

### 변경 사항

**`src/components/directions/KakaoMap.tsx`:**

1. `useEffect` 추가: 컴포넌트 마운트 시 `window.kakao?.maps` 존재 여부 확인
   - 이미 존재하면 → `setSdkLoaded(true)` 즉시 호출
   - 존재하지 않으면 → 기존 `onLoad` 콜백에 의존 (최초 로드 케이스)

2. 기존 `useEffect`에서 cleanup 로직 추가 (optional)
   - 컴포넌트 unmount 시 map 인스턴스 정리

### 수정 코드 (핵심)

```tsx
useEffect(() => {
  // 이미 SDK가 로드된 상태 (클라이언트 사이드 네비게이션으로 재방문)
  if (window.kakao?.maps) {
    setSdkLoaded(true);
  }
}, []);
```

## 4. Testing Checklist

- [ ] 직접 URL 접속 (`/directions`) → 지도 정상 표시
- [ ] 다른 페이지 → `/directions` 클라이언트 네비게이션 → 지도 정상 표시
- [ ] `/directions` → 다른 페이지 → `/directions` 반복 → 매번 지도 정상 표시
- [ ] 브라우저 새로고침 → 지도 정상 표시
- [ ] 마커 및 InfoWindow 정상 표시
- [ ] 줌 컨트롤 정상 작동

## 5. Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| 기존 초기 로드 동작 변경 | Low | `onLoad` 콜백은 그대로 유지, 추가 `useEffect`만 삽입 |
| SDK 로드 타이밍 이슈 | Low | `window.kakao?.maps` optional chaining으로 안전하게 체크 |
