# Plan: book-search-autocomplete

## 1. Feature Overview

| Item | Description |
|------|-------------|
| Feature Name | book-search-autocomplete |
| Description | 도서 페이지 검색창에 검색어 입력 시, 매칭되는 도서가 드롭다운으로 실시간 표시되는 자동완성 기능 |
| Reference | 교보문고 (product.kyobobook.co.kr) 검색 자동완성 UI |
| Priority | High |
| Estimated Scope | Small (1 component 신규 + 1 component 수정) |

## 2. Problem & Goal

### 현재 상태 (As-Is)
- BookSearch 컴포넌트에서 검색어 입력 후 **폼 submit** 해야만 결과가 표시됨
- 사용자가 원하는 도서를 찾으려면 정확한 검색어를 입력하고 제출해야 함
- 타이핑 중 어떤 도서가 매칭되는지 미리 확인할 수 없음

### 목표 상태 (To-Be)
- 검색창에 **타이핑하는 즉시** 매칭되는 도서 목록이 드롭다운으로 표시
- 예: "린 스타트업" 입력 시 → "린 스타트업 - 지속적 혁신을 실현하는 창업의 과학" 도서 정보가 검색창 아래에 표시
- 드롭다운 항목 클릭 시 해당 도서 검색 결과로 이동
- 교보문고 스타일 참고: 썸네일 + 도서명(키워드 하이라이트) + 저자 + 가격

## 3. Reference UI Analysis (교보문고)

교보문고 검색 자동완성 UI 분석:

```
┌──────────────────────────────────────────────┐
│  🔍  [수능특강                         ] [X] │  ← 검색 입력창
├──────────────────────────────────────────────┤
│  ┌────┐ [국내도서] EBS **수능특강** 국어영역  │
│  │ 📖 │ EBS교육방송 편집부 (한국교육방송공사) │  ← 도서 항목
│  │    │ 10% 12,150원                    🛒   │
│  └────┘                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  ┌────┐ [국내도서] EBS **수능특강** 독서      │
│  │ 📖 │ EBS교육방송 편집부                    │  ← 도서 항목
│  │    │ 10% 12,150원                    🛒   │
│  └────┘                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  ... (최대 5개)                               │
└──────────────────────────────────────────────┘
```

**핵심 UI 요소:**
1. 검색어와 매칭되는 도서 목록 (세로 리스트)
2. 각 항목: 썸네일(왼쪽) + 도서명(키워드 볼드) + 저자 + 할인율/가격
3. 검색 입력 중 실시간 갱신
4. 드롭다운 외부 클릭 시 닫힘

## 4. Scope

### In Scope
- [x] 검색어 입력 시 실시간 매칭 도서 드롭다운 표시
- [x] 도서 항목: 커버 이미지, 도서명(키워드 하이라이트), 저자, 가격
- [x] 드롭다운 항목 클릭 → 해당 검색어로 검색 실행
- [x] debounce 적용 (300ms) - 타이핑 중 과도한 필터링 방지
- [x] 최대 표시 개수 제한 (5개)
- [x] 드롭다운 외부 클릭 시 닫힘
- [x] 키보드 접근성 (Escape로 닫기)

### Out of Scope
- 검색 히스토리 (최근 검색어)
- 인기 검색어 표시
- 장바구니 버튼 (교보문고에는 있지만 비즈스쿨은 간소화)
- API 연동 (현재 정적 데이터 사용)

## 5. Technical Approach

### 데이터 소스
- 기존 `allBooks` (42권) from `src/data/books.ts`
- title, author 필드로 검색 (기존 로직 재활용)

### 검색 알고리즘
- 클라이언트 사이드 필터링 (정적 데이터, 42권으로 충분)
- case-insensitive string matching (title + author)
- debounce 300ms

### 구현 방식
1. **새 컴포넌트**: `SearchAutocomplete` - 자동완성 드롭다운 UI
2. **수정 컴포넌트**: `BookSearch` - SearchAutocomplete 통합

### 컴포넌트 구조
```
BookSearch (수정)
├── Search Input (기존)
├── SearchAutocomplete (신규)
│   └── AutocompleteItem (도서 항목)
└── Submit Button (기존)
```

## 6. Implementation Files

| Action | File | Description |
|--------|------|-------------|
| NEW | `src/components/books/SearchAutocomplete.tsx` | 자동완성 드롭다운 컴포넌트 |
| MODIFY | `src/components/books/BookSearch.tsx` | SearchAutocomplete 통합, debounce 로직 |

## 7. Acceptance Criteria

1. 검색창에 "린 스타트업" 입력 시 "린 스타트업 - 지속적 혁신을 실현하는 창업의 과학" 도서가 드롭다운에 표시됨
2. 검색창에 "에릭" 입력 시 저자 "에릭 리스"의 도서가 표시됨
3. 드롭다운 각 항목에 커버 이미지, 도서명, 저자, 가격이 표시됨
4. 검색 키워드가 도서명에서 볼드/하이라이트 처리됨
5. 드롭다운 항목 클릭 시 해당 검색어로 전체 검색 실행
6. 검색창 외부 클릭 시 드롭다운 닫힘
7. Escape 키로 드롭다운 닫힘
8. 최대 5개 결과만 표시
9. 입력 후 300ms debounce 적용
10. 검색어 없으면 드롭다운 미표시

## 8. Dependencies

- 추가 라이브러리 불필요 (기존 스택으로 구현 가능)
- `allBooks` 데이터 (기존)
- `lucide-react` 아이콘 (기존)
