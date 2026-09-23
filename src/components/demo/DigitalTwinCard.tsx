"use client";

import React, { useState } from "react";
import {
  Cpu,
  Globe,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  DigitalTwinState,
  createDigitalTwin,
  simulatePreFailureConsequence,
  PreFailureSimulationResult,
} from "@/lib/digitalTwinEngine";

interface DigitalTwinCardProps {
  candidateId?: string;
  candidateName?: string;
  theme?: "amber" | "cyan" | "violet";
}

export const DigitalTwinCard: React.FC<DigitalTwinCardProps> = ({
  candidateId = "STU-84920",
  candidateName = "Alex Chen",
  theme = "amber",
}) => {
  const [twin, setTwin] = useState<DigitalTwinState>(() =>
    createDigitalTwin(candidateId, "SESSION-RX-20481")
  );
  const [selectedScenario, setSelectedScenario] = useState<
    | "Network Disconnect"
    | "Browser Crash / Tab Freeze"
    | "Edge Server Failure"
    | "Packet Loss Saturation"
    | "Corrupted Checkpoint Rollback"
  >("Network Disconnect");

  const [simulationResult, setSimulationResult] =
    useState<PreFailureSimulationResult>(() =>
      simulatePreFailureConsequence(twin, "Network Disconnect")
    );

  const [isSimulating, setIsSimulating] = useState(false);

  const themeColors = {
    amber: {
      accent: "#7C3AED",
      badge: "bg-purple-100 text-purple-700 border-purple-200",
      border: "border-purple-100",
      button: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95",
    },
    cyan: {
      accent: "#0284C7",
      badge: "bg-sky-100 text-sky-700 border-sky-200",
      border: "border-sky-100",
      button: "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:opacity-95",
    },
    violet: {
      accent: "#9333EA",
      badge: "bg-purple-100 text-purple-700 border-purple-200",
      border: "border-purple-100",
      button: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95",
    },
  }[theme];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = simulatePreFailureConsequence(twin, selectedScenario);
      setSimulationResult(result);
      setIsSimulating(false);
    }, 450);
  };

  return (
    <div className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 text-[#1E1B4B] shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 border border-purple-200 text-purple-700"
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div
              className="font-mono text-xs font-extrabold uppercase tracking-wider text-purple-600"
            >
              Live Virtual Session Mirror
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#1E1B4B]">
              Digital Twin of Exam Session
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">Synchronized (Drift: 0ms)</span>
        </div>
      </div>

      {/* 6 State Vectors Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-left hover:bg-purple-50/70 transition-all">
          <span className="font-mono text-[10px] text-slate-500 uppercase block font-bold">
            1. Question
          </span>
          <span className="font-heading text-base font-extrabold text-[#1E1B4B] mt-1 block">
            Q14 / 40
          </span>
          <span className="text-[11px] text-purple-700 block mt-0.5 font-mono font-medium">
            3 Flagged • 11 Left
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-left hover:bg-purple-50/70 transition-all">
          <span className="font-mono text-[10px] text-slate-500 uppercase block font-bold">
            2. Answer State
          </span>
          <span className="font-heading text-base font-extrabold text-emerald-700 mt-1 block">
            Synced CRDT
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 font-mono font-medium">
            Seq #142 • 142 B
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-left hover:bg-purple-50/70 transition-all">
          <span className="font-mono text-[10px] text-slate-500 uppercase block font-bold">
            3. Network RTT
          </span>
          <span className="font-heading text-base font-extrabold text-[#1E1B4B] mt-1 block">
            14ms (Jit: 3ms)
          </span>
          <span className="text-[11px] text-emerald-700 block mt-0.5 font-mono font-medium">
            0% Packet Loss
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-left hover:bg-purple-50/70 transition-all">
          <span className="font-mono text-[10px] text-slate-500 uppercase block font-bold">
            4. Browser Health
          </span>
          <span className="font-heading text-base font-extrabold text-[#1E1B4B] mt-1 block">
            2.1ms Drift
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 font-mono font-medium">
            CPU: 18% • 60 FPS
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-left hover:bg-purple-50/70 transition-all">
          <span className="font-mono text-[10px] text-slate-500 uppercase block font-bold">
            5. Risk Score
          </span>
          <span className="font-heading text-base font-extrabold text-purple-700 mt-1 block">
            12% (Stable)
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 font-mono font-medium">
            Window: Normal
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-left hover:bg-purple-50/70 transition-all">
          <span className="font-mono text-[10px] text-slate-500 uppercase block font-bold">
            6. Checkpoint
          </span>
          <span className="font-heading text-base font-extrabold text-purple-900 mt-1 block truncate">
            #CHK-1042-89B
          </span>
          <span className="text-[11px] text-emerald-700 block mt-0.5 font-mono font-medium">
            IndexedDB Locked
          </span>
        </div>
      </div>

      {/* Pre-Failure Consequence Simulator ("What-If" Analysis) */}
      <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div>
            <span
              className="font-mono text-[10px] uppercase font-extrabold tracking-wider block text-purple-600"
            >
              PRE-CRASH FORECASTING ENGINE
            </span>
            <h4 className="font-heading text-base font-extrabold text-[#1E1B4B] mt-0.5">
              Simulate Failure BEFORE It Happens
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value as any)}
              className="rounded-xl border border-purple-200 bg-white px-3.5 py-2 font-mono text-xs text-[#1E1B4B] focus:border-purple-400 focus:outline-none shadow-sm"
            >
              <option value="Network Disconnect">Scenario: Network Disconnect</option>
              <option value="Browser Crash / Tab Freeze">Scenario: Browser Crash / Tab Freeze</option>
              <option value="Edge Server Failure">Scenario: Edge Server Failure</option>
              <option value="Packet Loss Saturation">Scenario: Packet Loss Saturation</option>
              <option value="Corrupted Checkpoint Rollback">Scenario: Corrupted Checkpoint</option>
            </select>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all shadow-md shadow-purple-500/20 cursor-pointer ${themeColors.button}`}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isSimulating ? "Forecasting..." : "Run Forecast"}</span>
            </button>
          </div>
        </div>

        {/* Forecast Result Banner */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-sm">
            <span className="font-mono text-[10px] text-emerald-800 uppercase block font-bold">
              Projected Recovery Duration
            </span>
            <div className="font-heading text-3xl font-extrabold text-emerald-700 mt-1">
              {(simulationResult.projectedRecoveryDurationMs / 1000).toFixed(2)}s
            </div>
            <span className="text-xs text-emerald-900 mt-1 block font-medium">
              Target SLA: &lt; 2.40s (100% Compliant)
            </span>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/90 p-4 shadow-sm">
            <span className="font-mono text-[10px] text-cyan-800 uppercase block font-bold">
              Data Loss Probability
            </span>
            <div className="font-heading text-3xl font-extrabold text-cyan-700 mt-1">
              0 Bytes Lost
            </div>
            <span className="text-xs text-cyan-900 mt-1 block font-medium">
              Protected by 100Hz local CRDT buffer
            </span>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50/90 p-4 shadow-sm">
            <span className="font-mono text-[10px] text-purple-800 uppercase block font-bold">
              Target Checkpoint
            </span>
            <div className="font-heading text-xl font-extrabold text-purple-700 mt-1 truncate">
              {simulationResult.candidateCheckpointId}
            </div>
            <span className="text-xs text-emerald-700 mt-1 block font-mono font-bold">
              Recovery Confidence: {simulationResult.recoveryConfidencePercent}%
            </span>
          </div>
        </div>

        {/* Step-by-Step Forecast Timeline */}
        <div className="mt-4 rounded-2xl border border-purple-100 bg-white p-3.5 shadow-sm">
          <span className="font-mono text-[10px] uppercase text-slate-500 block mb-2 font-bold">
            Simulated Recovery Path Sequence:
          </span>
          <div className="space-y-1.5 font-mono text-xs text-slate-700">
            {simulationResult.stepByStepForecast.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                <span className="text-[#1E1B4B] font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
