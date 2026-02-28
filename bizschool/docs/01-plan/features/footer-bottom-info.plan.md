# Plan: footer-bottom-info

> 푸터 하단에 "더존비즈스쿨" 정보 섹션 추가

## 1. Overview

| Item | Detail |
|------|--------|
| Feature | 푸터 하단 회사 정보 섹션 추가 |
| Priority | Low |
| Complexity | Simple (단일 파일 수정) |
| Target File | `src/components/layout/Footer.tsx` |

## 2. Requirements

### 추가할 내용
푸터 Bottom bar 영역에 아래 정보를 추가:

- **더존비즈스쿨** (타이틀)
- 비즈스쿨 소개 (링크)
- 연혁 및 교육실적 (링크)
- 찾아오시는 길 (링크)

### 위치
- 현재 Bottom bar (`border-t border-white/10`) 내부
- 기존 법적 링크(이용약관, 개인정보처리방침 등) 위 또는 아래

## 3. Implementation Plan

### 변경 파일
| File | Change |
|------|--------|
| `src/components/layout/Footer.tsx` | Bottom bar에 더존비즈스쿨 링크 그룹 추가 |

### 구현 상세
1. `Footer.tsx`의 Bottom bar 영역에 "더존비즈스쿨" 섹션 추가
2. 제목("더존비즈스쿨")과 3개 링크를 수평 배치
3. 기존 푸터 스타일(색상, 폰트 크기)과 일관성 유지
4. 링크 href는 `/about`, `/history`, `/directions` 등 적절한 경로 설정

## 4. Design Notes

- 기존 legal links 행과 유사한 스타일 적용
- 모바일 반응형: flex-wrap으로 줄바꿈 처리
- 색상: `text-white/40` ~ `text-white/50` 범위 (기존 패턴 준수)
