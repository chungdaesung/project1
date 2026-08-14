import { QuotationData, CalculationResult } from '../types';

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
 * Calculates total cost, margin, and margin rate based on the custom cost items
 */
export function calculateQuotation(data: QuotationData): CalculationResult {
  const items = data.costItems || [];
  
  let totalCost = 0;
  let materialsCost = 0;
  let operationsCost = 0;

  items.forEach((item) => {
    const amt = Number(item.amount) || 0;
    totalCost += amt;
    if (item.category === '자재비') {
      materialsCost += amt;
    } else {
      operationsCost += amt;
    }
  });

  const sellingPrice = data.sellingPrice || 0;
  const margin = sellingPrice - totalCost;

  let marginRate = 0;
  if (sellingPrice > 0) {
    marginRate = (margin / sellingPrice) * 100;
  }

  const missingItems: string[] = [];
  if (!data.customerName?.trim()) missingItems.push('고객명');
  if (!data.projectName?.trim()) missingItems.push('프로젝트명');
  if (sellingPrice <= 0) missingItems.push('판매가 (0원 초과 필수)');
  if (totalCost <= 0) missingItems.push('원가 항목 금액 입력');

  return {
    totalCost,
    margin,
    marginRate,
    isLoss: margin < 0,
    isValidSellingPrice: sellingPrice > 0,
    missingItems,
    materialsCost,
    operationsCost,
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
