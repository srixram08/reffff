import React from "react";

interface SectionLabelProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ text, icon, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-[#0A3D24] bg-[#0B120E]/90 px-3.5 py-1 text-xs font-mono tracking-widest text-[#00FF7F] uppercase shadow-[0_0_12px_rgba(0,255,127,0.15)] ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF7F] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF7F]" />
      </span>
      {icon}
      <span>{text}</span>
    </div>
  );
};
