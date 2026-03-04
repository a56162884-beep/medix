import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  BrainCircuit,
  Loader2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Result, User, Question } from '../types';
import MotivationalQuote from './MotivationalQuote';

interface StudentPerformanceProps {
  user: User;
  results: Result[];
}

export default function StudentPerformance({ user, results }: StudentPerformanceProps) {
  const [questions, setQuestions] = React.useState<Question[]>([]);

  React.useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(setQuestions)
      .catch(() => setQuestions([])); // Handle error gracefully
  }, []);

  const chartData = results.slice().reverse().map(r => ({
    name: new Date(r.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: r.score
  }));

  // Calculate subject-wise accuracy
  const subjectStats = results.reduce((acc: Record<string, { correct: number, total: number }>, res) => {
    Object.entries(res.answers).forEach(([qId, ans]) => {
      const question = questions.find(q => q.id === parseInt(qId));
      if (question) {
        if (!acc[question.subject]) {
          acc[question.subject] = { correct: 0, total: 0 };
        }
        acc[question.subject].total += 1;
        if (ans === question.correct_answer) {
          acc[question.subject].correct += 1;
        }
      }
    });
    return acc;
  }, {});

  const subjectData = [
    { subject: 'Physics', score: subjectStats['Physics'] ? Math.round((subjectStats['Physics'].correct / subjectStats['Physics'].total) * 100) : 0, color: 'bg-indigo-500', barColor: '#6366f1' },
    { subject: 'Chemistry', score: subjectStats['Chemistry'] ? Math.round((subjectStats['Chemistry'].correct / subjectStats['Chemistry'].total) * 100) : 0, color: 'bg-emerald-500', barColor: '#10b981' },
    { subject: 'Biology', score: subjectStats['Biology'] ? Math.round((subjectStats['Biology'].correct / subjectStats['Biology'].total) * 100) : 0, color: 'bg-amber-500', barColor: '#f59e0b' },
    { subject: 'Maths', score: subjectStats['Maths'] ? Math.round((subjectStats['Maths'].correct / subjectStats['Maths'].total) * 100) : 0, color: 'bg-rose-500', barColor: '#f43f5e' }
  ].filter(s => s.score > 0 || (subjectStats[s.subject] && subjectStats[s.subject].total > 0));

  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
    : 0;

  const totalQuestionsAttempted = Object.values(subjectStats).reduce((acc: number, curr: any) => acc + curr.total, 0);
  const totalCorrect = Object.values(subjectStats).reduce((acc: number, curr: any) => acc + curr.correct, 0);
  const overallAccuracy = totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;

  // Mock data for time analysis
  const timeData = [
    { name: 'Physics', time: 45 },
    { name: 'Chem', time: 30 },
    { name: 'Bio', time: 25 },
    { name: 'Math', time: 50 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Performance Hub 🚀</h1>
          <p className="text-slate-400 mt-0.5 text-xs md:text-sm font-medium italic">Detailed analysis of your learning progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Sync Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceStat 
          icon={<TrendingUp size={20} />} 
          label="Overall Avg" 
          value={`${avgScore}%`} 
          desc="Top 15% of batch" 
          color="indigo"
        />
        <PerformanceStat 
          icon={<Target size={20} />} 
          label="Tests Done" 
          value={results.length.toString()} 
          desc="100% completion" 
          color="emerald"
        />
        <PerformanceStat 
          icon={<Zap size={20} />} 
          label="Accuracy" 
          value={`${overallAccuracy}%`} 
          desc="+5% this week" 
          color="amber"
        />
        <PerformanceStat 
          icon={<Award size={20} />} 
          label="Batch Rank" 
          value="#42" 
          desc="Out of 1.2k" 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Score Trend */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Score Progression</h3>
            <select className="bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1.5 focus:outline-none">
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-64 md:h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748B', fontWeight: 600 }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]}
                    tick={{ fill: '#64748B', fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #F1F5F9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    itemStyle={{ color: '#4F46E5', fontWeight: 800 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4F46E5" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold text-sm">
                No test data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Subject-wise Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8">Subject-wise Accuracy</h3>
          <div className="space-y-6">
            {subjectData.length > 0 ? subjectData.map(sub => (
              <div key={sub.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{sub.subject}</span>
                  <span className="text-xs font-black text-slate-900">{sub.score}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full", sub.color)}
                  />
                </div>
              </div>
            )) : (
              <div className="text-slate-400 font-bold text-center py-8 text-sm">
                Complete a test to see analysis.
              </div>
            )}
          </div>

          <div className="mt-8 p-5 md:p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <BrainCircuit className="text-indigo-600" size={20} />
            </div>
            <div>
              <h4 className="text-base font-black text-indigo-900 mb-0.5">AI Insight</h4>
              <p className="text-xs text-indigo-700/70 leading-relaxed font-medium">
                {results.length > 0 
                  ? "You're showing strong grasp of concepts. Keep practicing!"
                  : "Start taking tests to get personalized AI insights."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Time Analysis */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
              <Clock size={16} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Time per Subject (min)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontWeight: 600 }} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontWeight: 600 }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #F1F5F9', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#f43f5e'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Areas */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
              <AlertTriangle size={16} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Areas for Improvement</h3>
          </div>
          <div className="space-y-4">
            {['Thermodynamics (Physics)', 'Organic Chemistry', 'Calculus (Maths)'].map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-700">{topic}</span>
                <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Weak</span>
              </div>
            ))}
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                <span className="font-black">AI Tip:</span> Focus on solving more numerical problems in Thermodynamics to improve your speed and accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <MotivationalQuote />
    </div>
  );
}

function PerformanceStat({ icon, label, value, desc, color }: { icon: React.ReactNode, label: string, value: string, desc: string, color: string }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
      <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4", colors[color as keyof typeof colors])}>
        {icon}
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl md:text-3xl font-black text-slate-900">{value}</div>
        <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">{label}</div>
        <div className="text-[9px] text-slate-400 font-bold">{desc}</div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
