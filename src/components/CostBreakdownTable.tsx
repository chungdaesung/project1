import React from 'react';
import { QuotationData, CostItemKey } from '../types';
import { COST_ITEMS_CONFIG, formatKRW, formatPercent } from '../utils/formatters';
import { CurrencyInput } from './CurrencyInput';

interface CostBreakdownTableProps {
  data: QuotationData;
  onChange: (key: CostItemKey, value: number) => void;
  totalCost: number;
  sellingPrice: number;
}

export const CostBreakdownTable: React.FC<CostBreakdownTableProps> = ({
  data,
  onChange,
  totalCost,
  sellingPrice,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="cost-breakdown-card">
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            원가 세부 항목 입력 (6대 원가 요소)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            도어, 상판, 하드웨어, 제작비, 시공비, 기타 비용을 입력하면 총원가가 실시간 자동 합산됩니다.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">총원가 합계</span>
          <div className="text-lg font-extrabold text-slate-900">
            {formatKRW(totalCost)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COST_ITEMS_CONFIG.map((item) => {
            const costVal = data[item.key] || 0;
            const costRatio = totalCost > 0 ? (costVal / totalCost) * 100 : 0;
            const salesRatio = sellingPrice > 0 ? (costVal / sellingPrice) * 100 : 0;

            return (
              <div
                key={item.key}
                id={`cost-item-${item.key}`}
                className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="font-semibold text-xs text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
                    비중 {formatPercent(costRatio)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2.5 min-h-[1.1rem]">
                  {item.description}
                </p>

                <CurrencyInput
                  id={`input-${item.key}`}
                  value={costVal}
                  onChange={(val) => onChange(item.key, val)}
                  placeholder="0"
                />

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>판매가 대비</span>
                  <span className="font-medium text-slate-600">
                    {sellingPrice > 0 ? formatPercent(salesRatio) : '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Table View for Production & Management Review */}
        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden hidden sm:block">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4 text-left">항목 구분</th>
                <th className="py-2.5 px-4 text-left">설명 및 세부내역</th>
                <th className="py-2.5 px-4 text-right">금액 (원)</th>
                <th className="py-2.5 px-4 text-right">원가 비중 (%)</th>
                <th className="py-2.5 px-4 text-right">판매가 대비 (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {COST_ITEMS_CONFIG.map((item) => {
                const val = data[item.key] || 0;
                const costPct = totalCost > 0 ? (val / totalCost) * 100 : 0;
                const salesPct = sellingPrice > 0 ? (val / sellingPrice) * 100 : 0;

                return (
                  <tr key={item.key} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.label}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{item.description}</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                      {formatKRW(val)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-600">
                      {formatPercent(costPct)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-600">
                      {sellingPrice > 0 ? formatPercent(salesPct) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td colSpan={2} className="py-3 px-4 text-slate-900">
                  총제조원가 합계 (6개 항목)
                </td>
                <td className="py-3 px-4 text-right text-slate-900 font-extrabold text-sm">
                  {formatKRW(totalCost)}
                </td>
                <td className="py-3 px-4 text-right text-slate-900">100.0%</td>
                <td className="py-3 px-4 text-right text-slate-900">
                  {sellingPrice > 0 ? formatPercent((totalCost / sellingPrice) * 100) : '-'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
