import React, { useState } from 'react';
import { QuotationData, CalculationResult } from '../types';
import { formatKRW, formatPercent } from '../utils/formatters';
import { exportElementToPdf, exportElementToImage, triggerPrintWithFallback } from '../utils/pdfExport';
import { Download, Printer, Image, X, Check, Loader2, FileText, AlertCircle } from 'lucide-react';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuotationData;
  result: CalculationResult;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  data,
  result,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImg, setIsExportingImg] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultFileName = `주방가구_견적원가검토서_${data.customerName ? data.customerName.replace(/[^a-zA-Z0-9가-힣]/g, '_') : '미지정'}_${data.quoteDate || new Date().toISOString().slice(0, 10)}`;

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const success = await exportElementToPdf(
        'modal-printable-sheet',
        `${defaultFileName}.pdf`
      );
      if (success) {
        setSuccessMessage('PDF 파일이 성공적으로 다운로드되었습니다.');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage('PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄 기능을 이용해보세요.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('PDF 다운로드 처리 중 문제가 발생했습니다.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsExportingImg(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const success = await exportElementToImage(
        'modal-printable-sheet',
        `${defaultFileName}.png`
      );
      if (success) {
        setSuccessMessage('고화질 이미지(PNG)가 다운로드되었습니다.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('이미지 생성에 실패했습니다.');
    } finally {
      setIsExportingImg(false);
    }
  };

  const handlePrint = () => {
    triggerPrintWithFallback('modal-printable-sheet');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                견적 및 원가 검토서 미리보기 & PDF 저장
              </h2>
              <p className="text-xs text-slate-500">
                A4 표준 규격 양식으로 즉시 PDF 다운로드 및 결재용 인쇄가 가능합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct PDF Download Button */}
            <button
              type="button"
              id="btn-modal-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PDF 생성 중...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF 다운로드</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              id="btn-modal-print"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄</span>
            </button>

            {/* PNG Image Download */}
            <button
              type="button"
              id="btn-modal-download-img"
              onClick={handleDownloadImage}
              disabled={isExportingImg}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="카카오톡/모바일 전송용 이미지 저장"
            >
              {isExportingImg ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Image className="w-3.5 h-3.5" />
              )}
              <span>이미지(PNG)</span>
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              id="btn-modal-close"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback message banner if any */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-800 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body showing exact A4 Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/80 flex justify-center">
          <div
            id="modal-printable-sheet"
            className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-10 shadow-xl rounded-sm font-sans"
            style={{ minHeight: '297mm' }}
          >
            {/* Sheet Render */}
            <PrintQuotationSheetContent data={data} result={result} />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>A4 표준 비율 및 3단계 결재란 자동 구성</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Clean Printable Quotation Content Component
 */
export const PrintQuotationSheetContent: React.FC<{
  data: QuotationData;
  result: CalculationResult;
}> = ({ data, result }) => {
  const { totalCost, margin, marginRate, isLoss, isValidSellingPrice } = result;
  const sellingPrice = data.sellingPrice || 0;

  return (
    <div>
      {/* Print Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              주방가구 견적 및 원가 검토서
            </h1>
            <p className="text-[11px] text-slate-500 mt-1 font-medium tracking-wide">
              KITCHEN FURNITURE ESTIMATION & COST ANALYSIS SHEET
            </p>
          </div>

          {/* Manager & Executive Sign-off box */}
          <table className="border-collapse border border-slate-400 text-[11px] text-center w-56 shrink-0">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-700">
                <th className="border border-slate-400 py-1 w-1/3">작 성 (영업)</th>
                <th className="border border-slate-400 py-1 w-1/3">검 토 (생산)</th>
                <th className="border border-slate-400 py-1 w-1/3">승 인 (임원/대표)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-400 h-12 align-bottom pb-1 text-[10px] text-slate-600 font-medium">
                  {data.managerName || '(서명)'}
                </td>
                <td className="border border-slate-400 h-12 align-bottom pb-1 text-[10px] text-slate-400">
                  (서명)
                </td>
                <td className="border border-slate-400 h-12 align-bottom pb-1 text-[10px] text-slate-400">
                  (서명)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Project & Client Meta */}
        <div className="grid grid-cols-2 gap-4 mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs">
          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-20 font-bold text-slate-500">고 객 명:</span>
              <span className="font-extrabold text-slate-900">{data.customerName || '-'}</span>
            </div>
            <div className="flex">
              <span className="w-20 font-bold text-slate-500">프로젝트명:</span>
              <span className="font-extrabold text-slate-900">{data.projectName || '-'}</span>
            </div>
          </div>
          <div className="space-y-1.5 text-right sm:text-left">
            <div className="flex justify-end sm:justify-start">
              <span className="w-20 font-bold text-slate-500">견적 일자:</span>
              <span className="font-semibold text-slate-800">{data.quoteDate}</span>
            </div>
            <div className="flex justify-end sm:justify-start">
              <span className="w-20 font-bold text-slate-500">견적 번호:</span>
              <span className="font-mono font-medium text-slate-700">{data.quoteNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Summary Indicators */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
          1. 견적 및 손익 요약
        </h2>
        <table className="w-full border-collapse border border-slate-300 text-xs text-center">
          <thead className="bg-slate-100 font-bold text-slate-700">
            <tr>
              <th className="border border-slate-300 py-2">판매가 (VAT 별도)</th>
              <th className="border border-slate-300 py-2">총제조원가</th>
              <th className="border border-slate-300 py-2">예상 마진 (이익)</th>
              <th className="border border-slate-300 py-2">마진율 (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-extrabold text-sm">
              <td className="border border-slate-300 py-3 text-indigo-900 bg-indigo-50/30">
                {formatKRW(sellingPrice)}
              </td>
              <td className="border border-slate-300 py-3 text-slate-800 bg-slate-50/50">
                {formatKRW(totalCost)}
              </td>
              <td
                className={`border border-slate-300 py-3 ${
                  isLoss ? 'text-rose-600' : 'text-emerald-800 bg-emerald-50/30'
                }`}
              >
                {isLoss ? `-${formatKRW(Math.abs(margin))}` : formatKRW(margin)}
              </td>
              <td
                className={`border border-slate-300 py-3 ${
                  isLoss ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {isValidSellingPrice ? formatPercent(marginRate) : '0.0%'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Itemized Cost Breakdown Table */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
          2. 원가 세부 내역 (6개 주요 항목)
        </h2>
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead className="bg-slate-100 font-bold text-slate-700">
            <tr>
              <th className="border border-slate-300 py-2 px-3 text-center w-10">No.</th>
              <th className="border border-slate-300 py-2 px-3 text-left w-32">원가 항목</th>
              <th className="border border-slate-300 py-2 px-3 text-left">항목 내용 및 세부 기준</th>
              <th className="border border-slate-300 py-2 px-3 text-right w-32">금액 (원)</th>
              <th className="border border-slate-300 py-2 px-3 text-right w-20">원가 비중</th>
              <th className="border border-slate-300 py-2 px-3 text-right w-20">판매가 대비</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'doorCost', label: '1. 도어 비용', description: '도어 판넬, 엣지 밴딩 마감, 도장/PET 가공비' },
              { key: 'countertopCost', label: '2. 상판 비용', description: '인조대리석, 엔지니어드스톤, 세라믹 상판 및 가공' },
              { key: 'hardwareCost', label: '3. 하드웨어', description: '씽크볼, 수전, 후드, 경첩, 레일 등 부자재' },
              { key: 'productionCost', label: '4. 가구 제작비', description: '공장 캐비닛 몸통(PB/MDF) 재단, 조립 공임' },
              { key: 'installationCost', label: '5. 시공비', description: '현장 시공팀 인건비, 양중비, 사다리차, 부자재' },
              { key: 'otherCost', label: '6. 기타 비용', description: '현장 실측비, 폐기물 처리비, 운반비 및 예비비' },
            ].map((item, idx) => {
              const val = (data as unknown as Record<string, number>)[item.key] || 0;
              const costPct = totalCost > 0 ? (val / totalCost) * 100 : 0;
              const salesPct = sellingPrice > 0 ? (val / sellingPrice) * 100 : 0;

              return (
                <tr key={item.key}>
                  <td className="border border-slate-300 py-2 px-3 text-center text-slate-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 py-2 px-3 font-bold text-slate-800">
                    {item.label}
                  </td>
                  <td className="border border-slate-300 py-2 px-3 text-slate-600">
                    {item.description}
                  </td>
                  <td className="border border-slate-300 py-2 px-3 text-right font-bold text-slate-900">
                    {formatKRW(val)}
                  </td>
                  <td className="border border-slate-300 py-2 px-3 text-right text-slate-600 font-medium">
                    {formatPercent(costPct)}
                  </td>
                  <td className="border border-slate-300 py-2 px-3 text-right text-slate-600 font-medium">
                    {sellingPrice > 0 ? formatPercent(salesPct) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-extrabold">
            <tr>
              <td colSpan={3} className="border border-slate-300 py-2.5 px-3 text-center text-slate-900">
                총제조원가 합계
              </td>
              <td className="border border-slate-300 py-2.5 px-3 text-right text-slate-900 text-sm">
                {formatKRW(totalCost)}
              </td>
              <td className="border border-slate-300 py-2.5 px-3 text-right text-slate-900">
                100.0%
              </td>
              <td className="border border-slate-300 py-2.5 px-3 text-right text-slate-900">
                {sellingPrice > 0 ? formatPercent((totalCost / sellingPrice) * 100) : '-'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes & Terms */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
          3. 특이사항 및 비고
        </h2>
        <div className="border border-slate-300 rounded p-3 min-h-[50px] text-xs text-slate-700 bg-slate-50/50 whitespace-pre-wrap leading-relaxed">
          {data.notes || '특이사항 없음 (표준 시공 및 발주 조건 준수)'}
        </div>
      </div>

      {/* Footer / Disclaimer */}
      <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
        <div>본 검토서는 주방가구 제조 및 시공 원가 산출 근거 공식 서식입니다.</div>
        <div>
          출력일시: {new Date().toLocaleDateString('ko-KR')} | 담당: {data.managerName || '영업관리부'}
        </div>
      </div>
    </div>
  );
};
