import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, FileType, BookOpen, GraduationCap } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

export default function PDFExtractor() {
  const [examType, setExamType] = useState('');
  const [subject, setSubject] = useState('');
  const [uploadType, setUploadType] = useState('');

  const examOptions = [
    { value: 'NEET', label: 'NEET' },
    { value: 'JEE', label: 'JEE Mains/Advanced' },
    { value: 'BOARD', label: 'Board Exams' },
  ];

  const subjectOptions = [
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Maths', label: 'Mathematics' },
  ];

  const uploadTypeOptions = [
    { value: 'Question Paper', label: 'Question Paper' },
    { value: 'Notes', label: 'Study Notes' },
    { value: 'Syllabus', label: 'Syllabus' },
    { value: 'Book', label: 'Textbook Chapter' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-charcoal uppercase tracking-tight">PDF Extractor 📄</h1>
          <p className="text-slate-400 mt-1 text-xs md:text-sm font-medium italic">Upload PDFs to automatically extract questions.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            value={examType}
            onChange={setExamType}
            options={examOptions}
            placeholder="Select Exam"
            label="Exam Type"
            icon={<GraduationCap size={16} />}
          />
          <CustomSelect
            value={subject}
            onChange={setSubject}
            options={subjectOptions}
            placeholder="Select Subject"
            label="Subject"
            icon={<BookOpen size={16} />}
          />
          <CustomSelect
            value={uploadType}
            onChange={setUploadType}
            options={uploadTypeOptions}
            placeholder="Document Type"
            label="Upload Type"
            icon={<FileType size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-indigo-50/30 transition-all cursor-pointer group h-80">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Upload className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-black text-charcoal mb-2">Upload Document</h3>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mb-4">
              Drag & drop your PDF here or click to browse.
            </p>
            <button className="px-6 py-2 bg-charcoal text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Browse Files
            </button>
          </div>

          <div className="space-y-4 h-80 flex flex-col">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest shrink-0">Recent Uploads</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                    <FileText className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-charcoal truncate">Physics_Mock_Test_{20 + i}.pdf</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NEET • Physics</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">45 Qs</span>
                    </div>
                  </div>
                  <CheckCircle2 className="text-emerald-500" size={18} />
                </div>
              ))}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all opacity-75">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="text-rose-500" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-charcoal truncate">Chemistry_Chapter_3.pdf</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Failed • Invalid Format</p>
                </div>
                <AlertCircle className="text-rose-500" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
