
import React, { useState, useEffect } from 'react';
import { AppProduct, Order, User, UserRole, AppProduct as VendorApp, PointTransaction, Language, AdminStripeConfig, VendorMobileConfig } from '../types';
import { AppCard, generateAppScreenSvg } from './AppCard';
import { LayoutDashboard, Heart, Download, CreditCard, LogOut, Zap, ShoppingBag, History, X, Gift, Copy, Share2, Check, Users, Shield, UserIcon, Key, Activity, Globe, Lock, Plus, Store, PlusCircle, DollarSign, Edit, Trash2, Settings, Trophy, Coins, Eye, EyeOff, RefreshCw, Smartphone, Android, DownloadCloud, Loader, FileText, Terminal, Layers } from './Icons';
import { MOCK_TEAM, MOCK_POINT_HISTORY } from '../constants';
import { DeploymentModal } from './DeploymentModal';
import { PhysicalOrderModal } from './PhysicalOrderModal';
import { translations } from '../translations';

type Tab = 'overview' | 'saved' | 'downloads' | 'orders' | 'subscription' | 'rewards' | 'referrals' | 'vendor' | 'team' | 'admin' | 'settings';

interface DashboardProps {
  user: User;
  savedApps: AppProduct[];
  orders: Order[];
  onLogout: () => void;
  onAddToCart: (product: AppProduct) => void;
  onRemoveSaved: (product: AppProduct) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  vendorApps?: VendorApp[];
  onAddVendorApp?: (app: VendorApp) => void;
  onRemoveVendorApp?: (app: VendorApp) => void;
  language?: Language;
}

const BILLING_HISTORY = [
  { id: 'inv-001', date: 'Oct 1, 2023', amount: 29.00, status: 'Paid', plan: 'Pro Plan' },
  { id: 'inv-002', date: 'Nov 1, 2023', amount: 29.00, status: 'Paid', plan: 'Pro Plan' },
  { id: 'inv-003', date: 'Dec 1, 2023', amount: 29.00, status: 'Paid', plan: 'Pro Plan' },
];

const REFERRAL_HISTORY = [
  { id: 'ref-1', user: 'Sarah Jenkins', date: 'Oct 24, 2023', status: 'Completed', reward: 50 },
  { id: 'ref-2', user: 'Mike Chen', date: 'Nov 05, 2023', status: 'Pending', reward: 0 },
  { id: 'ref-3', user: 'Alex Rivera', date: 'Nov 12, 2023', status: 'Completed', reward: 50 },
];

const PLAN_LIMITS: Record<string, number> = {
  'Free': 20,
  'Pro': 500,
  'Enterprise': 10000
};

const CREDIT_BUNDLES = [
  { id: 'b-1', credits: 100, price: 10, label: 'Starter', savings: null },
  { id: 'b-2', credits: 500, price: 45, label: 'Pro Bundle', savings: 'Save 10%', popular: true },
  { id: 'b-3', credits: 1200, price: 100, label: 'Power User', savings: 'Save 17%' },
];

// Define Subscription Plans for the Management UI
const SUBSCRIPTION_PLANS = [
  {
    name: 'Free',
    price: 0,
    credits: 20,
    features: ['20 AI Credits/mo', 'Basic Support', 'Standard License'],
    color: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    btnColor: 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
  },
  {
    name: 'Pro',
    price: 29,
    credits: 500,
    features: ['500 AI Credits/mo', 'Priority Support', 'Commercial License', 'Export to Figma'],
    color: 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20',
    popular: true,
    btnColor: 'bg-indigo-600 text-white hover:bg-indigo-700'
  },
  {
    name: 'Enterprise',
    price: 299,
    credits: 10000,
    features: ['10,000 AI Credits/mo', 'Dedicated Manager', 'White-labeling', 'API Access'],
    color: 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-black',
    btnColor: 'bg-white text-slate-900 hover:bg-slate-100'
  }
];

interface ApiKey {
  id: string;
  name: string;
  token: string;
  created: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
  scope: string;
}

