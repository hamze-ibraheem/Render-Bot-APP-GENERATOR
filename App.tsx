
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IdeaGenerator } from './components/IdeaGenerator';
import { Marketplace } from './components/Marketplace';
import { CartDrawer } from './components/CartDrawer';
import { Toaster } from './components/Toaster';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Pricing } from './components/Pricing';
import { VendorsList } from './components/VendorsList';
import { CopyrightPolicy } from './components/CopyrightPolicy';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { AppProduct, CartItem, Page, User, Order, UserRole, Language } from './types';
import { MOCK_APPS, MOCK_USER, MOCK_ORDERS, MOCK_VENDOR_APPS } from './constants';
import { translations } from './translations';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [generatedApps, setGeneratedApps] = useState<AppProduct[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Auth & User State
  const [user, setUser] = useState<User | null>(null);
  const [savedApps, setSavedApps] = useState<AppProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // Vendor State
  const [vendorApps, setVendorApps] = useState<AppProduct[]>(MOCK_VENDOR_APPS);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  // Get current translation
  const t = translations[language];

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply language direction
  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
    
    // Update font family based on language for better Arabic rendering
    if (language === 'ar') {
      document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  // Load state from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('renderbot_user');
    const storedSavedApps = localStorage.getItem('renderbot_saved');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedSavedApps) setSavedApps(JSON.parse(storedSavedApps));
  }, []);

  // Save state to local storage when changed
  useEffect(() => {
    if (user) localStorage.setItem('renderbot_user', JSON.stringify(user));
    else localStorage.removeItem('renderbot_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('renderbot_saved', JSON.stringify(savedApps));
  }, [savedApps]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: AppProduct) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) return prev;
      showToast(language === 'ar' ? `تمت إضافة ${product.name_ar || product.name} إلى السلة` : `Added ${product.name} to cart`);
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const navigateTo = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const handleGeneratedIdeas = (ideas: AppProduct[]) => {
    setGeneratedApps(prev => [...ideas, ...prev]);
    showToast(language === 'ar' ? "تم توليد أفكار جديدة بنجاح!" : "New ideas generated successfully!");
  };

  const handleLogin = (email: string) => {
    // Simulate login by setting mock user
    const newUser = { ...MOCK_USER, email };
    setUser(newUser);
    showToast(language === 'ar' ? `مرحباً بعودتك، ${newUser.name}!` : `Welcome back, ${newUser.name}!`);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    showToast(language === 'ar' ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
    navigateTo('home');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      showToast(language === 'ar' ? "تم تحديث الحساب بنجاح" : `Account updated successfully`);
    }
  };

  const toggleSaveApp = (product: AppProduct) => {
    if (!user) {
      showToast(language === 'ar' ? "يرجى تسجيل الدخول لحفظ الأفكار" : "Please login to save ideas");
      navigateTo('login');
      return;
    }

    setSavedApps(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast(language === 'ar' ? "تمت الإزالة من الأفكار المحفوظة" : "Removed from Saved Ideas");
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(language === 'ar' ? "تم الحفظ في لوحة التحكم" : "Saved to Dashboard");
        return [...prev, product];
      }
    });
  };

  const handleAddVendorApp = (app: AppProduct) => {
    setVendorApps(prev => [app, ...prev]);
    showToast(language === 'ar' ? "تم إدراج التطبيق الجديد بنجاح!" : "New app listed successfully!");
  };

  const handleRemoveVendorApp = (app: AppProduct) => {
    setVendorApps(prev => prev.filter(a => a.id !== app.id));
    showToast(language === 'ar' ? "تمت إزالة قائمة التطبيق" : "App listing removed");
  };

  const handleBecomeVendor = () => {
    if (!user) {
      showToast(language === 'ar' ? "يرجى تسجيل الدخول أولاً للتقديم." : "Please login first to apply.");
      navigateTo('login');
      return;
    }
    
    if (user.role === 'vendor') {
      showToast(language === 'ar' ? "أنت بالفعل بائع مسجل." : "You are already a registered vendor.");
      navigateTo('dashboard');
      return;
    }

    const updatedUser = { ...user, role: 'vendor' as UserRole };
    setUser(updatedUser);
    showToast(language === 'ar' ? "تمت الموافقة على الطلب! مرحباً بك في برنامج البائعين." : "Application approved! Welcome to the Vendor Program.");
    navigateTo('dashboard');
  };

  // Combine mock apps, generated apps, and vendor apps for the marketplace
  const allApps = [...generatedApps, ...vendorApps, ...MOCK_APPS];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden dark:bg-slate-950 transition-colors duration-300">
      <Navbar 
        onNavigate={navigateTo} 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)}
        currentPage={currentPage}
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onToggleLanguage={toggleLanguage}
        t={t}
      />

      <main className="flex-grow pt-20">
        {currentPage === 'home' && (
          <>
            <Hero onGetStarted={() => navigateTo('generator')} t={t} />
            <div className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">{t.feat_title}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  {t.feat_subtitle}
                </p>
              </div>
              <Marketplace 
                products={[...MOCK_APPS.slice(0, 3), ...vendorApps.slice(0, 1)]} 
                onAddToCart={addToCart} 
                featured={true}
                onSave={toggleSaveApp}
                savedIds={savedApps.map(a => a.id)}
                language={language}
              />
               <div className="text-center mt-12">
                <button 
                  onClick={() => navigateTo('marketplace')}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.feat_view_all}
                </button>
              </div>
            </div>
          </>
        )}

        {currentPage === 'generator' && (
          <IdeaGenerator 
            onIdeasGenerated={handleGeneratedIdeas} 
            onAddToCart={addToCart}
            onSave={toggleSaveApp}
            savedIds={savedApps.map(a => a.id)}
            language={language}
          />
        )}

        {currentPage === 'marketplace' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 dark:text-white">{t.nav_marketplace}</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {language === 'ar' 
                  ? "اكتشف مفاهيم تطبيقات جاهزة وأكواد برمجية تم إنشاؤها بواسطة الذكاء الاصطناعي وخبراء معتمدين."
                  : "Discover ready-made app concepts and codebases generated by AI and vetted experts."
                }
              </p>
            </div>
            <Marketplace 
              products={allApps} 
              onAddToCart={addToCart} 
              onSave={toggleSaveApp}
              savedIds={savedApps.map(a => a.id)}
              language={language}
            />
          </div>
        )}

        {currentPage === 'vendors' && (
          <VendorsList 
            onNavigate={() => navigateTo('marketplace')} 
            onBecomeVendor={handleBecomeVendor}
            language={language}
          />
        )}

        {currentPage === 'pricing' && (
          <Pricing onNavigate={user ? () => navigateTo('dashboard') : () => navigateTo('login')} />
        )}
        
        {currentPage === 'copyright' && (
          <CopyrightPolicy />
        )}

        {currentPage === 'terms' && (
          <TermsOfService />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicy />
        )}

        {currentPage === 'login' && (
          <AuthPage onLogin={handleLogin} />
        )}

        {currentPage === 'dashboard' && user && (
          <Dashboard 
            user={user}
            savedApps={savedApps}
            orders={orders}
            onLogout={handleLogout}
            onAddToCart={addToCart}
            onRemoveSaved={toggleSaveApp}
            onUpdateUser={handleUpdateUser}
            vendorApps={vendorApps}
            onAddVendorApp={handleAddVendorApp}
            onRemoveVendorApp={handleRemoveVendorApp}
            language={language}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} t={t} />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart}
        language={language}
      />

      {toastMessage && <Toaster message={toastMessage} />}
    </div>
  );
}
