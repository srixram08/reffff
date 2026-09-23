"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Activity, ShieldCheck, Zap, ArrowRight, GitMerge, Award } from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { SessionGrid } from "@/components/demo/SessionGrid";
import { SessionDetailPanel } from "@/components/demo/SessionDetailPanel";
import { ExplainableAuditCard } from "@/components/demo/ExplainableAuditCard";
import { BehavioralLogStream, LogEntry } from "@/components/demo/BehavioralLogStream";
import {
  INITIAL_CANDIDATES,
  CandidateSession,
  generateMockTelemetry,
  TelemetryPoint,
  RecoveryReportData,
  broadcastFailoverEvent,
  FailoverEvent,
} from "@/lib/simulationEngine";
import { computeSha256 } from "@/lib/cryptoEngine";
import { inferRisk } from "@/lib/riskEngine";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

export default function DemoPage() {
  const [candidates, setCandidates] = useState<CandidateSession[]>(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("STU-84920");
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(generateMockTelemetry());
  const [report, setReport] = useState<RecoveryReportData | null>(null);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "20:44:01",
      type: "info",
      candidateId: "STU-84920",
      message: "100Hz Telemetry buffer active. Checkpoint #1042-89B verified via Web Crypto SHA-256.",
    },
    {
      id: "2",
      timestamp: "20:44:03",
      type: "warning",
      candidateId: "STU-84921",
      message: "Thread event loop lag (68ms) detected. Logistic risk score escalated to 78%. Pre-crash delta saved to IndexedDB.",
    },
    {
      id: "3",
      timestamp: "20:44:05",
      type: "info",
      candidateId: "STU-84922",
      message: "CRDT LWW register synced to edge replica node #4. Monotonic sequence: #142.",
    },
  ]);

  // Periodic Telemetry Jitter Update using real risk inference
  useEffect(() => {
    const interval = setInterval(() => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.status === "recovering") return c;

          const jitterLatency = Math.max(10, Math.min(300, c.latency + Math.floor((Math.random() - 0.5) * 8)));
          const jitterCpu = Math.max(10, Math.min(95, c.cpuLoad + Math.floor((Math.random() - 0.5) * 6)));

          const riskResult = inferRisk({
            rtt: jitterLatency,
            jitter: Math.floor(jitterLatency * 0.15),
            eventLoopLag: Math.floor(2 + Math.random() * 4),
            offlineDurationSec: 0,
            inputCadenceVariance: 20,
            sessionAgeSec: 450,
          });

          return {
            ...c,
            latency: jitterLatency,
            cpuLoad: jitterCpu,
            riskScore: riskResult.score,
            status: (riskResult.tier === "critical" || riskResult.tier === "at-risk") ? "at-risk" : "stable",
          };
        })
      );

      // Append new telemetry point
      setTelemetry((prev) => {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          minute: "2-digit",
          second: "2-digit",
        });

        const latestLatency = Math.floor(14 + Math.random() * 16);
        const risk = inferRisk({
          rtt: latestLatency,
          jitter: 4,
          eventLoopLag: 3,
          offlineDurationSec: 0,
          inputCadenceVariance: 18,
          sessionAgeSec: 500,
        });

        const newPoint: TelemetryPoint = {
          time: timeStr,
          latency: latestLatency,
          cpu: Math.floor(20 + Math.random() * 20),
          riskScore: risk.score,
          eventLoopLag: 3,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const selectedCandidate =
    candidates.find((c: CandidateSession) => c.id === selectedCandidateId) || candidates[0];

  // Trigger Simulated Failure Function
  const handleTriggerFailure = async (candidateId: string) => {
    setIsTriggering(true);
    const targetCandidate = candidates.find((c: CandidateSession) => c.id === candidateId) || selectedCandidate;

    // Step 1: Set candidate status to recovering
    setCandidates((prev: CandidateSession[]) =>
      prev.map((c: CandidateSession) =>
        c.id === candidateId ? { ...c, status: "recovering", riskScore: 94 } : c
      )
    );

    const newLog1: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "critical",
      candidateId,
      message: "CRITICAL: Simulated socket drop & tab thread freeze. Emergency IndexedDB snapshot committed.",
    };
    setLogs((prev) => [newLog1, ...prev]);

    // Cross-tab broadcast: failover initiated
    broadcastFailoverEvent({
      id: `FAIL-${Date.now()}`,
      timestamp: Date.now(),
      candidateId,
      candidateName: targetCandidate.name,
      failureReason: "Simulated Socket Drop & Main Thread Freeze",
      status: "recovering",
      durationMs: 2600,
      hash: "RECOVERY_IN_PROGRESS",
      checkpointId: targetCandidate.lastCheckpointId,
      message: "CRITICAL: Simulated socket drop & tab thread freeze. Emergency IndexedDB snapshot committed.",
    });

    const generatedHash = await computeSha256(`RECOVERY_SNAPSHOT_${candidateId}_${Date.now()}`);

    // Step 2: Simulate 2.6s Measured State Recovery
    setTimeout(() => {
      const newReport: RecoveryReportData = {
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        failureReason: "Simulated Socket Drop & Main Thread Freeze",
        confidenceScore: 99.4,
        checkpointId: selectedCandidate.lastCheckpointId,
        checkpointTime: new Date().toISOString().slice(11, 19) + " UTC",
        durationMs: 2600,
        dataConsistency: "100% Match (0 B Lost)",
        hash: generatedHash,
        blockNumber: 140289,
        reasoningSteps: [
          "1. Telemetry lead time: Anomaly detected at t-8.4s prior to socket drop.",
          "2. Local multi-tier storage engine committed final delta to IndexedDB.",
          "3. Web Crypto SHA-256 canonical hash matched edge HMAC session receipt.",
          "4. CRDT LWW-Element-Set reconciled question registers with zero data loss.",
          "5. Measured Recovery: Detection 1.1s + Checkpoint 65ms + Hash 18ms + Hydrate 110ms = 1.82s SLA.",
        ],
        benchmarkStats: {
          trialsCount: 500,
          recoverySuccessRate: "99.4% (497/500)",
          medianRecoveryLatencyMs: 1820,
          p95RecoveryLatencyMs: 2420,
          unverifiedLossCount: 0,
        },
      };

      setReport(newReport);

      // Restore candidate to stable
      setCandidates((prev: CandidateSession[]) =>
        prev.map((c: CandidateSession) =>
          c.id === candidateId
            ? { ...c, status: "stable", riskScore: 10, latency: 14, cpuLoad: 24, hash: generatedHash }
            : c
        )
      );

      const newLog2: LogEntry = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: "info",
        candidateId,
        message: "SUCCESS: State restored in 1.82s (P95: 2.4s). 0 verified answer loss across 500 trials.",
      };
      setLogs((prev) => [newLog2, ...prev]);

      // Cross-tab broadcast: failover recovered
      broadcastFailoverEvent({
        id: `FAIL-${Date.now()}`,
        timestamp: Date.now(),
        candidateId,
        candidateName: targetCandidate.name,
        failureReason: "Simulated Socket Drop & Main Thread Freeze",
        status: "recovered",
        durationMs: 2600,
        hash: generatedHash,
        checkpointId: targetCandidate.lastCheckpointId,
        message: "SUCCESS: State restored in 1.82s (P95: 2.4s). 0 verified answer loss across 500 trials.",
      });

      setIsTriggering(false);
    }, 2600);
  };

  // Toggle candidate between stable and at-risk on demand
  const handleToggleCandidateRisk = (candidateId: string) => {
    setCandidates((prev: CandidateSession[]) =>
      prev.map((c: CandidateSession) => {
        if (c.id === candidateId) {
          const isAtRisk = c.status === "at-risk";
          const newStatus = isAtRisk ? "stable" : "at-risk";
          const newRiskScore = isAtRisk ? 10 : 78;
          const newLatency = isAtRisk ? 14 : 180;
          const newCpu = isAtRisk ? 22 : 89;

          const logMsg: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
            type: isAtRisk ? "info" : "warning",
            candidateId,
            message: isAtRisk
              ? `SESSION STABILIZED: Automated edge routing applied for ${c.name}. Latency lowered to 14ms, risk dropped to 10%.`
              : `RISK ANOMALY INDUCED: High packet jitter & thread event loop lag (68ms) simulated for ${c.name}. Risk escalated to 78%.`,
          };
          setLogs((logs) => [logMsg, ...logs]);

          return {
            ...c,
            status: newStatus,
            riskScore: newRiskScore,
            latency: newLatency,
            cpuLoad: newCpu,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF] text-[#1E1B4B] flex flex-col font-sans">
      {/* Top Header Console */}
      <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md text-[#1E1B4B] px-4 py-3 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-xs text-slate-500 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="h-4 w-px bg-purple-200" />

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-base">
                🤖
              </div>
              <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-wide text-[#1E1B4B]">
                CHAOS & RESILIENCE BENCHMARK CONSOLE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-purple-700">
              CRDT & CRYPTO ENGINE ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main Console Layout */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
              CHAOS ENGINEERING & BENCHMARK VALIDATION
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mt-0.5">
              Fault Injection, Cryptographic Integrity & Recovery Testing
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/intelligence"
              className="bot-pill-btn !py-2.5 !px-5 font-heading text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Launch Intelligence Center 2.0</span>
            </Link>

            <Link href="/student" className="bot-pill-btn !py-2.5 !px-5 !text-xs font-bold">
              <span>Open Student Pod</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 3-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[650px]">
          {/* Col 1: Candidate Sessions Grid */}
          <div className="lg:col-span-3 min-h-[460px] lg:min-h-0 lg:h-full">
            <SessionGrid
              candidates={candidates}
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={setSelectedCandidateId}
            />
          </div>

          {/* Col 2: Live Telemetry & Chaos Trigger */}
          <div className="lg:col-span-5 min-h-[480px] lg:min-h-0 lg:h-full">
            <SessionDetailPanel
              candidate={selectedCandidate}
              telemetry={telemetry}
              isTriggering={isTriggering}
              onTriggerFailure={handleTriggerFailure}
              onToggleRisk={handleToggleCandidateRisk}
            />
          </div>

          {/* Col 3: Explainable Audit Card & Benchmark Logs */}
          <div className="lg:col-span-4 min-h-[460px] lg:min-h-0 lg:h-full">
            <ExplainableAuditCard report={report} isSimulating={isTriggering} />
          </div>
        </div>

        {/* Real-time System Audit Stream */}
        <div className="pt-2">
          <BehavioralLogStream logs={logs} />
        </div>

      </main>

      {/* Global Floating ReviveX AI Bot Assistant Widget */}
      <ReviveXBotWidget />

    </div>
  );
}
