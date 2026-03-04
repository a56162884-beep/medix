import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, BrainCircuit, Target, BookOpen } from 'lucide-react';
import MotivationalQuote from './MotivationalQuote';

export default function StudyPlan() {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Physics: Laws of Motion', 
      status: 'completed', 
      date: 'Today',
      details: {
        questions: 25,
        level: 'Medium',
        focus: 'Newton\'s 2nd Law & Friction',
        aiInsight: 'You struggled with friction problems last time. Focus on free body diagrams.'
      },
      expanded: false
    },
    { 
      id: 2, 
      title: 'Chemistry: Chemical Bonding', 
      status: 'pending', 
      date: 'Tomorrow',
      details: {
        questions: 30,
        level: 'Hard',
        focus: 'VSEPR Theory & Hybridization',
        aiInsight: 'High weightage topic. Ensure you practice drawing structures.'
      },
      expanded: false
    },
    { 
      id: 3, 
      title: 'Biology: Cell Structure', 
      status: 'upcoming', 
      date: 'Next Week',
      details: {
        questions: 40,
        level: 'Easy',
        focus: 'Organelles & Functions',
        aiInsight: 'Review diagrams carefully. Direct questions expected.'
      },
      expanded: false
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const toggleExpand = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Custom Study Plan 📅</h1>
          <p className="text-slate-400 mt-0.5 text-xs md:text-sm font-medium italic">Your personalized roadmap to success.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Calendar size={128} className="text-primary" />
        </div>
        <div className="space-y-6 relative z-10">
          {tasks.map((task, index) => (
            <div key={task.id} className="group">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 pt-1">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      task.status === 'completed' 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200 shadow-lg' 
                        : task.status === 'pending' 
                          ? 'bg-white border-amber-500 text-amber-500 hover:bg-amber-50' 
                          : 'bg-white border-slate-200 text-slate-300'
                    }`}
                  >
                    {task.status === 'completed' ? <CheckCircle2 size={14} /> : task.status === 'pending' ? <Clock size={14} /> : <Circle size={14} />}
                  </button>
                  {index !== tasks.length - 1 && <div className="w-0.5 h-full min-h-[40px] bg-slate-100 group-hover:bg-slate-200 transition-colors" />}
                </div>
                
                <div className="flex-1 pb-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(task.id)}
                  >
                    <div>
                      <h4 className={`text-sm font-black transition-colors ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{task.date}</p>
                    </div>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      {task.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {task.expanded && (
                    <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-2">
                          <Target size={14} className="text-indigo-500" />
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Questions</p>
                            <p className="text-xs font-black text-slate-900">{task.details.questions}</p>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-2">
                          <BookOpen size={14} className="text-rose-500" />
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Level</p>
                            <p className="text-xs font-black text-slate-900">{task.details.level}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Focus Area</p>
                        <p className="text-xs font-medium text-slate-700">{task.details.focus}</p>
                      </div>

                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex gap-3">
                        <BrainCircuit size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-indigo-500 font-black uppercase mb-0.5">AI Insight</p>
                          <p className="text-xs font-medium text-indigo-700 leading-relaxed">{task.details.aiInsight}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MotivationalQuote />
    </div>
  );
}
