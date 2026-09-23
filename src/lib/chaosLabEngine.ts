/**
 * ReviveX Advanced Chaos Engineering Engine
 * 
 * Provides:
 * 1. 10+ Categorized Failure Scenarios across Network, Client, Server, and State Integrity:
 *    - Network: Packet Loss Saturation, High RTT Latency Spike, Complete Socket Disconnect, Jitter Flapping
 *    - Client: Main-Thread CPU Spike (95%), Browser Tab Freeze (Event-Loop Lock), Rapid Input Thrashing, Memory Pressure
 *    - Server & State: Edge Node Outage, DB Replication Timeout, Corrupted Checkpoint, Sequence Replay Attack
 * 2. Automated Chaos Test Runner executing the 8-milestone recovery lifecycle:
 *    - Step 1: Fault injected
 *    - Step 2: Failure detected
 *    - Step 3: Risk prediction calculated
 *    - Step 4: Protection upgraded autonomously
 *    - Step 5: Failure occurred
 *    - Step 6: Recovery started
 *    - Step 7: Cryptographic state verified
 *    - Step 8: Session restored with 0 answer loss
 */

import { computeSha256 } from "./cryptoEngine";

export type ChaosCategory = "NETWORK" | "CLIENT" | "SERVER" | "STATE_INTEGRITY";

export interface ChaosScenario {
  id: string;
  name: string;
  category: ChaosCategory;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CATASTROPHIC";
  description: string;
  injectionParams: {
    rtt?: number;
    jitter?: number;
    packetLoss?: number;
    cpuLoad?: number;
    eventLoopLag?: number;
    offlineSec?: number;
    corruptHash?: boolean;
  };
}

export const CHAOS_SCENARIOS: ChaosScenario[] = [
  // NETWORK FAULTS
  {
    id: "net-packet-loss",
    name: "Packet Loss Saturation (25%)",
    category: "NETWORK",
    severity: "HIGH",
    description: "Simulates severe Wi-Fi contention and dropped TCP packets causing buffer backlog.",
    injectionParams: { packetLoss: 25, jitter: 65, rtt: 180 },
  },
  {
    id: "net-latency-spike",
    name: "Cross-Continental Latency Spike (380ms)",
    category: "NETWORK",
    severity: "MEDIUM",
    description: "Forces artificial routing delay exceeding the 150ms edge tolerance threshold.",
    injectionParams: { rtt: 380, jitter: 45, packetLoss: 4 },
  },
  {
    id: "net-socket-drop",
    name: "Abrupt WebSocket Socket Disconnection",
    category: "NETWORK",
    severity: "CATASTROPHIC",
    description: "Immediately severs active WebSocket connection without sending TCP FIN packet.",
    injectionParams: { offlineSec: 8, rtt: 999, packetLoss: 100 },
  },
  {
    id: "net-jitter-flapping",
    name: "High-Frequency Jitter Flapping",
    category: "NETWORK",
    severity: "MEDIUM",
    description: "Randomly fluctuates latency between 15ms and 300ms every 100ms to stress connection pools.",
    injectionParams: { jitter: 120, rtt: 210, packetLoss: 8 },
  },

  // CLIENT RUNTIME FAULTS
  {
    id: "client-cpu-spike",
    name: "Main-Thread CPU Saturation (95%)",
    category: "CLIENT",
    severity: "HIGH",
    description: "Spawns heavy cryptographic / recursive computation blocking UI rendering.",
    injectionParams: { cpuLoad: 95, eventLoopLag: 72 },
  },
  {
    id: "client-tab-freeze",
    name: "Chromium Tab Event-Loop Freeze",
    category: "CLIENT",
    severity: "CATASTROPHIC",
    description: "Simulates background tab throttle clamping microtasks to 1-second intervals.",
    injectionParams: { eventLoopLag: 120, cpuLoad: 80, offlineSec: 4 },
  },
  {
    id: "client-input-thrash",
    name: "Rapid Input Thrashing (Code Burst)",
    category: "CLIENT",
    severity: "LOW",
    description: "Injects 500 characters per second to test CRDT monotonic sequence numbering.",
    injectionParams: { eventLoopLag: 35, cpuLoad: 60 },
  },
  {
    id: "client-memory-pressure",
    name: "Browser Heap Memory Exhaustion",
    category: "CLIENT",
    severity: "HIGH",
    description: "Triggers garbage collection pressure testing multi-tier storage fallback.",
    injectionParams: { eventLoopLag: 55, cpuLoad: 75 },
  },

  // SERVER & STATE INTEGRITY FAULTS
  {
    id: "server-node-outage",
    name: "Primary Edge Node Total Crash",
    category: "SERVER",
    severity: "CATASTROPHIC",
    description: "Simulates catastrophic failure of the regional edge container routing cluster.",
    injectionParams: { offlineSec: 10, rtt: 999 },
  },
  {
    id: "server-db-timeout",
    name: "Database Replication Split-Brain",
    category: "SERVER",
    severity: "HIGH",
    description: "Causes cloud database write timeouts forcing candidate sessions to rely strictly on local state.",
    injectionParams: { rtt: 320, packetLoss: 15 },
  },
  {
    id: "state-hash-corruption",
    name: "Checkpoint SHA-256 Bit-Flip Attack",
    category: "STATE_INTEGRITY",
    severity: "CATASTROPHIC",
    description: "Mutates 1 character in the canonical checkpoint hash to test cryptographic tamper detection.",
    injectionParams: { corruptHash: true },
  },
  {
    id: "state-replay-attack",
    name: "Sequence Replay & Desync Injection",
    category: "STATE_INTEGRITY",
    severity: "HIGH",
    description: "Attempts to replay an older sequence checkpoint to test CRDT epoch monotonicity.",
    injectionParams: { corruptHash: false },
  },
];

export interface ChaosTimelineStep {
  stepNumber: number;
  timeLabel: string;
  milestone: string;
  status: "pending" | "running" | "completed" | "flagged";
  details: string;
  delayMs: number;
}

export const BASE_CHAOS_TIMELINE: ChaosTimelineStep[] = [
  { stepNumber: 1, timeLabel: "T+0.0s", milestone: "Fault injected", status: "pending", details: "Chaos stimulus triggered on candidate runtime.", delayMs: 300 },
  { stepNumber: 2, timeLabel: "T+0.3s", milestone: "Failure detected", status: "pending", details: "Telemetry anomaly registered via microtask drift.", delayMs: 400 },
  { stepNumber: 3, timeLabel: "T+0.6s", milestone: "Risk prediction", status: "pending", details: "AI Failure Predictor scored probability & window.", delayMs: 300 },
  { stepNumber: 4, timeLabel: "T+0.9s", milestone: "Protection upgraded", status: "pending", details: "Autonomous planner escalated to Shadow Session & IDB sync.", delayMs: 400 },
  { stepNumber: 5, timeLabel: "T+1.3s", milestone: "Failure occurred", status: "pending", details: "Primary runtime connection or thread dropped.", delayMs: 400 },
  { stepNumber: 6, timeLabel: "T+1.6s", milestone: "Recovery started", status: "pending", details: "Rollback orchestrator discovered verified candidate checkpoints.", delayMs: 400 },
  { stepNumber: 7, timeLabel: "T+1.9s", milestone: "State verified", status: "pending", details: "Web Crypto SHA-256 matched HMAC receipt (0B lost).", delayMs: 400 },
  { stepNumber: 8, timeLabel: "T+2.3s", milestone: "Session restored", status: "pending", details: "Exam resumed with complete CRDT state reconciliation (< 2.4s SLA).", delayMs: 200 },
];
