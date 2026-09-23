"use client";

import { SessionStatus } from "../components/ui/StatusRing";
import { inferRisk, TelemetrySample, RiskInferenceResult } from "./riskEngine";

export interface CandidateSession {
  id: string;
  name: string;
  candidateNumber: string;
  examSubject: string;
  currentQuestion: number;
  totalQuestions: number;
  status: SessionStatus;
  riskScore: number; // 0 - 100
  latency: number; // ms
  cpuLoad: number; // %
  battery: number; // %
  stateDelta: number; // Bytes
  lastCheckpointId: string;
  checkpointTimestamp: string;
  hash: string;
  riskDetails?: RiskInferenceResult;
}

export interface TelemetryPoint {
  time: string;
  latency: number;
  cpu: number;
  riskScore: number;
  eventLoopLag?: number;
  isColdStart?: boolean;
}

export interface RecoveryReportData {
  candidateId: string;
  candidateName: string;
  failureReason: string;
  confidenceScore: number;
  checkpointId: string;
  checkpointTime: string;
  durationMs: number;
  dataConsistency: string;
  hash: string;
  blockNumber: number;
  reasoningSteps: string[];
  benchmarkStats?: {
    trialsCount: number;
    recoverySuccessRate: string;
    medianRecoveryLatencyMs: number;
    p95RecoveryLatencyMs: number;
    unverifiedLossCount: number;
  };
}

export const INITIAL_CANDIDATES: CandidateSession[] = [
  {
    id: "STU-84920",
    name: "Alex Chen",
    candidateNumber: "CN-2026-881A",
    examSubject: "Advanced Distributed Systems",
    currentQuestion: 14,
    totalQuestions: 40,
    status: "stable",
    riskScore: 12,
    latency: 14,
    cpuLoad: 24,
    battery: 88,
    stateDelta: 142,
    lastCheckpointId: "CHK-1042-89B",
    checkpointTimestamp: "2026-07-28 20:44:09",
    hash: "0xa8f492c10b7e49d29f8c12a3456789abcdef0123456789abcdef0123456789ab",
  },
  {
    id: "STU-84921",
    name: "Sarah Jenkins",
    candidateNumber: "CN-2026-902B",
    examSubject: "Quantum Information Theory",
    currentQuestion: 22,
    totalQuestions: 40,
    status: "stable",
    riskScore: 11,
    latency: 16,
    cpuLoad: 25,
    battery: 92,
    stateDelta: 164,
    lastCheckpointId: "CHK-1042-91A",
    checkpointTimestamp: "2026-07-28 20:43:55",
    hash: "0x7b3e19a45f8c12b99d0e123456789123456789abcdef0123456789abcdef0123",
  },
  {
    id: "STU-84922",
    name: "Marcus Vance",
    candidateNumber: "CN-2026-744C",
    examSubject: "Cryptographic Engineering",
    currentQuestion: 9,
    totalQuestions: 40,
    status: "stable",
    riskScore: 6,
    latency: 12,
    cpuLoad: 18,
    battery: 95,
    stateDelta: 96,
    lastCheckpointId: "CHK-1042-88C",
    checkpointTimestamp: "2026-07-28 20:44:01",
    hash: "0x3f1e92d88c7a10b44e211234567890abcdef0123456789abcdef0123456789ab",
  },
  {
    id: "STU-84923",
    name: "Elena Rostova",
    candidateNumber: "CN-2026-611D",
    examSubject: "Autonomous Systems AI",
    currentQuestion: 31,
    totalQuestions: 40,
    status: "stable",
    riskScore: 16,
    latency: 22,
    cpuLoad: 31,
    battery: 64,
    stateDelta: 280,
    lastCheckpointId: "CHK-1042-94D",
    checkpointTimestamp: "2026-07-28 20:44:11",
    hash: "0xc991e2b44a701e9b2c3d123456789456789abcdef0123456789abcdef012345",
  },
  {
    id: "STU-84924",
    name: "Devon Thorne",
    candidateNumber: "CN-2026-505E",
    examSubject: "Compiler Construction",
    currentQuestion: 18,
    totalQuestions: 40,
    status: "stable",
    riskScore: 24,
    latency: 35,
    cpuLoad: 42,
    battery: 45,
    stateDelta: 190,
    lastCheckpointId: "CHK-1042-90E",
    checkpointTimestamp: "2026-07-28 20:43:40",
    hash: "0x1a2b3c4d5e6f7a8b9c0d123456789efabcdef0123456789abcdef0123456789",
  },
];

