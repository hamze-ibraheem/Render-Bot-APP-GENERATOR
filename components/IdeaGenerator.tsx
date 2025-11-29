
import React, { useState } from 'react';
import { generateAppIdeas } from '../services/geminiService';
import { AppProduct, Language } from '../types';
import { Loader, Sparkles, Zap } from './Icons';
import { AppCard } from './AppCard';

interface IdeaGeneratorProps {
  onIdeasGenerated: (ideas: AppProduct[]) => void;
  onAddToCart: (product: AppProduct) => void;
  onSave?: (product: AppProduct) => void;
  savedIds?: string[];
  language?: Language;
}

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ 
  onIdeasGenerated, 
  onAddToCart,
  onSave,
  savedIds = [],
  language = 'en'
}) => {
  const [niche, setNiche] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdeas, setCurrentIdeas] = useState<AppProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isAr = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentIdeas([]);

    try {
      const rawIdeas = await generateAppIdeas(niche);
      
      const processedIdeas: AppProduct[] = rawIdeas.map((idea, index) => ({
        ...idea,
        id: `gen-${Date.now()}-${index}`,
        imageSeed: Math.floor(Math.random() * 1000),
        isAI: true
      }));

      setCurrentIdeas(processedIdeas);
      onIdeasGenerated(processedIdeas);
    } catch (err) {
      setError(isAr 
        ? "فشل في توليد الأفكار. يرجى المحاولة بموضوع مختلف أو التحقق من الاتصال." 
        : "Failed to generate ideas. Please try a different topic or check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2 dark:text-white">
          <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          {isAr ? "مولد أفكار التطبيقات الذكي" : "AI App Idea Generator"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {isAr 
            ? 'أدخل مجالاً أو هواية أو مشكلة (مثلاً: "تطبيق للمشي مع الكلاب" أو "الزراعة المستدامة"). سيقوم Gemini بتصميم مفاهيم تطبيقات كاملة لك.'
            : 'Enter a niche, hobby, or problem (e.g., "Dog walking for seniors" or "Sustainable gardening"). Gemini AI will architect complete app concepts for you.'
          }
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-16">
        <form onSubmit={handleSubmit} className="relative">
          <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <input
            type="text"
            className={`block w-full ${isAr ? 'pr-12 pl-32' : 'pl-12 pr-32'} py-4 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-2xl shadow-lg shadow-indigo-100/50 dark:shadow-none text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
            placeholder={isAr ? "صف فكرتك..." : "Describe your niche..."}
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !niche.trim()}
            className={`absolute ${isAr ? 'left-2' : 'right-2'} top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>{isAr ? "يفكر..." : "Thinking..."}</span>
              </>
            ) : (
              (isAr ? 'توليد' : 'Generate')
            )}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
      </div>

      {isLoading && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="inline-block relative">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isAr ? "جارٍ التفكير..." : "Thinking..."}
            </div>
            <p className="text-sm text-slate-400 mt-2">{isAr ? "يقوم Gemini بطرح المفاهيم" : "Gemini is brainstorming concepts"}</p>
          </div>
        </div>
      )}

      {currentIdeas.length > 0 && !isLoading && (
        <div className="animate-fade-in-up">
           <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">
             {isAr ? `مفاهيم مولدة لـ "${niche}"` : `Generated Concepts for "${niche}"`}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentIdeas.map(idea => (
              <AppCard 
                key={idea.id} 
                product={idea} 
                onAddToCart={onAddToCart}
                onSave={onSave}
                isSaved={savedIds.includes(idea.id)}
                language={language}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
