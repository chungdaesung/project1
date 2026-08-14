import { QuotationData, CalculationResult, CostItemConfig } from '../types';

export const COST_ITEMS_CONFIG: CostItemConfig[] = [
  {
    key: 'doorCost',
    label: '도어 금액',
    description: '도어 도장/PET/LPM 및 가공비',
    color: '#2563eb', // blue
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    key: 'countertopCost',
    label: '상판 금액',
    description: '인조대리석 / 엔지니어드스톤 / 세라믹',
    color: '#0891b2', // cyan
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    key: 'hardwareCost',
    label: '하드웨어 금액',
    description: '힌지, 레일, 씽크볼, 수전, 후드, 액세서리',
    color: '#d97706', // amber
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    key: 'productionCost',
    label: '제작비',
    description: '몸통(PB/MDF) 재단, 엣지 밴딩, 조립 공임',
    color: '#059669', // emerald
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    key: 'installationCost',
    label: '시공비',
    description: '현장 배송, 양중 및 전문 시공팀 인건비',
    color: '#7c3aed', // violet
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    key: 'otherCost',
    label: '기타 비용',
    description: '폐기물 처리, 보양, 부자재 및 경비',
    color: '#64748b', // slate
    bgLight: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
];

/**
 * Formats a number to KRW comma-separated string (e.g. 1,500,000)
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return Math.round(num).toLocaleString('ko-KR');
}

/**
 * Formats a number with Korean won suffix (e.g. 1,500,000원)
 */
export function formatKRW(num: number): string {
  return `${formatNumber(num)}원`;
}

/**
 * Converts a large KRW amount to readable Korean unit (e.g. 1,250만원, 1억 2,000만원)
 */
export function formatKoreanUnits(amount: number): string {
  if (!amount || amount === 0) return '0원';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  const eok = Math.floor(abs / 100000000);
  const man = Math.floor((abs % 100000000) / 10000);
  const remainder = abs % 10000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (remainder > 0 && eok === 0 && man === 0) parts.push(`${remainder.toLocaleString('ko-KR')}`);

  const formatted = parts.join(' ') + '원';
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats margin percentage to 1 decimal place (e.g. 25.4%)
 */
export function formatPercent(rate: number): string {
  if (isNaN(rate) || !isFinite(rate)) return '0.0%';
  return `${rate.toFixed(1)}%`;
}

/**
 * Calculates total cost, margin, and margin rate based on the requirements:
 * 총원가 = 도어 금액 + 상판 금액 + 하드웨어 금액 + 제작비 + 시공비 + 기타 비용
 * 마진 = 판매가 - 총원가
 * 마진율 = (마진 ÷ 판매가) × 100
 */
export function calculateQuotation(data: QuotationData): CalculationResult {
  const totalCost =
    (data.doorCost || 0) +
    (data.countertopCost || 0) +
    (data.hardwareCost || 0) +
    (data.productionCost || 0) +
    (data.installationCost || 0) +
    (data.otherCost || 0);

  const sellingPrice = data.sellingPrice || 0;
  const margin = sellingPrice - totalCost;

  let marginRate = 0;
  if (sellingPrice > 0) {
    marginRate = (margin / sellingPrice) * 100;
  }

  const missingItems: string[] = [];
  if (!data.customerName.trim()) missingItems.push('고객명');
  if (!data.projectName.trim()) missingItems.push('프로젝트명');
  if (sellingPrice <= 0) missingItems.push('판매가 (0원 초과 필수)');
  if (totalCost <= 0) missingItems.push('원가 항목 입력 필요');

  return {
    totalCost,
    margin,
    marginRate,
    isLoss: margin < 0,
    isValidSellingPrice: sellingPrice > 0,
    missingItems,
  };
}

/**
 * Provides margin rating assessment for business review
 */
export function getMarginEvaluation(marginRate: number): {
  label: string;
  badgeClass: string;
  desc: string;
} {
  if (marginRate >= 35) {
    return {
      label: '우수 마진 (35% 이상)',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: '수익성이 매우 높은 최적의 견적입니다.',
    };
  } else if (marginRate >= 25) {
    return {
      label: '적정 마진 (25~34%)',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      desc: '표준적인 주방가구 제조 목표 마진 범위입니다.',
    };
  } else if (marginRate >= 15) {
    return {
      label: '주의 마진 (15~24%)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: '마진율이 다소 낮습니다. 원가 절감 또는 단가 조정을 검토하세요.',
    };
  } else if (marginRate > 0) {
    return {
      label: '저마진 경고 (0~14%)',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      desc: '최소 영업 마진 미달 상태입니다. 추가 협의가 필요합니다.',
    };
  } else {
    return {
      label: '원가 역전 (적자 손실)',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: '총원가가 판매가를 초과하여 손실이 발생합니다!',
    };
  }
}
