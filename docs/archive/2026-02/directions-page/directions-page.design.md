# Design: 찾아오시는 길 (directions-page)

> Plan Reference: `docs/01-plan/features/directions-page.plan.md`

## 1. Page Layout

### Route & Metadata
- **Path**: `/directions`
- **Title**: `찾아오시는 길 | BIZSCHOOL`
- **Description**: 더존비즈스쿨 평생교육원 오시는 길 안내. 주소, 전화, 교통편, 지도 정보.

### Section Structure

```
┌──────────────────────────────────────────────┐
│  Hero Section (찾아오시는 길)                  │
│  - bg gradient (About 페이지와 동일)           │
│  - 타이틀 + 서브텍스트                         │
├──────────────────────────────────────────────┤
│  Map Section (카카오 지도)                     │
│  - full-width container                      │
│  - height: 400px (md: 480px)                 │
│  - 마커 + 인포윈도우                           │
├──────────────────────────────────────────────┤
│  Info Section (max-w-[1200px])               │
│  ┌─────────────┬─────────────┐               │
│  │ 기본 정보    │ 교통 안내    │               │
│  │ - 주소       │ - 지하철     │               │
│  │ - 전화       │ - 버스       │               │
│  │ - 팩스       │              │               │
│  └─────────────┴─────────────┘               │
└──────────────────────────────────────────────┘
```

## 2. Component Design

### 2.1 DirectionsPage (`src/app/directions/page.tsx`)

**Type**: Server Component (RSC)

```tsx
// metadata export
export const metadata: Metadata = {
  title: "찾아오시는 길 | BIZSCHOOL",
  description: "더존비즈스쿨 평생교육원 오시는 길 안내..."
};

// Sections: Hero → Map → Info
```

**Hero Section**:
- About 페이지 Hero와 동일한 gradient: `bg-gradient-to-br from-[#155dfc] to-[#0d3b9e]`
- 타이틀: "찾아오시는 길"
- 서브텍스트: "더존비즈스쿨 평생교육원의 위치와 교통편을 안내합니다."
- 장식 원형 (decorative circles) 동일 패턴

**Info Section**:
- `max-w-[1200px]` 컨테이너, `py-16 md:py-24`
- 2-column grid: `grid-cols-1 md:grid-cols-2 gap-8`
- 좌측: 기본 정보 카드
- 우측: 교통 안내 카드

### 2.2 KakaoMap (`src/components/directions/KakaoMap.tsx`)

**Type**: Client Component (`"use client"`)

**Props**: 없음 (좌표, 줌 레벨 내부 상수)

**구현 상세**:
```tsx
// 좌표 상수
const LOCATION = {
  lat: 37.5384,    // 서울 광진구 자양로 142 위도
  lng: 127.0843,   // 서울 광진구 자양로 142 경도
  level: 4,        // 줌 레벨 (동네 수준)
};

// Kakao SDK 로드 → kakao.maps.load() → Map 생성 → Marker + InfoWindow
```

