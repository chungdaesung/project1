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
    <div
      id="printable-quotation-sheet"
      className="hidden print:block w-full max-w-[210mm] mx-auto bg-white text-slate-900 p-8 font-sans"
      style={{ minHeight: '297mm' }}
    >
      <PrintQuotationSheetContent data={data} result={result} />
    </div>
  );
};
