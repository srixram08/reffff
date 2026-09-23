"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export interface CausalityNode {
  id: string;
  label: string;
  subtitle: string;
  category: "stimulus" | "telemetry" | "decision" | "action" | "resolution";
  threshold: string;
}

const CAUSALITY_NODES: CausalityNode[] = [
  { id: "congestion", label: "Network Congestion", subtitle: "Bufferbloat / Wi-Fi drop", category: "stimulus", threshold: "Packet jitter > 40ms" },
  { id: "rtt_spike", label: "RTT Spike", subtitle: "Round trip time exceeds baseline", category: "telemetry", threshold: "RTT > 220ms (Norm: 14ms)" },
  { id: "packet_loss", label: "Packet Loss", subtitle: "Unacknowledged TCP packets", category: "telemetry", threshold: "Loss rate > 12%" },
  { id: "thread_lag", label: "Event-Loop Delay", subtitle: "Main thread microtask lag", category: "telemetry", threshold: "UI delay > 45ms" },
  { id: "risk_elevated", label: "Risk Score Escalation", subtitle: "Logistic regression threshold", category: "decision", threshold: "Risk Score >= 78%" },
  { id: "protection_tier", label: "Protection Escalated", subtitle: "Adaptive replication tier switch", category: "action", threshold: "Tier: Shadow Replica" },
  { id: "socket_lost", label: "Socket Severed", subtitle: "WebSocket heartbeat timeout", category: "stimulus", threshold: "Disconnection > 3.0s" },
  { id: "local_recovery", label: "Local Autonomous Rollback", subtitle: "IndexedDB CRDT restoration", category: "action", threshold: "Sub-2.4s recovery execution" },
  { id: "reconciliation", label: "Server Reconciliation", subtitle: "Merkle proof & zero data loss", category: "resolution", threshold: "0 Bytes Lost / HMAC Verified" },
];

interface FailureCausalityGraphProps {
  currentRiskScore?: number;
  activeStage?: number;
  theme?: "amber" | "cyan" | "violet";
}

export const FailureCausalityGraph: React.FC<FailureCausalityGraphProps> = ({
  currentRiskScore = 12,
  activeStage = 0,
  theme = "amber",
}) => {
  const [selectedNode, setSelectedNode] = useState<CausalityNode | null>(CAUSALITY_NODES[0]);

  // Color schemes based on contrast theme (tailored to clean purple landing page design)
  const themeColors = {
    amber: {
      accent: "#7C3AED", // Royal Violet
      accentGlow: "rgba(124, 58, 237, 0.15)",
      badgeBg: "bg-purple-100 border-purple-200 text-purple-700",
      activeText: "text-purple-700",
      cardBorder: "border-purple-100",
    },
    cyan: {
      accent: "#0284C7", // Sky/Cyan
      accentGlow: "rgba(2, 132, 199, 0.15)",
      badgeBg: "bg-sky-100 border-sky-200 text-sky-700",
      activeText: "text-sky-700",
      cardBorder: "border-sky-100",
    },
    violet: {
      accent: "#9333EA", // Bright Purple
      accentGlow: "rgba(147, 51, 234, 0.15)",
      badgeBg: "bg-purple-100 border-purple-200 text-purple-700",
      activeText: "text-purple-700",
      cardBorder: "border-purple-100",
    },
  }[theme];

  const computedStage =
    activeStage > 0
      ? activeStage
      : currentRiskScore >= 85
      ? 8
      : currentRiskScore >= 65
      ? 5
      : currentRiskScore >= 35
      ? 3
      : 1;

  return (
    <div className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 text-[#1E1B4B] shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}>
      {/* Subtle ambient lighting */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ background: themeColors.accent }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-600" />
            <span
              className="font-mono text-xs font-extrabold uppercase tracking-wider text-purple-600"
            >
              AI Explainability Engine
            </span>
          </div>
          <h3 className="font-heading text-xl font-extrabold text-[#1E1B4B] mt-1">
            Failure Causality Graph
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl font-bold">
            Active Causality Depth:{" "}
            <strong className="text-purple-700">
              {computedStage} / {CAUSALITY_NODES.length} Nodes
            </strong>
          </span>
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
        </div>
      </div>

      {/* Causality Node DAG Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
        {CAUSALITY_NODES.map((node, index) => {
          const isPassed = index < computedStage;
          const isCurrent = index === computedStage - 1;
          const isSelected = selectedNode?.id === node.id;

          let cardStyle = "border-purple-100 bg-purple-50/40 text-slate-700 hover:border-purple-300 hover:bg-purple-50/80 shadow-sm";
          let badgeColor = "bg-purple-100 text-purple-700 border border-purple-200";
          let stepNumberColor = "text-purple-600";

          if (isCurrent) {
            cardStyle = "border-rose-400 bg-rose-50/90 text-rose-950 ring-2 ring-rose-400/40 shadow-lg shadow-rose-900/10";
            badgeColor = "bg-rose-100 text-rose-700 border border-rose-200";
            stepNumberColor = "text-rose-700";
          } else if (isPassed) {
            cardStyle = "border-emerald-300/80 bg-emerald-50/80 text-emerald-950 shadow-sm shadow-emerald-900/5";
            badgeColor = "bg-emerald-100 text-emerald-700 border border-emerald-200";
            stepNumberColor = "text-emerald-700";
          }

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`relative rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] cursor-pointer ${cardStyle} ${
                isSelected ? "ring-2 ring-purple-500 shadow-md" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] uppercase font-extrabold tracking-wider ${stepNumberColor}`}>
                  Step 0{index + 1}
                </span>
                <span className={`font-mono text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {node.category}
                </span>
                {isPassed && !isCurrent ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <AlertTriangle className="h-4 w-4 text-rose-600 animate-bounce shrink-0" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-purple-300 shrink-0" />
                )}
              </div>

              <div className="font-heading font-extrabold text-sm sm:text-base mt-2 text-[#1E1B4B]">
                {node.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                {node.subtitle}
              </div>

              <div className="mt-3 pt-2 border-t border-purple-100/80 font-mono text-[11px] flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-semibold">Threshold:</span>
                <span
                  className="font-bold text-[10px] sm:text-[11px]"
                  style={{ color: isCurrent ? "#BE123C" : isPassed ? "#059669" : themeColors.accent }}
                >
                  {node.threshold}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Deep-Dive Inspection Panel */}
      {selectedNode && (
        <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-purple-700">
                Node Analysis: {selectedNode.label}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase ${themeColors.badgeBg}`}>
                {selectedNode.category}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {selectedNode.subtitle} — Trigger condition:{" "}
              <strong className="text-purple-900 font-mono bg-white px-2 py-0.5 rounded border border-purple-200">
                {selectedNode.threshold}
              </strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3.5 py-1.5 rounded-xl whitespace-nowrap shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-bold">Deterministic Causality Rule</span>
          </div>
        </div>
      )}
    </div>
  );
};
