import React from 'react';
import { QuotationData, CalculationResult } from '../types';
import { PrintQuotationSheetContent } from './QuotationModal';

interface PrintQuotationSheetProps {
  data: QuotationData;
  result: CalculationResult;
}

export const PrintQuotationSheet: React.FC<PrintQuotationSheetProps> = ({
  data,
  result,
}) => {
  return (
    <>
      {/* 1. Visible only on browser standard print (window.print() or Ctrl+P) */}
      <div
        id="printable-quotation-sheet"
        className="hidden print:block w-full max-w-[210mm] mx-auto bg-white text-slate-900 p-8 font-sans"
        style={{ minHeight: '297mm' }}
      >
        <PrintQuotationSheetContent data={data} result={result} />
      </div>

      {/* 2. Offscreen element ready for instant direct PDF export */}
      <div
        id="direct-pdf-export-sheet"
        className="no-print"
        style={{
          position: 'absolute',
          left: '0px',
          top: '-99999px',
          width: '794px',
          minHeight: '1123px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: '36px',
          zIndex: -9999,
          pointerEvents: 'none',
        }}
      >
        <PrintQuotationSheetContent data={data} result={result} />
      </div>
    </>
  );
};
