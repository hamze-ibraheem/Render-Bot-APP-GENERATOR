
import React from 'react';

interface LogoProps {
  className?: string;
  classNameText?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", classNameText = "text-xl", withText = false }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${className} relative`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="logo_grad_main" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo-600 */}
              <stop offset="100%" stopColor="#7c3aed" /> {/* Violet-600 */}
            </linearGradient>
            <linearGradient id="logo_grad_accent" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" /> {/* Blue-400 */}
              <stop offset="100%" stopColor="#a78bfa" /> {/* Purple-400 */}
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
          </defs>
          
          {/* Main Container - Squircle */}
          <rect x="10" y="10" width="80" height="80" rx="22" fill="url(#logo_grad_main)" />
          
          {/* Screen/Face Area */}
          <rect x="22" y="32" width="56" height="40" rx="10" fill="#0f172a" fillOpacity="0.4" />
          
          {/* Eyes */}
          <rect x="34" y="44" width="8" height="16" rx="4" fill="white" />
          <rect x="58" y="44" width="8" height="16" rx="4" fill="white" />
          
          {/* Rendering Beam / Antenna */}
          <path d="M50 10 V 32" stroke="url(#logo_grad_accent)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="10" r="8" fill="#f43f5e" filter="url(#glow)" /> {/* Pink Spark */}
          
          {/* Tech Detail Lines */}
          <path d="M10 50 L 22 50" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
          <path d="M78 50 L 90 50" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
          <circle cx="80" cy="80" r="14" fill="white" fillOpacity="0.1" />
        </svg>
      </div>
      {withText && (
        <span className={`${classNameText} font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-400 dark:to-violet-400 font-space tracking-tight`}>
          RenderBot
        </span>
      )}
    </div>
  );
};
