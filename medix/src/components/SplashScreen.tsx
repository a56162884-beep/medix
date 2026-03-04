import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LOGO_URL } from '../constants';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Total duration of splash screen
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[200]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 2.5, 
          times: [0, 0.2, 0.8, 1],
          ease: "easeInOut"
        }}
        className="flex flex-col items-center"
      >
        <img 
          src={LOGO_URL} 
          alt="MediX Logo" 
          className="h-16 md:h-24 w-auto mb-6"
          referrerPolicy="no-referrer"
        />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] md:text-xs mt-2">AI-Powered Learning</p>
      </motion.div>
    </div>
  );
}
