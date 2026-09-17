import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Sparkles, FileText, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types';

interface DashboardProps {
  onAnalyzeSuccess: (result: AnalysisResponse) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAnalyzeSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    
    setSelectedFile(file);
    setIsUploading(true);
    
    try {
      const result = await apiService.uploadResume(file);
      setResumeText(result.extractedText);
      toast.success('Resume uploaded and parsed successfully.');
    } catch (error) {
      toast.error('Failed to parse resume. Please try again.');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) return;
    
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeMatch(resumeText, jobDescription);
      toast.success('Analysis complete!');
      onAnalyzeSuccess(result);
    } catch (error) {
      toast.error('Analysis failed. Please check the backend connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = resumeText.length > 0 && jobDescription.trim().length > 0 && !isAnalyzing && !isUploading;

  return (
    <motion.main 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-colors border border-slate-100 dark:border-slate-700"
    >
      {/* Educational Banner */}
      <div className="bg-primary-50 dark:bg-slate-900/50 p-6 md:p-8 border-b border-primary-100 dark:border-slate-700">
        <h2 className="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          How It Works
        </h2>
        <p className="text-primary-700 dark:text-slate-400 max-w-3xl leading-relaxed">
          Upload a candidate's resume and paste the target job description. Our AI model will perform a deep semantic analysis, evaluating hard skills, soft skills, and relevant experience to generate a comprehensive <strong>Recruiter Report</strong> and match score.
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Side: Resume Upload */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-bold shadow-inner">
              1
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Upload Resume
            </h2>
          </div>
          
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center h-72 ${
              isDragging 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]' 
                : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-primary-400 dark:hover:border-primary-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="application/pdf" 
              onChange={handleFileSelect} 
            />
            
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div key="uploading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <Loader2 className="w-14 h-14 text-primary-600 dark:text-primary-400 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium">Extracting text via AI...</p>
                </motion.div>
              ) : selectedFile ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                   <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 p-4 rounded-full mb-4 shadow-sm">
                     <FileText className="w-10 h-10" />
                   </div>
                   <p className="text-slate-800 dark:text-slate-100 font-semibold truncate max-w-[250px] px-4 text-lg">{selectedFile.name}</p>
                   <p className="text-green-600 dark:text-green-400 text-sm mt-2 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">✓ Ready for analysis</p>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg">Drag & drop your PDF here</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">or click to browse your files</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Job Description */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-bold shadow-inner">
              2
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Target Job Description
            </h2>
          </div>
          <div className="h-72 relative group">
            <Briefcase className="absolute top-4 left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-full p-4 pl-12 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Paste the target job description here..."
            />
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="bg-slate-50 dark:bg-slate-800/80 p-8 flex justify-center border-t border-slate-200 dark:border-slate-700">
        <button 
          onClick={handleAnalyze} 
          disabled={!canAnalyze}
          className="relative px-10 py-4 bg-slate-900 dark:bg-primary-600 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-primary-600 dark:hover:bg-primary-500 hover:shadow-primary-500/30 dark:hover:shadow-primary-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group flex items-center gap-3 w-full md:w-auto justify-center"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin w-6 h-6 text-white" />
              <span>AI is analyzing the candidate...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-primary-400 dark:text-white" />
              <span>Generate Match Report</span>
            </>
          )}
          
          {/* Shine effect */}
          {!isAnalyzing && canAnalyze && (
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          )}
        </button>
      </div>
    </motion.main>
  );
};
