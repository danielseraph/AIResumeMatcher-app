import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Dashboard } from './components/Dashboard';
import { Results } from './components/Results';
import type { AnalysisResponse } from './types';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or local storage here if needed
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 mb-2 tracking-tight">
              AI Resume Matcher
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Intelligently match candidates to job descriptions</p>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-105"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {!analysisResult ? (
          <Dashboard onAnalyzeSuccess={(result) => setAnalysisResult(result)} />
        ) : (
          <Results result={analysisResult} onReset={() => setAnalysisResult(null)} />
        )}
      </div>
      
      <Toaster position="bottom-right" richColors theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
}

export default App;
