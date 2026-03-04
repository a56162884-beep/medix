import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  BookOpen, 
  ClipboardList, 
  Users, 
  Target,
  TrendingUp
} from 'lucide-react';
import MotivationalQuote from './MotivationalQuote';

export default function TeacherAnalytics() {
  const [data, setData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/teacher').then(res => res.json()),
      fetch('/api/questions').then(res => res.json()),
      fetch('/api/tests').then(res => res.json())
    ]).then(([analyticsData, questionsData, testsData]) => {
      setData(analyticsData);
      setQuestions(questionsData);
      setTests(testsData);
      setLoading(false);
    }).catch(() => {
        // Mock data for fallback
        setData({ classPerformance: [] });
        setQuestions([]);
        setTests([]);
        setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold">Loading analytics...</p>
      </div>
    );
  }

  const subjectCounts = questions.reduce((acc: any, q: any) => {
    acc[q.subject] = (acc[q.subject] || 0) + 1;
    return acc;
  }, {});

  const subjectData = [
    { name: 'Physics', value: subjectCounts['Physics'] || 0, color: '#4F46E5' },
    { name: 'Chemistry', value: subjectCounts['Chemistry'] || 0, color: '#10B981' },
    { name: 'Biology', value: subjectCounts['Biology'] || 0, color: '#F59E0B' },
    { name: 'Maths', value: subjectCounts['Maths'] || 0, color: '#8B5CF6' },
  ].filter(d => d.value > 0);

  const difficultyCounts = questions.reduce((acc: any, q: any) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  const difficultyData = [
    { name: 'Easy', value: difficultyCounts['Easy'] || 0, color: '#10B981' },
    { name: 'Medium', value: difficultyCounts['Medium'] || 0, color: '#F59E0B' },
    { name: 'Hard', value: difficultyCounts['Hard'] || 0, color: '#EF4444' },
  ];

  const totalAttempts = data.classPerformance.reduce((acc: number, curr: any) => acc + curr.submissions, 0);
  const avgScore = data.classPerformance.length > 0 
    ? Math.round(data.classPerformance.reduce((acc: number, curr: any) => acc + (curr.avg_score || 0), 0) / data.classPerformance.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Batch Analytics 📊</h1>
          <p className="text-slate-400 mt-0.5 text-xs md:text-sm font-medium italic">Real-time performance metrics for NEET 2026-A.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard 
          icon={<BookOpen size={20} />} 
          label="Questions" 
          value={questions.length.toString()} 
          color="indigo"
        />
        <AnalyticsStatCard 
          icon={<ClipboardList size={20} />} 
          label="Tests" 
          value={tests.length.toString()} 
          color="emerald"
        />
        <AnalyticsStatCard 
          icon={<Users size={20} />} 
          label="Attempts" 
          value={totalAttempts.toString()} 
          color="blue"
        />
        <AnalyticsStatCard 
          icon={<Target size={20} />} 
          label="Avg Score" 
          value={`${avgScore}%`} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Questions by Subject */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-900 mb-6">Questions by Subject</h3>
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="40%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 font-bold text-sm">No questions added yet.</p>
            )}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-900 mb-6">Difficulty Distribution</h3>
          <div className="h-[250px] md:h-[300px]">
            {questions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 font-bold flex items-center justify-center h-full text-sm">No questions added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Class Performance */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900">Class Performance</h3>
          <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-4 text-slate-600 font-bold text-xs focus:outline-none">
            <option>All Tests</option>
          </select>
        </div>
        {data.classPerformance.length > 0 ? (
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.classPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                <Bar dataKey="avg_score" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm">No test data available.</p>
          </div>
        )}
      </div>

      <MotivationalQuote />
    </div>
  );
}

function AnalyticsStatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
      <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4", colors[color as keyof typeof colors])}>
        {icon}
      </div>
      <p className="text-2xl md:text-3xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
