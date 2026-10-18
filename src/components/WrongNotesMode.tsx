import React, { useState, useEffect } from 'react';
import { WrongAnswerRecord } from '../types/math';
import {
  getStoredWrongNotes,
  markWrongNoteResolved,
  removeWrongNote,
  clearAllWrongNotes,
} from '../utils/storage';
import { getMultiplicationBreakdown } from '../utils/mathGenerator';
import { sound } from '../utils/sound';
import { FourDigitInput, FourDigits, getDigitsNumericValue } from './ThreeDigitInput';
import {
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';

interface WrongNotesModeProps {
  onStartPractice: () => void;
}

export const WrongNotesMode: React.FC<WrongNotesModeProps> = ({ onStartPractice }) => {
  const [notes, setNotes] = useState<WrongAnswerRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [retryDigits, setRetryDigits] = useState<FourDigits>(['', '', '', '']);
  const [retryActiveBox, setRetryActiveBox] = useState<number>(0);
  const [retryError, setRetryError] = useState<boolean>(false);

  const loadNotes = () => {
    setNotes(getStoredWrongNotes());
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const filteredNotes = notes.filter((n) => {
    if (filter === 'unresolved') return !n.resolved;
    if (filter === 'resolved') return n.resolved;
    return true;
  });

  const handleToggleExpand = (id: string) => {
    sound.playClick();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStartRetry = (note: WrongAnswerRecord) => {
    sound.playClick();
    setRetryingId(note.id);
    setRetryDigits(['', '', '', '']);
    setRetryActiveBox(0);
    setRetryError(false);
  };

  const handleCancelRetry = () => {
    setRetryingId(null);
    setRetryDigits(['', '', '', '']);
    setRetryError(false);
  };

  const handleSubmitRetry = (note: WrongAnswerRecord) => {
    const val = getDigitsNumericValue(retryDigits);
    if (val === null) return;

    const targetAnswer = note.problem.answer ?? note.problem.sum;
    if (val === targetAnswer) {
      sound.playCorrect();
      markWrongNoteResolved(note.id);
      setRetryingId(null);
      setRetryDigits(['', '', '', '']);
      setRetryError(false);
      loadNotes();
    } else {
      sound.playWrong();
      setRetryError(true);
    }
  };

  const handleDelete = (id: string) => {
    sound.playClick();
    removeWrongNote(id);
    loadNotes();
  };

  const handleClearAll = () => {
    if (window.confirm('오답노트의 모든 기록을 삭제하시겠습니까?')) {
      clearAllWrongNotes();
      loadNotes();
    }
  };

  const unresolvedCount = notes.filter((n) => !n.resolved).length;
  const resolvedCount = notes.filter((n) => n.resolved).length;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>나만의 오답노트</span>
            {unresolvedCount > 0 ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                복습 필요 {unresolvedCount}문제
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                모든 오답 정복 완료!
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            자유 연습, 60초 도전, 10문제 승부에서 틀린 문제들이 자동으로 모여 단계별 복습을 돕습니다.
          </p>
        </div>

        {notes.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>오답노트 비우기</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 max-w-sm">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setFilter('unresolved');
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            filter === 'unresolved'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>복습 대기</span>
          <span className="text-[11px] font-bold opacity-80">({unresolvedCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setFilter('resolved');
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            filter === 'resolved'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>해결 완료</span>
          <span className="text-[11px] font-bold opacity-80">({resolvedCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setFilter('all');
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>전체</span>
          <span className="text-[11px] font-bold opacity-80">({notes.length})</span>
        </button>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 p-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {filter === 'unresolved' ? '복습할 오답이 없습니다!' : '등록된 기록이 없습니다.'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filter === 'unresolved'
              ? '모든 문제를 성공적으로 극복했습니다. 새로운 문제를 풀며 곱셈 실력을 키워보세요!'
              : '연습이나 승부를 진행하면 틀린 문제가 여기에 자동으로 기록됩니다.'}
          </p>
          <button
            type="button"
            onClick={onStartPractice}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>곱셈 연습하러 가기</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const isExpanded = expandedId === note.id;
            const isRetrying = retryingId === note.id;
            const targetAnswer = note.problem.answer ?? note.problem.sum;
            const breakdown = getMultiplicationBreakdown(note.problem.num1, note.problem.num2);
            const dateStr = new Date(note.timestamp).toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={note.id}
                className={`bg-white rounded-2xl border transition-all ${
                  note.resolved
                    ? 'border-slate-200/80 opacity-90'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Note Main Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Problem Formula & Meta */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                        note.resolved
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                    >
                      {note.resolved ? <Check className="w-5 h-5 stroke-[2.5]" /> : '!'}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                          {note.problem.num1} × {note.problem.num2}
                        </span>
                        <span className="text-slate-400 font-mono text-xl">=</span>
                        <span className="font-mono text-2xl font-black text-emerald-600">
                          {targetAnswer}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>내 오답:</span>
                        <span className="font-mono font-bold text-rose-600 line-through">
                          {note.userAnswer}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{dateStr}</span>
                        {note.resolved && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 font-bold">극복 완료</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(note.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isExpanded ? '풀이 접기' : '단계별 풀이'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {!note.resolved && !isRetrying && (
                      <button
                        type="button"
                        onClick={() => handleStartRetry(note)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>다시 풀기</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Re-solve Input Box */}
                {isRetrying && (
                  <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-indigo-600" />
                        <span>다시 풀어 정답을 맞혀보세요:</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelRetry}
                        className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        취소
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="font-mono text-xl font-bold text-slate-800 shrink-0">
                        {note.problem.num1} × {note.problem.num2} =
                      </div>
                      <div className="w-60">
                        <FourDigitInput
                          digits={retryDigits}
                          onDigitsChange={(d) => {
                            setRetryDigits(d);
                            setRetryError(false);
                          }}
                          activeBox={retryActiveBox}
                          onActiveBoxChange={setRetryActiveBox}
                          onSubmit={() => handleSubmitRetry(note)}
                          problemId={note.id}
                          size="compact"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSubmitRetry(note)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        정답 제출
                      </button>
                    </div>

                    {retryError && (
                      <p className="text-xs text-rose-600 font-bold mt-2">
                        정답이 아닙니다. 아래 단계별 풀이를 참고하여 다시 계산해보세요!
                      </p>
                    )}
                  </div>
                )}

                {/* Expanded Step-by-Step Explanation */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/70 rounded-b-2xl text-xs space-y-2.5 text-slate-700">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <span>{note.problem.num1} × {note.problem.num2} 단계별 곱셈 원리</span>
                    </div>

                    {/* Step 1: Ones place */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-0.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          1
                        </span>
                        <span>1단계: 일의 자리 곱 ({note.problem.num1} × {breakdown.onesDigit2})</span>
                      </div>
                      <p className="text-slate-600">
                        {note.problem.num1}에 {note.problem.num2}의 일의 자리 수 {breakdown.onesDigit2}를 곱하면{' '}
                        <strong className="text-indigo-600 font-mono font-bold">{breakdown.step1Product}</strong>입니다.
                      </p>
                    </div>

                    {/* Step 2: Tens place */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-0.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          2
                        </span>
                        <span>2단계: 십의 자리 곱 ({note.problem.num1} × {breakdown.tensDigit2 * 10})</span>
                      </div>
                      <p className="text-slate-600">
                        {note.problem.num1}에 {note.problem.num2}의 십의 자리 수 {breakdown.tensDigit2}(실제 10단위 {breakdown.tensDigit2 * 10})를 곱하면{' '}
                        <strong className="text-indigo-600 font-mono font-bold">{breakdown.step2Value}</strong>입니다.
                      </p>
                    </div>

                    {/* Step 3: Sum */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-0.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          3
                        </span>
                        <span>3단계: 두 부분곱 더하기</span>
                      </div>
                      <p className="text-slate-600">
                        {breakdown.step1Product} + {breakdown.step2Value} ={' '}
                        <strong className="text-emerald-600 font-mono font-bold">{breakdown.finalProduct}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
