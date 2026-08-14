import React, { useState, useEffect } from 'react';
import { formatNumber, formatKoreanUnits } from '../utils/formatters';

interface CurrencyInputProps {
  id?: string;
  label?: string;
  subLabel?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  quickButtons?: boolean;
  highlight?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  subLabel,
  value,
  onChange,
  placeholder = '0',
  quickButtons = true,
  highlight = false,
  disabled = false,
  required = false,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    value ? formatNumber(value) : ''
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setDisplayValue(value ? formatNumber(value) : '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (rawVal === '') {
      setDisplayValue('');
      onChange(0);
    } else {
      const numVal = parseInt(rawVal, 10);
      setDisplayValue(formatNumber(numVal));
      onChange(numVal);
    }
  };

  const handleAddAmount = (addValue: number) => {
    const nextVal = Math.max(0, (value || 0) + addValue);
    onChange(nextVal);
  };

  const handleClear = () => {
    onChange(0);
    setDisplayValue('');
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-semibold text-slate-700 flex items-center gap-1">
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {subLabel && <span className="text-xs text-slate-400">{subLabel}</span>}
        </div>
      )}

      <div className="relative rounded-lg shadow-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-sm font-bold text-slate-400">₩</span>
        </div>

        <input
          type="text"
          inputMode="numeric"
          id={id}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full rounded-lg border py-2 pl-7 pr-10 text-right text-sm font-semibold tracking-tight transition-all focus:outline-hidden ${
            highlight
              ? 'border-indigo-200 bg-indigo-50 text-indigo-700 text-base font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
              : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
          } ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-xs font-semibold text-slate-400">원</span>
        </div>
      </div>

      {/* Korean units preview & quick adjust controls */}
      <div className="flex items-center justify-between pt-0.5 text-xs">
        <span className="font-medium text-slate-500 truncate text-[11px]">
          {value > 0 ? (
            <span className="text-indigo-600 bg-indigo-50/70 border border-indigo-100/60 px-1.5 py-0.5 rounded font-semibold">
              ≈ {formatKoreanUnits(value)}
            </span>
          ) : (
            <span className="text-slate-400">0원</span>
          )}
        </span>

        {quickButtons && !disabled && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              id={id ? `${id}-btn-10m` : undefined}
              onClick={() => handleAddAmount(100000)}
              className="px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
              title="10만원 추가"
            >
              +10만
            </button>
            <button
              type="button"
              id={id ? `${id}-btn-50m` : undefined}
              onClick={() => handleAddAmount(500000)}
              className="px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
              title="50만원 추가"
            >
              +50만
            </button>
            <button
              type="button"
              id={id ? `${id}-btn-100m` : undefined}
              onClick={() => handleAddAmount(1000000)}
              className="px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
              title="100만원 추가"
            >
              +100만
            </button>
            {value > 0 && (
              <button
                type="button"
                id={id ? `${id}-btn-clear` : undefined}
                onClick={handleClear}
                className="px-1.5 py-0.5 text-[11px] font-medium text-rose-500 hover:bg-rose-50 rounded transition-colors"
                title="초기화"
              >
                비우기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
