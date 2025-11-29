
import React, { useState } from 'react';
import { ArrowRight, UserIcon, Terminal, Store, Shield } from './Icons';
import { Logo } from './Logo';
import { UserRole, Language } from '../types';
import { translations } from '../translations';

interface AuthPageProps {
  onLogin: (email: string, password?: string) => void;
  onSignup: (name: string, email: string, role: UserRole) => void;
  language?: Language;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, language = 'en' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];
  const isAr = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        onLogin(email, password);
      } else {
        onSignup(name, email, role);
      }
      setIsLoading(false);
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
  };

  const roles: { id: UserRole; label: string; icon: React.FC<any> }[] = [
    { id: 'user', label: t.role_user, icon: UserIcon },
    { id: 'developer', label: t.role_developer, icon: Terminal },
    { id: 'vendor', label: t.role_vendor, icon: Store },
    { id: 'admin', label: t.role_admin, icon: Shield },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
        <div className="text-center">
          <div className="flex justify-center mb-6">
             <Logo className="w-16 h-16" withText={false} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isLogin ? t.auth_welcome_back : t.auth_create_account}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? t.auth_welcome_back_desc : t.auth_create_account_desc}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth_fullname}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition dark:bg-slate-800"
                  placeholder={isAr ? "الاسم الكامل" : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.auth_email}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition dark:bg-slate-800"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.auth_password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition dark:bg-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.auth_role_label}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => (
                    <div 
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                        role === r.id 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500 text-indigo-700 dark:text-indigo-300' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-800'
                      }`}
                    >
                      <r.icon className={`w-6 h-6 ${role === r.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{r.label}</span>
                    </div>
                  ))}
                </div>
                {(role === 'admin' || role === 'vendor') && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1 animate-fade-in bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <Shield className="w-3 h-3" />
                    {t.auth_approval_hint}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                {t.auth_remember}
              </label>
            </div>

            {isLogin && (
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  {t.auth_forgot}
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg dark:shadow-none"
            >
              {isLoading 
                ? (isAr ? 'جاري المعالجة...' : 'Processing...') 
                : (isLogin ? t.auth_signin_btn : t.auth_signup_btn)
              }
              {!isLoading && (
                <span className={`absolute inset-y-0 flex items-center ${isAr ? 'left-0 pl-3' : 'right-0 pr-3'}`}>
                  <ArrowRight className={`h-4 w-4 text-indigo-300 group-hover:text-indigo-100 ${isAr ? 'rotate-180' : ''}`} />
                </span>
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          {isLogin ? t.auth_no_account : t.auth_has_account}{' '}
          <button 
            onClick={toggleMode}
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline focus:outline-none"
          >
            {isLogin ? t.auth_signup_link : t.auth_signin_link}
          </button>
        </p>
      </div>
    </div>
  );
};