
import React from 'react';
import { ArrowRight, Cpu, Sparkles } from './Icons';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative pt-10 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-pink-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
            Turn Ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Apps</span> Instantly
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate innovative mobile app concepts, complete with features, tech stacks, and business plans. Or browse our marketplace of ready-to-launch codebases.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <Cpu className="w-5 h-5" />
              Generate App Idea
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
            >
              Browse Shop <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-slate-400 dark:text-slate-500 grayscale opacity-60">
             {/* Tech badges mock */}
             <span className="font-bold text-xl">React Native</span>
             <span className="font-bold text-xl">Flutter</span>
             <span className="font-bold text-xl">SwiftUI</span>
             <span className="font-bold text-xl">Kotlin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
