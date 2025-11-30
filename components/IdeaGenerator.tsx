import React, { useState } from 'react';
import { generateAppIdeas } from '../services/geminiService';
import { AppProduct, Language } from '../types';
import { Loader, Sparkles, Zap, Smartphone, Globe, Cpu, Gamepad, Layers, Box, Key, Eye, EyeOff } from './Icons';
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
  const [platform, setPlatform] = useState('Mobile');
  const [complexity, setComplexity] = useState('Standard');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
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
      const rawIdeas = await generateAppIdeas(niche, platform, complexity, 3, apiKey);
      
      const processedIdeas: AppProduct[] = rawIdeas.map((idea, index) => ({
        ...idea,
        id: `gen-${Date.now()}-${index}`,
        imageSeed: Math.floor(Math.random() * 1000),
        isAI: true
      }));

      setCurrentIdeas(processedIdeas);
      onIdeasGenerated(processedIdeas);
    } catch (err) {
      console.error("Failed to generate ideas:", err);
      setError(isAr 
        ? "فشل في توليد الأفكار. يرجى المحاولة بموضوع مختلف أو التحقق من الاتصال." 
        : "Failed to generate ideas. Please check your API key or connection."
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
            ? 'أدخل مجالاً أو هواية أو مشكلة. سيقوم Gemini بتصميم مفاهيم تطبيقات كاملة مخصصة لاحتياجاتك.'
            : 'Enter a niche, hobby, or problem. Gemini AI will architect complete app concepts tailored to your requirements.'
          }
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                 <Sparkles className="h-5 w-5 text-indigo-400" />
               </div>
               <input
                 type="text"
                 className={`block w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-2xl shadow-sm text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                 placeholder={isAr ? "صف فكرتك... (مثلاً: الزراعة المستدامة)" : "Describe your niche... (e.g., Sustainable gardening)"}
                 value={niche}
                 onChange={(e) => setNiche(e.target.value)}
                 disabled={isLoading}
               />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">{isAr ? 'المنصة' : 'Platform'}</label>
              <div className="relative">
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className={`appearance-none w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-8'} py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="Mobile">Mobile App (iOS/Android)</option>
                  <option value="Web">Web Application (SaaS)</option>
                  <option value="Cross-platform">Cross-platform</option>
                  <option value="Game">Mobile Game</option>
                  <option value="Watch">Wearable/Watch App</option>
                </select>
                <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  {platform === 'Mobile' && <Smartphone className="w-4 h-4 text-slate-400" />}
                  {platform === 'Web' && <Globe className="w-4 h-4 text-slate-400" />}
                  {platform === 'Cross-platform' && <Layers className="w-4 h-4 text-slate-400" />}
                  {platform === 'Game' && <Gamepad className="w-4 h-4 text-slate-400" />}
                  {platform === 'Watch' && <Box className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">{isAr ? 'التعقيد' : 'Complexity'}</label>
              <div className="relative">
                <select 
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className={`appearance-none w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-8'} py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="MVP">MVP (Simple/Core Features)</option>
                  <option value="Standard">Standard (Full Featured)</option>
                  <option value="Advanced">Advanced (AI/Complex Logic)</option>
                  <option value="Enterprise">Enterprise Scale</option>
                </select>
                <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Cpu className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">{isAr ? 'مفتاح API مخصص (اختياري)' : 'Custom API Key (Optional)'}</label>
             <div className="relative">
               <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                 <Key className="h-4 w-4 text-slate-400" />
               </div>
               <input
                 type={showApiKey ? "text" : "password"}
                 className={`block w-full ${isAr ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                 placeholder={isAr ? "أدخل مفتاح Gemini API الخاص بك" : "Enter your Gemini API Key"}
                 value={apiKey}
                 onChange={(e) => setApiKey(e.target.value)}
               />
               <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className={`absolute inset-y-0 ${isAr ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-slate-400 hover:text-slate-600`}
               >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
             </div>
             <p className="text-[10px] text-slate-400 mt-1 ml-1">
               {isAr 
                 ? 'اتركه فارغاً لاستخدام المفتاح الافتراضي للنظام. يتم استخدام مفتاحك محلياً فقط.' 
                 : 'Leave empty to use the system default key. Your key is only used locally.'}
             </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !niche.trim()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>{isAr ? "جاري التحليل والتوليد..." : "Analyzing & Generating..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {isAr ? 'توليد المخططات' : 'Generate Blueprints'}
              </>
            )}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
      </div>

      {isLoading && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="inline-block relative">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isAr ? "جارٍ التفكير..." : "Gemini is thinking..."}
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {isAr 
                ? `يقوم Gemini بتصميم تطبيقات ${platform} بمستوى ${complexity}` 
                : `Architecting ${complexity} ${platform} solutions for "${niche}"`
              }
            </p>
          </div>
        </div>
      )}

      {currentIdeas.length > 0 && !isLoading && (
        <div className="animate-fade-in-up">
           <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
             {isAr 
               ? `نتائج لـ: "${niche}" (${platform})` 
               : `Results for: "${niche}" (${platform} - ${complexity})`
             }
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