import React, { useState, useMemo } from 'react';
import { MessageSquare, Send, Search, ArrowUpDown } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

export default function AskDoubts() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('newest');

  const doubtHistory = [
    { id: 1, question: 'Explain the concept of torque', answer: 'Torque is the rotational equivalent of linear force...', date: '2025-12-15', subject: 'Physics' },
    { id: 2, question: 'What is mitochondria?', answer: 'Mitochondria is the powerhouse of the cell...', date: '2025-12-14', subject: 'Biology' },
    { id: 3, question: 'Integration of sin(x)', answer: '-cos(x) + C', date: '2025-12-10', subject: 'Math' },
  ];

  const filteredHistory = useMemo(() => {
    return doubtHistory
      .filter(d => 
        d.question.toLowerCase().includes(search.toLowerCase()) || 
        d.subject.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sort === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [search, sort]);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-charcoal uppercase tracking-tight">Ask Doubts 💬</h1>
          <p className="text-slate-400 mt-1 text-xs md:text-sm font-medium italic">Get instant answers from our AI assistant.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'new' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            New Doubt
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-6 pr-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-primary shrink-0">
                <MessageSquare size={20} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                <p className="text-sm text-charcoal font-medium">Hello! I'm your AI study buddy. How can I help you today?</p>
              </div>
            </div>
            {/* Example User Message */}
            <div className="flex items-start gap-4 flex-row-reverse">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
                <span className="font-black text-[10px]">ME</span>
              </div>
              <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                <p className="text-sm text-primary font-medium">Can you explain the concept of torque?</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
            <input 
              type="text" 
              placeholder="Type your doubt here..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all text-charcoal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10"
            />
            <button className="p-3 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search doubts..." 
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

          <div className="grid grid-cols-1 gap-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((d) => (
                <div key={d.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-indigo-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">{d.subject}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{d.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">{d.question}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{d.answer}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-slate-400 font-medium text-sm">No doubts found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
