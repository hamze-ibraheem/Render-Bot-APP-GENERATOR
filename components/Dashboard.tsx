
import React, { useState, useEffect } from 'react';
import { AppProduct, Order, User, UserRole, AppProduct as VendorApp, PointTransaction } from '../types';
import { AppCard, generateAppScreenSvg } from './AppCard';
import { LayoutDashboard, Heart, Download, CreditCard, LogOut, Zap, ShoppingBag, History, X, Gift, Copy, Share2, Check, Users, Shield, UserIcon, Key, Activity, Globe, Lock, Plus, Store, PlusCircle, DollarSign, Edit, Trash2, Settings, Trophy, Coins } from './Icons';
import { MOCK_TEAM, MOCK_POINT_HISTORY } from '../constants';
import { DeploymentModal } from './DeploymentModal';
import { PhysicalOrderModal } from './PhysicalOrderModal';

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
}

type Tab = 'overview' | 'saved' | 'downloads' | 'orders' | 'subscription' | 'referrals' | 'rewards' | 'team' | 'admin' | 'vendor' | 'settings';

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
  onRemoveVendorApp
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

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: currentUser.name,
    avatar: currentUser.avatar,
    email: currentUser.email
  });

  // Sync settings form when active tab changes to 'settings' or user updates
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

  // Generate a mock referral code based on user name
  const referralCode = `RENDER-${currentUser.name.split(' ')[0].toUpperCase()}-${currentUser.id.substring(2,5)}`;
  const referralLink = `https://renderbot.ai/invite/${referralCode}`;

  interface MenuItem {
    id: Tab;
    label: string;
    icon: React.ComponentType<any>;
    roles?: UserRole[];
  }

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'saved', label: 'Saved Ideas', icon: Heart },
    { id: 'downloads', label: 'My Downloads', icon: Download },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'rewards', label: 'Rewards & Points', icon: Trophy },
    { id: 'referrals', label: 'Refer & Earn', icon: Gift },
    { id: 'vendor', label: 'Vendor Portal', icon: Store, roles: ['vendor'] },
    { id: 'team', label: 'Team', icon: Users, roles: ['manager', 'admin'] },
    { id: 'admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const filteredMenu = menuItems.filter(item => 
    !item.roles || item.roles.includes(currentUser.role)
  );

  const handleUpgrade = () => {
    // Cycle through plans for demo
    const nextPlan = currentUser.plan === 'Free' ? 'Pro' : currentUser.plan === 'Pro' ? 'Enterprise' : 'Free';
    // Set credits to a reasonable starting amount for the new plan
    const baseCredits = nextPlan === 'Free' ? 20 : nextPlan === 'Pro' ? 125 : 1000;
    
    onUpdateUser({ plan: nextPlan, credits: baseCredits });
  };

  const initiatePurchase = (bundle: typeof CREDIT_BUNDLES[0]) => {
    setSelectedBundle(bundle);
  };

  const confirmPurchase = () => {
    if (!selectedBundle) return;
    
    const { id, credits } = selectedBundle;
    setIsProcessing(id);
    setSelectedBundle(null); // Close modal
    
    // Simulate API delay
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
      // Mock new product creation
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
     // Mock updating the order item to 'deployed'
     // In a real app, this would update backend state
     showToast("App deployed successfully! Live URL generated.");
     // Force refresh or update local state logic here if needed
  };

  const handleUpgradePhysical = (order: Order) => {
     setSelectedPhysicalOrder(order);
     setShowPhysicalModal(true);
  };

  const handlePhysicalOrderComplete = () => {
     // Mock updating order status
     showToast("Physical copy ordered! Shipment pending.");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
       {toast && (
          <div className="absolute top-4 right-4 z-50 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg shadow-lg text-sm animate-bounce-in">
             {toast}
          </div>
       )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-14 h-14 rounded-full border-2 border-indigo-100 dark:border-indigo-900 object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                  currentUser.role === 'admin' ? 'bg-red-500' : currentUser.role === 'manager' ? 'bg-indigo-500' : currentUser.role === 'vendor' ? 'bg-amber-500' : 'bg-green-500'
                }`}>
                  {currentUser.role === 'admin' ? <Shield className="w-3 h-3 text-white" /> : 
                   currentUser.role === 'manager' ? <Users className="w-3 h-3 text-white" /> :
                   currentUser.role === 'vendor' ? <Store className="w-3 h-3 text-white" /> :
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
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Switcher for Demo */}
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${
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
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Total</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{currentUser.credits}</div>
                    <div className="text-indigo-100 text-sm">Credits Available</div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Rewards</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{currentUser.points}</div>
                    <div className="text-orange-100 text-sm">Genius Points</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <History className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{orders.length}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">Total Orders</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {orders.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">Order #{order.id.split('-')[1] || order.id}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{order.items.length} items • {order.date}</div>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">${order.total}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">No recent activity</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
             <div className="animate-fade-in-up space-y-8">
               {/* Hero */}
               <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-orange-50 text-xs font-semibold mb-4 border border-white/10">
                           <Trophy className="w-3 h-3" />
                           <span>Loyalty Program</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-2">{currentUser.points} PTS</h2>
                        <p className="text-orange-100 text-lg">Your Genius Points Balance</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 max-w-xs">
                        <h4 className="font-bold text-sm mb-2">How to earn points?</h4>
                        <ul className="text-xs space-y-1.5 text-orange-50">
                           <li className="flex items-center gap-2"><Coins className="w-3 h-3" /> Earn 10 pts per $1 spent</li>
                           <li className="flex items-center gap-2"><Trophy className="w-3 h-3" /> 50 pts per review</li>
                        </ul>
                     </div>
                  </div>
               </div>

               {/* Redemption Options */}
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Redeem Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                           <Zap className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">50 AI Credits</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Boost your idea generation limit.</p>
                        <button 
                           onClick={() => handleRedeemPoints(500, 50)}
                           className="w-full py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition disabled:opacity-50"
                           disabled={currentUser.points < 500}
                        >
                           Redeem for 500 Pts
                        </button>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                           <Zap className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">120 AI Credits</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Best value for quick generation.</p>
                        <button 
                           onClick={() => handleRedeemPoints(1000, 120)}
                           className="w-full py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition disabled:opacity-50"
                           disabled={currentUser.points < 1000}
                        >
                           Redeem for 1,000 Pts
                        </button>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                           <Gift className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">5% Discount</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Get a coupon for your next order.</p>
                        <button 
                           className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg font-medium cursor-not-allowed"
                           disabled
                        >
                           Out of Stock
                        </button>
                     </div>
                  </div>
               </div>

               {/* History */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">Points History</div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                           <tr>
                              <th className="px-6 py-4">Action</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Points</th>
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

          {activeTab === 'vendor' && (
             <div className="animate-fade-in-up space-y-8">
               <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor Portal</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your product listings and view earnings.</p>
                 </div>
                 <button 
                    onClick={() => setShowProductModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                 >
                    <PlusCircle className="w-4 h-4" />
                    List New App
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                      <DollarSign className="w-4 h-4" /> Total Revenue
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">$2,450.00</div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                      <ShoppingBag className="w-4 h-4" /> Total Sales
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">34</div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                      <Store className="w-4 h-4" /> Active Listings
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{vendorApps.length}</div>
                 </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">Your Products</div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <tr>
                             <th className="px-6 py-4">Product Name</th>
                             <th className="px-6 py-4">Category</th>
                             <th className="px-6 py-4">Price</th>
                             <th className="px-6 py-4">License</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4 text-right">Actions</th>
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
                                <td className="px-6 py-4">
                                   <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">Active</span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                   <button 
                                      onClick={() => showToast('Edit functionality coming soon!')}
                                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                   >
                                      <Edit className="w-4 h-4" />
                                   </button>
                                   <button 
                                      onClick={() => onRemoveVendorApp && onRemoveVendorApp(app)}
                                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-red-500"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </td>
                             </tr>
                          ))}
                          {vendorApps.length === 0 && (
                             <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                   You haven't listed any apps yet.
                                </td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'team' && (
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage access and roles for your organization.</p>
                 </div>
                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Invite Member
                 </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Active</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_TEAM.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                                {member.name.charAt(0)}
                             </div>
                             <div>
                                <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{member.email}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${
                             member.role === 'manager' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                           }`}>
                             {member.role}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                             member.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                           }`}>
                             {member.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{member.lastActive}</td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
             <div className="animate-fade-in-up space-y-8">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Admin Console</h2>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
                         <div className="text-slate-400 text-sm mb-1 uppercase font-bold tracking-wider">Revenue</div>
                         <div className="text-3xl font-bold">$124.5k</div>
                         <div className="text-green-400 text-xs mt-2 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> +12% this month
                         </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                         <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase font-bold tracking-wider">Users</div>
                         <div className="text-3xl font-bold text-slate-900 dark:text-white">8,432</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                         <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase font-bold tracking-wider">Blueprints</div>
                         <div className="text-3xl font-bold text-slate-900 dark:text-white">1,204</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                         <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase font-bold tracking-wider">System</div>
                         <div className="text-3xl font-bold text-green-500 dark:text-green-400">99.9%</div>
                      </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
                   <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">System Logs</h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-6">View detailed system logs, user activity, and security alerts.</p>
                   <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                      View Logs
                   </button>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in-up max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <form onSubmit={handleSaveSettings}>
                  <div className="flex items-start gap-8 mb-8">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-800 overflow-hidden mb-3 relative group">
                        <img 
                          src={settingsForm.avatar || 'https://via.placeholder.com/150'} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'; }}
                        />
                      </div>
                      <div className="text-center text-xs text-slate-400">Preview</div>
                    </div>
                    
                    <div className="flex-grow space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Avatar URL</label>
                        <input 
                          type="text" 
                          value={settingsForm.avatar}
                          onChange={(e) => setSettingsForm({...settingsForm, avatar: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                          placeholder="https://..."
                        />
                        <p className="text-xs text-slate-400 mt-1">Paste a direct link to an image (e.g., from DiceBear or Gravatar).</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                        <input 
                          type="text" 
                          value={settingsForm.name}
                          onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                          placeholder="Your Name"
                        />
                      </div>

                       <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={settingsForm.email}
                          disabled
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed in this demo.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Saved Ideas</h2>
              {savedApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedApps.map(app => (
                    <AppCard 
                      key={app.id} 
                      product={app} 
                      onAddToCart={onAddToCart}
                      onSave={onRemoveSaved}
                      isSaved={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg">No saved ideas yet.</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Go to the Generator to create and save new concepts.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Downloads</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {orders.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.flatMap(order => order.items.map(item => {
                       const seed = item.imageSeed || item.name.length;
                       const imageSrc = item.imageUrl || generateAppScreenSvg(item.name, item.tagline, seed);
                       // Determine deployment status for this item
                       const isDeployed = item.deploymentStatus === 'deployed';
                       return (
                       <div key={`${order.id}-${item.id}`} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                         <div className="flex items-start space-x-4">
                           <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                              <img 
                                src={imageSrc}
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Purchased on {order.date}</p>
                             <div className="flex gap-2">
                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                 Verified Purchase
                               </span>
                               {isDeployed && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                    Deployed
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
                               <span>View Live App</span>
                             </a>
                           ) : (
                              <button 
                                onClick={() => handleStartDeploy(item)}
                                className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm bg-white dark:bg-slate-800"
                              >
                                <Zap className="w-4 h-4" />
                                <span>Deploy to Supabase</span>
                              </button>
                           )}
                           <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm bg-white dark:bg-slate-800">
                             <Download className="w-4 h-4" />
                             <span>Code</span>
                           </button>
                         </div>
                       </div>
                    )}))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    <Download className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p>You haven't purchased any blueprints yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Order History</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Physical Copy</th>
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
                                  <span key={item.id} className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
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
                                   Order Box
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
                    No orders found.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="animate-fade-in-up space-y-8">
              {/* Plan Management */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Manage Subscription</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Plan</h3>
                      <p className="text-slate-500 dark:text-slate-400">You are currently on the <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.plan}</span> plan.</p>
                    </div>
                    <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg border border-indigo-100 dark:border-indigo-800">Active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Next Billing Date</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{renewal.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Renewal Amount</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{renewal.amount}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span>Idea Generation Credits</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {currentUser.credits} <span className="text-slate-400 dark:text-slate-500 font-normal">/ {maxCredits} limit</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${currentUser.credits > maxCredits ? 'bg-amber-500' : 'bg-indigo-600 dark:bg-indigo-500'}`}
                        style={{ width: `${creditPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-medium px-0.5">
                       <span className={currentUser.plan === 'Free' ? 'text-indigo-600 dark:text-indigo-400' : ''}>Free: 20</span>
                       <span className={currentUser.plan === 'Pro' ? 'text-indigo-600 dark:text-indigo-400' : ''}>Pro: 500</span>
                       <span className={currentUser.plan === 'Enterprise' ? 'text-indigo-600 dark:text-indigo-400' : ''}>Enterprise: 10,000</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleUpgrade}
                      className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition"
                    >
                      {currentUser.plan === 'Enterprise' ? 'Switch to Free (Demo)' : `Upgrade to ${currentUser.plan === 'Free' ? 'Pro' : 'Enterprise'}`}
                    </button>
                    <button 
                      onClick={() => setShowBilling(!showBilling)}
                      className={`px-6 py-2.5 border rounded-lg font-medium transition ${showBilling ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                      {showBilling ? 'Hide Billing History' : 'View Billing History'}
                    </button>
                  </div>

                  {showBilling && (
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 animate-fade-in-up">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-4">Billing History</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 rounded-l-lg">Date</th>
                              <th className="px-4 py-3">Plan</th>
                              <th className="px-4 py-3">Amount</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 rounded-r-lg">Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {BILLING_HISTORY.map((bill) => (
                              <tr key={bill.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{bill.date}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{bill.plan}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">${bill.amount}</td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                    {bill.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Download</a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enterprise API Access */}
              {currentUser.plan === 'Enterprise' && (
                <div className="animate-fade-in-up delay-75">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Developer API Access</h2>
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded uppercase">Enterprise</span>
                  </div>

                  {/* API Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                        <Activity className="w-4 h-4" /> Requests (24h)
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">142,893</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 14% vs yesterday</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                        <Shield className="w-4 h-4" /> Error Rate
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">0.04%</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">Healthy</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                        <Zap className="w-4 h-4" /> Avg. Latency
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">245ms</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Global avg</div>
                    </div>
                  </div>

                  {/* API Keys Management */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-slate-400" /> API Keys
                      </h3>
                      <button 
                        onClick={handleGenerateKey}
                        className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Generate New Key
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Token</th>
                            <th className="px-6 py-4">Scope</th>
                            <th className="px-6 py-4">Last Used</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {apiKeys.map((key) => (
                            <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{key.name}</td>
                              <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded px-2 py-1 text-xs w-fit">
                                {key.token}
                              </td>
                              <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{key.scope}</td>
                              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{key.lastUsed}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  key.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                }`}>
                                  {key.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {key.status === 'Active' && (
                                  <button 
                                    onClick={() => handleRevokeKey(key.id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-slate-400" /> Security Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> IP Whitelist
                        </label>
                        <textarea 
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm h-24"
                          placeholder="Enter IP addresses (one per line)..."
                          defaultValue="192.168.1.1&#10;10.0.0.5"
                        ></textarea>
                        <p className="text-xs text-slate-400 mt-2">Only requests from these IPs will be accepted.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Rate Limiting
                        </label>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Global Limit</span>
                            <span className="font-bold">5,000 req/min</span>
                          </div>
                          <input 
                            type="range" 
                            min="1000" 
                            max="10000" 
                            step="1000" 
                            defaultValue="5000"
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <p className="text-xs text-slate-400">Adjust the maximum number of requests allowed per minute.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                        Save Security Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Bundles */}
              <div className="animate-fade-in-up delay-100">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Top Up Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CREDIT_BUNDLES.map((bundle) => (
                    <div 
                      key={bundle.id} 
                      className={`relative bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm flex flex-col transition hover:shadow-md ${
                        bundle.popular ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {bundle.popular && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                          MOST POPULAR
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{bundle.label}</h4>
                        <div className="flex items-baseline mt-1">
                          <span className="text-3xl font-bold text-slate-900 dark:text-white">${bundle.price}</span>
                          <span className="text-slate-500 dark:text-slate-400 ml-1">USD</span>
                        </div>
                        {bundle.savings && (
                          <span className="inline-block mt-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            {bundle.savings}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 mb-6">
                        <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                        <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{bundle.credits}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 ml-1 font-medium">credits</span>
                      </div>

                      <button
                        onClick={() => initiatePurchase(bundle)}
                        disabled={isProcessing === bundle.id}
                        className={`mt-auto w-full py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                          bundle.popular 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                         {isProcessing === bundle.id ? 'Processing...' : 'Buy Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="animate-fade-in-up space-y-8">
              {/* Refer & Earn Hero */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-indigo-50 text-xs font-semibold mb-4 border border-white/10">
                    <Gift className="w-3 h-3" />
                    <span>Referral Program</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">Invite Friends, Get AI Superpowers</h2>
                  <p className="text-indigo-100 max-w-xl text-lg mb-8 leading-relaxed">
                    Share your unique referral link with friends. For every friend who signs up and buys their first blueprint, you both get <strong className="text-white">50 free AI credits</strong>.
                  </p>

                  <div className="bg-white/10 p-1.5 rounded-xl flex items-center max-w-md backdrop-blur-sm border border-white/20">
                    <input 
                      type="text" 
                      readOnly 
                      value={referralLink}
                      className="flex-grow bg-transparent border-none text-white placeholder-indigo-200 focus:ring-0 px-4 py-2 text-sm font-medium"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition flex items-center gap-2 shadow-sm"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-indigo-200">
                    <button className="flex items-center gap-2 hover:text-white transition">
                      <Share2 className="w-4 h-4" /> Share on Twitter
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition">
                      <Share2 className="w-4 h-4" /> Share on Facebook
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Referrals</div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">2</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                      <Share2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Credits Earned</div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">100</div>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                      <Gift className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral History */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Referral History</h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Date Invited</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {REFERRAL_HISTORY.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{ref.user}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ref.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ref.status === 'Completed' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                            }`}>
                              {ref.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                            {ref.reward > 0 ? `+${ref.reward} Credits` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {REFERRAL_HISTORY.length === 0 && (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      You haven't invited anyone yet. Start sharing to earn!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedBundle(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-bounce-in">
             <button 
               onClick={() => setSelectedBundle(null)}
               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
             >
               <X className="w-5 h-5" />
             </button>
             
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Confirm Purchase</h3>
             
             <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 flex items-center justify-between border border-slate-100 dark:border-slate-700">
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400 mb-1">Package</div>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedBundle.label}</div>
                </div>
                <div className="text-right">
                   <div className="text-xs uppercase font-bold text-slate-400 mb-1">Total</div>
                   <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">${selectedBundle.price}</div>
                </div>
             </div>

             <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">
               You are about to add <strong>{selectedBundle.credits} AI credits</strong> to your account. This amount will be charged to your default payment method ending in •••• 4242.
             </p>

             <div className="flex gap-3">
               <button 
                 onClick={() => setSelectedBundle(null)}
                 className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmPurchase}
                 className="flex-1 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
               >
                 Confirm Purchase
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Simple Mock) */}
      {showProductModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-bounce-in max-h-[90vh] overflow-y-auto">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">List New App</h3>
               <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">App Name</label>
                     <input name="name" type="text" required className="w-full px-4 py-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. FitTrack Pro" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tagline</label>
                     <input name="tagline" type="text" required className="w-full px-4 py-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Short catchphrase" />
                  </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                     <textarea name="description" required className="w-full px-4 py-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 h-24" placeholder="Detailed description..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                        <input name="price" type="number" min="0" required className="w-full px-4 py-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="49" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select name="category" className="w-full px-4 py-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500">
                           <option>Productivity</option>
                           <option>Health & Fitness</option>
                           <option>Finance</option>
                           <option>Education</option>
                           <option>Games</option>
                           <option>Other</option>
                        </select>
                     </div>
                  </div>
                  
                  {/* License Section */}
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">License Type</label>
                     <select name="licenseType" className="w-full px-4 py-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="Standard">Standard License (Single Use)</option>
                        <option value="Extended">Extended License (Unlimited Users)</option>
                        <option value="Exclusive">Exclusive Rights Transfer</option>
                     </select>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select "Exclusive" if you are transferring full IP ownership to the buyer.</p>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                     <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Cancel</button>
                     <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">List Product</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Deployment Modal */}
      {showDeployModal && selectedDeployApp && (
         <DeploymentModal 
           isOpen={showDeployModal} 
           onClose={() => setShowDeployModal(false)} 
           app={selectedDeployApp}
           onDeployComplete={handleDeployComplete}
         />
      )}

      {/* Physical Order Modal */}
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
