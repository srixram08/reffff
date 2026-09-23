"use client";

import React from "react";
import { Terminal } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "error" | "success" | "critical";
  candidateId: string;
  message: string;
}

interface BehavioralLogStreamProps {
  logs: LogEntry[];
}

export const BehavioralLogStream: React.FC<BehavioralLogStreamProps> = ({ logs }) => {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white/95 p-4 text-[#1E1B4B] font-mono text-xs space-y-2 shadow-sm">
      <div className="flex items-center justify-between border-b border-purple-100 pb-2 text-purple-700">
        <div className="flex items-center gap-2 font-bold">
          <Terminal className="h-4 w-4 text-purple-600" />
          <span>BEHAVIORAL RISK & TELEMETRY LOG</span>
        </div>
        <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">100HZ SOCKET STREAM</span>
      </div>

      <div className="h-28 overflow-y-auto space-y-1.5 pr-2">
        {logs.map((log) => {
          const typeColors = {
            info: "text-slate-600",
            warning: "text-amber-700 font-semibold",
            error: "text-red-600 font-bold",
            critical: "text-red-600 font-bold",
            success: "text-purple-700 font-bold",
          };

          return (
            <div key={log.id} className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
              <span className="text-slate-900 font-bold">[{log.candidateId}]</span>
              <span className={typeColors[log.type] || "text-slate-600"}>{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
