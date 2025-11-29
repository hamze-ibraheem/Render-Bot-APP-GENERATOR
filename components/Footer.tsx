
import React from 'react';
import { Page } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate?: (page: Page) => void;
  t: any; // Translation object
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, t }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
               <Logo className="w-8 h-8" withText={true} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              {t.footer_desc}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.footer_col_platform}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate && onNavigate('marketplace')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.nav_marketplace}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('generator')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.nav_generator}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('pricing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.nav_pricing}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('vendors')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.nav_vendors}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.footer_col_legal}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate && onNavigate('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.footer_terms}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.footer_privacy}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('copyright')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t.footer_copyright}</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <p className="text-sm text-slate-400">{t.footer_rights}</p>
            <div className="flex gap-4">
               {/* Social icons placeholder */}
               <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
               </a>
               <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
               </a>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-700">
             <strong className="block text-slate-700 dark:text-slate-300 mb-2 font-semibold">{t.license_title}</strong>
             <p className="mb-3">
               {t.license_desc}
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <div className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                  <div>
                     <strong className="text-slate-700 dark:text-slate-300">{t.lic_standard}</strong>
                     <p>{t.lic_standard_desc}</p>
                  </div>
               </div>
               <div className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                  <div>
                     <strong className="text-slate-700 dark:text-slate-300">{t.lic_extended}</strong>
                     <p>{t.lic_extended_desc}</p>
                  </div>
               </div>
               <div className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                  <div>
                     <strong className="text-slate-700 dark:text-slate-300">{t.lic_exclusive}</strong>
                     <p>{t.lic_exclusive_desc}</p>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};