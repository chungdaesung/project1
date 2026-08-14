import React, { useState, useMemo } from 'react';
import { QuotationData, CostItemEntry } from './types';
import { calculateQuotation, formatKRW } from './utils/formatters';
import { SAMPLE_QUOTES, INITIAL_QUOTATION_DATA, DEFAULT_PALETTE_COLORS, STANDARD_COST_PRESETS } from './data/samples';
import { CurrencyInput } from './components/CurrencyInput';
import { SummaryCards } from './components/SummaryCards';
import { CostBreakdownTable } from './components/CostBreakdownTable';
import { CostVisualizer } from './components/CostVisualizer';
import { PrintQuotationSheet } from './components/PrintQuotationSheet';
import { QuotationModal } from './components/QuotationModal';
import { exportElementToPdf } from './utils/pdfExport';
import {
  Printer,
  RotateCcw,
  Sparkles,
  Calculator,
  User,
  FolderOpen,
  Calendar,
  FileText,
  Building,
  CheckCircle2,
  Download,
  Eye,
  Loader2,
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<QuotationData>(INITIAL_QUOTATION_DATA);
  const [showSampleMenu, setShowSampleMenu] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState<boolean>(false);
  const [isDownloadingPdfDirect, setIsDownloadingPdfDirect] = useState<boolean>(false);

  // Real-time calculation based on dynamic cost items
  const result = useMemo(() => calculateQuotation(data), [data]);

  // Update a single cost item
  const handleUpdateCostItem = (id: string, updates: Partial<CostItemEntry>) => {
    setData((prev) => ({
      ...prev,
      costItems: prev.costItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  // Add a new cost item
  const handleAddCostItem = (newItem?: Partial<CostItemEntry>) => {
    const newId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nextColorIndex = (data.costItems?.length || 0) % DEFAULT_PALETTE_COLORS.length;

    const itemToAdd: CostItemEntry = {
      id: newId,
      name: newItem?.name || `추가 원가 항목 ${(data.costItems?.length || 0) + 1}`,
      category: newItem?.category || '기타',
      description: newItem?.description || '',
      amount: newItem?.amount || 0,
      color: newItem?.color || DEFAULT_PALETTE_COLORS[nextColorIndex],
    };

    setData((prev) => ({
      ...prev,
      costItems: [...prev.costItems, itemToAdd],
    }));
  };

  // Delete a cost item
  const handleDeleteCostItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      costItems: prev.costItems.filter((item) => item.id !== id),
    }));
  };

  // Reset cost items back to standard default 6 items
  const handleResetToDefaultItems = () => {
    if (window.confirm('기본 표준 6대 원가 항목 구성으로 재설정하시겠습니까?')) {
      setData((prev) => ({
        ...prev,
        costItems: INITIAL_QUOTATION_DATA.costItems,
      }));
    }
  };

  const handleSellingPriceChange = (value: number) => {
    setData((prev) => ({
      ...prev,
      sellingPrice: value,
    }));
  };

  const handleMetaChange = (field: keyof QuotationData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    if (window.confirm('입력된 모든 견적 항목과 금액을 초기화하시겠습니까?')) {
      setData({
        customerName: '',
        projectName: '',
        quoteDate: new Date().toISOString().split('T')[0],
        quoteNumber: `KQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        managerName: '',
        costItems: [
          {
            id: 'item-1',
            name: '도어 비용',
            description: '도어 판넬 및 가공비',
            amount: 0,
            category: '자재비',
            color: DEFAULT_PALETTE_COLORS[0],
          },
          {
            id: 'item-2',
            name: '상판 비용',
            description: '인조대리석 / 세라믹 상판',
            amount: 0,
            category: '자재비',
            color: DEFAULT_PALETTE_COLORS[1],
          },
          {
            id: 'item-3',
            name: '하드웨어/기기',
            description: '힌지, 레일, 싱크볼, 수전 등',
            amount: 0,
            category: '자재비',
            color: DEFAULT_PALETTE_COLORS[2],
          },
          {
            id: 'item-4',
            name: '몸통 제작비',
            description: '공장 캐비닛 가공 및 조립 공임',
            amount: 0,
            category: '가공/제작비',
            color: DEFAULT_PALETTE_COLORS[3],
          },
          {
            id: 'item-5',
            name: '현장 시공비',
            description: '시공 인건비 및 설치비',
            amount: 0,
            category: '시공/인건비',
            color: DEFAULT_PALETTE_COLORS[4],
          },
          {
            id: 'item-6',
            name: '기타/폐기물',
            description: '철거, 양중, 보양 및 기타비',
            amount: 0,
            category: '부대비용',
            color: DEFAULT_PALETTE_COLORS[5],
          },
        ],
        sellingPrice: 0,
        notes: '',
      });
    }
  };

  const handleLoadSample = (sample: QuotationData) => {
    setData({
      ...sample,
      quoteDate: new Date().toISOString().split('T')[0],
      quoteNumber: `KQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    });
    setShowSampleMenu(false);
  };

  const handleOpenQuotation = () => {
    setIsQuotationModalOpen(true);
  };

  // 1-Click Instant High-Resolution PDF Download
  const handleDirectDownloadPdf = async () => {
    setIsDownloadingPdfDirect(true);
    try {
      const defaultFileName = `주방가구_견적원가검토서_${data.customerName ? data.customerName.replace(/[^a-zA-Z0-9가-힣]/g, '_') : '미지정'}_${data.quoteDate || new Date().toISOString().slice(0, 10)}.pdf`;
      // Use the offscreen sheet or fallback to modal
      const targetId = document.getElementById('direct-pdf-export-sheet')
        ? 'direct-pdf-export-sheet'
        : 'printable-quotation-sheet';

      const success = await exportElementToPdf(targetId, defaultFileName);
      if (!success) {
        // If offscreen failed, open modal for interactive download
        setIsQuotationModalOpen(true);
      }
    } catch (e) {
      console.error('PDF export error:', e);
      setIsQuotationModalOpen(true);
    } finally {
      setIsDownloadingPdfDirect(false);
    }
  };

  const handleCopySummary = () => {
    const costDetails = data.costItems
      .map((item) => `  - ${item.name} (${item.category || '기타'}): ${formatKRW(item.amount)}`)
      .join('\n');

    const summaryText = `[주방가구 견적 및 원가 요약]
• 고객명: ${data.customerName || '미지정'}
• 프로젝트: ${data.projectName || '미지정'}
• 최종 판매가: ${formatKRW(data.sellingPrice)}
• 총제조원가: ${formatKRW(result.totalCost)} (항목 ${data.costItems.length}개)
${costDetails}
• 예상 마진: ${formatKRW(result.margin)}
• 마진율: ${result.marginRate.toFixed(1)}%`;

    navigator.clipboard.writeText(summaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col justify-between">
      {/* Screen View */}
      <div className="no-print flex-1">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  주방가구 견적 및 원가 계산 도구
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    실무 v1.0
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  대표 · 디자인영업 · 생산관리 · 임원용 실시간 견적 및 마진 산출
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Sample loader dropdown */}
              <div className="relative">
                <button
                  type="button"
                  id="btn-sample-toggle"
                  onClick={() => setShowSampleMenu(!showSampleMenu)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden md:inline">예시 견적</span> 불러오기
                </button>

                {showSampleMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSampleMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        주방가구 표준 샘플 불러오기
                      </div>
                      {SAMPLE_QUOTES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          id={`btn-sample-${idx}`}
                          onClick={() => handleLoadSample(sample.data)}
                          className="w-full text-left px-4 py-2.5 hover:bg-indigo-50/70 transition-colors flex flex-col gap-0.5 border-t border-slate-100 first:border-t-0 cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-800">
                            {sample.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {sample.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Copy Summary Text Button */}
              <button
                type="button"
                id="btn-copy-summary"
                onClick={handleCopySummary}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="견적 요약 텍스트 복사"
              >
                {copiedNotification ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">복사완료!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>요약 복사</span>
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                id="btn-reset"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 transition-colors shadow-2xs cursor-pointer"
                title="모든 항목 비우기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">초기화</span>
              </button>

              {/* Direct PDF Download Button */}
              <button
                type="button"
                id="btn-direct-download-pdf"
                onClick={handleDirectDownloadPdf}
                disabled={isDownloadingPdfDirect}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                title="A4 규격 PDF 파일로 즉시 다운로드"
              >
                {isDownloadingPdfDirect ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>PDF 저장 중...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                    <span>PDF 다운로드</span>
                  </>
                )}
              </button>

              {/* Print / Save PDF Preview Modal Button */}
              <button
                type="button"
                id="btn-print-pdf"
                onClick={handleOpenQuotation}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>견적서 미리보기 & PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Row: Basic Info & Selling Price Setting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Project & Client Info Card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" id="project-info-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  프로젝트 및 고객 기본 정보
                </h2>
                <span className="text-[11px] text-slate-400">견적서 인쇄 시 자동 반영</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="input-customer-name"
                    className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    고객명 / 거래처 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-customer-name"
                    value={data.customerName}
                    onChange={(e) => handleMetaChange('customerName', e.target.value)}
                    placeholder="예: 김민준 고객님, (주)디자인하우스"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-project-name"
                    className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                    프로젝트명 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-project-name"
                    value={data.projectName}
                    onChange={(e) => handleMetaChange('projectName', e.target.value)}
                    placeholder="예: 서초 래미안 34평 주방 리모델링"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-quote-date"
                    className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    견적 일자
                  </label>
                  <input
                    type="date"
                    id="input-quote-date"
                    value={data.quoteDate}
                    onChange={(e) => handleMetaChange('quoteDate', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-manager-name"
                    className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    담당자 (영업/설계)
                  </label>
                  <input
                    type="text"
                    id="input-manager-name"
                    value={data.managerName}
                    onChange={(e) => handleMetaChange('managerName', e.target.value)}
                    placeholder="예: 홍길동 과장"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right: Sales Price Input Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between" id="selling-price-setting-card">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    최종 견적 판매가 설정
                  </span>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    VAT 별도 기준
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">
                  고객 제시 판매가 (계약 예상 금액)
                </h3>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <CurrencyInput
                  id="input-selling-price"
                  value={data.sellingPrice}
                  onChange={handleSellingPriceChange}
                  highlight={true}
                  required={true}
                  placeholder="0"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>총원가 기준 손익분기점</span>
                <span className="font-semibold text-indigo-600">
                  최소 {formatKRW(result.totalCost)} 이상 권장
                </span>
              </div>
            </div>
          </div>

          {/* Core Calculation Result Cards (판매가, 총원가, 마진, 마진율) */}
          <SummaryCards sellingPrice={data.sellingPrice} result={result} data={data} />

          {/* Visualizer Bar */}
          <CostVisualizer data={data} result={result} />

          {/* User-customizable Cost Items Breakdown Table & Inputs */}
          <CostBreakdownTable
            data={data}
            onUpdateItem={handleUpdateCostItem}
            onAddItem={handleAddCostItem}
            onDeleteItem={handleDeleteCostItem}
            onResetToDefaultItems={handleResetToDefaultItems}
            totalCost={result.totalCost}
            sellingPrice={data.sellingPrice}
          />

          {/* Notes & Remarks Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" id="notes-card">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="input-notes"
                className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                특이사항 및 비고 (도면 규격, 자재 스펙, 시공 조건 등)
              </label>
              <span className="text-[11px] text-slate-400">인쇄 문서 및 PDF에 함께 출력됩니다</span>
            </div>
            <textarea
              id="input-notes"
              rows={3}
              value={data.notes}
              onChange={(e) => handleMetaChange('notes', e.target.value)}
              placeholder="예: 싱크대 규격 3,200 x 2,400mm, 상판 세라믹 12T 졸리컷 가공, 엘리베이터 양중 가능 여부 등"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Print Action Bottom Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-800">
                  대표 및 생산관리 검토용 인쇄물/PDF가 필요하신가요?
                </span>
                <p className="text-slate-400 text-xs mt-0.5">
                  ‘견적서 미리보기 & PDF’ 버튼을 클릭하면 표준 승인 결재란이 포함된 A4 양식을 확인하고 즉시 PDF 파일로 저장하거나 인쇄할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="btn-print-pdf-bottom"
                onClick={handleOpenQuotation}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>견적 및 원가 검토서 미리보기 & PDF</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Sleek System Footer */}
      <footer className="no-print px-4 sm:px-8 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
        <div>본 시스템은 내부용 원가 계산 도구이며, 외부 유출을 금합니다.</div>
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>실시간 자동 계산 및 유효성 검증 작동 중</span>
        </div>
      </footer>

      {/* Dedicated Clean A4 Printable Sheet (Visible only on print or export) */}
      <PrintQuotationSheet data={data} result={result} />

      {/* Full-featured Quotation Preview & PDF Download Modal */}
      <QuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        data={data}
        result={result}
      />
    </div>
  );
}
