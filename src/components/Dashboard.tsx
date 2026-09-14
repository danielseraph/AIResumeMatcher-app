import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all"
    >
      <div className="flex flex-col md:flex-row">
        
        {/* Left Side: Resume Upload */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-slate-200">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
             <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-lg">1</span> 
             Upload Resume (PDF)
          </h2>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer flex flex-col items-center justify-center h-64 ${
              isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'
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
            
            {isUploading ? (
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            ) : selectedFile ? (
              <div className="flex flex-col items-center">
                 <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
                   <UploadCloud className="w-8 h-8" />
                 </div>
                 <p className="text-primary-600 font-semibold truncate max-w-[200px] px-4">{selectedFile.name}</p>
                 <p className="text-slate-500 text-sm mt-1">Ready for analysis</p>
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">Drag & drop your PDF here</p>
                <p className="text-slate-400 text-sm mt-1">or click to browse files</p>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Job Description */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-lg">2</span> 
            Target Job Description
          </h2>
          <div className="h-64">
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-shadow"
              placeholder="Paste the target job description here..."
            />
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="bg-slate-50 p-6 flex justify-center border-t border-slate-200">
        <button 
          onClick={handleAnalyze} 
          disabled={!canAnalyze}
          className="relative px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-600 hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 text-white" />
              <span>AI is analyzing the candidate...</span>
            </>
          ) : (
            <>
              <span>Analyze Match</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </motion.main>
  );
};
