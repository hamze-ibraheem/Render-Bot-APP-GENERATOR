
import React from 'react';
import { ShoppingBag, Zap, LayoutDashboard, UserIcon, Store, Trophy, Sun, Moon, Globe } from './Icons';
import { Logo } from './Logo';
import { Page, User, Language } from '../types';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentPage: Page;
  user: User | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
  t: any; // Translation object
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  cartCount, 
  onOpenCart, 
  currentPage, 
  user, 
  theme, 
  onToggleTheme,
  language,
  onToggleLanguage,
  t
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/20 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" withText={true} />
        </div>

        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <div className="hidden md:flex space-x-6 rtl:space-x-reverse items-center">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition ${currentPage === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              {t.nav_home}
            </button>
            <button 
              onClick={() => onNavigate('generator')}
              className={`text-sm font-medium transition flex items-center gap-1 ${currentPage === 'generator' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              <Zap className="w-4 h-4" />
              {t.nav_generator}
            </button>
            <button 
              onClick={() => onNavigate('marketplace')}
              className={`text-sm font-medium transition ${currentPage === 'marketplace' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              {t.nav_marketplace}
            </button>
            <button 
              onClick={() => onNavigate('vendors')}
              className={`text-sm font-medium transition flex items-center gap-1 ${currentPage === 'vendors' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              <Store className="w-4 h-4" />
              {t.nav_vendors}
            </button>
            <button 
              onClick={() => onNavigate('pricing')}
              className={`text-sm font-medium transition ${currentPage === 'pricing' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              {t.nav_pricing}
            </button>
            
            {user && (
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`text-sm font-medium transition flex items-center gap-1 ${currentPage === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t.nav_dashboard}
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

          <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <button
              onClick={onToggleLanguage}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
              aria-label="Toggle Language"
              title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

             {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {user && (
               <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-500 px-2" title="Genius Points">
                    <Trophy className="w-3 h-3" /> {user.points}
                  </div>
                  <div className="w-px h-3 bg-slate-200 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 px-2" title="AI Credits">
                    <Zap className="w-3 h-3" /> {user.credits}
                  </div>
               </div>
            )}

            <button 
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
               <div 
                 onClick={() => onNavigate('dashboard')}
                 className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition"
               >
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
               </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-md"
              >
                <UserIcon className="w-4 h-4" />
                {t.nav_signin}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};