// Generate telemetry points driven by the real riskEngine logistic regression model
export const generateMockTelemetry = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = new Date();

  for (let i = 10; i >= 0; i--) {
    const timeStr = new Date(now.getTime() - i * 3000).toLocaleTimeString("en-US", {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
    });

    const latency = Math.floor(14 + Math.sin(i * 0.8) * 8 + Math.random() * 6);
    const cpu = Math.floor(22 + Math.cos(i * 0.5) * 10 + Math.random() * 5);
    const eventLoopLag = Math.floor(2 + Math.random() * 4);

    const sample: TelemetrySample = {
      rtt: latency,
      jitter: Math.floor(latency * 0.15),
      eventLoopLag,
      offlineDurationSec: 0,
      inputCadenceVariance: 24,
      sessionAgeSec: 300 + (10 - i) * 3,
    };

    const risk = inferRisk(sample);

    points.push({
      time: timeStr,
      latency,
      cpu,
      riskScore: risk.score,
      eventLoopLag,
      isColdStart: false,
    });
  }

  return points;
};

export interface FailoverEvent {
  id: string;
  timestamp: number;
  candidateId: string;
  candidateName: string;
  failureReason: string;
  status: "recovering" | "recovered";
  durationMs: number;
  hash: string;
  checkpointId: string;
  message: string;
}

export const FAILOVER_STORAGE_KEY = "revivex_active_failover_event";
export const FAILOVER_CHANNEL_NAME = "revivex_failover_bus";

let sharedBroadcastChannel: BroadcastChannel | null = null;

export function getFailoverBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  try {
    if (!sharedBroadcastChannel) {
      sharedBroadcastChannel = new BroadcastChannel(FAILOVER_CHANNEL_NAME);
    }
    return sharedBroadcastChannel;
  } catch {
    return null;
  }
}

export function broadcastFailoverEvent(event: FailoverEvent) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(event);
    localStorage.setItem(FAILOVER_STORAGE_KEY, serialized);
    // Ping key to force cross-tab StorageEvent even if serialized payload is identical
    localStorage.setItem("revivex_failover_ping", Date.now().toString() + "_" + Math.random().toString(36).substring(2, 6));

    // 1. Instant cross-tab BroadcastChannel (persistent, do not close immediately)
    try {
      const channel = getFailoverBroadcastChannel();
      channel?.postMessage(event);
    } catch {}

    // 2. Same-window CustomEvent
    window.dispatchEvent(new CustomEvent("revivex_failover_event", { detail: event }));

    // 3. Fallback StorageEvent within active window
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: FAILOVER_STORAGE_KEY,
        newValue: serialized,
      })
    );
  } catch (err) {
    console.error("Failed to broadcast failover event:", err);
  }
}

export function getActiveFailoverEvent(): FailoverEvent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FAILOVER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FailoverEvent;
  } catch {
    return null;
  }
}

export function clearActiveFailoverEvent() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FAILOVER_STORAGE_KEY);
    localStorage.setItem("revivex_failover_ping", "CLEARED_" + Date.now().toString());
    try {
      const channel = getFailoverBroadcastChannel();
      channel?.postMessage({ type: "CLEAR" });
    } catch {}
    window.dispatchEvent(new CustomEvent("revivex_failover_cleared"));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: FAILOVER_STORAGE_KEY,
        newValue: null,
      })
    );
  } catch {}
}

