import React from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The secret of getting ahead is getting started. – Mark Twain",
  "It always seems impossible until it's done. – Nelson Mandela",
  "Dream big and dare to fail. – Norman Vaughan",
  "Quality is not an act, it is a habit. – Aristotle"
];

export default function MotivationalQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const parts = randomQuote.split('–');
  const quoteText = parts[0].trim();
  const author = parts.length > 1 ? parts[1].trim() : '';

  return (
    <div className="mt-12 mb-8 relative py-12 px-4 md:px-0 overflow-hidden">
      {/* Background Blended Elements */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <h1 className="text-[6rem] md:text-[12rem] font-black text-slate-900 leading-none tracking-tighter">QUOTE</h1>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        <Quote className="mx-auto text-primary/40 mb-4" size={32} />
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-slate-700 leading-relaxed tracking-tight">
          "{quoteText}"
        </h2>
        {author && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-8 bg-slate-300"></div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{author}</p>
            <div className="h-px w-8 bg-slate-300"></div>
          </div>
        )}
      </div>
    </div>
  );
}
