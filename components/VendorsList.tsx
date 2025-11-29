import React from 'react';
import { Store, Star, ArrowRight, Zap, Award } from './Icons';

interface Vendor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  appsCount: number;
  rating: number;
  joined: string;
  badges: string[];
}

const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'TechFlow Studio',
    tagline: 'Enterprise-grade Business Apps',
    description: 'Specializing in high-performance React Native applications for workflow automation and team productivity. Trusted by over 500 companies.',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechFlow',
    appsCount: 24,
    rating: 4.9,
    joined: '2022',
    badges: ['Verified', 'Top Seller']
  },
  {
    id: 'v2',
    name: 'PixelPerfect',
    tagline: 'Beautiful Consumer Apps',
    description: 'We craft stunning, animation-rich mobile experiences using Flutter. Our apps focus on wellness, lifestyle, and social connection.',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Pixel',
    appsCount: 18,
    rating: 4.8,
    joined: '2023',
    badges: ['Design Award']
  },
  {
    id: 'v3',
    name: 'CryptoBuilders',
    tagline: 'Web3 & Fintech Solutions',
    description: 'Secure, audited, and ready-to-deploy dApps and wallets. Experts in Solidity, Web3.js, and financial data visualization.',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Crypto',
    appsCount: 12,
    rating: 4.7,
    joined: '2023',
    badges: ['Verified']
  },
  {
    id: 'v4',
    name: 'Gameify Lab',
    tagline: 'Casual Games & Gamification',
    description: 'Turn engagement into revenue with our pre-built game engines and gamified loyalty platform templates.',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Gameify',
    appsCount: 30,
    rating: 4.6,
    joined: '2021',
    badges: ['Veteran']
  },
  {
    id: 'v5',
    name: 'EduTech Pro',
    tagline: 'Learning Management Systems',
    description: 'Scalable educational platforms for schools and coaching centers. Includes video streaming, quizzes, and progress tracking modules.',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Edu',
    appsCount: 9,
    rating: 5.0,
    joined: '2024',
    badges: ['Rising Star']
  },
  {
    id: 'v6',
    name: 'HealthStack',
    tagline: 'HIPAA Compliant Health Apps',
    description: 'Secure telemedicine and patient management blueprints designed with privacy and compliance at the core.',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Health',
    appsCount: 15,
    rating: 4.8,
    joined: '2022',
    badges: ['Verified']
  }
];

interface VendorsListProps {
  onNavigate: () => void;
  onBecomeVendor?: () => void;
}

export const VendorsList: React.FC<VendorsListProps> = ({ onNavigate, onBecomeVendor }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
          <Store className="w-4 h-4" />
          <span>Verified Creators</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Meet the Minds Behind the Apps
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Browse our directory of top-tier developers and studios. 
          Discover specialized vendors for every niche, from Fintech to Gaming.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_VENDORS.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition flex flex-col h-full group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-1">
                {vendor.badges.includes('Verified') && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" /> Verified
                  </span>
                )}
                {vendor.badges.includes('Top Seller') && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Top
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition">{vendor.name}</h3>
              <p className="text-sm font-medium text-indigo-600 mb-3">{vendor.tagline}</p>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                {vendor.description}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Store className="w-4 h-4" />
                  <span className="font-semibold text-slate-900">{vendor.appsCount}</span> Apps
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-semibold text-slate-900">{vendor.rating}</span>
                </div>
              </div>
              
              <button 
                onClick={onNavigate}
                className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition flex items-center gap-1"
              >
                Visit Store <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Are you a developer?</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8">
            Join the RenderBot Vendor Program and start selling your high-quality app blueprints to thousands of entrepreneurs today.
          </p>
          <button 
            onClick={onBecomeVendor}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/50"
          >
            Apply to Sell
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );
};