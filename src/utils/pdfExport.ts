import { toCanvas, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Downloads the given DOM element as a high-resolution A4 PDF file.
 */
export async function exportElementToPdf(
  elementId: string,
  fileName: string = '주방가구_견적원가검토서.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return false;
  }

  try {
    // Generate high-resolution canvas using html-to-image
    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        left: '0px',
        top: '0px',
        position: 'static',
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('Failed to export PDF with html-to-image:', error);
    // Fallback: try direct window print if PDF export failed
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Downloads the given DOM element as a PNG image (for mobile messenger sharing).
 */
export async function exportElementToImage(
  elementId: string,
  fileName: string = '주방가구_견적원가검토서.png'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        left: '0px',
        top: '0px',
        position: 'static',
      },
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export image:', error);
    return false;
  }
}

/**
 * Triggers printing with fallback popup window
 */
export function triggerPrintWithFallback(elementId: string): void {
  try {
    window.print();
  } catch (e) {
    console.warn('Direct window.print() failed, attempting popup print...', e);
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>주방가구 견적 및 원가 검토서</title>
            <meta charset="utf-8" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "Noto Sans KR", sans-serif; background: #fff; padding: 20px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${element.outerHTML}
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                setTimeout(() => window.close(), 1000);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
