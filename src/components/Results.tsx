import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Briefcase, RefreshCcw, TrendingUp, Lightbulb } from 'lucide-react';
import type { AnalysisResponse } from '../types';

interface ResultsProps {
  result: AnalysisResponse;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'suggestions'>('skills');

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500 dark:text-green-400';
    if (score >= 50) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-green-500 dark:bg-green-500';
    if (score >= 50) return 'bg-yellow-500 dark:bg-yellow-500';
    return 'bg-red-500 dark:bg-red-500';
  };

  const tabs = [
    { id: 'skills', label: 'Skills Analysis', icon: TrendingUp },
    { id: 'experience', label: 'Experience Review', icon: Briefcase },
    { id: 'suggestions', label: 'Action Plan', icon: Lightbulb }
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
    >
      {/* Header / Verdict Card */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 md:p-12 relative overflow-hidden">
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          
          {/* Animated SVG Circular Progress Gauge */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="10" />
              {/* Progress circle */}
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" 
                className={`stroke-current ${getScoreColor(result.matchScore)}`} 
                strokeWidth="10" 
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 1000" }}
                animate={{ strokeDasharray: `${(result.matchScore / 100) * 283} 283` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tabular-nums tracking-tighter">
                {result.matchScore}
              </span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-widest mt-1">Match</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
              AI Recruiter Verdict
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              {result.verdict}
            </h2>
            <p className="text-slate-300 md:text-lg leading-relaxed max-w-2xl">
              {result.summary}
            </p>
          </div>
          
          <button 
            onClick={onReset} 
            className="flex items-center gap-2 mt-6 md:mt-0 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all whitespace-nowrap font-bold text-white shadow-lg backdrop-blur-sm"
          >
            <RefreshCcw className="w-5 h-5" />
            New Scan
          </button>
        </div>
      </div>

      {/* Score Breakdown (3-bar chart equivalent) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        {[
          { label: 'Technical Skills', score: result.scoreBreakdown.technicalSkills },
          { label: 'Experience', score: result.scoreBreakdown.experience },
          { label: 'Soft Skills', score: result.scoreBreakdown.softSkills }
        ].map((item, i) => (
          <motion.div 
            key={item.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <div className="flex justify-between items-end mb-4">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
              <span className={`text-2xl font-black ${getScoreColor(item.score)}`}>{item.score}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                className={`h-full rounded-full ${getScoreBg(item.score)}`} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="p-8">
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 gap-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-4 font-semibold text-lg transition-all whitespace-nowrap border-b-2 relative ${
                  isActive 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-lg'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="min-h-[300px]"
          >
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500 shrink-0" /> 
                    <div>
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-400">Matched Skills</h3>
                      <p className="text-green-700 dark:text-green-500/80 text-sm">The candidate possesses these required skills.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {result.matchedHardSkills.map(skill => (
                      <div key={skill.skill} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                        <span className="font-extrabold text-slate-900 dark:text-white text-lg">{skill.skill}</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{skill.detail}</p>
                      </div>
                    ))}
                    {result.matchedSoftSkills.map(skill => (
                      <div key={skill.skill} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />
                        <span className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                          {skill.skill} 
                          <span className="text-xs uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md font-bold">Soft Skill</span>
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{skill.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-500 shrink-0" /> 
                    <div>
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-400">Missing Core Skills</h3>
                      <p className="text-red-700 dark:text-red-500/80 text-sm">Critical requirements not found in the resume.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {result.missingHardSkills.length > 0 ? (
                      result.missingHardSkills.map(skill => (
                        <div key={skill.skill} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                          <span className="font-extrabold text-slate-900 dark:text-white text-lg">{skill.skill}</span>
                          <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{skill.detail}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center border-2 border-dashed border-green-200 dark:border-green-800 rounded-2xl bg-green-50/50 dark:bg-green-900/10">
                        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                        <p className="text-green-700 dark:text-green-500 font-bold text-lg">Incredible Match!</p>
                        <p className="text-green-600/80 dark:text-green-400/80 mt-1">No critical skills are missing.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="max-w-4xl mx-auto">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden">
                  <Briefcase className="absolute right-0 bottom-0 w-64 h-64 text-slate-200 dark:text-slate-800 opacity-20 -mb-10 -mr-10 pointer-events-none" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">Experience deep-dive</h3>
                  <div className="prose prose-lg dark:prose-invert relative z-10 max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-wrap font-medium">
                      {result.experienceAnalysis}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">How to improve this match</h3>
                  <p className="text-slate-500 dark:text-slate-400">Actionable advice for the candidate to secure an interview.</p>
                </div>
                
                {result.suggestions.map((suggestion, idx) => {
                  const priorityStyles = {
                    'High': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
                    'Medium': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50',
                    'Low': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50'
                  };
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest border shrink-0 flex items-center justify-center min-w-[120px] ${priorityStyles[suggestion.priority]}`}>
                        {suggestion.priority} Priority
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{suggestion.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{suggestion.detail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