**SDK 로드 방식**:
- `next/script` strategy="afterInteractive"
- src: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`
- `autoload=false` 사용 → `kakao.maps.load()` 콜백에서 초기화
- onLoad 핸들러에서 지도 초기화

**지도 옵션**:
- 컨테이너: `width: 100%`, `height: 400px` (md: 480px)
- 줌 컨트롤: `kakao.maps.ZoomControl` 추가
- 마커: 기본 마커 (커스텀 불필요)
- 인포윈도우: "더존비즈스쿨 평생교육원" 텍스트

**반응형**:
- 컨테이너 `max-w-[1200px] mx-auto px-4`
- 지도 높이: `h-[400px] md:h-[480px]`
- 모서리: `rounded-2xl overflow-hidden`

**TypeScript 타입**:
```tsx
// window.kakao 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: object) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: object) => any;
        InfoWindow: new (options: object) => any;
        ZoomControl: new () => any;
      };
    };
  }
}
```

## 3. Data Model

### 기본 정보 (상수)
```tsx
const CONTACT_INFO = {
  name: "더존비즈스쿨 평생교육원",
  address: "서울 광진구 자양로 142 청양빌딩 3층",
  phone: "02-456-9156",
  fax: "02-452-9762",
};
```

### 교통 안내 (상수)
```tsx
const TRANSPORT_INFO = {
  subway: {
    line: "2호선",
    station: "구의역",
    exit: "1번출구",
    walkTime: "도보 8분",
    distance: "200m 이내",
  },
  bus: {
    routes: ["302", "303", "320", "2221", "3215", "3216", "3220", "9403"],
    stop: "광진구청 앞",
    walkTime: "도보 5분",
  },
};
```

## 4. UI Specifications

### 4.1 Hero Section
| Property | Value |
|----------|-------|
| Background | `bg-gradient-to-br from-[#155dfc] to-[#0d3b9e]` |
| Padding | `px-8 py-16 md:px-16 md:py-24 lg:py-28` |
| Title | `text-2xl md:text-3xl lg:text-4xl font-bold text-white` |
| Subtitle | `text-base md:text-lg text-white/70` |

### 4.2 Map Section
| Property | Value |
|----------|-------|
| Container | `max-w-[1200px] mx-auto px-4 py-16 md:py-24` |
| Map wrapper | `rounded-2xl overflow-hidden shadow-lg` |
| Map height | `h-[400px] md:h-[480px]` |

### 4.3 Info Cards
| Property | Value |
|----------|-------|
| Container | `max-w-[1200px] mx-auto px-4 pb-16 md:pb-24` |
| Grid | `grid-cols-1 md:grid-cols-2 gap-8` |
| Card | `rounded-2xl border border-[var(--color-border)] bg-white p-8` |
| Card title | `text-lg font-bold text-[var(--color-dark)]` |
| Icon container | `h-10 w-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]` |
| Label | `text-sm font-medium text-[var(--color-dark)]` |
| Value | `text-sm text-[var(--color-muted)]` |

### 4.4 아이콘 매핑
| 항목 | lucide-react Icon |
|------|-------------------|
| 주소 | `MapPin` |
| 전화 | `Phone` |
| 팩스 | `Printer` |
| 지하철 | `TrainFront` |
| 버스 | `Bus` |

## 5. Environment Variables

```env
# .env.local
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_javascript_app_key
```

**카카오 개발자 등록 필요**:
1. https://developers.kakao.com 접속
2. 애플리케이션 추가 → JavaScript 키 발급
3. 플랫폼 설정 → 웹 사이트 도메인 등록 (localhost:3000 + production domain)

## 6. Implementation Order

1. **환경변수 설정** - `.env.local`에 카카오 맵 키 추가
2. **KakaoMap 컴포넌트** - `src/components/directions/KakaoMap.tsx`
3. **DirectionsPage** - `src/app/directions/page.tsx` (Hero + Map + Info)
4. **테스트** - 지도 로드 확인, 반응형 확인

## 7. File List

| File | Action | Description |
|------|--------|-------------|
| `src/app/directions/page.tsx` | CREATE | 메인 페이지 (Server Component) |
| `src/components/directions/KakaoMap.tsx` | CREATE | 카카오 지도 Client Component |
| `.env.local` | MODIFY | 카카오 맵 키 추가 |

## 8. Acceptance Criteria

- [ ] `/directions` 경로로 접근 가능
- [ ] Hero 섹션이 About 페이지와 동일한 스타일
- [ ] 카카오 지도가 정상 로드되고 마커가 올바른 위치에 표시
- [ ] 인포윈도우에 "더존비즈스쿨 평생교육원" 표시
- [ ] 기본 정보 (주소, 전화, 팩스) 정확히 표시
- [ ] 교통 안내 (지하철, 버스) 정확히 표시
- [ ] 모바일/데스크탑 반응형 레이아웃 정상 동작
- [ ] 카카오 맵 키 없이도 페이지 자체는 에러 없이 렌더링 (지도만 미표시)
