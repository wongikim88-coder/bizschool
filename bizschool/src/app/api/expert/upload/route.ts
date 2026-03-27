import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "videos");
const ALLOWED_EXTS = [".mp4", ".mkv", ".m4v", ".mov"];
const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

// POST — 파일 업로드
export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: "허용되지 않는 파일 형식입니다. (.mp4, .mkv, .m4v, .mov)" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "파일 크기가 5GB를 초과합니다." },
        { status: 400 }
      );
    }

    // 고유 파일명 생성 (타임스탬프 + 원본명)
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({
      id: fileName,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET — 파일 목록 조회
export async function GET() {
  try {
    await ensureUploadDir();
    const files = await readdir(UPLOAD_DIR);
    const fileList = await Promise.all(
      files
        .filter((f) => ALLOWED_EXTS.includes(path.extname(f).toLowerCase()))
        .map(async (f) => {
          const fileStat = await stat(path.join(UPLOAD_DIR, f));
          // 원본 파일명 복원: "1234567890_원본명.mp4" → "원본명.mp4"
          const originalName = f.replace(/^\d+_/, "");
          return {
            id: f,
            name: originalName,
            size: fileStat.size,
            uploadDate: fileStat.mtime.toLocaleString("ko-KR", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        })
    );

    return NextResponse.json(fileList);
  } catch {
    return NextResponse.json([]);
  }
}

// DELETE — 파일 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "파일 ID가 없습니다." }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, id);
    // path traversal 방지
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
