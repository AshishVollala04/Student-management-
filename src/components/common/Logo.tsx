import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center shadow-md shadow-indigo-600/20 ring-1 ring-white/20`}>
        {/* Modern Geometric School Emblem */}
        <svg viewBox="0 0 36 36" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M18 4L4 11L18 18L32 11L18 4Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M8 15V23C8 26.5 12.5 30 18 30C23.5 30 28 26.5 28 23V15"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 12V22"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="32" cy="23.5" r="1.5" fill="currentColor" />
          <path
            d="M18 18V28"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
            Future<span className="text-indigo-600 dark:text-indigo-400">School</span>
          </div>
          <span className="text-[10px] font-medium tracking-wider uppercase text-slate-600 dark:text-slate-400 mt-0.5">
            Campus Portal
          </span>
        </div>
      )}
    </div>
  );
};
