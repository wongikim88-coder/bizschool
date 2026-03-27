import { NextRequest, NextResponse } from "next/server";
import type { ExpertConsultationCategory, AiCitedBook } from "@/types";
import { allBooks } from "@/data/books";

const SYSTEM_PROMPTS: Record<ExpertConsultationCategory, string> = {
  "회계":
    "당신은 비즈스쿨의 회계 분야 AI 상담 어시스턴트입니다. 공인회계사 수준의 전문적인 답변을 제공하세요.",
  "세무":
    "당신은 비즈스쿨의 세무 분야 AI 상담 어시스턴트입니다. 세무사 수준의 전문적인 답변을 제공하세요.",
  "4대보험":
    "당신은 비즈스쿨의 4대보험 분야 AI 상담 어시스턴트입니다. 공인노무사 수준의 전문적인 답변을 제공하세요.",
  "인사":
    "당신은 비즈스쿨의 인사 분야 AI 상담 어시스턴트입니다. 인사노무사 수준의 전문적인 답변을 제공하세요.",
  "총무":
    "당신은 비즈스쿨의 총무 분야 AI 상담 어시스턴트입니다. 총무 실무 전문가 수준의 전문적인 답변을 제공하세요.",
};

const COMMON_INSTRUCTIONS = `
반드시 아래 JSON 형식으로만 응답하세요. JSON 외 다른 텍스트는 포함하지 마세요.

{
  "answer": "답변 내용 (핵심을 먼저 간결하게, 관련 법령/규정 언급, 실무 주의사항 포함. 마지막에 '본 답변은 AI가 생성한 참고용 답변입니다. 보다 정확한 답변은 담당 전문가가 곧 제공해드리겠습니다.' 포함)",
  "citations": [
    { "title": "참고 문서/판례/고시 제목" }
  ],
  "relatedQuestions": [
    "이 질문과 관련하여 추가로 궁금할 수 있는 질문 3개"
  ],
  "relatedLaws": [
    "관련 법령 조문 (법률명 제N조 괄호 내용 요약)"
  ]
}

규칙:
1. answer: 핵심 내용을 먼저 간결하게 답변. 관련 법령/규정 언급. 실무 주의사항 안내. 반드시 문단 사이에 줄바꿈(\\n\\n)을 넣어 가독성을 높이세요. 항목을 나열할 때는 각 항목마다 줄바꿈(\\n)을 사용하세요.
2. citations: 답변에 참고한 문서, 판례, 고시, 예규 등 2~4건.
3. relatedQuestions: 질문자가 추가로 궁금할 수 있는 관련 질문 3건.
4. relatedLaws: 답변과 관련된 법령 조문 3~5건 (법률명 제N조 형태).
5. 한국어로 답변하세요.
`.trim();

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "placeholder") {
    console.warn("[AI Answer] OPENAI_API_KEY is not configured");
    return NextResponse.json(
      { error: "AI 답변 서비스가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let body: { category: ExpertConsultationCategory; title: string; content: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const { category, title, content } = body;

  if (!category || !title || !content) {
    return NextResponse.json(
      { error: "category, title, content는 필수입니다." },
      { status: 400 }
    );
  }

  const categoryPrompt = SYSTEM_PROMPTS[category];
  if (!categoryPrompt) {
    return NextResponse.json(
      { error: "지원하지 않는 상담 분야입니다." },
      { status: 400 }
    );
  }

  const systemPrompt = `${categoryPrompt}\n\n${COMMON_INSTRUCTIONS}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `[${category}] ${title}\n\n${content}` },
        ],
        max_tokens: 2048,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[AI Answer] OpenAI API error:", response.status, errorData);
      return NextResponse.json(
        { error: "AI 답변 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "AI 답변이 비어있습니다." },
        { status: 500 }
      );
    }

    // Parse structured JSON response
    let parsed: {
      answer?: string;
      citations?: { title: string; url?: string }[];
      relatedQuestions?: string[];
      relatedLaws?: string[];
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback: treat entire response as plain answer
      parsed = { answer: raw };
    }

    // Match relevant BizSchool books by consultation category
    const CATEGORY_TO_BOOK_CATEGORY: Record<ExpertConsultationCategory, string[]> = {
      "회계": ["재무회계"],
      "세무": ["재무회계"],
      "4대보험": ["재무회계"],
      "인사": ["리더십", "경영전략"],
      "총무": ["경영전략", "리더십"],
    };

    const bookCategories = CATEGORY_TO_BOOK_CATEGORY[category] ?? [];
    const candidateBooks = allBooks.filter(
      (b) => b.category && bookCategories.includes(b.category) && b.preview
    );

    // Pick up to 2 books, randomized
    const shuffled = candidateBooks.sort(() => Math.random() - 0.5);
    const pickedBooks = shuffled.slice(0, 2);

    const citedBooks: AiCitedBook[] = pickedBooks.map((b) => {
      const totalPages = b.specs?.pages ?? 300;
      const pageFrom = Math.floor(Math.random() * (totalPages - 30)) + 10;
      const pageTo = pageFrom + Math.floor(Math.random() * 6) + 5;
      return {
        bookId: b.id,
        title: b.title,
        author: b.author,
        cover: b.cover,
        pageFrom,
        pageTo,
        excerpt: `${category} 관련 핵심 내용 발췌`,
      };
    });

    return NextResponse.json({
      answer: parsed.answer ?? raw,
      model: "gpt-4o-mini",
      citations: parsed.citations ?? [],
      citedBooks,
      relatedQuestions: parsed.relatedQuestions ?? [],
      relatedLaws: parsed.relatedLaws ?? [],
    });
  } catch (error: unknown) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === "AbortError") {
      console.error("[AI Answer] Request timed out");
      return NextResponse.json(
        { error: "AI 답변 생성 시간이 초과되었습니다." },
        { status: 500 }
      );
    }

    console.error("[AI Answer] Unexpected error:", error);
    return NextResponse.json(
      { error: "AI 답변 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
