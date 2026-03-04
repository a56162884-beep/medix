import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  BookOpen, 
  ClipboardList,
  FileText,
  TrendingUp,
  ArrowRight, 
  FileUp, 
  FileEdit,
  Clock,
  Users,
  Loader2,
  ChevronRight,
  BrainCircuit,
  History,
  BookX,
  Calendar,
  MessageSquare,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { User, Question, Test } from '../types';
import QuestionBank from './QuestionBank';
import TestGenerator from './TestGenerator';
import PdfUploader from './PdfUploader';
import TeacherAnalytics from './TeacherAnalytics';
import TestHistory from './TestHistory';
import MistakeDiary from './MistakeDiary';
import StudyPlan from './StudyPlan';
import AskDoubts from './AskDoubts';
import MotivationalQuote from './MotivationalQuote';

interface TeacherDashboardProps {
  activeTab: string;
  user: User;
  onTabChange: (tab: string) => void;
}

export default function TeacherDashboard({ activeTab, user, onTabChange }: TeacherDashboardProps) {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalTests: 0,
    activeStudents: 124,
    avgAccuracy: 72,
    pdfsUploaded: 1
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/questions').then(res => res.json()),
      fetch('/api/tests').then(res => res.json()),
    ]).then(([questions, tests]) => {
      setStats(prev => ({
        ...prev,
        totalQuestions: questions.length,
        totalTests: tests.length,
      }));
    });
  }, []);

  const progressData = [
    { name: 'Test 1', score: 450 },
    { name: 'Test 2', score: 480 },
    { name: 'Test 3', score: 510 },
    { name: 'Test 4', score: 495 },
    { name: 'Test 5', score: 530 },
    { name: 'Test 6', score: 560 },
    { name: 'Test 7', score: 590 },
  ];

  if (activeTab === 'upload') return <PdfUploader onTabChange={onTabChange} />;
  if (activeTab === 'bank') return <QuestionBank questions={[]} />; // Assuming questions will be fetched inside or passed
  if (activeTab === 'generator') return <TestGenerator />;
  if (activeTab === 'analytics') return <TeacherAnalytics />;
  if (activeTab === 'tests') return <TestsList onTabChange={onTabChange} />;
  if (activeTab === 'history') return <TestHistory />;
  if (activeTab === 'mistakes') return <MistakeDiary />;
  if (activeTab === 'plan') return <StudyPlan />;
  if (activeTab === 'doubts') return <AskDoubts />;

  return (
    <div className="space-y-8">
      {/* Marks Progress Chart Section */}
      <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="mb-6 pr-24">
          <h2 className="text-base md:text-lg font-black text-charcoal uppercase tracking-tight">Marks Progress 📈</h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-medium">Test performance over time</p>
        </div>
        
        {/* Leaderboard Rank Tile - Absolute Positioned */}
        <div className="absolute top-5 right-5 md:top-8 md:right-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-2 md:p-3 flex items-center gap-2 md:gap-3 shadow-sm z-10">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
            <Trophy size={16} className="md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-0.5">Rank</p>
            <p className="text-base md:text-xl font-black text-charcoal leading-none">#42</p>
          </div>
        </div>

        <div className="h-[200px] md:h-[250px] w-full -ml-2 md:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B21B6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#5B21B6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} 
                domain={[0, 720]} 
                width={30}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#5B21B6', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="score" stroke="#5B21B6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid - Updated Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard 
          icon={<BookOpen className="text-indigo-500" size={20} />} 
          label="Total Questions" 
          value={stats.totalQuestions.toString()} 
          bgColor="bg-white"
        />
        <StatCard 
          icon={<ClipboardList className="text-emerald-500" size={20} />} 
          label="Tests Created" 
          value={stats.totalTests.toString()} 
          bgColor="bg-white"
        />
        <StatCard 
          icon={<BrainCircuit className="text-rose-500" size={20} />} 
          label="Accuracy" 
          value={`${stats.avgAccuracy}%`} 
          bgColor="bg-white"
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-500" size={20} />} 
          label="Predicted NEET" 
          value="620-640" 
          bgColor="bg-white"
        />
      </div>

      {/* Management Offerings (Inspired by PW) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Management Tools</h2>
          <button className="text-primary text-[10px] font-bold hover:underline">All Tools</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <OfferingCard 
            title="PDF Extractor"
            icon={<Upload size={20} className="text-indigo-500" />}
            onClick={() => onTabChange('upload')}
          />
          <OfferingCard 
            title="Question Bank"
            icon={<BookOpen size={20} className="text-emerald-500" />}
            onClick={() => onTabChange('bank')}
          />
          <OfferingCard 
            title="Test Generator"
            icon={<FileEdit size={20} className="text-cyan-500" />}
            onClick={() => onTabChange('generator')}
          />
          <OfferingCard 
            title="Test History"
            icon={<History size={20} className="text-amber-500" />}
            onClick={() => onTabChange('history')}
          />
          <OfferingCard 
            title="Mistake Diary"
            icon={<BookX size={20} className="text-rose-500" />}
            onClick={() => onTabChange('mistakes')}
          />
          <OfferingCard 
            title="Performance"
            icon={<TrendingUp size={20} className="text-purple-500" />}
            onClick={() => onTabChange('analytics')}
          />
          <OfferingCard 
            title="Custom Study Plan"
            icon={<Calendar size={20} className="text-primary" />}
            onClick={() => onTabChange('plan')}
          />
          <OfferingCard 
            title="Ask Doubts"
            icon={<MessageSquare size={20} className="text-orange-500" />}
            onClick={() => onTabChange('doubts')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent PDF Uploads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Recent Uploads</h3>
            <button 
              onClick={() => onTabChange('upload')}
              className="text-primary text-[10px] font-bold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={10} />
            </button>
          </div>
          <div className="space-y-3">
            <RecentUploadItem 
              title="Work, Energy and Power" 
              subject="Physics" 
              type="DPP" 
              status="Completed" 
            />
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Recent Tests</h3>
            <button 
              onClick={() => onTabChange('tests')}
              className="text-primary text-[10px] font-bold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={10} />
            </button>
          </div>
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="text-slate-200" size={24} />
            </div>
            <p className="text-slate-400 font-bold text-xs mb-1">No tests created yet</p>
            <button 
              onClick={() => onTabChange('generator')}
              className="text-primary font-bold text-[10px] hover:underline"
            >
              Create your first test →
            </button>
          </div>
        </div>
      </div>

      <MotivationalQuote />
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode, label: string, value: string, bgColor: string }) {
  return (
    <div className={cn("rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm transition-all hover:shadow-md", bgColor)}>
      <div className="mb-3 p-3 bg-slate-50 rounded-xl">{icon}</div>
      <p className="text-xl md:text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ActionCard({ title, subtitle, tag, icon, onClick }: { title: string, subtitle: string, tag?: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all group text-left"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-black text-slate-900 tracking-tight">{title}</h4>
          {tag && <span className="bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{tag}</span>}
        </div>
        <p className="text-xs text-slate-400 font-medium italic">{subtitle}</p>
      </div>
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </button>
  );
}

function RecentUploadItem({ title, subject, type, status }: { title: string, subject: string, type: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
          <FileText size={18} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-xs md:text-sm">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{subject}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">• {type}</span>
          </div>
        </div>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
        {status}
      </span>
    </div>
  );
}

function TestsList({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tests')
      .then(res => res.json())
      .then(data => {
        setTests(data);
        setLoading(false);
      });
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Tests</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">{tests.length} tests created</p>
        </div>
        <button 
          onClick={() => onTabChange('generator')}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-primary/20 transition-all self-start md:self-center"
        >
          <ClipboardList size={18} />
          New Test
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Published', 'Draft', 'Archived'].map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-5 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap",
              activeFilter === filter 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            {filter} ({filter === 'All' ? tests.length : 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : tests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {tests.map(test => (
            <div key={test.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ClipboardList size={18} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest">Published</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-1 line-clamp-1">{test.title}</h4>
              <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {test.duration}m</span>
                <span className="flex items-center gap-1.5"><BookOpen size={12} /> {test.questions.length} Qs</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 md:p-16 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">No tests found.</h3>
          <button 
            onClick={() => onTabChange('generator')}
            className="text-indigo-600 font-bold text-sm hover:underline"
          >
            Create your first test →
          </button>
        </div>
      )}
    </div>
  );
}

function OfferingCard({ title, icon, onClick, isLocked }: { title: string, icon: React.ReactNode, onClick: () => void, isLocked?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-black text-slate-900 tracking-tight">{title}</span>
      </div>
      {isLocked && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
    </button>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
