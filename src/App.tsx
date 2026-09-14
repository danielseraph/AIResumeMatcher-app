import { useState } from 'react';
import { Toaster } from 'sonner';
import { Dashboard } from './components/Dashboard';
import { Results } from './components/Results';
import type { AnalysisResponse } from './types';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">AI Resume Matcher</h1>
          <p className="text-slate-500">Intelligently match candidates to job descriptions</p>
        </header>

        {!analysisResult ? (
          <Dashboard onAnalyzeSuccess={(result) => setAnalysisResult(result)} />
        ) : (
          <Results result={analysisResult} onReset={() => setAnalysisResult(null)} />
        )}
      </div>
      
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
