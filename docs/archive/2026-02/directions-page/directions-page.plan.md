# Plan: 찾아오시는 길 (Directions Page)

## Feature Name
`directions-page`

## Overview
더존비즈스쿨 평생교육원의 위치 안내 페이지를 제작한다. 주소, 연락처, 교통편 정보와 카카오 지도 API를 활용한 인터랙티브 지도를 제공한다.

## Requirements

### 기본 정보 표시
- **기관명**: 더존비즈스쿨 평생교육원
- **주소**: 서울 광진구 자양로 142 청양빌딩 3층
- **전화**: 02-456-9156
- **팩스**: 02-452-9762

### 교통 안내
- **지하철**: 2호선 구의역 1번출구 도보 8분 (200m 이내)
- **버스**: 302, 303, 320, 2221, 3215, 3216, 3220, 9403 (광진구청 앞 하차 후, 도보 5분)

### 지도
- 카카오 지도 JavaScript API를 사용한 인터랙티브 지도
- 마커로 정확한 위치 표시
- 반응형 지도 (모바일/데스크탑 대응)

## Technical Approach

### Route
- **Path**: `/directions` (Footer에 이미 링크 존재)
- **File**: `src/app/directions/page.tsx`

### Kakao Map API
- 카카오 지도 JavaScript SDK v3 사용
- `<Script>` (next/script) strategy="afterInteractive"로 로드
- 환경변수: `NEXT_PUBLIC_KAKAO_MAP_KEY`에 JavaScript 앱 키 저장
- 좌표: 서울 광진구 자양로 142 (위도/경도 geocoding 필요)

### Page Structure (Sections)
1. **Hero Section** - 페이지 타이틀 "찾아오시는 길" (About 페이지 Hero 스타일 일관성)
2. **Map Section** - 카카오 지도 (넓은 영역)
3. **Info Section** - 주소, 연락처, 교통편 (카드 레이아웃)

### Design Patterns
- 기존 About 페이지(`/about`)의 스타일 패턴 유지
- CSS 변수 사용: `var(--color-primary)`, `var(--color-dark)`, `var(--color-muted)` 등
- max-w-[1200px] 컨테이너, lucide-react 아이콘 사용
- 반응형: 모바일 우선 (grid-cols-1 → md:grid-cols-2)

## Components
| Component | Location | Description |
|-----------|----------|-------------|
| DirectionsPage | `src/app/directions/page.tsx` | 메인 페이지 (Server Component) |
| KakaoMap | `src/components/directions/KakaoMap.tsx` | 카카오 지도 Client Component |

## Dependencies
- 카카오 지도 JavaScript SDK (CDN, 외부 스크립트)
- `lucide-react` (아이콘: MapPin, Phone, Printer, Train, Bus)
- `next/script` (카카오 SDK 로드)

## Out of Scope
- 길찾기 기능 (카카오 지도 앱 링크로 대체)
- 로드뷰
- 다국어 지원

## Estimated Files
- `src/app/directions/page.tsx` (신규)
- `src/components/directions/KakaoMap.tsx` (신규)
- `.env.local` 수정 (카카오 맵 키 추가)

## PDCA Phase
- [x] Plan
- [ ] Design
- [ ] Do
- [ ] Check
- [ ] Report
