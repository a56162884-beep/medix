import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ChevronRight, FolderPlus, Folder, Filter, ArrowUpDown, Tag } from 'lucide-react';
import { Question } from '../types';
import { neetSyllabus } from '../data/neetSyllabus';
import CustomSelect from './ui/CustomSelect';

interface QuestionBankProps {
  questions: Question[];
}

type SortOption = 'newest' | 'oldest' | 'difficulty_asc' | 'difficulty_desc';

export default function QuestionBank({ questions }: QuestionBankProps) {
  const [folders, setFolders] = useState(['Physics Mechanics', 'Organic Chemistry Basics', 'Biology High Yield']);
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    chapter: '',
    topic: '',
    difficulty: ''
  });
  const [sort, setSort] = useState<string>('newest');
  
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Get chapters based on selected subject
  const availableChapters = useMemo(() => {
    if (!filters.subject) return [];
    return Object.keys(neetSyllabus[filters.subject as keyof typeof neetSyllabus] || {});
  }, [filters.subject]);

  // Get topics based on selected chapter
  const availableTopics = useMemo(() => {
    if (!filters.subject || !filters.chapter) return [];
    // @ts-ignore - we know the structure is correct based on the check above
    return neetSyllabus[filters.subject][filters.chapter] || [];
  }, [filters.subject, filters.chapter]);

  const filteredQuestions = useMemo(() => {
    let result = questions.filter(q => {
      const searchLower = search.toLowerCase();
      const matchesSearch = q.text.toLowerCase().includes(searchLower) || 
                            (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchLower)));
      const matchesSubject = !filters.subject || q.subject === filters.subject;
      const matchesDifficulty = !filters.difficulty || q.difficulty === filters.difficulty;
      const matchesChapter = !filters.chapter || q.chapter === filters.chapter;
      const matchesTopic = !filters.topic || q.topic === filters.topic;
      
      return matchesSearch && matchesSubject && matchesDifficulty && matchesChapter && matchesTopic;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case 'difficulty_asc':
          const diffOrderAsc = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return (diffOrderAsc[a.difficulty as keyof typeof diffOrderAsc] || 0) - (diffOrderAsc[b.difficulty as keyof typeof diffOrderAsc] || 0);
        case 'difficulty_desc':
          const diffOrderDesc = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return (diffOrderDesc[b.difficulty as keyof typeof diffOrderDesc] || 0) - (diffOrderDesc[a.difficulty as keyof typeof diffOrderDesc] || 0);
        case 'oldest':
          return parseInt(a.id.toString()) - parseInt(b.id.toString());
        case 'newest':
        default:
          return parseInt(b.id.toString()) - parseInt(a.id.toString());
      }
    });
  }, [questions, search, filters, sort]);

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) setFolders([...folders, name]);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'difficulty_asc', label: 'Difficulty (Low-High)' },
    { value: 'difficulty_desc', label: 'Difficulty (High-Low)' },
  ];

  const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ];

  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    ...Object.keys(neetSyllabus).map(s => ({ value: s, label: s }))
  ];

  const chapterOptions = [
    { value: '', label: 'All Chapters' },
    ...availableChapters.map(c => ({ value: c, label: c }))
  ];

  const topicOptions = [
    { value: '', label: 'All Topics' },
    ...availableTopics.map(t => ({ value: t, label: t }))
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-charcoal uppercase tracking-tight">Question Bank 📚</h1>
          <p className="text-slate-400 mt-1 text-xs md:text-sm font-medium">Manage and practice questions.</p>
        </div>
      </div>

      {/* Folders Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Create Folder Tile */}
        <button 
          onClick={handleCreateFolder}
          className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-indigo-50/30 transition-all group min-h-[10rem]"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <FolderPlus size={24} />
          </div>
          <span className="text-xs font-black text-charcoal uppercase tracking-widest">Create Folder</span>
        </button>

        {/* All Folders Tile */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col min-h-[10rem]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest">All Folders</h3>
            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-[10px] font-bold">{folders.length} Folders</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 items-center flex-1">
            {folders.length > 0 ? (
              folders.map((folder, idx) => (
                <button 
                  key={idx}
                  className="min-w-[140px] md:min-w-[160px] bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md hover:bg-white transition-all group"
                >
                  <Folder size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-charcoal uppercase tracking-wide text-center line-clamp-1 w-full">{folder}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-medium italic w-full text-center">No folders created yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Questions List Section */}
      <div className="space-y-6">
        {/* Filters & Search */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative z-20">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search questions or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary/50 transition-all text-charcoal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                className={`p-3 rounded-xl border transition-all flex items-center justify-center ${showSort ? 'bg-indigo-50 border-primary text-primary' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                title="Sort"
              >
                <ArrowUpDown size={18} />
              </button>

              {showSort && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Sort Options</h3>
                  <CustomSelect
                    value={sort}
                    onChange={setSort}
                    options={sortOptions}
                    placeholder="Sort By"
                    icon={<ArrowUpDown size={16} />}
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                className={`p-3 rounded-xl border transition-all flex items-center justify-center ${showFilters ? 'bg-indigo-50 border-primary text-primary' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                title="Filter"
              >
                <Filter size={18} />
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-3 w-[280px] sm:w-[400px] md:w-[500px] bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter Questions</h3>
                    <button 
                      onClick={() => setFilters({ subject: '', chapter: '', topic: '', difficulty: '' })}
                      className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                      value={filters.subject}
                      onChange={(val) => setFilters(prev => ({ ...prev, subject: val, chapter: '', topic: '' }))}
                      options={subjectOptions}
                      placeholder="Subject"
                      label="Subject"
                    />

                    <CustomSelect
                      value={filters.chapter}
                      onChange={(val) => setFilters(prev => ({ ...prev, chapter: val, topic: '' }))}
                      options={chapterOptions}
                      placeholder="Chapter"
                      label="Chapter"
                      disabled={!filters.subject}
                    />

                    <CustomSelect
                      value={filters.topic}
                      onChange={(val) => setFilters(prev => ({ ...prev, topic: val }))}
                      options={topicOptions}
                      placeholder="Topic"
                      label="Topic"
                      disabled={!filters.chapter}
                    />

                    <CustomSelect
                      value={filters.difficulty}
                      onChange={(val) => setFilters(prev => ({ ...prev, difficulty: val }))}
                      options={difficultyOptions}
                      placeholder="Difficulty"
                      label="Difficulty"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black text-charcoal uppercase tracking-tight">All Questions</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{filteredQuestions.length} Questions</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{q.subject}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                      q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>{q.difficulty}</span>
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{q.chapter}</span>
                    {q.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-slate-300 group-hover:text-primary transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <h3 className="text-sm md:text-base font-bold text-charcoal mb-4 line-clamp-2 leading-relaxed">{q.text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, i) => (
                    <div key={i} className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 truncate border border-transparent group-hover:border-slate-100 transition-colors">
                      <span className="font-black mr-3 text-slate-400">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-bold text-sm">No questions found matching your filters.</p>
              <button 
                onClick={() => {setFilters({ subject: '', chapter: '', topic: '', difficulty: '' }); setSearch('');}}
                className="mt-4 text-primary text-xs font-black uppercase tracking-widest hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
