import React, { useState } from 'react';
import { 
  Upload, 
  Loader2, 
  Sparkles,
  Info,
  Tag,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExtractedQuestion, extractQuestionsFromPdf } from '../services/geminiService';
import CustomSelect from './ui/CustomSelect';

interface PdfUploaderProps {
  onTabChange: (tab: string) => void;
}

export default function PdfUploader({ onTabChange }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [details, setDetails] = useState({
    subject: '',
    examType: '',
    uploadType: 'DPP',
    chapter: '',
    notes: ''
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExtractedQuestion>>({});
  const [newTag, setNewTag] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setExtracting(true);
    try {
      const base64 = await fileToBase64(file);
      const questions = await extractQuestionsFromPdf(base64);
      setExtractedQuestions(questions);
    } catch (error) {
      console.error(error);
      alert('Failed to extract questions. Please try again.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = async () => {
    try {
      for (const q of extractedQuestions) {
        await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...q, ...details })
        });
      }
      alert('Questions saved to bank!');
      onTabChange('bank');
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...extractedQuestions[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...extractedQuestions];
      updated[editingIndex] = { ...updated[editingIndex], ...editForm } as ExtractedQuestion;
      setExtractedQuestions(updated);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const addTag = () => {
    if (newTag.trim() && editForm.tags) {
      if (!editForm.tags.includes(newTag.trim())) {
        setEditForm({ ...editForm, tags: [...editForm.tags, newTag.trim()] });
      }
      setNewTag('');
    } else if (newTag.trim()) {
      setEditForm({ ...editForm, tags: [newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (editForm.tags) {
      setEditForm({ ...editForm, tags: editForm.tags.filter(t => t !== tagToRemove) });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Upload PDF</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Upload DPP, Assignment or Past Year Papers — AI will extract all questions automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Dropzone */}
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl md:rounded-3xl p-8 md:p-16 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all cursor-pointer group relative">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
              <Upload className="text-slate-300 size-8 md:size-12" />
            </div>
            {file ? (
              <div>
                <p className="text-lg md:text-2xl font-black text-slate-900 mb-1 md:mb-2">{file.name}</p>
                <p className="text-slate-400 font-bold text-xs md:text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-lg md:text-2xl font-black text-slate-900 mb-1 md:mb-2">Drop your PDF here or click to browse</p>
                <p className="text-slate-400 font-bold text-xs md:text-sm">Supports DPP, Assignment, Past Year Papers</p>
              </div>
            )}
          </div>

          {/* PDF Details Form */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 space-y-6 md:space-y-8">
            <h3 className="text-lg md:text-xl font-black text-slate-900">PDF Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Subject <span className="text-rose-500">*</span></label>
                <select 
                  value={details.subject}
                  onChange={(e) => setDetails({ ...details, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="">Select subject</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Maths">Maths</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Exam Type <span className="text-rose-500">*</span></label>
                <select 
                  value={details.examType}
                  onChange={(e) => setDetails({ ...details, examType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="">Select exam</option>
                  <option value="NEET">NEET</option>
                  <option value="JEE">JEE</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Upload Type</label>
                <select 
                  value={details.uploadType}
                  onChange={(e) => setDetails({ ...details, uploadType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="DPP">DPP</option>
                  <option value="Assignment">Assignment</option>
                  <option value="PYQ">Past Year Paper</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Chapter / Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Thermodynamics" 
                  value={details.chapter}
                  onChange={(e) => setDetails({ ...details, chapter: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900">Notes (optional)</label>
              <textarea 
                placeholder="Any notes about this PDF..." 
                rows={3}
                value={details.notes}
                onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>

            <div className="bg-indigo-50 p-4 md:p-6 rounded-xl md:rounded-2xl flex items-start gap-3 md:gap-4">
              <Info className="text-indigo-600 shrink-0 mt-0.5 size-4 md:size-5" />
              <p className="text-indigo-600 text-[10px] md:text-sm font-medium leading-relaxed">
                AI will extract all questions, options, answers, and explanations. You can review and edit before saving to the question bank.
              </p>
            </div>

            <button 
              onClick={handleExtract}
              disabled={!file || extracting}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-slate-200 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all uppercase tracking-widest"
            >
              {extracting ? (
                <>
                  <Loader2 className="animate-spin size-5 md:size-6" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="size-5 md:size-6" />
                  Extract with AI
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Extraction Preview / Results */}
          {extractedQuestions.length > 0 && (
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-black text-slate-900">Extracted</h3>
                <span className="bg-emerald-100 text-emerald-600 px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  {extractedQuestions.length} Found
                </span>
              </div>
              
              <div className="space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {extractedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    {editingIndex === idx ? (
                      <div className="space-y-4">
                        <textarea
                          value={editForm.text || ''}
                          onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium resize-none"
                          rows={3}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Difficulty:</span>
                          <select
                            value={editForm.difficulty || 'Medium'}
                            onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as any })}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-500">Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {editForm.tags?.map((tag, tIdx) => (
                              <span key={tIdx} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-indigo-800"><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addTag()}
                              placeholder="Add tag..."
                              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium flex-1"
                            />
                            <button onClick={addTag} className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">Add</button>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700 text-xs font-bold px-3 py-1">Cancel</button>
                          <button onClick={saveEdit} className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"><Check size={12} /> Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-900 font-bold text-xs line-clamp-2 mb-2">{q.text}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                            q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {q.difficulty}
                          </span>
                          {q.tags?.map((tag, tIdx) => (
                            <span key={tIdx} className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                              <Tag size={8} /> {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Q{idx + 1} • {q.type}</span>
                          <button onClick={() => startEditing(idx)} className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:underline">Edit</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSave}
                className="w-full mt-6 md:mt-8 bg-emerald-500 hover:bg-emerald-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest"
              >
                Save to Bank
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
