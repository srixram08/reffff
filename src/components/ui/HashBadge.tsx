import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

interface HashBadgeProps {
  hash: string;
  blockNumber?: number;
  label?: string;
  verified?: boolean;
  className?: string;
}

export const HashBadge: React.FC<HashBadgeProps> = ({
  hash,
  blockNumber,
  label,
  verified = true,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded border border-[#0A3D24] bg-[#05070A]/80 px-3 py-1.5 font-mono text-xs text-[#00FF7F] ${
        verified ? "border-[#00FF7F]/40 shadow-[0_0_10px_rgba(0,255,127,0.1)]" : "border-[#FFB020]/40 text-[#FFB020]"
      } ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5 text-[#00FF7F]" />
      {label && (
        <span className="text-[#7FA98F] border-r border-[#0A3D24] pr-2 text-[11px]">
          {label}
        </span>
      )}
      {blockNumber !== undefined && (
        <span className="text-[#7FA98F] border-r border-[#0A3D24] pr-2">
          BLK #{blockNumber}
        </span>
      )}
      <div className="flex items-center gap-1">
        <Lock className="h-3 w-3 text-[#7FA98F]" />
        <span className="truncate max-w-[140px] sm:max-w-[200px]" title={hash}>
          {hash}
        </span>
      </div>
      <span className="ml-auto rounded bg-[#0A3D24] px-1.5 py-0.5 text-[10px] text-[#00FF7F] font-bold">
        VERIFIED
      </span>
    </div>
  );
};
