import React, { useRef, useEffect } from 'react';

export type FourDigits = [string, string, string, string]; // [천, 백, 십, 일]
export type ThreeDigits = FourDigits; // Backwards compatibility alias

export function getDigitsNumericValue(digits: FourDigits | string[]): number | null {
  if (!digits || digits.every((d) => !d)) return null;
  if (digits.length >= 4) {
    const [th, h, t, o] = digits;
    const thVal = th ? parseInt(th, 10) : 0;
    const hVal = h ? parseInt(h, 10) : 0;
    const tVal = t ? parseInt(t, 10) : 0;
    const oVal = o ? parseInt(o, 10) : 0;
    return thVal * 1000 + hVal * 100 + tVal * 10 + oVal;
  }
  const [h, t, o] = digits;
  const hVal = h ? parseInt(h, 10) : 0;
  const tVal = t ? parseInt(t, 10) : 0;
  const oVal = o ? parseInt(o, 10) : 0;
  return hVal * 100 + tVal * 10 + oVal;
}

export function digitsToString(digits: FourDigits | string[]): string {
  const val = getDigitsNumericValue(digits);
  return val !== null ? String(val) : '';
}

interface FourDigitInputProps {
  digits: FourDigits;
  onDigitsChange: (digits: FourDigits) => void;
  activeBox: number;
  onActiveBoxChange: (box: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null;
  problemId?: string;
  size?: 'normal' | 'compact';
}

export const FourDigitInput: React.FC<FourDigitInputProps> = ({
  digits,
  onDigitsChange,
  activeBox,
  onActiveBoxChange,
  onSubmit,
  disabled = false,
  isCorrect = null,
  problemId,
  size = 'normal',
}) => {
  const ref0 = useRef<HTMLInputElement | null>(null);
  const ref1 = useRef<HTMLInputElement | null>(null);
  const ref2 = useRef<HTMLInputElement | null>(null);
  const ref3 = useRef<HTMLInputElement | null>(null);
  const refs = [ref0, ref1, ref2, ref3];

  // Auto-focus current active box when activeBox changes or on problem change
  useEffect(() => {
    if (disabled) return;
    const target = refs[activeBox]?.current;
    if (target && document.activeElement !== target) {
      target.focus();
    }
  }, [activeBox, problemId, disabled]);

  const handleBoxChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      const next: FourDigits = [...digits];
      next[idx] = '';
      onDigitsChange(next);
      return;
    }

    // If multiple digits were pasted or typed fast (e.g. "1620" or "450")
    if (raw.length > 1) {
      const chars = raw.split('');
      const next: FourDigits = [...digits];
      if (chars.length === 4) {
        next[0] = chars[0];
        next[1] = chars[1];
        next[2] = chars[2];
        next[3] = chars[3];
        onDigitsChange(next);
        onActiveBoxChange(3);
        refs[3].current?.focus();
        return;
      } else if (chars.length === 3) {
        next[0] = '';
        next[1] = chars[0];
        next[2] = chars[1];
        next[3] = chars[2];
        onDigitsChange(next);
        onActiveBoxChange(3);
        refs[3].current?.focus();
        return;
      } else {
        next[idx] = chars[chars.length - 1];
        onDigitsChange(next);
        if (idx < 3) {
          onActiveBoxChange(idx + 1);
          refs[idx + 1].current?.focus();
        }
        return;
      }
    }

    const char = raw.slice(-1);
    const next: FourDigits = [...digits];
    next[idx] = char;
    onDigitsChange(next);

    // Natural keyboard advance:
    // When typing in box 0 -> 1 -> 2 -> 3
    if (char && idx < 3) {
      onActiveBoxChange(idx + 1);
      refs[idx + 1].current?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
      return;
    }

    if (e.key === 'Backspace') {
      if (!digits[idx] && idx > 0) {
        e.preventDefault();
        onActiveBoxChange(idx - 1);
        refs[idx - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      onActiveBoxChange(idx - 1);
      refs[idx - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && idx < 3) {
      e.preventDefault();
      onActiveBoxChange(idx + 1);
      refs[idx + 1].current?.focus();
    }
  };

  const placeholders = ['천', '백', '십', '일'];
  const labels = ['천', '백', '십', '일'];
  const boxHeight = size === 'compact' ? 'h-11 text-xl sm:text-2xl' : 'h-14 sm:h-16 text-2xl sm:text-3xl';

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {[0, 1, 2, 3].map((idx) => {
          const val = digits[idx];
          const isActive = activeBox === idx;

          return (
            <div key={idx} className="relative flex flex-col items-center">
              <input
                ref={refs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                disabled={disabled}
                value={val}
                onFocus={() => onActiveBoxChange(idx)}
                onClick={() => onActiveBoxChange(idx)}
                onChange={(e) => handleBoxChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                placeholder={placeholders[idx]}
                aria-label={`${labels[idx]}의 자리 정답 입력`}
                className={`w-full ${boxHeight} rounded-xl text-center font-mono font-extrabold tracking-wider transition-all outline-none cursor-text ${
                  isCorrect === true
                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-400'
                    : isCorrect === false
                    ? 'bg-rose-50 text-rose-600 border-2 border-rose-400 animate-shake'
                    : isActive
                    ? 'bg-white text-indigo-950 border-2 border-indigo-600 shadow-xs ring-3 ring-indigo-200'
                    : val
                    ? 'bg-indigo-50/70 text-indigo-950 border-2 border-indigo-400 shadow-2xs'
                    : 'bg-slate-50 text-slate-800 placeholder:text-slate-300 placeholder:font-sans placeholder:text-xs sm:placeholder:text-sm placeholder:font-normal border-2 border-dashed border-slate-300 hover:border-slate-400'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Re-export for compatibility
export const ThreeDigitInput = FourDigitInput;
