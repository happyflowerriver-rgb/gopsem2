import React, { useState } from 'react';
import { MathProblem, StepExplanation } from '../types/math';
import { getMultiplicationBreakdown } from '../utils/mathGenerator';
import { FourDigitInput, FourDigits } from './ThreeDigitInput';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

interface ProblemCardProps {
  problem: MathProblem;
  digits: FourDigits;
  onDigitsChange: (digits: FourDigits) => void;
  activeBox: number;
  onActiveBoxChange: (box: number) => void;
  isCorrect?: boolean | null;
  layout?: 'vertical' | 'horizontal';
  showCarryGuide?: boolean;
  onSubmit?: () => void;
  showStepByStep?: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  digits,
  onDigitsChange,
  activeBox,
  onActiveBoxChange,
  isCorrect = null,
  layout = 'vertical',
  showCarryGuide = false,
  showStepByStep = false,
  onSubmit,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const breakdown: StepExplanation = getMultiplicationBreakdown(problem.num1, problem.num2);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
      {/* Problem Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-indigo-600 font-semibold">두 자리 수 곱셈</span>
          <span aria-hidden="true">·</span>
          <span className={problem.answer >= 1000 ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
            {problem.answer >= 1000 ? '네 자리 수 결과' : '세 자리 수 결과'}
          </span>
        </div>

        {problem.hintTip && (
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>암산 비법</span>
          </div>
        )}
      </div>

      {/* Main Calculation Display */}
      {layout === 'vertical' ? (
        <div className="flex flex-col items-center py-2">
          {/* Column labels (천, 백, 십, 일) aligned with 4 columns */}
          <div className="w-64 grid grid-cols-4 text-center text-xs font-semibold text-slate-400 mb-1 select-none">
            <span className={problem.answer >= 1000 ? 'text-amber-500 font-bold' : 'text-slate-300'}>
              천
            </span>
            <span className="text-slate-500">백</span>
            <span className="text-slate-500">십</span>
            <span className="text-slate-500">일</span>
          </div>

          {/* Vertical numbers container */}
          <div className="w-64 font-mono text-4xl sm:text-5xl font-bold text-slate-800 tracking-wider">
            {/* First row: num1 */}
            <div className="grid grid-cols-4 text-right py-1 select-none">
              <span className="text-center font-normal text-slate-300"></span>
              <span className="text-center font-normal text-slate-300"></span>
              <span className="pr-1">{Math.floor(problem.num1 / 10)}</span>
              <span className="pr-2">{problem.num1 % 10}</span>
            </div>

            {/* Second row with × sign: num2 */}
            <div className="grid grid-cols-4 text-right py-1 relative select-none">
              <span className="text-center font-extrabold text-indigo-600 text-3xl sm:text-4xl flex items-center justify-center">
                ×
              </span>
              <span className="text-center font-normal text-slate-300"></span>
              <span className="pr-1">{Math.floor(problem.num2 / 10)}</span>
              <span className="pr-2">{problem.num2 % 10}</span>
            </div>

            {/* Multiplication horizontal divider line */}
            <div className="w-full border-b-4 border-slate-800 my-2 rounded-full"></div>

            {/* Intermediate carry/step helper row if enabled */}
            {showCarryGuide && (
              <div className="my-2 p-2 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs font-sans text-indigo-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600">① {problem.num1} × {breakdown.onesDigit2} (일의 자리 곱)</span>
                  <span className="font-mono font-bold text-slate-800">{breakdown.step1Product}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600">② {problem.num1} × {breakdown.tensDigit2 * 10} (십의 자리 곱)</span>
                  <span className="font-mono font-bold text-slate-800">{breakdown.step2Value}</span>
                </div>
              </div>
            )}

            {/* Direct Input Field - Four Digit Boxes (천, 백, 십, 일) */}
            <div className="py-1">
              <FourDigitInput
                digits={digits}
                onDigitsChange={onDigitsChange}
                activeBox={activeBox}
                onActiveBoxChange={onActiveBoxChange}
                onSubmit={() => onSubmit?.()}
                disabled={isCorrect === true}
                isCorrect={isCorrect}
                problemId={problem.id}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-[11px] text-slate-400 font-sans font-normal">
                각 자릿수 칸(천·백·십·일)을 클릭하거나 키보드로 숫자 입력
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Horizontal layout */
        <div className="flex flex-col items-center justify-center py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono text-3xl sm:text-5xl font-bold text-slate-800">
            <div className="flex items-center gap-3">
              <span className="select-none">{problem.num1}</span>
              <span className="text-indigo-600 font-extrabold select-none">×</span>
              <span className="select-none">{problem.num2}</span>
              <span className="text-slate-400 select-none">=</span>
            </div>

            {/* Four Digit Boxes */}
            <div className="w-60 sm:w-64">
              <FourDigitInput
                digits={digits}
                onDigitsChange={onDigitsChange}
                activeBox={activeBox}
                onActiveBoxChange={onActiveBoxChange}
                onSubmit={() => onSubmit?.()}
                disabled={isCorrect === true}
                isCorrect={isCorrect}
                problemId={problem.id}
              />
            </div>
          </div>

          {/* Intermediate carry/step helper row if enabled */}
          {showCarryGuide && (
            <div className="mt-4 p-2.5 w-full max-w-sm bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs font-sans text-indigo-950 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600">① {problem.num1} × {breakdown.onesDigit2}</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.step1Product}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600">② {problem.num1} × {breakdown.tensDigit2 * 10}</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.step2Value}</span>
              </div>
            </div>
          )}

          <div className="text-center mt-2">
            <span className="text-[11px] text-slate-400 font-sans font-normal">
              각 자릿수 칸(천·백·십·일)을 클릭하거나 키보드로 숫자 입력
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {onSubmit && isCorrect !== true && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onSubmit}
            className="w-full sm:w-64 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>정답 확인</span>
            <span className="text-[11px] bg-indigo-500/60 px-1.5 py-0.5 rounded font-mono font-normal">
              Enter ↵
            </span>
          </button>
        </div>
      )}

      {/* Mental trick banner if available */}
      {problem.hintTip && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold flex items-center gap-1.5 mb-0.5 text-amber-950">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            빠른 곱셈 비법:
          </p>
          <p>{problem.hintTip}</p>
        </div>
      )}

      {/* Step-by-step collapse trigger if allowed or on wrong answer */}
      {showStepByStep && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              단계별 두 자리 수 곱셈 풀이 보기
            </span>
            {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showExplanation && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2.5 text-slate-700 animate-fadeIn">
              {/* Step 1: Ones place multiplication */}
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    1단계: 일의 자리 곱 ({problem.num1} × {breakdown.onesDigit2})
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {problem.num1}에 {problem.num2}의 일의 자리 수 <strong className="text-indigo-600">{breakdown.onesDigit2}</strong>를 곱합니다 ={' '}
                    <strong className="text-indigo-600 font-bold">{breakdown.step1Product}</strong>
                  </p>
                </div>
              </div>

              {/* Step 2: Tens place multiplication */}
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    2단계: 십의 자리 곱 ({problem.num1} × {breakdown.tensDigit2 * 10})
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {problem.num1}에 {problem.num2}의 십의 자리 수 <strong className="text-indigo-600">{breakdown.tensDigit2}</strong>(실제 값 {breakdown.tensDigit2 * 10})를 곱합니다 ={' '}
                    <strong className="text-indigo-600 font-bold">{breakdown.step2Value}</strong>
                  </p>
                </div>
              </div>

              {/* Step 3: Add partial products */}
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    3단계: 두 부분곱 더하기
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {breakdown.step1Product} + {breakdown.step2Value} ={' '}
                    <strong className="text-emerald-600 font-mono font-bold text-sm">{breakdown.finalProduct}</strong>
                  </p>
                </div>
              </div>

              {/* Final answer */}
              <div className="pt-1.5 flex items-center justify-end gap-1.5 font-bold text-slate-900 text-sm">
                <span>최종 정답:</span>
                <span className="text-indigo-600 font-mono text-base">{breakdown.finalProduct}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
