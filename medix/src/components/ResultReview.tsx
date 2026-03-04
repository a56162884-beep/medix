import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  BrainCircuit,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Result, Question } from '../types';

interface ResultReviewProps {
  result: Result;
  questions: Question[];
  onClose: () => void;
}

export default function ResultReview({ result, questions, onClose }: ResultReviewProps) {
  return (
    <div className="fixed inset-0 bg-slate-50 z-[120] flex flex-col font-sans">
      <header className="h-16 md:h-20 border-b border-slate-100 bg-white px-4 md:px-10 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 rounded-xl md:rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-black text-slate-900 text-sm md:text-lg leading-tight truncate max-w-[150px] md:max-w-xs">Review: {result.title}</h2>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Detailed Analysis & Solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-10">
          <div className="text-right">
            <p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Score</p>
            <p className={cn(
              "text-base md:text-2xl font-black",
              result.score >= 70 ? "text-emerald-500" : result.score >= 40 ? "text-amber-500" : "text-rose-500"
            )}>{result.score}%</p>
          </div>
          <div className="h-8 md:h-10 w-px bg-slate-100" />
          <div className="text-right">
            <p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Correct</p>
            <p className="text-base md:text-2xl font-black text-slate-900">{result.correct_count}/{result.total_questions}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-10 pb-24 md:pb-0">
            {/* Subject Analysis (Inspired by Allen) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Subject Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Physics</p>
                  <p className="text-sm font-black text-indigo-600">85%</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Chemistry</p>
                  <p className="text-sm font-black text-emerald-600">92%</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl">
                  <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Biology</p>
                  <p className="text-sm font-black text-rose-600">45%</p>
                </div>
              </div>
            </div>

            {questions.map((q, idx) => {
              const userAnswer = result.answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;

              return (
                <div key={q.id} id={`q-${idx}`} className="bg-white border border-slate-100 rounded-2xl md:rounded-[32px] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8 scroll-mt-24">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-black uppercase tracking-widest text-[10px] md:text-xs">Question {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physics • Single Choice</span>
                      {isCorrect ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-[8px] md:text-xs font-black uppercase tracking-widest bg-emerald-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full">
                          <CheckCircle2 size={14} />
                          Correct
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-600 text-[8px] md:text-xs font-black uppercase tracking-widest bg-rose-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full">
                          <XCircle size={14} />
                          Incorrect
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </h3>

                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {q.options.map((opt, optIdx) => {
                      const label = String.fromCharCode(65 + optIdx);
                      const isUserChoice = userAnswer === label;
                      const isCorrectChoice = q.correct_answer === label;

                      return (
                        <div 
                          key={optIdx}
                          className={cn(
                            "p-4 md:p-6 rounded-xl md:rounded-2xl border-2 flex items-center gap-4 md:gap-6 transition-all",
                            isCorrectChoice 
                              ? "bg-emerald-50 border-emerald-200 text-slate-900" 
                              : isUserChoice && !isCorrect
                                ? "bg-rose-50 border-rose-200 text-slate-900"
                                : "bg-white border-slate-50 text-slate-400"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black transition-all text-sm md:text-base shrink-0",
                            isCorrectChoice 
                              ? "bg-emerald-500 text-white" 
                              : isUserChoice && !isCorrect
                                ? "bg-rose-500 text-white"
                                : "bg-slate-100 text-slate-400"
                          )}>
                            {label}
                          </div>
                          <span className="text-sm md:text-base font-medium">{opt}</span>
                          {isCorrectChoice && <CheckCircle2 className="ml-auto text-emerald-500" size={20} />}
                          {isUserChoice && !isCorrect && <XCircle className="ml-auto text-rose-500" size={20} />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-6 md:mt-8 p-5 md:p-8 bg-blue-50 border border-blue-100 rounded-2xl md:rounded-3xl">
                      <div className="flex items-center gap-2 md:gap-3 text-primary font-black text-[10px] md:text-xs uppercase tracking-widest mb-3 md:mb-4">
                        <BrainCircuit className="size-4 md:size-5" />
                        Solution & Explanation
                      </div>
                      <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Navigation Sidebar (Desktop) */}
        <aside className="hidden md:block w-80 bg-white border-l border-slate-100 p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const userAnswer = result.answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <a 
                  key={q.id}
                  href={`#q-${idx}`}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black transition-all border",
                    isCorrect 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                      : userAnswer 
                        ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100"
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {idx + 1}
                </a>
              );
            })}
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Legend</h3>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correct</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Incorrect</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Not Answered</span>
            </div>
          </div>
        </aside>

        {/* Mobile Question Navigation (Bottom Bar) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex items-center gap-2 overflow-x-auto custom-scrollbar z-50">
          {questions.map((q, idx) => {
            const userAnswer = result.answers[q.id];
            const isCorrect = userAnswer === q.correct_answer;
            return (
              <a 
                key={q.id}
                href={`#q-${idx}`}
                className={cn(
                  "min-w-[40px] h-10 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border",
                  isCorrect 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : userAnswer 
                      ? "bg-rose-50 border-rose-100 text-rose-600"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                )}
              >
                {idx + 1}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
