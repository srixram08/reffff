"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Battery,
  Cpu,
  Wifi,
  HardDrive,
  RotateCcw,
  CheckCircle2,
  Zap
} from "lucide-react";
import { CandidateSession, TelemetryPoint } from "@/lib/simulationEngine";
import { StatusRing } from "../ui/StatusRing";

interface SessionDetailPanelProps {
  candidate: CandidateSession;
  telemetry: TelemetryPoint[];
  onTriggerFailure: (candidateId: string) => void;
  onToggleRisk?: (candidateId: string) => void;
  isTriggering: boolean;
}

export const SessionDetailPanel: React.FC<SessionDetailPanelProps> = ({
  candidate,
  telemetry,
  onTriggerFailure,
  onToggleRisk,
  isTriggering,
}) => {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-purple-200/80 bg-white/95 shadow-sm p-5 text-[#1E1B4B] space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-purple-100 pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <StatusRing status={candidate.status} size="lg" showLabel />
            <h2 className="font-heading text-xl font-bold text-[#1E1B4B]">
              {candidate.name}
            </h2>
            <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold">
              {candidate.id}
            </span>
          </div>
          <p className="font-mono text-xs text-slate-500">
            Exam: <span className="text-[#1E1B4B] font-semibold">{candidate.examSubject}</span> | Candidate Num: {candidate.candidateNumber}
          </p>
        </div>

        {/* Action Buttons: Toggle Risk vs Simulate Failover */}
        <div className="flex flex-wrap items-center gap-2">
          {onToggleRisk && (
            <button
              type="button"
              onClick={() => onToggleRisk(candidate.id)}
              disabled={isTriggering || candidate.status === "recovering"}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                candidate.status === "at-risk"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  : "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
              title={
                candidate.status === "at-risk"
                  ? "Stabilize candidate connection and clear risk alert"
                  : "Simulate network latency jitter to test AI risk detection"
              }
            >
              {candidate.status === "at-risk" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Auto-Stabilize Session</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Induce Risk Anomaly</span>
                </>
              )}
            </button>
          )}

          {/* Trigger Simulation Button */}
          <button
            onClick={() => onTriggerFailure(candidate.id)}
            disabled={isTriggering || candidate.status === "recovering"}
            id="trigger-failure-btn"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
              isTriggering || candidate.status === "recovering"
                ? "bg-amber-600 text-white animate-pulse"
                : "bot-pill-btn !py-2.5 !px-5"
            }`}
          >
            <RotateCcw className={`h-4 w-4 ${isTriggering ? "animate-spin" : ""}`} />
            <span>
              {isTriggering || candidate.status === "recovering"
                ? "Recovering State (2.4s)..."
                : "Simulate Failover Event"}
            </span>
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-3">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold">
            <Wifi className="h-3 w-3 text-purple-600" /> Network Latency
          </div>
          <div className="text-lg font-bold text-purple-700 mt-1 tabular-nums">
            {candidate.latency} ms
          </div>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-3">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold">
            <Cpu className="h-3 w-3 text-purple-600" /> CPU Core Load
          </div>
          <div className="text-lg font-bold text-[#1E1B4B] mt-1 tabular-nums">
            {candidate.cpuLoad} %
          </div>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-3">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold">
            <Battery className="h-3 w-3 text-purple-600" /> Device Battery
          </div>
          <div className="text-lg font-bold text-[#1E1B4B] mt-1 tabular-nums">
            {candidate.battery} %
          </div>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-3">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold">
            <HardDrive className="h-3 w-3 text-purple-600" /> Risk Score
          </div>
          <div className={`text-lg font-bold mt-1 tabular-nums ${candidate.riskScore > 60 ? "text-[#D97706]" : "text-emerald-600"}`}>
            {candidate.riskScore} %
          </div>
        </div>
      </div>

      {/* Real-time Recharts Stream */}
      <div className="flex-1 rounded-xl border border-purple-100 bg-purple-50/30 p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 font-bold text-[#1E1B4B]">
            <Activity className="h-3.5 w-3.5 text-purple-600" />
            LIVE TELEMETRY WAVEFORM (100HZ)
          </span>
          <span className="text-purple-600 font-semibold">STREAM STABLE</span>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetry}>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1B4B",
                  border: "1px solid rgba(147, 51, 234, 0.4)",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#FFFFFF",
                }}
              />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#7C3AED"
                strokeWidth={2}
                dot={false}
                name="Latency (ms)"
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#6366F1"
                strokeWidth={1.5}
                dot={false}
                name="CPU (%)"
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#D97706"
                strokeWidth={1.5}
                dot={false}
                name="Risk Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State Delta & Checkpoint Info */}
      <div className="rounded-xl border border-purple-100 bg-purple-50/20 p-3 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-slate-500 block text-[10px]">LAST CHECKPOINT:</span>
          <span className="font-bold text-[#1E1B4B]">{candidate.lastCheckpointId}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">STATE SHA-256:</span>
          <span className="text-purple-700 font-bold truncate max-w-[140px] block">{candidate.hash}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">PROGRESS:</span>
          <span className="font-bold text-[#1E1B4B]">Q{candidate.currentQuestion} / {candidate.totalQuestions}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">LAST TIMESTAMP:</span>
          <span className="font-bold text-[#1E1B4B]">{candidate.checkpointTimestamp}</span>
        </div>
      </div>
    </div>
  );
};
