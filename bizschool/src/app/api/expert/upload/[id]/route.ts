import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "videos");

// GET — 파일 다운로드
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(UPLOAD_DIR, id);

    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const buffer = await readFile(filePath);
    const originalName = id.replace(/^\d+_/, "");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(originalName)}`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "파일을 찾을 수 없습니다." },
      { status: 404 }
    );
  }
}
