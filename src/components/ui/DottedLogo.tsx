"use client";

import React from "react";

export const DottedLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 48, 
  className = "" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center Sphere */}
      <circle cx="50" cy="50" r="12" fill="#7C3AED" />
      
      {/* 4 Diagonal Inner Dots */}
      <circle cx="34" cy="34" r="8" fill="#6D28D9" />
      <circle cx="66" cy="34" r="8" fill="#6D28D9" />
      <circle cx="34" cy="66" r="8" fill="#6D28D9" />
      <circle cx="66" cy="66" r="8" fill="#6D28D9" />
      
      {/* 4 Mid Diagonal Dots */}
      <circle cx="22" cy="22" r="6" fill="#8B5CF6" />
      <circle cx="78" cy="22" r="6" fill="#8B5CF6" />
      <circle cx="22" cy="78" r="6" fill="#8B5CF6" />
      <circle cx="78" cy="78" r="6" fill="#8B5CF6" />

      {/* 4 Outer Diagonal Dots */}
      <circle cx="12" cy="12" r="4.5" fill="#A78BFA" />
      <circle cx="88" cy="12" r="4.5" fill="#A78BFA" />
      <circle cx="12" cy="88" r="4.5" fill="#A78BFA" />
      <circle cx="88" cy="88" r="4.5" fill="#A78BFA" />

      {/* Satellite cluster dots */}
      <circle cx="20" cy="34" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="34" cy="20" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="80" cy="34" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="66" cy="20" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="20" cy="66" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="34" cy="80" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="80" cy="66" r="5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="66" cy="80" r="5" fill="#8B5CF6" opacity="0.8" />
    </svg>
  );
};
