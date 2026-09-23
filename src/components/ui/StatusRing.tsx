import React from "react";

export type SessionStatus = "stable" | "at-risk" | "recovering";

interface StatusRingProps {
  status: SessionStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const StatusRing = ({
  status,
  size = "md",
  showLabel = false,
}: StatusRingProps) => {
  const sizeMap: Record<"sm" | "md" | "lg", string> = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const statusConfig: Record<
    SessionStatus,
    { bg: string; ping: string; shadow: string; label: string; textColor: string }
  > = {
    stable: {
      bg: "bg-emerald-500",
      ping: "bg-emerald-400",
      shadow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      label: "STABLE",
      textColor: "text-emerald-600",
    },
    "at-risk": {
      bg: "bg-[#FFB020]",
      ping: "bg-[#FFB020]",
      shadow: "shadow-[0_0_8px_#FFB020]",
      label: "AT RISK",
      textColor: "text-[#D97706]",
    },
    recovering: {
      bg: "bg-[#EF4444]",
      ping: "bg-[#EF4444]",
      shadow: "shadow-[0_0_10px_#EF4444]",
      label: "RECOVERING",
      textColor: "text-[#EF4444]",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <span className={`relative flex shrink-0 ${sizeMap[size]}`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.ping} opacity-75`}
        />
        <span
          className={`relative inline-flex rounded-full h-full w-full ${current.bg} ${current.shadow}`}
        />
      </span>
      {showLabel && (
        <span className={`font-mono text-xs font-bold tracking-wider ${current.textColor}`}>
          {current.label}
        </span>
      )}
    </div>
  );
};
