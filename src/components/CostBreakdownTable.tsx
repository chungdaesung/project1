import React, { useState } from 'react';
import { CostItemEntry, QuotationData } from '../types';
import { formatKRW, formatPercent } from '../utils/formatters';
import { DEFAULT_PALETTE_COLORS, STANDARD_COST_PRESETS } from '../data/samples';
import { CurrencyInput } from './CurrencyInput';
import {
  Plus,
  Trash2,
  Layers,
  Table as TableIcon,
  LayoutGrid,
  RotateCcw,
  Sparkles,
  Edit2,
  Tag,
} from 'lucide-react';

interface CostBreakdownTableProps {
  data: QuotationData;
  onUpdateItem: (id: string, updates: Partial<CostItemEntry>) => void;
  onAddItem: (newItem?: Partial<CostItemEntry>) => void;
  onDeleteItem: (id: string) => void;
  onResetToDefaultItems: () => void;
  totalCost: number;
  sellingPrice: number;
}

export const CostBreakdownTable: React.FC<CostBreakdownTableProps> = ({
  data,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onResetToDefaultItems,
  totalCost,
  sellingPrice,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showPresetDropdown, setShowPresetDropdown] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const costItems = data.costItems || [];

  const handleAddPreset = (preset: typeof STANDARD_COST_PRESETS[0]) => {
    const nextColorIndex = costItems.length % DEFAULT_PALETTE_COLORS.length;
    onAddItem({
      name: preset.name,
      category: preset.category,
      description: preset.desc,
      amount: 0,
      color: DEFAULT_PALETTE_COLORS[nextColorIndex],
    });
    setShowPresetDropdown(false);
  };

  const handleAddNewBlank = () => {
    const nextColorIndex = costItems.length % DEFAULT_PALETTE_COLORS.length;
    onAddItem({
      name: `추가 원가 항목 ${costItems.length + 1}`,
      category: '기타',
      description: '직접 입력한 원가 항목',
      amount: 0,
      color: DEFAULT_PALETTE_COLORS[nextColorIndex],
    });
    setShowPresetDropdown(false);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      id="cost-breakdown-card"
    >
      {/* Header with Title and Control Buttons */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              원가 세부 항목 직접 입력 및 관리
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              총 {costItems.length}개 항목
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            원가 항목명, 세부 스펙 및 금액을 직접 수정하거나 필요한 항목을 자유롭게 추가·삭제할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              type="button"
              id="btn-view-cards"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="카드형 입력 보기"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">카드형</span>
            </button>
            <button
              type="button"
              id="btn-view-table"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="상세 표(테이블)형 입력 보기"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">표(테이블)형</span>
            </button>
          </div>

          {/* Add Item Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              id="btn-add-cost-item"
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 원가 항목 추가</span>
            </button>

            {showPresetDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPresetDropdown(false)}
                ></div>
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    원가 항목 선택 추가
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    <button
                      type="button"
                      onClick={handleAddNewBlank}
                      className="w-full px-3 py-2 text-left text-slate-800 hover:bg-indigo-50 font-bold flex items-center gap-2 border-b border-slate-100"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>새 원가 항목 (직접 입력)</span>
                    </button>
                    {STANDARD_COST_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPreset(preset)}
                        className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex flex-col transition-colors"
                      >
                        <span className="font-semibold text-slate-900 flex items-center justify-between">
                          {preset.name}
                          <span className="text-[10px] text-slate-400 font-normal">
                            {preset.category}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {preset.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset to standard preset */}
          <button
            type="button"
            id="btn-reset-items"
            onClick={onResetToDefaultItems}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="기본 6대 원가 항목으로 복원"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {costItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="text-sm font-semibold text-slate-600">등록된 원가 항목이 없습니다.</p>
            <button
              type="button"
              onClick={handleAddNewBlank}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              첫 번째 원가 항목 추가하기
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {costItems.map((item, index) => {
              const costVal = Number(item.amount) || 0;
              const costRatio = totalCost > 0 ? (costVal / totalCost) * 100 : 0;
              const salesRatio = sellingPrice > 0 ? (costVal / sellingPrice) * 100 : 0;
              const itemColor = item.color || DEFAULT_PALETTE_COLORS[index % DEFAULT_PALETTE_COLORS.length];

              return (
                <div
                  key={item.id}
                  id={`cost-item-${item.id}`}
                  className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 transition-all hover:bg-slate-50 hover:border-slate-300 relative group"
                >
                  {/* Top Item Header with Editable Name & Delete */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: itemColor }}
                        ></span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                          placeholder="항목명 (예: 도어 비용)"
                          className="font-bold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 rounded transition-all w-full focus:outline-hidden"
                        />
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-1">
                        {/* Category Selector */}
                        <select
                          value={item.category || '기타'}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              category: e.target.value as CostItemEntry['category'],
                            })
                          }
                          className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5 hover:border-slate-300 focus:outline-hidden"
                        >
                          <option value="자재비">자재비</option>
                          <option value="가공/제작비">가공/제작비</option>
                          <option value="시공/인건비">시공/인건비</option>
                          <option value="부대비용">부대비용</option>
                          <option value="기타">기타</option>
                        </select>

                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) =>
                            onUpdateItem(item.id, { description: e.target.value })
                          }
                          placeholder="규격/사양 설명 입력"
                          className="text-[11px] text-slate-400 bg-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 rounded border border-transparent transition-all flex-1 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 whitespace-nowrap">
                        비중 {formatPercent(costRatio)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="항목 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Currency Input Field */}
                  <CurrencyInput
                    id={`input-${item.id}`}
                    value={costVal}
                    onChange={(val) => onUpdateItem(item.id, { amount: val })}
                    placeholder="0"
                  />

                  {/* Bottom comparison */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>판매가 대비 점유율</span>
                    <span className="font-semibold text-slate-700">
                      {sellingPrice > 0 ? formatPercent(salesRatio) : '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Full Table View for Dense Production / Office Work */
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">No.</th>
                  <th className="py-2.5 px-3 text-left w-24">구분</th>
                  <th className="py-2.5 px-3 text-left w-44">원가 항목명</th>
                  <th className="py-2.5 px-3 text-left">세부 스펙 및 설명</th>
                  <th className="py-2.5 px-3 text-right w-44">금액 (원)</th>
                  <th className="py-2.5 px-3 text-right w-20">원가 비중</th>
                  <th className="py-2.5 px-3 text-right w-20">판매가 대비</th>
                  <th className="py-2.5 px-3 text-center w-12">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {costItems.map((item, idx) => {
                  const val = Number(item.amount) || 0;
                  const costPct = totalCost > 0 ? (val / totalCost) * 100 : 0;
                  const salesPct = sellingPrice > 0 ? (val / sellingPrice) * 100 : 0;
                  const itemColor = item.color || DEFAULT_PALETTE_COLORS[idx % DEFAULT_PALETTE_COLORS.length];

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={item.category || '기타'}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              category: e.target.value as CostItemEntry['category'],
                            })
                          }
                          className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:bg-white focus:outline-hidden"
                        >
                          <option value="자재비">자재비</option>
                          <option value="가공/제작비">가공/제작비</option>
                          <option value="시공/인건비">시공/인건비</option>
                          <option value="부대비용">부대비용</option>
                          <option value="기타">기타</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: itemColor }}
                          ></span>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                            className="w-full font-bold text-xs text-slate-800 bg-transparent border-b border-slate-200 focus:border-indigo-500 px-1 py-0.5 rounded focus:bg-white focus:outline-hidden"
                            placeholder="항목명"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                          className="w-full text-xs text-slate-600 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 px-1 py-0.5 rounded focus:bg-white focus:outline-hidden"
                          placeholder="세부 스펙 및 비고"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={val ? val.toLocaleString('ko-KR') : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            onUpdateItem(item.id, { amount: raw === '' ? 0 : parseInt(raw, 10) });
                          }}
                          placeholder="0"
                          className="w-full text-right font-bold text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-600">
                        {formatPercent(costPct)}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-600">
                        {sellingPrice > 0 ? formatPercent(salesPct) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-slate-900">
                    총제조원가 합계 ({costItems.length}개 항목)
                  </td>
                  <td className="py-3 px-3 text-right text-slate-900 font-extrabold text-sm">
                    {formatKRW(totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-900 font-bold">100.0%</td>
                  <td className="py-3 px-3 text-right text-slate-900 font-bold">
                    {sellingPrice > 0 ? formatPercent((totalCost / sellingPrice) * 100) : '-'}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Quick Add Bar under the list */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-700">빠른 항목 추가:</span>
            {['도어 비용', '상판 비용', '하드웨어', '가구 제작비', '현장 시공비', '물류운반비', '철거/양중비'].map(
              (label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const found = STANDARD_COST_PRESETS.find((p) => p.name === label);
                    if (found) handleAddPreset(found);
                    else {
                      onAddItem({
                        name: label,
                        category: '기타',
                        description: `${label} 상세`,
                        amount: 0,
                        color: DEFAULT_PALETTE_COLORS[costItems.length % DEFAULT_PALETTE_COLORS.length],
                      });
                    }
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md border border-slate-200 transition-colors font-medium cursor-pointer"
                >
                  + {label}
                </button>
              )
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-slate-400 font-medium mr-2">총 원가:</span>
            <span className="text-base font-black text-slate-900">{formatKRW(totalCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
