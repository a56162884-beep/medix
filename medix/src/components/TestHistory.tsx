import React, { useState, useMemo } from 'react';
import { History, Calendar, CheckCircle2, XCircle, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

export default function TestHistory() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('date_desc');

  const history = [
    { id: 1, title: 'Physics Mock Test 1', date: '2025-12-10', score: 85, total: 100, status: 'Passed' },
    { id: 2, title: 'Chemistry Chapter 4', date: '2025-12-12', score: 45, total: 100, status: 'Failed' },
    { id: 3, title: 'Full Syllabus Test', date: '2025-12-15', score: 92, total: 100, status: 'Passed' },
  ];

  const filteredHistory = useMemo(() => {
    return history
      .filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.date.includes(search)
      )
      .sort((a, b) => {
        switch (sort) {
          case 'score_desc':
            return b.score - a.score;
          case 'score_asc':
            return a.score - b.score;
          case 'date_asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'date_desc':
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [search, sort]);

  const sortOptions = [
    { value: 'date_desc', label: 'Date (Newest)' },
    { value: 'date_asc', label: 'Date (Oldest)' },
    { value: 'score_desc', label: 'Score (High-Low)' },
    { value: 'score_asc', label: 'Score (Low-High)' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-charcoal uppercase tracking-tight">Test History 📜</h1>
          <p className="text-slate-400 mt-1 text-xs md:text-sm font-medium italic">Review your past performance.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or date..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary/50 transition-all text-charcoal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10"
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

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-50">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'Passed' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                      {item.status === 'Passed' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-charcoal group-hover:text-primary transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        <Calendar size={10} />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>Score: {item.score}/{item.total}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 font-medium text-sm">
                No test history found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
