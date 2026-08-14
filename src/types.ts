export interface CostItemEntry {
  id: string;
  name: string; // e.g. "도어 비용", "상판 비용", "하드웨어 비용"
  description: string; // e.g. "E0 PET 무광 도어 22T", "12T 세라믹 졸리컷"
  amount: number; // in KRW
  category?: '자재비' | '가공/제작비' | '시공/인건비' | '부대비용' | '기타';
  color?: string;
}

export interface QuotationData {
  customerName: string;
  projectName: string;
  quoteDate: string;
  quoteNumber: string;
  managerName: string;
  costItems: CostItemEntry[];
  sellingPrice: number;
  notes: string;
}

export interface CalculationResult {
  totalCost: number;
  margin: number;
  marginRate: number; // in percentage, e.g., 25.4
  isLoss: boolean;
  isValidSellingPrice: boolean;
  missingItems: string[];
  materialsCost: number; // 주요 자재비 (도어, 상판, 하드웨어 등)
  operationsCost: number; // 가공, 시공, 인건비, 기타 등
}
