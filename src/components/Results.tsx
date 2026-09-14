import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Briefcase, RefreshCcw } from 'lucide-react';
import type { AnalysisResponse } from '../types';

interface ResultsProps {
  result: AnalysisResponse;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'suggestions'>('skills');

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const tabs = [
    { id: 'skills', label: 'Skills Analysis' },
    { id: 'experience', label: 'Experience' },
    { id: 'suggestions', label: 'Actionable Suggestions' }
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header / Verdict Card */}
      <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Briefcase className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-700 bg-slate-800 shrink-0 shadow-inner">
            <span className={`text-4xl font-bold ${getScoreColor(result.matchScore)}`}>
              {result.matchScore}<span className="text-xl text-slate-400">%</span>
            </span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Verdict: {result.verdict}</h2>
            <p className="text-slate-300 text-lg leading-relaxed">{result.summary}</p>
          </div>
          
          <button 
            onClick={onReset} 
            className="flex items-center gap-2 mt-4 md:mt-0 px-5 py-3 border border-slate-600 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap font-semibold"
          >
            <RefreshCcw className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Score Breakdown (3-bar chart equivalent) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-slate-200 bg-slate-50">
        {[
          { label: 'Technical Skills', score: result.scoreBreakdown.technicalSkills },
          { label: 'Experience', score: result.scoreBreakdown.experience },
          { label: 'Soft Skills', score: result.scoreBreakdown.softSkills }
        ].map(item => (
          <div key={item.label} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between mb-3">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2.5 rounded-full ${getScoreBg(item.score)}`} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="p-8">
        <div className="flex border-b border-slate-200 mb-6 gap-8 overflow-x-auto">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-medium text-lg transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5" /> Matched Skills
                  </h3>
                  <div className="space-y-3">
                    {result.matchedHardSkills.map(skill => (
                      <div key={skill.skill} className="p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm">
                        <span className="font-bold text-green-800">{skill.skill}</span>
                        <p className="text-sm text-green-700 mt-1">{skill.detail}</p>
                      </div>
                    ))}
                    {result.matchedSoftSkills.map(skill => (
                      <div key={skill.skill} className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm">
                        <span className="font-bold text-emerald-800">{skill.skill} <span className="text-xs uppercase bg-emerald-200 px-2 py-0.5 rounded ml-2">Soft</span></span>
                        <p className="text-sm text-emerald-700 mt-1">{skill.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5" /> Missing Skills
                  </h3>
                  <div className="space-y-3">
                    {result.missingHardSkills.length > 0 ? (
                      result.missingHardSkills.map(skill => (
                        <div key={skill.skill} className="p-4 bg-red-50 border border-red-100 rounded-lg shadow-sm">
                          <span className="font-bold text-red-800">{skill.skill}</span>
                          <p className="text-sm text-red-700 mt-1">{skill.detail}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-slate-500 italic border border-slate-200 rounded-lg bg-slate-50">
                        No critical skills missing!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Experience Analysis</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{result.experienceAnalysis}</p>
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                {result.suggestions.map((suggestion, idx) => {
                  const priorityColors = {
                    'High': 'bg-red-100 text-red-600',
                    'Medium': 'bg-yellow-100 text-yellow-600',
                    'Low': 'bg-blue-100 text-blue-600'
                  };
                  return (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 mt-1 ${priorityColors[suggestion.priority]}`}>
                        {suggestion.priority}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{suggestion.title}</h4>
                        <p className="text-slate-600 mt-1">{suggestion.detail}</p>
                      </div>
                    </div>
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
