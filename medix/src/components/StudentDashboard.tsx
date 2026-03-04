import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText,
  ArrowRight, 
  Loader2,
  Award,
  BrainCircuit,
  Calendar,
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  ChevronRight,
  Upload,
  FileEdit,
  History,
  BookX,
  MessageSquare,
  Trophy
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { User, TestAssignment, Result, Question } from '../types';
import TestEngine from './TestEngine';
import StudentPerformance from './StudentPerformance';
import ResultReview from './ResultReview';
import QuestionBank from './QuestionBank';
import PDFExtractor from './PDFExtractor';
import TestGenerator from './TestGenerator';
import TestHistory from './TestHistory';
import MistakeDiary from './MistakeDiary';
import StudyPlan from './StudyPlan';
import AskDoubts from './AskDoubts';
import MotivationalQuote from './MotivationalQuote';

interface StudentDashboardProps {
  activeTab: string;
  user: User;
  onTabChange: (tab: string) => void;
}

export default function StudentDashboard({ activeTab, user, onTabChange }: StudentDashboardProps) {
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<TestAssignment | null>(null);
  const [reviewResult, setReviewResult] = useState<Result | null>(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    testsTaken: 0,
    avgAccuracy: 72,
    predictedScore: 620
  });

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/api/student/assignments/${user.id}`).then(res => res.json()),
        fetch(`/api/results/student/${user.id}`).then(res => res.json()),
        fetch('/api/questions').then(res => res.json())
      ]).then(([assignmentsData, resultsData, questionsData]) => {
        setAssignments(assignmentsData);
        setResults(resultsData);
        setQuestions(questionsData);
        setLoading(false);
        
        // Mock stats update
        setStats({
          totalQuestions: 1250,
          testsTaken: resultsData.length,
          avgAccuracy: 78,
          predictedScore: 645
        });
      });
    }
  }, [user]);

  const progressData = [
    { name: 'Test 1', score: 450 },
    { name: 'Test 2', score: 480 },
    { name: 'Test 3', score: 510 },
    { name: 'Test 4', score: 495 },
    { name: 'Test 5', score: 530 },
    { name: 'Test 6', score: 560 },
    { name: 'Test 7', score: 590 },
  ];

  if (activeTest) {
    return (
      <TestEngine 
        test={activeTest} 
        user={user} 
        onComplete={() => {
          setActiveTest(null);
          setLoading(true);
          Promise.all([
            fetch(`/api/student/assignments/${user.id}`).then(res => res.json()),
            fetch(`/api/results/student/${user.id}`).then(res => res.json())
          ]).then(([assignmentsData, resultsData]) => {
            setAssignments(assignmentsData);
            setResults(resultsData);
            setLoading(false);
          });
        }} 
      />
    );
  }

  if (reviewResult) {
    return (
      <ResultReview 
        result={reviewResult} 
        questions={questions}
        onClose={() => setReviewResult(null)} 
      />
    );
  }

  // Render content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 no-scrollbar">
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
                  <p className="text-base md:text-xl font-black text-charcoal leading-none">#12</p>
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
                label="Questions Solved" 
                value={stats.totalQuestions.toString()} 
                bgColor="bg-white"
              />
              <StatCard 
                icon={<ClipboardList className="text-emerald-500" size={20} />} 
                label="Tests Taken" 
                value={stats.testsTaken.toString()} 
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

            {/* Batch Offerings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Your Tools</h2>
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
                  onClick={() => onTabChange('performance')}
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
                <div className="space-y-3">
                  <RecentTestItem 
                    title="Physics - Mechanics Test 1" 
                    score="160/180" 
                    date="2 days ago" 
                    status="Completed" 
                  />
                   <RecentTestItem 
                    title="Chemistry - Organic Basics" 
                    score="145/180" 
                    date="5 days ago" 
                    status="Completed" 
                  />
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Study Plan Tasks</h3>
                  <button 
                    onClick={() => onTabChange('plan')}
                    className="text-primary text-[10px] font-bold hover:underline flex items-center gap-1"
                  >
                    View plan <ArrowRight size={10} />
                  </button>
                </div>
                <div className="space-y-3">
                  <TaskItem 
                    title="Solve 30 Qs on Rotational Motion" 
                    subject="Physics" 
                    due="Today" 
                  />
                  <TaskItem 
                    title="Revise Periodic Table Trends" 
                    subject="Chemistry" 
                    due="Tomorrow" 
                  />
                </div>
              </div>
            </div>

            <MotivationalQuote />
          </div>
        );
      case 'upload':
        return <PDFExtractor />;
      case 'bank':
        return <QuestionBank questions={questions} />;
      case 'generator':
        return <TestGenerator />;
      case 'history':
        return <TestHistory />;
      case 'mistakes':
        return <MistakeDiary />;
      case 'performance':
        return <StudentPerformance user={user} results={results} />;
      case 'plan':
        return <StudyPlan />;
      case 'doubts':
        return <AskDoubts />;
      default:
        return null;
    }
  };

  return renderContent();
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

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode, label: string, value: string, bgColor: string }) {
  return (
    <div className={cn("rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm transition-all hover:shadow-md", bgColor)}>
      <div className="mb-3 p-3 bg-slate-50 rounded-xl">{icon}</div>
      <p className="text-xl md:text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function RecentTestItem({ title, score, date, status }: { title: string, score: string, date: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
          <ClipboardList size={18} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-xs md:text-sm">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{date}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">• Score: {score}</span>
          </div>
        </div>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
        {status}
      </span>
    </div>
  );
}

function TaskItem({ title, subject, due }: { title: string, subject: string, due: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
          <Calendar size={18} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-xs md:text-sm">{title}</h4>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{subject}</span>
        </div>
      </div>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        Due: {due}
      </span>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