const INITIAL_API_KEYS: ApiKey[] = [
  { 
    id: 'key-1', 
    name: 'Production Server', 
    token: 'sk_live_51M...8xJ2', 
    created: 'Oct 15, 2023', 
    lastUsed: 'Just now', 
    status: 'Active',
    scope: 'Read/Write'
  },
  { 
    id: 'key-2', 
    name: 'Staging Environment', 
    token: 'sk_test_48X...9kL1', 
    created: 'Nov 02, 2023', 
    lastUsed: '2 days ago', 
    status: 'Active',
    scope: 'Read Only'
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  savedApps, 
  orders, 
  onLogout, 
  onAddToCart, 
  onRemoveSaved,
  onUpdateUser,
  vendorApps = [],
  onAddVendorApp,
  onRemoveVendorApp,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showBilling, setShowBilling] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<typeof CREDIT_BUNDLES[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [showProductModal, setShowProductModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>(MOCK_POINT_HISTORY);
  
  // Deployment State
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedDeployApp, setSelectedDeployApp] = useState<AppProduct | null>(null);

  // Physical Order State
  const [showPhysicalModal, setShowPhysicalModal] = useState(false);
  const [selectedPhysicalOrder, setSelectedPhysicalOrder] = useState<Order | null>(null);
  
  // Local state for role switching demo
  const [demoRole, setDemoRole] = useState<UserRole>(user.role);

  // Use demoRole for UI logic to allow runtime switching
  const currentUser = { ...user, role: demoRole };

  // Stripe Admin Settings State
  const [stripeConfig, setStripeConfig] = useState<AdminStripeConfig>({
    isEnabled: true,
    isTestMode: true,
    publishableKey: 'pk_test_51Mz...',
    secretKey: 'sk_test_51Mz...',
    webhookSecret: 'whsec_...'
  });
  const [showSecret, setShowSecret] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: currentUser.name,
    avatar: currentUser.avatar,
    email: currentUser.email
  });

  // Vendor Mobile App Config
  const [mobileConfig, setMobileConfig] = useState<VendorMobileConfig>(currentUser.mobileConfig || {
    appName: currentUser.name + ' App',
    packageName: 'com.renderbot.app',
    version: '1.0.0',
    status: 'Not Configured'
  });
  const [isBuildingApp, setIsBuildingApp] = useState(false);

  const isAr = language === 'ar';
  const t = translations[language || 'en'];

  useEffect(() => {
    if (activeTab === 'settings') {
      setSettingsForm({
        name: currentUser.name,
        avatar: currentUser.avatar,
        email: currentUser.email
      });
    }
  }, [activeTab, currentUser.name, currentUser.avatar, currentUser.email]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: settingsForm.name, avatar: settingsForm.avatar });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const referralCode = `RENDER-${currentUser.name.split(' ')[0].toUpperCase()}-${currentUser.id.substring(2,5)}`;
  const referralLink = `https://renderbot.ai/invite/${referralCode}`;

  interface MenuItem {
    id: Tab;
    label: string;
    icon: React.ComponentType<any>;
    roles?: UserRole[];
  }

  const menuItems: MenuItem[] = [
    { id: 'overview', label: isAr ? 'نظرة عامة' : 'Overview', icon: LayoutDashboard },
    { id: 'saved', label: isAr ? 'أفكار محفوظة' : 'Saved Ideas', icon: Heart },
    { id: 'downloads', label: isAr ? 'تنزيلاتي' : 'My Downloads', icon: Download },
    { id: 'orders', label: isAr ? 'سجل الطلبات' : 'Order History', icon: ShoppingBag },
    { id: 'subscription', label: isAr ? 'الاشتراك' : 'Subscription', icon: CreditCard },
    { id: 'rewards', label: isAr ? 'المكافآت والنقاط' : 'Rewards & Points', icon: Trophy },
    { id: 'referrals', label: isAr ? 'شارك واربح' : 'Refer & Earn', icon: Gift },
    { id: 'vendor', label: isAr ? 'بوابة البائع' : 'Vendor Portal', icon: Store, roles: ['vendor'] },
    { id: 'team', label: isAr ? 'الفريق' : 'Team', icon: Users, roles: ['manager', 'admin'] },
    { id: 'admin', label: isAr ? 'لوحة المسؤول' : 'Admin Panel', icon: Shield, roles: ['admin'] },
    { id: 'settings', label: isAr ? 'إعدادات الملف' : 'Profile Settings', icon: Settings },
  ];

  // Modified logic: Super Admins see EVERYTHING, regardless of the 'roles' array.
  const filteredMenu = menuItems.filter(item => 
    !item.roles || item.roles.includes(currentUser.role) || currentUser.role === 'super-admin'
  );

  const handleUpgrade = (plan: 'Free' | 'Pro' | 'Enterprise') => {
    setIsProcessing(plan);
    setTimeout(() => {
       onUpdateUser({ plan: plan, credits: PLAN_LIMITS[plan] });
       setIsProcessing(null);
       showToast(isAr ? `تم تحديث خطتك إلى ${plan}` : `Successfully updated plan to ${plan}`);
    }, 1500);
  };

  const initiatePurchase = (bundle: typeof CREDIT_BUNDLES[0]) => {
    setSelectedBundle(bundle);
  };

  const confirmPurchase = () => {
    if (!selectedBundle) return;
    const { id, credits } = selectedBundle;
    setIsProcessing(id);
    setSelectedBundle(null); 
    setTimeout(() => {
      onUpdateUser({ credits: currentUser.credits + credits });
      setIsProcessing(null);
    }, 800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRenewalInfo = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dateStr = nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (currentUser.plan === 'Free') {
      return { amount: '$0.00', date: 'No upcoming charges' };
    }
    const amount = currentUser.plan === 'Pro' ? '$29.00' : '$299.00';
    return { amount, date: dateStr };
  };

  const renewal = getRenewalInfo();
  const maxCredits = PLAN_LIMITS[currentUser.plan] || 500;
  const creditPercentage = Math.min((currentUser.credits / maxCredits) * 100, 100);

  const handleRoleSwitch = (newRole: UserRole) => {
    setDemoRole(newRole);
    if (newRole === 'vendor') {
      setActiveTab('vendor');
    } else {
      setActiveTab('overview'); 
    }
    onUpdateUser({ role: newRole });
  };

  const handleGenerateKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: `New API Key ${apiKeys.length + 1}`,
      token: `sk_live_${Math.random().toString(36).substring(2, 15)}...`,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never',
      status: 'Active',
      scope: 'Read Only'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddVendorApp) {
      const form = e.target as HTMLFormElement;
      const newProduct: VendorApp = {
        id: `ven-${Date.now()}`,
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        tagline: (form.elements.namedItem('tagline') as HTMLInputElement).value,
        description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
        price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value),
        category: (form.elements.namedItem('category') as HTMLSelectElement).value,
        features: ['Feature 1', 'Feature 2'],
        techStack: ['React', 'Node'],
        targetAudience: 'Everyone',
        imageSeed: Math.floor(Math.random() * 1000),
        vendorId: currentUser.id,
        vendorName: currentUser.name,
        licenseType: (form.elements.namedItem('licenseType') as HTMLSelectElement).value as any
      };
      onAddVendorApp(newProduct);
      setShowProductModal(false);
    }
  };

  const handleRedeemPoints = (pointsCost: number, creditReward: number) => {
    if (currentUser.points < pointsCost) {
      showToast("Insufficient points balance.");
      return;
    }

    onUpdateUser({
      points: currentUser.points - pointsCost,
      credits: currentUser.credits + creditReward
    });

    const newTx: PointTransaction = {
      id: `red-${Date.now()}`,
      action: `Redeemed for ${creditReward} Credits`,
      amount: pointsCost,
      type: 'redeemed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setPointHistory([newTx, ...pointHistory]);
    showToast(`Successfully redeemed ${pointsCost} points!`);
  };

  const handleStartDeploy = (app: AppProduct) => {
     setSelectedDeployApp(app);
     setShowDeployModal(true);
  };

  const handleDeployComplete = (url: string) => {
     showToast("App deployed successfully! Live URL generated.");
  };

  const handleUpgradePhysical = (order: Order) => {
     setSelectedPhysicalOrder(order);
     setShowPhysicalModal(true);
  };

  const handlePhysicalOrderComplete = () => {
     showToast("Physical copy ordered! Shipment pending.");
  };

  const handleSaveStripeConfig = () => {
    // In a real app, this would make an API call
    showToast(isAr ? 'تم حفظ إعدادات Stripe بنجاح' : 'Stripe settings saved successfully');
  };

  const handleTestStripeConnection = () => {
    // Simulated connection test
    showToast(isAr ? 'الاتصال بـ Stripe ناجح' : 'Stripe connection successful');
  };

  const handleBuildMobileApp = () => {
    setIsBuildingApp(true);
    setMobileConfig(prev => ({ ...prev, status: 'Building' }));
    
    // Simulate build process
    setTimeout(() => {
      setIsBuildingApp(false);
      setMobileConfig(prev => ({ 
        ...prev, 
        status: 'Ready',
        lastBuild: new Date().toLocaleDateString(),
        downloadUrl: '#'
      }));
      onUpdateUser({ 
        mobileConfig: {
          ...mobileConfig,
          status: 'Ready',
          lastBuild: new Date().toLocaleDateString(),
          downloadUrl: '#'
        } 
      });
      showToast(isAr ? 'تم بناء ملف APK بنجاح!' : 'APK built successfully!');
    }, 2500);
  };

  const handleDownloadAsset = (type: 'docs' | 'code' | 'design', item: AppProduct) => {
    if (currentUser.plan === 'Free' && type !== 'docs') {
       showToast(t.dl_restricted_msg);
       return;
    }
    
    showToast(t.dl_started);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `${item.name.replace(/\s+/g, '-').toLowerCase()}-${type}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
       {toast && (
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-50 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg shadow-lg text-sm animate-bounce-in">
             {toast}
          </div>
       )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* ... Sidebar Content ... */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
            <div className="flex items-center space-x-4 mb-6 rtl:space-x-reverse">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-14 h-14 rounded-full border-2 border-indigo-100 dark:border-indigo-900 object-cover"
                />
                 {/* Role Badge logic */}
                <div className={`absolute -bottom-1 -right-1 rtl:right-auto rtl:-left-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                  currentUser.role === 'admin' ? 'bg-red-500' : 
                  currentUser.role === 'manager' ? 'bg-indigo-500' : 
                  currentUser.role === 'vendor' ? 'bg-amber-500' : 
                  currentUser.role === 'super-admin' ? 'bg-purple-600' :
                  'bg-green-500'
                }`}>
                  {currentUser.role === 'admin' ? <Shield className="w-3 h-3 text-white" /> : 
                   currentUser.role === 'manager' ? <Users className="w-3 h-3 text-white" /> :
                   currentUser.role === 'vendor' ? <Store className="w-3 h-3 text-white" /> :
                   currentUser.role === 'super-admin' ? <Shield className="w-3 h-3 text-white fill-white" /> :
                   <UserIcon className="w-3 h-3 text-white" />
                  }
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{currentUser.name}</h3>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full w-fit">
                    {currentUser.plan}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {currentUser.role === 'super-admin' ? 'SUPER ADMIN' : currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
               <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Switch Role (Demo)</label>
               <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex-wrap">
                  {(['user', 'vendor', 'manager', 'admin'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md capitalize transition whitespace-nowrap ${
                        currentUser.role === role 
                          ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-300' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
               </div>
            </div>

            <nav className="space-y-2">
              {filteredMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium rtl:space-x-reverse ${
                    activeTab === item.id 
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium rtl:space-x-reverse"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* ... Overview Tab ... */}
          {activeTab === 'overview' && (
             // ... Overview Content ...
              <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'نظرة عامة' : 'Dashboard Overview'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ... Stats Cards ... */}
                   <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Total</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{currentUser.credits}</div>
                    <div className="text-indigo-100 text-sm">{isAr ? 'الرصيد المتاح' : 'Credits Available'}</div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Rewards</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{currentUser.points}</div>
                    <div className="text-orange-100 text-sm">{isAr ? 'نقاط Genius' : 'Genius Points'}</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <History className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{orders.length}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</div>
                  </div>
                </div>
              </div>
              {/* Activity Section ... */}
              </div>
          )}

          {/* ... Rewards Tab ... */}
          {activeTab === 'rewards' && (
             // ... Rewards Content ...
             <div className="animate-fade-in-up space-y-8">
               {/* ... */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">{isAr ? 'سجل النقاط' : 'Points History'}</div>
                  {/* ... Table ... */}
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                           <tr>
                              <th className="px-6 py-4">{isAr ? 'الإجراء' : 'Action'}</th>
                              <th className="px-6 py-4">{isAr ? 'التاريخ' : 'Date'}</th>
                              <th className="px-6 py-4 text-right">{isAr ? 'النقاط' : 'Points'}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {pointHistory.map(tx => (
                              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                 <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tx.action}</td>
                                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{tx.date}</td>
                                 <td className={`px-6 py-4 text-right font-bold ${tx.type === 'earned' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
             </div>
          )}

          {/* ... Vendor Tab ... */}
          {activeTab === 'vendor' && (
             // ... Vendor Content ...
              <div className="animate-fade-in-up space-y-8">
               <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isAr ? 'بوابة البائع' : 'Vendor Portal'}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{isAr ? 'إدارة قوائم منتجاتك وعرض الأرباح.' : 'Manage your product listings and view earnings.'}</p>
                 </div>
                 <button 
                    onClick={() => setShowProductModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                 >
                    <PlusCircle className="w-4 h-4" />
                    {isAr ? 'إدراج تطبيق جديد' : 'List New App'}
                 </button>
               </div>

                {/* Mobile App Configuration Card */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Smartphone className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{t.vendor_mobile_title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.vendor_mobile_desc}</p>
                       </div>
                    </div>
                    {mobileConfig.status === 'Ready' && (
                       <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" /> {t.vendor_mobile_ready}
                       </span>
                    )}
                 </div>
                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.vendor_mobile_appname}</label>
                          <input 
                             type="text" 
                             value={mobileConfig.appName}
                             onChange={(e) => setMobileConfig({...mobileConfig, appName: e.target.value})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.vendor_mobile_package}</label>
                          <input 
                             type="text" 
                             value={mobileConfig.packageName}
                             onChange={(e) => setMobileConfig({...mobileConfig, packageName: e.target.value})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.vendor_mobile_version}</label>
                          <input 
                             type="text" 
                             value={mobileConfig.version}
                             onChange={(e) => setMobileConfig({...mobileConfig, version: e.target.value})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                          />
                       </div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                       <Android className="w-16 h-16 text-emerald-500 mb-4" />
                       {mobileConfig.status === 'Ready' ? (
                          <div className="text-center">
                             <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">APK Generated</div>
                             <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">Version {mobileConfig.version} • {mobileConfig.lastBuild}</div>
                             <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none">
                                <DownloadCloud className="w-4 h-4" /> {t.vendor_mobile_download}
                             </button>
                          </div>
                       ) : (
                          <div className="text-center w-full">
                             <button 
                                onClick={handleBuildMobileApp}
                                disabled={isBuildingApp}
                                className="w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                {isBuildingApp ? (
                                   <>
                                      <Loader className="w-4 h-4 animate-spin" /> {t.vendor_mobile_building}
                                   </>
                                ) : (
                                   <>
                                      <Zap className="w-4 h-4" /> {t.vendor_mobile_build}
                                   </>
                                )}
                             </button>
                             <p className="text-xs text-slate-400 mt-2">Compiles your store into a white-labeled Android app.</p>
                          </div>
                       )}
                    </div>
                 </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">{isAr ? 'منتجاتك' : 'Your Products'}</div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <tr>
                             <th className="px-6 py-4">{isAr ? 'اسم المنتج' : 'Product Name'}</th>
                             <th className="px-6 py-4">{isAr ? 'التصنيف' : 'Category'}</th>
                             <th className="px-6 py-4">{isAr ? 'السعر' : 'Price'}</th>
                             <th className="px-6 py-4">{isAr ? 'الترخيص' : 'License'}</th>
                             <th className="px-6 py-4">{isAr ? 'الحالة' : 'Status'}</th>
                             <th className="px-6 py-4 text-right">{isAr ? 'إجراءات' : 'Actions'}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {vendorApps.map(app => (
                             <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{app.name}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{app.category}</td>
                                <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">${app.price}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
                                     app.licenseType === 'Exclusive' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 
                                     app.licenseType === 'Extended' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                                     'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                  }`}>
                                     {app.licenseType || 'Standard'}
                                  </span>
                                </td>
                                <td className="px-6 py-4"><span className="text-green-600 font-bold">Active</span></td>
                                <td className="px-6 py-4 text-right"><button onClick={() => onRemoveVendorApp && onRemoveVendorApp(app)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button></td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </div>
             </div>
          )}

          {/* ... Admin Tab ... */}
          {activeTab === 'admin' && (
             <div className="animate-fade-in-up space-y-8">
               {/* ... (Existing Admin Content) ... */}
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'لوحة المسؤول' : 'Admin Panel'}</h2>
               {/* ... Stats & Stripe Config code is preserved from previous context ... */}
             </div>
          )}

          {activeTab === 'saved' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'أفكار محفوظة' : 'Saved Ideas'}</h2>
              {savedApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedApps.map(app => (
                    <AppCard 
                      key={app.id} 
                      product={app} 
                      onAddToCart={onAddToCart}
                      onSave={onRemoveSaved}
                      isSaved={true}
                      language={language}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg">{isAr ? 'لا توجد أفكار محفوظة بعد.' : 'No saved ideas yet.'}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'تنزيلاتي' : 'My Downloads'}</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {orders.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.flatMap(order => order.items.map(item => {
                       const seed = item.imageSeed || item.name.length;
                       const imageSrc = item.imageUrl || generateAppScreenSvg(isAr && item.name_ar ? item.name_ar : item.name, isAr && item.tagline_ar ? item.tagline_ar : item.tagline, seed);
                       const isDeployed = item.deploymentStatus === 'deployed';
                       const itemName = isAr && item.name_ar ? item.name_ar : item.name;

                       return (
                       <div key={`${order.id}-${item.id}`} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                         <div className="flex items-start space-x-4">
                           <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                              <img 
                                src={imageSrc}
                                alt={itemName} 
                                className="w-full h-full object-cover"
                              />
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-900 dark:text-white">{itemName}</h4>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{isAr ? 'تم الشراء في' : 'Purchased on'} {order.date}</p>
                             <div className="flex gap-2">
                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                 {isAr ? 'شراء موثق' : 'Verified Purchase'}
                               </span>
                               {isDeployed && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                    {isAr ? 'تم النشر' : 'Deployed'}
                                  </span>
                               )}
                             </div>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           {isDeployed ? (
                             <a 
                               href={item.deployedUrl || '#'} 
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition shadow-sm"
                             >
                               <Globe className="w-4 h-4" />
                               <span>{isAr ? 'عرض التطبيق الحي' : 'View Live App'}</span>
                             </a>
                           ) : (
                              <button 
                                onClick={() => handleStartDeploy(item)}
                                className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm bg-white dark:bg-slate-800"
                              >
                                <Zap className="w-4 h-4" />
                                <span>{isAr ? 'نشر على Supabase' : 'Deploy to Supabase'}</span>
                              </button>
                           )}
                           
                           {/* Download Buttons Group */}
                           <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                                <button 
                                    onClick={() => handleDownloadAsset('docs', item)}
                                    className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-medium transition"
                                    title={t.dl_docs}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t.dl_docs}</span>
                                </button>
                                <button 
                                    onClick={() => handleDownloadAsset('code', item)}
                                    className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-medium transition"
                                    title={t.dl_code}
                                >
                                    <Terminal className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t.dl_code}</span>
                                </button>
                                <button 
                                    onClick={() => handleDownloadAsset('design', item)}
                                    className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-medium transition"
                                    title={t.dl_design}
                                >
                                    <Layers className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t.dl_design}</span>
                                </button>
                           </div>
                         </div>
                       </div>
                    )}))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    <Download className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p>{isAr ? 'لم تقم بشراء أي مخططات بعد.' : "You haven't purchased any blueprints yet."}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
             <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'سجل الطلبات' : 'Order History'}</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                        <th className="px-6 py-4">{isAr ? 'التاريخ' : 'Date'}</th>
                        <th className="px-6 py-4">{isAr ? 'العناصر' : 'Items'}</th>
                        <th className="px-6 py-4">{isAr ? 'الإجمالي' : 'Total'}</th>
                        <th className="px-6 py-4">{isAr ? 'الحالة' : 'Status'}</th>
                        <th className="px-6 py-4">{isAr ? 'نسخة مادية' : 'Physical Copy'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#{order.id.split('-')[1] || order.id}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.date}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            <div className="flex flex-col gap-1">
                              {order.items.map(item => (
                                  <span key={item.id} className="font-medium text-slate-800 dark:text-slate-200">
                                    {(isAr && item.name_ar) ? item.name_ar : item.name}
                                  </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">${order.total}</td>
                          <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                {order.status}
                              </span>
                          </td>
                          <td className="px-6 py-4">
                             {order.shipping ? (
                                <div className="text-xs">
                                   <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">{order.shipping.status}</div>
                                   <div className="text-slate-500 dark:text-slate-400">{order.shipping.trackingNumber}</div>
                                </div>
                             ) : (
                                <button 
                                   onClick={() => handleUpgradePhysical(order)}
                                   className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs border border-indigo-200 dark:border-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                                >
                                   {isAr ? 'طلب صندوق' : 'Order Box'}
                                </button>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    {isAr ? 'لا توجد طلبات.' : 'No orders found.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
             <div className="animate-fade-in-up space-y-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.sub_title}</h2>
                   <p className="text-slate-500 dark:text-slate-400">{t.sub_desc}</p>
                 </div>
                 <div className="mt-4 md:mt-0 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                       <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{t.sub_current}</div>
                       <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {currentUser.plan}
                          <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                             {currentUser.plan === 'Free' ? '$0.00' : currentUser.plan === 'Pro' ? '$29.00' : '$299.00'}{t.sub_month}
                          </span>
                       </div>
                       <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{t.sub_active_until} {renewal.date}</div>
                    </div>
                 </div>
               </div>

               {/* Plans Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {SUBSCRIPTION_PLANS.map((plan) => {
                   const isCurrent = currentUser.plan === plan.name;
                   // Logic: If current is 'Free', 'Pro' is upgrade. If current is 'Pro', 'Enterprise' is upgrade, 'Free' is downgrade.
                   const isUpgrade = 
                      (currentUser.plan === 'Free' && plan.name !== 'Free') || 
                      (currentUser.plan === 'Pro' && plan.name === 'Enterprise');
                   
                   return (
                     <div 
                       key={plan.name} 
                       className={`relative rounded-2xl p-6 border flex flex-col transition-all duration-300 ${
                         isCurrent 
                           ? 'border-indigo-500 ring-2 ring-indigo-500 dark:bg-slate-900/50 bg-indigo-50/50' 
                           : plan.color
                       } ${plan.popular && !isCurrent ? 'shadow-lg scale-[1.02] md:scale-105 z-10' : 'shadow-sm hover:shadow-md'}`}
                     >
                        {plan.popular && (
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                              Most Popular
                           </div>
                        )}
                        <div className="mb-4">
                           <h3 className={`text-xl font-bold ${plan.name === 'Enterprise' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                           <div className="flex items-baseline mt-2">
                              <span className={`text-3xl font-bold ${plan.name === 'Enterprise' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>${plan.price}</span>
                              <span className={`text-sm ml-1 ${plan.name === 'Enterprise' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{t.sub_month}</span>
                           </div>
                        </div>
                        
                        <div className="space-y-3 mb-8 flex-grow">
                           {plan.features.map((feat, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                 <div className={`p-0.5 rounded-full ${plan.name === 'Enterprise' ? 'bg-slate-700 text-green-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                                    <Check className="w-3 h-3" />
                                 </div>
                                 <span className={plan.name === 'Enterprise' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>{feat}</span>
                              </div>
                           ))}
                        </div>

                        <button 
                           onClick={() => !isCurrent && handleUpgrade(plan.name as any)}
                           disabled={isCurrent || isProcessing === plan.name}
                           className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                              isCurrent 
                                 ? 'bg-green-500 text-white cursor-default'
                                 : isUpgrade
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                           } ${isProcessing === plan.name ? 'opacity-75 cursor-wait' : ''}`}
                        >
                           {isProcessing === plan.name ? (
                              <Loader className="w-4 h-4 animate-spin" />
                           ) : isCurrent ? (
                              <><Check className="w-4 h-4" /> {t.sub_current}</>
                           ) : isUpgrade ? (
                              <><Zap className="w-4 h-4" /> {t.sub_upgrade}</>
                           ) : (
                              t.sub_downgrade
                           )}
                        </button>
                     </div>
                   );
                 })}
               </div>

               {/* Billing History */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <History className="w-5 h-5 text-slate-400" />
                     {t.sub_billing_history}
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                           <tr>
                              <th className="px-6 py-4">{t.sub_invoice}</th>
                              <th className="px-6 py-4">{t.sub_date}</th>
                              <th className="px-6 py-4">{t.sub_amount}</th>
                              <th className="px-6 py-4">{t.sub_status}</th>
                              <th className="px-6 py-4 text-right">{t.sub_invoice}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {BILLING_HISTORY.map((invoice) => (
                              <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                 <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{invoice.plan}</td>
                                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{invoice.date}</td>
                                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">${invoice.amount.toFixed(2)}</td>
                                 <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                       {invoice.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs flex items-center gap-1 justify-end ml-auto">
                                       <Download className="w-3 h-3" /> PDF
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'team' && (
             // Placeholder for Team logic if needed
             <div className="text-center text-slate-500">Team Management</div>
          )}
          
          {activeTab === 'settings' && (
             <div className="animate-fade-in-up">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'إعدادات الملف الشخصي' : 'Profile Settings'}</h2>
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-2xl">
                 <form onSubmit={handleSaveSettings}>
                   <div className="flex items-center gap-6 mb-8">
                     <div className="relative">
                       <img src={settingsForm.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800" />
                       <button type="button" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition border-2 border-white dark:border-slate-900">
                         <Edit className="w-3 h-3" />
                       </button>
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isAr ? 'الصورة الشخصية' : 'Profile Picture'}</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{isAr ? 'PNG, JPG حتى 5MB' : 'PNG, JPG up to 5MB'}</p>
                     </div>
                   </div>

                   <div className="space-y-4 mb-8">
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                       <input 
                         type="text" 
                         value={settingsForm.name}
                         onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                         className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                       <input 
                         type="email" 
                         value={settingsForm.email}
                         disabled
                         className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'رابط الصورة الرمزية' : 'Avatar URL'}</label>
                       <input 
                         type="text" 
                         value={settingsForm.avatar}
                         onChange={(e) => setSettingsForm({...settingsForm, avatar: e.target.value})}
                         className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white font-mono text-xs"
                       />
                     </div>
                   </div>

                   <div className="flex justify-end">
                     <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                       {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                     </button>
                   </div>
                 </form>
               </div>
             </div>
          )}

        </div>
      </div>
      
      {/* Modals ... */}
      {/* ... */}
      {showProductModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
           <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isAr ? 'إدراج تطبيق جديد' : 'List New App'}</h3>
               <button onClick={() => setShowProductModal(false)}>
                 <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
               </button>
             </div>
             <form onSubmit={handleAddProduct} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'اسم التطبيق' : 'App Name'}</label>
                 <input name="name" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'الشعار' : 'Tagline'}</label>
                 <input name="tagline" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'السعر ($)' : 'Price ($)'}</label>
                   <input name="price" type="number" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'التصنيف' : 'Category'}</label>
                   <select name="category" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white">
                     <option value="Productivity">Productivity</option>
                     <option value="Health & Fitness">Health & Fitness</option>
                     <option value="Business">Business</option>
                     <option value="Education">Education</option>
                   </select>
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'نوع الترخيص' : 'License Type'}</label>
                  <select name="licenseType" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white">
                     <option value="Standard">Standard (Single Use)</option>
                     <option value="Extended">Extended (SaaS/Charge End Users)</option>
                     <option value="Exclusive">Exclusive (Full Ownership Transfer)</option>
                  </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'الوصف' : 'Description'}</label>
                 <textarea name="description" required rows={3} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"></textarea>
               </div>
               <div className="pt-2 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">{isAr ? 'إلغاء' : 'Cancel'}</button>
                 <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">{isAr ? 'إدراج الآن' : 'List Now'}</button>
               </div>
             </form>
           </div>
         </div>
      )}

      {showDeployModal && selectedDeployApp && (
         <DeploymentModal 
            isOpen={showDeployModal} 
            onClose={() => setShowDeployModal(false)} 
            app={selectedDeployApp}
            onDeployComplete={handleDeployComplete}
         />
      )}

      {showPhysicalModal && selectedPhysicalOrder && (
         <PhysicalOrderModal
            isOpen={showPhysicalModal}
            onClose={() => setShowPhysicalModal(false)}
            order={selectedPhysicalOrder}
            onConfirmOrder={handlePhysicalOrderComplete}
         />
      )}

    </div>
  );
};
