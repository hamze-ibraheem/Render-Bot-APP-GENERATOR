
import React from 'react';
import { AppProduct } from '../types';
import { ShoppingBag, Zap, Heart, Store, Check } from './Icons';

interface AppCardProps {
  product: AppProduct;
  onAddToCart: (product: AppProduct) => void;
  onSave?: (product: AppProduct) => void;
  isSaved?: boolean;
  onClick?: (product: AppProduct) => void;
}

// Helper to generate a data URI for the app screenshot
export const generateAppScreenSvg = (name: string, tagline: string, seed: number) => {
  const colors = [
    ['#2563eb', '#4338ca'], // blue-indigo
    ['#10b981', '#0f766e'], // emerald-teal
    ['#f97316', '#dc2626'], // orange-red
    ['#9333ea', '#a21caf'], // purple-fuchsia
    ['#ec4899', '#e11d48'], // pink-rose
    ['#06b6d4', '#2563eb'], // cyan-blue
    ['#334155', '#0f172a'], // slate
    ['#7c3aed', '#581c87'], // violet-purple
  ];
  const [c1, c2] = colors[(seed || 0) % colors.length];
  
  // Safe truncation for SVG text
  const safeName = name.slice(0, 18);
  
  // Create a realistic "Home Page" wireframe SVG
  const svg = `
  <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.1" />
        </feComponentTransfer>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="400" height="300" fill="#f8fafc" />
    
    <!-- Top Header Background -->
    <path d="M0 0 H400 V75 Q 200 100 0 75 Z" fill="${c1}" />
    
    <!-- Status Bar dots -->
    <circle cx="360" cy="15" r="2.5" fill="white" fill-opacity="0.8" />
    <circle cx="370" cy="15" r="2.5" fill="white" fill-opacity="0.8" />
    <rect x="380" y="12" width="10" height="5" rx="1" fill="white" fill-opacity="0.8" />
    
    <!-- App Header -->
    <text x="20" y="45" font-family="sans-serif" font-size="20" font-weight="bold" fill="white">${safeName}</text>
    <circle cx="370" cy="40" r="14" fill="white" fill-opacity="0.2" />
    <circle cx="370" cy="40" r="5" fill="white" />

    <!-- Search Bar -->
    <g transform="translate(20, 80)" filter="url(#shadow)">
      <rect width="360" height="40" rx="12" fill="white" />
      <circle cx="20" cy="20" r="6" fill="${c2}" fill-opacity="0.2" />
      <rect x="40" y="17" width="120" height="6" rx="3" fill="#cbd5e1" />
    </g>

    <!-- Categories Row -->
    <g transform="translate(20, 140)">
       <rect width="90" height="28" rx="14" fill="${c1}" fill-opacity="0.1" stroke="${c1}" stroke-width="1" />
       <rect x="25" y="11" width="40" height="6" rx="3" fill="${c1}" />
       
       <rect x="100" y="0" width="90" height="28" rx="14" fill="white" stroke="#e2e8f0" stroke-width="1" />
       <rect x="125" y="11" width="40" height="6" rx="3" fill="#cbd5e1" />
       
       <rect x="198" y="0" width="90" height="28" rx="14" fill="white" stroke="#e2e8f0" stroke-width="1" />
       <rect x="223" y="11" width="40" height="6" rx="3" fill="#cbd5e1" />
    </g>

    <!-- Content Cards -->
    <g transform="translate(20, 185)">
       <!-- Card 1 -->
       <g filter="url(#shadow)">
         <rect width="170" height="100" rx="12" fill="white" />
         <rect x="0" y="0" width="170" height="55" rx="12" fill="${c2}" fill-opacity="0.1" />
         <circle cx="85" cy="27" r="12" fill="${c2}" fill-opacity="0.4" />
         
         <rect x="15" y="70" width="100" height="8" rx="4" fill="#1e293b" />
         <rect x="15" y="85" width="60" height="6" rx="3" fill="#94a3b8" />
       </g>
       
       <!-- Card 2 -->
       <g transform="translate(190, 0)" filter="url(#shadow)">
         <rect width="170" height="100" rx="12" fill="white" />
         <rect x="0" y="0" width="170" height="55" rx="12" fill="${c1}" fill-opacity="0.1" />
         <circle cx="85" cy="27" r="12" fill="${c1}" fill-opacity="0.4" />
         
         <rect x="15" y="70" width="100" height="8" rx="4" fill="#1e293b" />
         <rect x="15" y="85" width="60" height="6" rx="3" fill="#94a3b8" />
       </g>
    </g>
    
    <!-- Bottom Navigation -->
    <path d="M0 300 H400 V290 H0 Z" fill="white" />
    <rect x="130" y="293" width="140" height="4" rx="2" fill="#cbd5e1" />
  </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const AppCard: React.FC<AppCardProps> = ({ product, onAddToCart, onSave, isSaved, onClick }) => {
  const { name, tagline, description, price, features, imageSeed, isAI, vendorName, category, imageUrl } = product;
  
  const seed = imageSeed || name.length;
  const gradients = [
    'from-blue-600 to-indigo-700',
    'from-emerald-500 to-teal-700',
    'from-orange-500 to-red-600',
    'from-purple-600 to-fuchsia-700',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-slate-700 to-slate-900',
    'from-violet-600 to-purple-800'
  ];
  const gradientClass = gradients[seed % gradients.length];
  
  // Use custom image if available, otherwise generate SVG based on seed/name
  const displayImage = imageUrl || generateAppScreenSvg(name, tagline, seed);

  return (
    <div 
      onClick={() => onClick && onClick(product)}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative ${onClick ? 'cursor-pointer' : ''}`}
      itemScope 
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="applicationCategory" content={category} />
      <meta itemProp="operatingSystem" content="iOS, Android, Web" />

      {isAI && (
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 z-20 shadow-sm">
          <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          AI GENERATED
        </div>
      )}

      {vendorName && !isAI && (
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-2 z-20 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5" itemProp="author" itemScope itemType="https://schema.org/Person">
             <Store className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
             <span itemProp="name">{vendorName}</span>
          </div>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
          <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold border border-blue-200 dark:border-blue-800" title="Verified Creator">
             <Check className="w-3 h-3" /> Verified
          </span>
        </div>
      )}

      {onSave && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSave(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md z-20 transition-all ${
            isSaved 
              ? 'bg-pink-500 text-white shadow-lg scale-110' 
              : 'bg-black/20 text-white/80 hover:bg-white hover:text-pink-500 dark:hover:bg-slate-800 dark:hover:text-pink-500'
          }`}
          aria-label={isSaved ? "Remove from saved" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      )}
      
      {/* Product Thumbnail with SEO Optimization */}
      <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-colors">
        <img 
          src={displayImage} 
          alt={`${name} - Mobile App Home Screen UI Design for ${category}`}
          title={`${name} - ${tagline}`}
          width="400"
          height="300"
          loading="lazy"
          itemProp="image"
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-5 flex-grow flex flex-col relative bg-white dark:bg-slate-900">
        {!imageUrl && (
          <div className="absolute -top-10 right-4 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-lg p-1 flex items-center justify-center z-10 border border-slate-100 dark:border-slate-700">
             <div className={`w-full h-full rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg`}>
                {name.charAt(0)}
             </div>
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1" itemProp="name">{name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow pt-2" itemProp="description">
          {description}
        </p>

        <div className="space-y-2 mb-6">
          {features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${gradientClass}`}></span>
              {feature}
            </div>
          ))}
          {features.length > 2 && (
            <div className="text-xs text-slate-400 italic pl-1">+ {features.length - 2} more features</div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="USD" />
          <div className="text-slate-900 dark:text-white font-bold text-lg">
            $<span itemProp="price">{price}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Buy Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
