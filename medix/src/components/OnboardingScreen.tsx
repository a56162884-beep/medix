import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, GraduationCap, Target, BookOpen, Clock, Building2 } from 'lucide-react';
import { LOGO_URL } from '../constants';

interface OnboardingScreenProps {
  role: 'student' | 'teacher';
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options?: { id: string; label: string; desc: string; }[];
  isInput?: boolean;
  placeholder?: string;
}

export default function OnboardingScreen({ role, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({});

  const studentSteps: OnboardingStep[] = [
    {
      id: 'exam',
      title: 'What is your target exam?',
      subtitle: 'Select the exam you are preparing for',
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      options: [
        { id: 'neet', label: 'NEET (UG)', desc: 'Medical Entrance' },
        { id: 'jee_main', label: 'JEE Main', desc: 'Engineering Entrance' },
        { id: 'jee_adv', label: 'JEE Advanced', desc: 'IIT Entrance' },
        { id: 'foundation', label: 'Foundation', desc: 'Class 9th & 10th' },
      ]
    },
    {
      id: 'class',
      title: 'Which class are you in?',
      subtitle: 'Help us personalize your study material',
      icon: <GraduationCap className="w-6 h-6 text-emerald-500" />,
      options: [
        { id: '11', label: 'Class 11th', desc: 'Starting preparation' },
        { id: '12', label: 'Class 12th', desc: 'Board + Competitive' },
        { id: 'dropper', label: 'Dropper / Repeater', desc: 'Dedicated focus' },
      ]
    },
    {
      id: 'year',
      title: 'Target Year',
      subtitle: 'When are you planning to appear?',
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      options: [
        { id: '2025', label: '2025', desc: 'Upcoming exam' },
        { id: '2026', label: '2026', desc: 'Next year' },
        { id: '2027', label: '2027', desc: 'Future target' },
      ]
    }
  ];

  const teacherSteps: OnboardingStep[] = [
    {
      id: 'subject',
      title: 'What do you teach?',
      subtitle: 'Select your primary subject',
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
      options: [
        { id: 'physics', label: 'Physics', desc: 'Mechanics, Electromagnetism...' },
        { id: 'chemistry', label: 'Chemistry', desc: 'Organic, Inorganic, Physical...' },
        { id: 'biology', label: 'Biology', desc: 'Botany, Zoology...' },
        { id: 'math', label: 'Mathematics', desc: 'Calculus, Algebra...' },
      ]
    },
    {
      id: 'experience',
      title: 'Teaching Experience',
      subtitle: 'How long have you been teaching?',
      icon: <Clock className="w-6 h-6 text-emerald-500" />,
      options: [
        { id: '0-2', label: '0-2 Years', desc: 'Just starting out' },
        { id: '3-5', label: '3-5 Years', desc: 'Experienced' },
        { id: '5+', label: '5+ Years', desc: 'Veteran Educator' },
      ]
    },
    {
      id: 'institute',
      title: 'Institute Details',
      subtitle: 'Where do you currently teach?',
      icon: <Building2 className="w-6 h-6 text-amber-500" />,
      isInput: true,
      placeholder: 'e.g. Allen, Aakash, PW, or Independent'
    }
  ];

  const steps = role === 'student' ? studentSteps : teacherSteps;
  const currentStepData = steps[step - 1];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSelect = (optionId: string) => {
    setData({ ...data, [currentStepData.id]: optionId });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [currentStepData.id]: e.target.value });
  };

  const isNextDisabled = !data[currentStepData.id] && !currentStepData.isInput;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-8 flex flex-col items-center gap-6">
          <img 
            src={LOGO_URL} 
            alt="MediX Logo" 
            className="h-8 md:h-10 w-auto"
            referrerPolicy="no-referrer"
          />
          <div className="w-full flex items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: i + 1 <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              {currentStepData.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentStepData.title}</h2>
              <p className="text-sm font-medium text-slate-500">{currentStepData.subtitle}</p>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            {currentStepData.isInput ? (
              <div className="pt-4 pb-8">
                <input 
                  type="text" 
                  value={data[currentStepData.id] || ''}
                  onChange={handleInputChange}
                  placeholder={currentStepData.placeholder}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-medium outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            ) : (
              currentStepData.options?.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left group ${
                    data[currentStepData.id] === opt.id 
                      ? 'border-primary bg-indigo-50/50 shadow-md shadow-primary/5' 
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                    data[currentStepData.id] === opt.id 
                      ? 'border-primary bg-primary' 
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {data[currentStepData.id] === opt.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${data[currentStepData.id] === opt.id ? 'text-primary' : 'text-slate-900'}`}>
                      {opt.label}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isNextDisabled && !currentStepData.isInput}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isNextDisabled && !currentStepData.isInput
                  ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
              }`}
            >
              {step === steps.length ? 'Get Started' : 'Continue'}
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
