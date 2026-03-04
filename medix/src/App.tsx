import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Upload, 
  BookOpen, 
  FileEdit, 
  ClipboardList,
  BarChart2, 
  LogOut, 
  ChevronRight,
  Search,
  GraduationCap,
  Menu,
  X,
  Users,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, Question, Test, TestAssignment, Result } from './types';
import { LOGO_URL } from './constants';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Profile from './components/Profile';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import OnboardingScreen from './components/OnboardingScreen';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AppState = 'splash' | 'auth' | 'onboarding' | 'app';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainContentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate initial load check
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        // We won't auto-login here because we want to show the auth flow for demonstration
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSplashComplete = () => {
    setAppState('auth');
  };

  const handleLogin = (role: 'student' | 'teacher') => {
    // Simulate login
    const mockUser: User = {
      id: 1,
      name: role === 'teacher' ? 'Teacher User' : 'Student User',
      email: `${role}@medix.com`,
      role: role
    };
    setUser(mockUser);
    setAppState('onboarding');
  };

  const handleOnboardingComplete = () => {
    setAppState('app');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('auth');
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (appState === 'onboarding' && user) {
    return <OnboardingScreen role={user.role} onComplete={handleOnboardingComplete} />;
  }

  if (!user) return null; // Fallback

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-900 flex flex-col overflow-hidden">
      {/* Top Navigation Bar (Professional Style) */}
      <header className="h-14 md:h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <img 
              src={LOGO_URL} 
              alt="MediX Logo" 
              className="h-6 md:h-8 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Batch Selector (Inspired by PW) */}
          <div className="hidden lg:flex items-center ml-6 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
              <Users size={12} className="text-primary" />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">NEET 2026 • Batch A</span>
            <ChevronRight size={12} className="text-slate-400" />
          </div>

          {/* Desktop Horizontal Menu */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {user.role === 'teacher' ? (
              <>
                <NavItem label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <NavItem label="Question Bank" active={activeTab === 'bank'} onClick={() => setActiveTab('bank')} />
                <NavItem label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                <NavItem label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
              </>
            ) : (
              <>
                <NavItem label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <NavItem label="Question Bank" active={activeTab === 'bank'} onClick={() => setActiveTab('bank')} />
                <NavItem label="Tests" active={activeTab === 'tests'} onClick={() => setActiveTab('tests')} />
                <NavItem label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
                <NavItem label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar (Inspired by Allen) */}
          <div className="hidden xl:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 w-64 gap-2">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search questions, tests..." 
              className="bg-transparent border-none outline-none text-xs font-medium text-slate-600 w-full"
            />
          </div>

          {/* Menu on Right (Mobile) */}
          <button onClick={toggleMenu} className="md:hidden text-slate-400 p-2 hover:text-primary transition-colors">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Logout Button */}
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors font-bold text-xs"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-x-0 top-14 bg-white border-b border-slate-100 shadow-xl z-30 p-4 space-y-1"
          >
            {user.role === 'teacher' ? (
              <>
                <MobileNavItem label="Home" icon={<LayoutGrid size={16} />} active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Upload PDF" icon={<Upload size={16} />} active={activeTab === 'upload'} onClick={() => { setActiveTab('upload'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Question Bank" icon={<BookOpen size={16} />} active={activeTab === 'bank'} onClick={() => { setActiveTab('bank'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Create Test" icon={<FileEdit size={16} />} active={activeTab === 'generator'} onClick={() => { setActiveTab('generator'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Tests" icon={<ClipboardList size={16} />} active={activeTab === 'tests'} onClick={() => { setActiveTab('tests'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Analytics" icon={<BarChart2 size={16} />} active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Profile" icon={<UserIcon size={16} />} active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} />
              </>
            ) : (
              <>
                <MobileNavItem label="Home" icon={<LayoutGrid size={16} />} active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Performance" icon={<BarChart2 size={16} />} active={activeTab === 'performance'} onClick={() => { setActiveTab('performance'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Profile" icon={<UserIcon size={16} />} active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} />
              </>
            )}
            <div className="pt-4 mt-4 border-t border-slate-50">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-rose-500 font-bold text-sm w-full px-4 py-3"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' ? (
                <Profile />
              ) : user.role === 'teacher' ? (
                <TeacherDashboard activeTab={activeTab} user={user} onTabChange={setActiveTab} />
              ) : (
                <StudentDashboard activeTab={activeTab} user={user} onTabChange={setActiveTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-xs font-bold transition-all",
        active 
          ? "text-primary bg-indigo-50" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

function MobileNavItem({ label, icon, active, onClick }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
        active 
          ? "bg-indigo-50 text-primary" 
          : "text-slate-500 hover:bg-slate-50"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}
