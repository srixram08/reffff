"use client";

import React, { useState } from "react";
import { ArrowRight, Database, HardDrive, Layers, Server, ShieldCheck, Wifi, Zap } from "lucide-react";
import { globalRecoveryPlanner, AdaptiveReplicationTier } from "@/lib/recoveryPlanner";

interface AdaptiveReplicationVisualizerProps {
  initialRiskScore?: number;
  theme?: "amber" | "cyan" | "violet";
}

export const AdaptiveReplicationVisualizer: React.FC<AdaptiveReplicationVisualizerProps> = ({
  initialRiskScore = 18,
  theme = "amber",
}) => {
  const [simulatedRisk, setSimulatedRisk] = useState(initialRiskScore);

  const plan = globalRecoveryPlanner.plan(
    "STU-84920",
    simulatedRisk,
    simulatedRisk >= 85 ? "Socket Keep-Alive Drop" : simulatedRisk >= 65 ? "Packet Loss Saturation" : "None"
  );

  const themeColors = {
    amber: {
      accent: "#7C3AED",
      badge: "bg-purple-100 text-purple-700 border-purple-200",
      border: "border-purple-100",
    },
    cyan: {
      accent: "#0284C7",
      badge: "bg-sky-100 text-sky-700 border-sky-200",
      border: "border-sky-100",
    },
    violet: {
      accent: "#9333EA",
      badge: "bg-purple-100 text-purple-700 border-purple-200",
      border: "border-purple-100",
    },
  }[theme];

  const TIERS: Array<{
    id: AdaptiveReplicationTier;
    label: string;
    sublabel: string;
    riskRange: string;
    icon: any;
    color: string;
    badge: string;
  }> = [
    {
      id: "LOCAL_ONLY",
      label: "Tier 1: Local Only",
      sublabel: "IndexedDB buffer, 0 egress",
      riskRange: "0% – 34% Risk",
      icon: HardDrive,
      color: "border-emerald-300 bg-emerald-50/90 text-emerald-950",
      badge: "Zero Network Overhead",
    },
    {
      id: "PERIODIC_SYNC",
      label: "Tier 2: Periodic Sync",
      sublabel: "Compressed batch deltas",
      riskRange: "35% – 64% Risk",
      icon: Wifi,
      color: "border-sky-300 bg-sky-50/90 text-sky-950",
      badge: "500ms Cadence",
    },
    {
      id: "CONTINUOUS_DELTA",
      label: "Tier 3: Stream Delta",
      sublabel: "JSON-Patch RFC 6902 deltas",
      riskRange: "65% – 84% Risk",
      icon: Database,
      color: "border-amber-300 bg-amber-50/90 text-amber-950",
      badge: "150ms Delta Stream",
    },
    {
      id: "FULL_SHADOW_REPLICA",
      label: "Tier 4: Shadow Session",
      sublabel: "Dedicated cloud replica pod",
      riskRange: "85% – 100% Risk",
      icon: Server,
      color: "border-rose-300 bg-rose-50/90 text-rose-950",
      badge: "Emergency Mirror",
    },
  ];

  return (
    <div className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 text-[#1E1B4B] shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-600" />
            <span
              className="font-mono text-xs font-extrabold uppercase tracking-wider text-purple-600"
            >
              Autonomous Orchestrator
            </span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#1E1B4B] mt-1">
            Adaptive Replication Tiering
          </h3>
        </div>

        {/* Dynamic Bandwidth Savings Badge */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-xs text-emerald-800 shadow-sm">
            Bandwidth Saved:{" "}
            <strong className="font-extrabold text-emerald-950 text-sm">
              {plan.bandwidthSavedPercent}%
            </strong>
          </div>
        </div>
      </div>

      {/* Interactive Risk Slider to see Tier Escalation */}
      <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
        <div className="flex items-center justify-between font-mono text-xs text-slate-700 mb-2.5">
          <span className="font-bold">Test Dynamic Risk Escalation:</span>
          <span className="font-bold text-[#1E1B4B] bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-sm">
            Simulated Risk:{" "}
            <span
              className={
                simulatedRisk >= 85
                  ? "text-rose-600 font-extrabold"
                  : simulatedRisk >= 65
                  ? "text-amber-600 font-extrabold"
                  : "text-emerald-600 font-extrabold"
              }
            >
              {simulatedRisk}%
            </span>
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={98}
          value={simulatedRisk}
          onChange={(e) => setSimulatedRisk(Number(e.target.value))}
          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* 4 Tiers Comparison Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map((tier) => {
          const isActive = plan.replicationTier === tier.id;
          const Icon = tier.icon;

          return (
            <div
              key={tier.id}
              className={`rounded-2xl border p-4 transition-all ${
                isActive
                  ? `${tier.color} ring-2 ring-purple-400 shadow-lg scale-[1.02]`
                  : "border-purple-100 bg-white/90 text-slate-500 shadow-sm hover:border-purple-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${isActive ? "text-current" : "text-purple-600"}`} />
                <span className="rounded-full font-mono text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 border border-current">
                  {tier.badge}
                </span>
              </div>

              <div className="font-heading font-extrabold text-sm text-[#1E1B4B] mt-3">
                {tier.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">
                {tier.sublabel}
              </div>

              <div className="mt-3 pt-2.5 border-t border-purple-100/80 flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-slate-600">{tier.riskRange}</span>
                {isActive && (
                  <span className="font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    ACTIVE
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Details Summary */}
      <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="font-mono text-xs text-purple-800 font-extrabold">
            Autonomous Strategy: {plan.strategy} ({plan.syncMethod})
          </div>
          <p className="text-xs text-slate-600 font-medium">{plan.description}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3.5 py-1.5 rounded-xl whitespace-nowrap shadow-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Checkpoint Interval: {plan.checkpointIntervalMs}ms</span>
        </div>
      </div>
    </div>
  );
};
