import React, { useState, useMemo } from 'react';
import { BookX, RefreshCcw, AlertTriangle, CheckCircle2, Filter, ArrowUpDown } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

export default function MistakeDiary() {
  const [filterSubject, setFilterSubject] = useState('');
  const [sort, setSort] = useState<string>('newest');

  const mistakes = [
    { id: 1, question: 'What is the unit of force?', correct: 'Newton', wrong: 'Joule', subject: 'Physics' },
    { id: 2, question: 'Chemical formula of water?', correct: 'H2O', wrong: 'HO2', subject: 'Chemistry' },
    { id: 3, question: 'Powerhouse of the cell?', correct: 'Mitochondria', wrong: 'Nucleus', subject: 'Biology' },
  ];

  const filteredMistakes = useMemo(() => {
    return mistakes
      .filter(m => !filterSubject || m.subject === filterSubject)
      .sort((a, b) => {
        switch (sort) {
          case 'subject_asc':
            return a.subject.localeCompare(b.subject);
          case 'subject_desc':
            return b.subject.localeCompare(a.subject);
          case 'oldest':
            return a.id - b.id;
          case 'newest':
          default:
            return b.id - a.id;
        }
      });
  }, [filterSubject, sort]);

  const uniqueSubjects = Array.from(new Set(mistakes.map(m => m.subject)));

  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    ...uniqueSubjects.map(s => ({ value: s, label: s }))
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'subject_asc', label: 'Subject (A-Z)' },
    { value: 'subject_desc', label: 'Subject (Z-A)' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-charcoal uppercase tracking-tight">Mistake Diary 📓</h1>
          <p className="text-slate-400 mt-1 text-xs md:text-sm font-medium italic">Learn from your errors and improve.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <CustomSelect
              value={filterSubject}
              onChange={setFilterSubject}
              options={subjectOptions}
              placeholder="Filter Subject"
              label="Subject"
              icon={<Filter size={16} />}
            />
          </div>
          <div className="w-full md:w-64">
            <CustomSelect
              value={sort}
              onChange={setSort}
              options={sortOptions}
              placeholder="Sort By"
              label="Sort Order"
              icon={<ArrowUpDown size={16} />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMistakes.length > 0 ? (
            filteredMistakes.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle size={64} className="text-rose-500" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Mistake</span>
                  <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{m.subject}</span>
                </div>
                <h3 className="text-sm font-bold text-charcoal mb-4 line-clamp-2">{m.question}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-rose-500">
                    <BookX size={14} />
                    <span>You answered: <span className="font-bold">{m.wrong}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                    <CheckCircle2 size={14} />
                    <span>Correct answer: <span className="font-bold">{m.correct}</span></span>
                  </div>
                </div>
                <button className="w-full py-2 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all flex items-center justify-center gap-2">
                  <RefreshCcw size={12} />
                  Re-attempt
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100">
              <p className="text-slate-400 font-medium text-sm">No mistakes found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
