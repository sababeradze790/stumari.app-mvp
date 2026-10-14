import React from 'react';

interface StumariArchProps {
  className?: string;
  size?: number;
  color?: string;
}

export const StumariArchIcon: React.FC<StumariArchProps> = ({ 
  className = "w-6 h-7", 
  size,
  color = "currentColor" 
}) => {
  return (
    <svg 
      viewBox="0 0 24 28" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size * (28 / 24) } : undefined}
      aria-label="Stumari Arch Logo"
    >
      {/* Outer Arch */}
      <path 
        d="M3 27V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V27" 
        stroke={color} 
        strokeWidth="2.8" 
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      {/* Inner Arch (closed at bottom) */}
      <path 
        d="M8 27V13C8 10.7909 9.79086 9 12 9C14.2091 9 16 10.7909 16 13V27H8Z" 
        stroke={color} 
        strokeWidth="2.2" 
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface StumariLogoProps {
  showText?: boolean;
  stacked?: boolean;
  className?: string;
  iconSize?: number;
}

export const StumariLogo: React.FC<StumariLogoProps> = ({ 
  showText = true, 
  stacked = false,
  className = "",
  iconSize = 22
}) => {
  if (stacked) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <StumariArchIcon size={iconSize * 1.3} className="text-[#F55A51]" />
        {showText && (
          <span className="font-serif tracking-[0.22em] text-sm uppercase font-bold text-[#1C1B1A] dark:text-[#F7F5F0] select-none pl-1">
            STUMARI
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] dark:bg-[#F55A51]/15 border border-[#F55A51]/25 flex items-center justify-center text-[#F55A51] shadow-2xs transition-colors">
        <StumariArchIcon size={iconSize} className="text-[#F55A51]" />
      </div>
      {showText && (
        <span className="font-serif tracking-[0.18em] text-lg font-bold uppercase text-[#1C1B1A] dark:text-[#F7F5F0] select-none">
          STUMARI
        </span>
      )}
    </div>
  );
};
