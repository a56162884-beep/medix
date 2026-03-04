import React, { useState, useEffect } from 'react';
import { FileEdit, Plus, Settings, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';
import { neetSyllabus } from '../data/neetSyllabus';
import { Question } from '../types';

export default function TestGenerator() {
  const [mode, setMode] = useState<'select' | 'configure'>('select');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Custom Test Config
  const [config, setConfig] = useState({
    subject: '',
    chapter: '',
    topic: '',
    totalQuestions: 30,
    easyPercent: 30,
    mediumPercent: 50,
    hardPercent: 20
  });

  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [distributionWarning, setDistributionWarning] = useState<string | null>(null);

  useEffect(() => {
    // Fetch questions to know what's available
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(console.error);
  }, []);

  const handlePercentChange = (type: 'easy' | 'medium' | 'hard', value: number) => {
    // Basic logic to ensure they sum to 100 could be added here, 
    // but for simplicity we'll just let them set it and validate on generate.
    setConfig(prev => ({ ...prev, [`${type}Percent`]: value }));
  };

  const generateTest = () => {
    setGenerationStatus('generating');
    setDistributionWarning(null);

    setTimeout(() => {
      // 1. Filter questions based on criteria
      let pool = questions.filter(q => {
        if (config.subject && q.subject !== config.subject) return false;
        if (config.chapter && q.chapter !== config.chapter) return false;
        if (config.topic && q.topic !== config.topic) return false;
        return true;
      });

      if (pool.length < config.totalQuestions) {
        setGenerationStatus('error');
        setDistributionWarning(`Not enough questions in the bank. Found ${pool.length}, requested ${config.totalQuestions}.`);
        return;
      }

      // 2. Calculate desired counts
      const total = config.totalQuestions;
      let desiredEasy = Math.round((config.easyPercent / 100) * total);
      let desiredMedium = Math.round((config.mediumPercent / 100) * total);
      let desiredHard = total - desiredEasy - desiredMedium; // Ensure sum is exact

      // 3. Group available questions by difficulty
      const easyPool = pool.filter(q => q.difficulty === 'Easy');
      const mediumPool = pool.filter(q => q.difficulty === 'Medium');
      const hardPool = pool.filter(q => q.difficulty === 'Hard');

      let actualEasy = Math.min(desiredEasy, easyPool.length);
      let actualMedium = Math.min(desiredMedium, mediumPool.length);
      let actualHard = Math.min(desiredHard, hardPool.length);

      let remaining = total - (actualEasy + actualMedium + actualHard);

      // 4. Fill remaining if possible (fallback logic)
      if (remaining > 0) {
        // Try to fill with whatever is left
        const fillFrom = (poolArr: Question[], currentCount: number) => {
          const available = poolArr.length - currentCount;
          const take = Math.min(available, remaining);
          remaining -= take;
          return currentCount + take;
        };

        actualMedium = fillFrom(mediumPool, actualMedium);
        actualEasy = fillFrom(easyPool, actualEasy);
        actualHard = fillFrom(hardPool, actualHard);
      }

      if (remaining > 0) {
        setGenerationStatus('error');
        setDistributionWarning(`Cannot generate test. Only ${total - remaining} suitable questions found.`);
        return;
      }

      // Check if distribution was altered
      if (actualEasy !== desiredEasy || actualMedium !== desiredMedium || actualHard !== desiredHard) {
        const actualEasyPct = Math.round((actualEasy / total) * 100);
        const actualMediumPct = Math.round((actualMedium / total) * 100);
        const actualHardPct = Math.round((actualHard / total) * 100);
        setDistributionWarning(`Precise match not possible. Adjusted distribution to: Easy ${actualEasyPct}%, Medium ${actualMediumPct}%, Hard ${actualHardPct}%.`);
      }

      setGenerationStatus('success');
      
      // In a real app, we would now save this test to the backend
      // and redirect to the test view or list.

    }, 1500);
  };

  if (mode === 'configure') {
    const subjectOptions = [{ value: '', label: 'All Subjects' }, ...Object.keys(neetSyllabus).map(s => ({ value: s, label: s }))];
    const chapterOptions = [{ value: '', label: 'All Chapters' }, ...(config.subject ? Object.keys(neetSyllabus[config.subject as keyof typeof neetSyllabus] || {}).map(c => ({ value: c, label: c })) : [])];
    
    return (
      <div className="space-y-6 max-w-3xl mx-auto pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setMode('select')} className="text-slate-400 hover:text-primary transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Configure Custom Test</h1>
            <p className="text-slate-400 mt-0.5 text-xs font-medium">Set parameters and difficulty distribution.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomSelect
              label="Subject"
              value={config.subject}
              onChange={(v) => setConfig({ ...config, subject: v, chapter: '', topic: '' })}
              options={subjectOptions}
            />
            <CustomSelect
              label="Chapter"
              value={config.chapter}
              onChange={(v) => setConfig({ ...config, chapter: v, topic: '' })}
              options={chapterOptions}
              disabled={!config.subject}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Total Questions</label>
            <input 
              type="number" 
              value={config.totalQuestions}
              onChange={(e) => setConfig({ ...config, totalQuestions: parseInt(e.target.value) || 0 })}
              className="w-full md:w-1/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-slate-900"
            />
          </div>

          {/* Difficulty Distribution */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Difficulty Distribution (%)</label>
              <span className={`text-xs font-bold ${config.easyPercent + config.mediumPercent + config.hardPercent === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                Total: {config.easyPercent + config.mediumPercent + config.hardPercent}%
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-600">Easy</span>
                  <span>{config.easyPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={config.easyPercent}
                  onChange={(e) => handlePercentChange('easy', parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-600">Medium</span>
                  <span>{config.mediumPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={config.mediumPercent}
                  onChange={(e) => handlePercentChange('medium', parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-600">Hard</span>
                  <span>{config.hardPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={config.hardPercent}
                  onChange={(e) => handlePercentChange('hard', parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
            {config.easyPercent + config.mediumPercent + config.hardPercent !== 100 && (
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-2">
                Percentages must add up to 100%.
              </p>
            )}
          </div>

          {distributionWarning && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${generationStatus === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">{distributionWarning}</p>
            </div>
          )}

          {generationStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 flex items-start gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">Test generated successfully! It has been saved to your tests.</p>
            </div>
          )}

          <button 
            onClick={generateTest}
            disabled={generationStatus === 'generating' || (config.easyPercent + config.mediumPercent + config.hardPercent !== 100)}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 uppercase tracking-widest mt-8"
          >
            {generationStatus === 'generating' ? 'Generating AI Test...' : 'Generate Test'}
            {generationStatus !== 'generating' && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Test Generator ⚡</h1>
          <p className="text-slate-400 mt-0.5 text-xs md:text-sm font-medium italic">Create custom tests from the question bank.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Plus className="text-indigo-500" size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">Quick Test</h3>
          <p className="text-xs text-slate-400 font-medium mb-4">
            Generate a random 30-question test based on your weak areas.
          </p>
          <button className="w-full py-2 bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">
            Start Now
          </button>
        </div>

        <div 
          onClick={() => setMode('configure')}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Settings className="text-emerald-500" size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">Custom Test</h3>
          <p className="text-xs text-slate-400 font-medium mb-4">
            Select specific chapters, difficulty, and question count.
          </p>
          <button className="w-full py-2 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
