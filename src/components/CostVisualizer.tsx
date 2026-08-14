import React from 'react';
import { QuotationData, CalculationResult } from '../types';
import { COST_ITEMS_CONFIG, formatKRW, formatPercent } from '../utils/formatters';

interface CostVisualizerProps {
  data: QuotationData;
  result: CalculationResult;
}

export const CostVisualizer: React.FC<CostVisualizerProps> = ({ data, result }) => {
  const { totalCost, margin, marginRate, isLoss, isValidSellingPrice } = result;
  const sellingPrice = data.sellingPrice || 0;

  if (totalCost <= 0 && sellingPrice <= 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" id="cost-visualizer-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            원가 및 마진 구조 시각화 (Cost & Margin Breakdown)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            판매가 대비 각 원가 요소와 이익(마진)의 점유 비중을 한눈에 파악할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            총원가율: <strong className="text-slate-700">{sellingPrice > 0 ? formatPercent((totalCost / sellingPrice) * 100) : '0%'}</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            마진율: <strong className="text-emerald-700">{isValidSellingPrice ? formatPercent(marginRate) : '0%'}</strong>
          </span>
        </div>
      </div>

      {/* Stacked Bar for Selling Price Distribution */}
      {sellingPrice > 0 && (
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>판매가 100% 분해 구성도</span>
            <span className="font-bold text-slate-800">{formatKRW(sellingPrice)}</span>
          </div>

          <div className="h-5 w-full rounded-full bg-slate-100 flex overflow-hidden border border-slate-200/70 p-0.5 gap-0.5">
            {COST_ITEMS_CONFIG.map((item) => {
              const val = data[item.key] || 0;
              const pct = (val / sellingPrice) * 100;
              if (pct <= 0) return null;
              return (
                <div
                  key={item.key}
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: item.color,
                  }}
                  className="h-full rounded-xs relative group transition-all duration-300 hover:opacity-90 flex items-center justify-center text-[10px] text-white font-bold overflow-hidden"
                  title={`${item.label}: ${formatKRW(val)} (${formatPercent(pct)})`}
                >
                  {pct > 7 && <span className="truncate px-1 text-[10px]">{item.label}</span>}
                </div>
              );
            })}

            {/* Margin segment */}
            {!isLoss && margin > 0 && (
              <div
                style={{
                  width: `${Math.min(marginRate, 100)}%`,
                  backgroundColor: '#10b981',
                }}
                className="h-full rounded-xs relative group transition-all duration-300 flex items-center justify-center text-[10px] text-white font-bold bg-emerald-500"
                title={`마진: ${formatKRW(margin)} (${formatPercent(marginRate)})`}
              >
                {marginRate > 6 && <span className="truncate px-1 text-[10px]">마진 {formatPercent(marginRate)}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend & Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-1 text-xs">
        {COST_ITEMS_CONFIG.map((item) => {
          const val = data[item.key] || 0;
          const costPct = totalCost > 0 ? (val / totalCost) * 100 : 0;

          return (
            <div
              key={item.key}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="truncate text-xs">{item.label}</span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-800 text-xs">{formatKRW(val)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  원가의 {formatPercent(costPct)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Profit margin chip */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col justify-between ${
            isLoss
              ? 'bg-rose-50 border-rose-200'
              : 'bg-emerald-50/70 border-emerald-200/80'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isLoss ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            ></span>
            <span className="truncate text-xs">{isLoss ? '손실' : '순마진'}</span>
          </div>
          <div className="mt-2">
            <div
              className={`font-bold text-xs ${
                isLoss ? 'text-rose-600' : 'text-emerald-800'
              }`}
            >
              {isLoss ? `-${formatKRW(Math.abs(margin))}` : formatKRW(margin)}
            </div>
            <div
              className={`text-[10px] font-medium mt-0.5 ${
                isLoss ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              마진율 {isValidSellingPrice ? formatPercent(marginRate) : '0%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
