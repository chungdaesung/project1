export interface QuotationData {
  customerName: string;
  projectName: string;
  quoteDate: string;
  quoteNumber: string;
  managerName: string;
  doorCost: number;
  countertopCost: number;
  hardwareCost: number;
  productionCost: number;
  installationCost: number;
  otherCost: number;
  sellingPrice: number;
  notes: string;
}

export type CostItemKey =
  | 'doorCost'
  | 'countertopCost'
  | 'hardwareCost'
  | 'productionCost'
  | 'installationCost'
  | 'otherCost';

export interface CostItemConfig {
  key: CostItemKey;
  label: string;
  description: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export interface CalculationResult {
  totalCost: number;
  margin: number;
  marginRate: number; // in percentage, e.g., 25.4
  isLoss: boolean;
  isValidSellingPrice: boolean;
  missingItems: string[];
}
