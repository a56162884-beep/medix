import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  Send,
  Loader2,
  Calculator,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, TestAssignment, Question } from '../types';

interface TestEngineProps {
  test: TestAssignment;
  user: User;
  onComplete: () => void;
}

export default function TestEngine({ test, user, onComplete }: TestEngineProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(allQuestions => {
        const testQuestions = allQuestions.filter((q: Question) => test.questions.includes(q.id));
        setQuestions(testQuestions);
      });

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const toggleReview = (idx: number) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: test.id,
          student_id: user.id,
          score,
          total_questions: questions.length,
          correct_count: correctCount,
          answers
        })
      });
      onComplete();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Preparing your test...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 md:h-20 border-b border-slate-100 bg-white px-4 md:px-10 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <div className="hidden sm:block">
            <h2 className="font-black text-slate-900 text-sm md:text-lg leading-tight truncate max-w-[150px] md:max-w-xs">{test.title}</h2>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">{test.questions.length} Qs • {test.duration} Mins</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <div className={cn(
            "flex items-center gap-2 md:gap-4 px-3 md:px-6 py-1.5 md:py-2.5 rounded-xl md:rounded-2xl border-2 transition-all",
            timeLeft < 300 ? "bg-rose-50 border-rose-100 text-rose-600 animate-pulse" : "bg-slate-50 border-slate-100 text-slate-900"
          )}>
            <Clock className="size-4 md:size-5" />
            <span className="font-mono font-black text-sm md:text-xl">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={() => setShowConfirm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm transition-all flex items-center gap-2 md:gap-3 shadow-xl shadow-emerald-500/20 uppercase tracking-widest"
          >
            Submit
            <Send size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {/* Subject Switcher (Inspired by Allen) */}
            <div className="flex items-center gap-2 mb-8 md:mb-12 overflow-x-auto pb-2 no-scrollbar">
              {['Physics', 'Chemistry', 'Biology'].map(sub => (
                <button 
                  key={sub}
                  className={cn(
                    "px-4 md:px-6 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border-2 shrink-0",
                    currentQ.subject === sub 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6 md:mb-10">
              <div className="flex items-center gap-3">
                <span className="text-primary font-black uppercase tracking-widest text-[10px]">Q {currentIndex + 1} / {questions.length}</span>
                <div className="h-1 w-16 md:w-24 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-100 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentQ.difficulty}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 mb-8">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-8 md:mb-12 leading-relaxed">
                {currentQ.text}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {currentQ.options.map((opt, idx) => {
                  const label = String.fromCharCode(65 + idx);
                  const isSelected = answers[currentQ.id] === label;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(currentQ.id, label)}
                      className={cn(
                        "w-full text-left p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all flex items-center gap-4 md:gap-6 group",
                        isSelected 
                          ? "bg-indigo-50 border-primary text-slate-900" 
                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-black transition-all text-base md:text-lg shrink-0",
                        isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                      )}>
                        {label}
                      </div>
                      <span className="text-base md:text-lg font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Palette */}
        <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-100 bg-white flex flex-col shadow-2xl relative z-10 h-auto md:h-full">
          <div className="p-5 md:p-8 border-b border-slate-50">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Question Palette</h4>
              <div className="flex items-center gap-2">
                <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Calculator">
                  <Calculator size={14} />
                </button>
                <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Notepad">
                  <FileText size={14} />
                </button>
              </div>
            </div>
            <div className="flex md:grid md:grid-cols-5 gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar">
              {questions.map((_, idx) => {
                const qId = questions[idx].id;
                const isAnswered = !!answers[qId];
                const isReview = markedForReview.has(idx);
                const isCurrent = currentIndex === idx;

                return (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "min-w-[40px] md:min-w-0 w-10 md:w-full aspect-square rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm font-black transition-all border-2 shrink-0",
                      isCurrent ? "border-primary scale-105 md:scale-110 z-10 shadow-lg shadow-primary/10" : "border-transparent",
                      isReview 
                        ? "bg-purple-500 text-white" 
                        : isAnswered 
                          ? "bg-emerald-500 text-white" 
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block p-8 flex-1 overflow-y-auto custom-scrollbar">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6">Legend</h4>
            <div className="space-y-4">
              <LegendItem color="bg-emerald-500" label="Answered" />
              <LegendItem color="bg-purple-500" label="Marked for Review" />
              <LegendItem color="bg-slate-50" label="Not Answered" />
            </div>
          </div>

          <div className="p-5 md:p-8 border-t border-slate-50 space-y-3 md:space-y-4">
            <button 
              onClick={() => toggleReview(currentIndex)}
              className={cn(
                "w-full py-3 md:py-4 rounded-xl md:rounded-2xl border-2 font-black text-xs md:text-sm flex items-center justify-center gap-2 md:gap-3 transition-all",
                markedForReview.has(currentIndex) 
                  ? "bg-purple-50 border-purple-100 text-purple-600" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <Flag size={16} />
              {markedForReview.has(currentIndex) ? 'Unmark Review' : 'Mark for Review'}
            </button>
            <div className="flex gap-3 md:gap-4">
              <button 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs md:text-sm disabled:opacity-30 transition-all"
              >
                Previous
              </button>
              <button 
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xs md:text-sm disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
              >
                Next
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-2xl text-center"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mb-8 mx-auto">
                <AlertCircle className="text-primary" size={48} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Submit Test?</h3>
              <p className="text-slate-500 font-medium text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                You have answered <span className="text-primary font-black">{Object.keys(answers).length}</span> out of <span className="text-slate-900 font-black">{questions.length}</span> questions. Are you sure you want to finish?
              </p>
              <div className="flex flex-col gap-3 md:gap-4">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg md:text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Yes, Submit Now'}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 font-black text-base md:text-lg transition-all"
                >
                  No, Keep Working
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
      <div className={cn("w-6 h-6 rounded-lg", color)} />
      <span>{label}</span>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
