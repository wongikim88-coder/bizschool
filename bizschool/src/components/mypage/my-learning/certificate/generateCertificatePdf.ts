import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  userName: string;
  courseTitle: string;
  periodLabel: string;
  courseId: string;
}

export async function generateCertificatePdf(data: CertificateData): Promise<void> {
  const now = new Date();
  const issueDate = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일`;
  const issueNumber = `BIZS-${now.getFullYear()}-${data.courseId}`;

  // 임시 DOM 생성
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = buildCertificateHtml({
    ...data,
    issueDate,
    issueNumber,
  });
  document.body.appendChild(container);

  try {
    const target = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const fileName = `수료증_${data.courseTitle.replace(/[^가-힣a-zA-Z0-9]/g, "_")}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

function buildCertificateHtml(data: {
  userName: string;
  courseTitle: string;
  periodLabel: string;
  issueDate: string;
  issueNumber: string;
}): string {
  return `
    <div style="width:1122px;height:793px;background:#fff;padding:64px;
                display:flex;flex-direction:column;align-items:center;justify-content:center;
                font-family:'Malgun Gothic','맑은 고딕','Apple SD Gothic Neo',sans-serif;
                box-sizing:border-box;">
      <div style="font-size:36px;font-weight:bold;letter-spacing:0.5em;color:#1a1a1a;">
        수 료 증
      </div>
      <div style="font-size:14px;letter-spacing:0.3em;color:#888;margin-top:4px;">
        CERTIFICATE
      </div>
      <div style="width:80%;height:1px;background:#e0e0e0;margin:40px 0;"></div>
      <div style="font-size:28px;font-weight:600;color:#1a1a1a;">
        성명: ${data.userName}
      </div>
      <div style="font-size:16px;color:#555;margin-top:28px;">
        위 사람은 다음 교육과정을 수료하였기에
      </div>
      <div style="font-size:16px;color:#555;margin-top:4px;">
        이 증서를 수여합니다.
      </div>
      <div style="width:80%;height:1px;background:#e0e0e0;margin:36px 0;"></div>
      <div style="align-self:flex-start;margin-left:160px;font-size:15px;color:#555;line-height:2.2;">
        <div><span style="display:inline-block;width:100px;">교육과정명:</span>${data.courseTitle}</div>
        <div><span style="display:inline-block;width:100px;">교육기간:</span>${data.periodLabel}</div>
        <div><span style="display:inline-block;width:100px;">발급일자:</span>${data.issueDate}</div>
        <div><span style="display:inline-block;width:100px;">발급번호:</span>${data.issueNumber}</div>
      </div>
      <div style="width:80%;height:1px;background:#e0e0e0;margin:36px 0;"></div>
      <div style="font-size:22px;font-weight:bold;color:#00c471;">BIZSCHOOL</div>
      <div style="font-size:14px;color:#888;margin-top:4px;">더존비즈스쿨 평생교육원</div>
    </div>
  `;
}
