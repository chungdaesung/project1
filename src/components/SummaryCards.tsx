import React from 'react';
import { CalculationResult } from '../types';
import {
  formatKRW,
  formatPercent,
  formatKoreanUnits,
  getMarginEvaluation,
} from '../utils/formatters';
import {
  TrendingUp,
  AlertTriangle,
  Receipt,
  PiggyBank,
  Percent,
  Info,
} from 'lucide-react';

interface SummaryCardsProps {
  sellingPrice: number;
  result: CalculationResult;
  data?: {
    doorCost: number;
    countertopCost: number;
    hardwareCost: number;
    productionCost: number;
    installationCost: number;
    otherCost: number;
  };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  sellingPrice,
  result,
  data,
}) => {
  const { totalCost, margin, marginRate, isLoss, isValidSellingPrice, missingItems } =
    result;
  const evaluation = getMarginEvaluation(marginRate);

  const materialsCost =
    (data?.doorCost || 0) + (data?.countertopCost || 0) + (data?.hardwareCost || 0);
  const operationsCost =
    (data?.productionCost || 0) + (data?.installationCost || 0) + (data?.otherCost || 0);

  return (
    <div className="space-y-4" id="summary-section">
      {/* Alert / Warning message banner if missing critical inputs or in deficit */}
      {missingItems.length > 0 && (
        <div
          id="warning-missing-items"
          className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs sm:text-sm"
        >
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-950">
              정확한 견적 산출을 위해 입력을 확인해주세요:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {missingItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-200/70 text-amber-900"
                >
                  • {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoss && isValidSellingPrice && (
        <div
          id="alert-loss-warning"
          className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm font-medium animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold text-rose-950">원가 역전(적자) 경고:</span>{' '}
            총원가가 판매가를 초과하여 <strong className="text-rose-700">{formatKRW(Math.abs(margin))}</strong>의 손실이 발생합니다. 판매가격을 인상하거나 원가를 절감해야 합니다.
          </div>
        </div>
      )}

      {/* 4 Core Metric Cards with Sleek Interface Aesthetics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. 총 판매가 (Hero Indigo Card) */}
        <div
          id="card-selling-price"
          className="bg-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">
                총 판매가
              </h3>
              <Receipt className="w-4 h-4 text-indigo-300 opacity-80" />
            </div>
            <div className="text-3xl font-bold flex items-baseline gap-1 mt-2">
              <span className="text-lg font-medium opacity-80">₩</span>
              <span>{formatKRW(sellingPrice).replace('원', '')}</span>
            </div>
            <div className="text-xs text-indigo-200/80 font-medium mt-1">
              ≈ {formatKoreanUnits(sellingPrice)}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-600/60 flex justify-between text-xs text-indigo-200">
            <span>고객 견적 기준</span>
            <span className="font-semibold text-white">기준 100%</span>
          </div>
        </div>

        {/* 2. 총 원가 (Total Cost White Card) */}
        <div
          id="card-total-cost"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                총 원가 (Total Cost)
              </h3>
              <PiggyBank className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-baseline gap-1 mt-2">
              <span className="text-lg font-medium text-slate-400">₩</span>
              <span>{formatKRW(totalCost).replace('원', '')}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              ≈ {formatKoreanUnits(totalCost)}
            </div>
          </div>

          <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>주요자재비 (도어/상판/H.W)</span>
              <span className="font-medium text-slate-700">{formatKRW(materialsCost)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>운영비용 (제작/시공/기타)</span>
              <span className="font-medium text-slate-700">{formatKRW(operationsCost)}</span>
            </div>
          </div>
        </div>

        {/* 3. 마진 (Emerald Sleek Card) */}
        <div
          id="card-margin"
          className={`rounded-2xl border p-6 flex flex-col justify-between ${
            isLoss
              ? 'bg-rose-50 border-rose-200'
              : 'bg-emerald-50 border-emerald-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <h3
                className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  isLoss ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                마진 (순이익)
              </h3>
              <TrendingUp
                className={`w-4 h-4 ${
                  isLoss ? 'text-rose-500' : 'text-emerald-600'
                }`}
              />
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 ${
                isLoss ? 'text-rose-600' : 'text-emerald-800'
              }`}
            >
              {isLoss ? `-${formatKRW(Math.abs(margin))}` : formatKRW(margin)}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                isLoss ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              ≈ {formatKoreanUnits(margin)}
            </div>
          </div>

          <div
            className={`text-[11px] leading-tight mt-4 pt-3 border-t ${
              isLoss
                ? 'text-rose-600 border-rose-200/80'
                : 'text-emerald-600 border-emerald-200/60'
            }`}
          >
            {isLoss
              ? '총원가가 판매가를 초과하여 손실이 발생합니다.'
              : '총 판매가에서 6대 원가를 차감한 순수익 금액입니다.'}
          </div>
        </div>

        {/* 4. 마진율 (Amber Sleek Card) */}
        <div
          id="card-margin-rate"
          className={`rounded-2xl border p-6 flex flex-col justify-between ${
            isLoss
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <h3
                className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  isLoss ? 'text-rose-700' : 'text-amber-700'
                }`}
              >
                마진율
              </h3>
              <Percent
                className={`w-4 h-4 ${
                  isLoss ? 'text-rose-500' : 'text-amber-600'
                }`}
              />
            </div>
            <div
              className={`text-4xl font-black tracking-tight mt-2 ${
                isLoss ? 'text-rose-600' : 'text-amber-800'
              }`}
            >
              {isValidSellingPrice ? marginRate.toFixed(1) : '0.0'}
              <span className="text-xl font-bold ml-0.5">%</span>
            </div>
            <div className="mt-1">
              <span
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${evaluation.badgeClass}`}
              >
                {evaluation.label}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="w-full bg-amber-200/70 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isLoss ? 'bg-rose-500' : 'bg-amber-600'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(isValidSellingPrice ? marginRate : 0, 100))}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-amber-800/80 font-medium">
              <span>목표 마진율</span>
              <span>권장 25%~35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
