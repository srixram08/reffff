"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  LogOut, Zap, Shield, Activity, Globe, Lock, Cpu, Server, CheckCircle2, ArrowRight, Users
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { GlassCard } from "@/components/ui/GlassCard";
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
} from "@/lib/simulationEngine";
import { computeSha256 } from "@/lib/cryptoEngine";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "PROCTOR-01";

  // Detailed Student / Proctor User Profile Map
  const userMap: Record<string, { 
    id: string;
    name: string; 
    role: "student" | "proctor" | "admin"; 
    email: string;
    num: string; 
    university: string;
    gpa: string;
    exam: string;
    enrolledCourses: Array<{ code: string; title: string; progress: string; status: string }>;
    testsTaken: Array<{ title: string; score: string; date: string; receipt: string }>;
    upcomingTests: Array<{ title: string; date: string; duration: string }>;
  }> = {
    "PROCTOR-01": { 
      id: "PROCTOR-01",
      name: "Platform Owner (Sarah Jenkins)", 
      role: "proctor",
      email: "owner@revivex.edu",
      num: "OWNER-2026-01",
      university: "ReviveX Global Examination Operations",
      gpa: "N/A",
      exam: "Live Session Monitoring Console",
      enrolledCourses: [],
      testsTaken: [],
      upcomingTests: []
    },
    "STU-84920": { 
      id: "STU-84920",
      name: "Alex Chen", 
      role: "student", 
      email: "alex.chen@revivex.edu",
      num: "CN-2026-881A", 
      university: "Stanford University • Dept of Computer Science",
      gpa: "3.92 GPA",
      exam: "Advanced Distributed Systems",
      enrolledCourses: [
        { code: "CS-448", title: "Advanced Distributed Systems", progress: "85%", status: "Active Examination" },
        { code: "PHYS-301", title: "Quantum Information Theory", progress: "60%", status: "Enrolled" }
      ],
      testsTaken: [
        { title: "Midterm Exam: Consensus Protocols", score: "98 / 100", date: "2026-07-15", receipt: "0xa8f492c10b7e49d2" }
      ],
      upcomingTests: [
        { title: "Final Exam: Distributed Fault-Tolerance", date: "Tomorrow, 10:00 AM", duration: "2.0 Hours" }
      ]
    }
  };

  const currentUser = userMap[userId] || userMap["PROCTOR-01"];

  // Proctor / Owner State
  const [candidates, setCandidates] = useState<CandidateSession[]>(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("STU-84921");
  const [telemetry] = useState<TelemetryPoint[]>(generateMockTelemetry());
  const [report, setReport] = useState<RecoveryReportData | null>(null);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "20:44:01",
      type: "info",
      candidateId: "STU-84920",
      message: "100Hz Telemetry stream active. Checkpoint #1042-89B verified across 6 edge nodes.",
    },
    {
      id: "2",
      timestamp: "20:44:03",
      type: "warning",
      candidateId: "STU-84921",
      message: "CPU load spike (89%) detected. ML risk score raised to 78%. Pre-crash snapshot committed.",
    },
  ]);

  const selectedCandidate = candidates.find((c: CandidateSession) => c.id === selectedCandidateId) || candidates[0];

  const handleTriggerFailure = async (candidateId: string) => {
    setIsTriggering(true);
    const targetCandidate = candidates.find((c: CandidateSession) => c.id === candidateId) || selectedCandidate;

    setCandidates((prev: CandidateSession[]) =>
      prev.map((c: CandidateSession) => (c.id === candidateId ? { ...c, status: "recovering", riskScore: 94 } : c))
    );

    const newLog1: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "critical",
      candidateId,
      message: "CRITICAL: Simulated socket drop & tab thread freeze. Emergency IndexedDB snapshot committed.",
    };
    setLogs((prev) => [newLog1, ...prev]);

    // Cross-tab broadcast to all student exam pods
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

    setTimeout(() => {
      const newReport: RecoveryReportData = {
        candidateId: targetCandidate.id,
        candidateName: targetCandidate.name,
        failureReason: "Sudden Socket Drop & Browser Thread Crash",
        confidenceScore: 99.4,
        checkpointId: targetCandidate.lastCheckpointId,
        checkpointTime: new Date().toISOString().slice(11, 19) + " UTC",
        durationMs: 2600,
        dataConsistency: "100% Match (0 B Lost)",
        hash: generatedHash,
        blockNumber: 140289,
        reasoningSteps: [
          "1. Telemetry Stream detected socket disconnect at t-350ms.",
          "2. Emergency snapshot committed to IndexedDB Tier 1 before process crash.",
          "3. 2.6s Rollback executed with zero bytes lost.",
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

      setCandidates((prev: CandidateSession[]) =>
        prev.map((c: CandidateSession) => (c.id === candidateId ? { ...c, status: "stable", riskScore: 10, latency: 14, hash: generatedHash } : c))
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

          const log: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
            type: isAtRisk ? "info" : "warning",
            candidateId,
            message: isAtRisk
              ? `AUTO-STABILIZE: ${c.name} network path rerouted to nearest edge mesh. Latency normalized to 14ms.`
              : `RISK ANOMALY INDUCED: High packet jitter & thread event loop lag (68ms) simulated for ${c.name}. Risk escalated to 78%.`,
          };
          setLogs((l) => [log, ...l]);

          return { ...c, status: newStatus, riskScore: newRiskScore, latency: newLatency, cpuLoad: newCpu };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF] text-[#1E1B4B] flex flex-col font-sans">
      {/* Header Banner */}
      <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md px-4 py-3.5 sm:px-6 shadow-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-base">
                🤖
              </div>
              <span className="font-heading font-extrabold text-xl text-[#1E1B4B]">
                ReviveX Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Logged In: <strong>{currentUser.name}</strong></span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:text-purple-600 hover:border-purple-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Layout */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* PROCTOR / OWNER ROLE DASHBOARD */}
        {currentUser.role === "proctor" && (
          <div className="space-y-6">
            
            {/* Owner Title Header & Executive Metric Cards */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-purple-700 font-bold uppercase tracking-wider">
                    PROCTOR / OWNER CONTROL CENTER
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mt-0.5">
                    Live Session Monitoring Console
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-4 py-2 rounded-full shadow-sm">
                    100Hz STREAM ACTIVE • 6 EDGE NODES
                  </span>
                  <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-2 text-xs font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm cursor-pointer transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Exit Console</span>
                  </button>
                </div>
              </div>

              {/* Executive Metrics Overview Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">5 Active</div>
                    <div className="text-xs font-semibold text-slate-500">Monitored Candidates</div>
                  </div>
                </div>

                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-purple-700">2.42s</div>
                    <div className="text-xs font-semibold text-slate-500">Avg Rollback Speed</div>
                  </div>
                </div>

                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">14ms</div>
                    <div className="text-xs font-semibold text-slate-500">Edge Mesh Latency</div>
                  </div>
                </div>

                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-purple-700">99.999%</div>
                    <div className="text-xs font-semibold text-slate-500">Consistency Match</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main 3-Column Proctor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[620px]">
              <div className="lg:col-span-3 min-h-[460px] lg:min-h-0 lg:h-full">
                <SessionGrid
                  candidates={candidates}
                  selectedCandidateId={selectedCandidateId}
                  onSelectCandidate={setSelectedCandidateId}
                />
              </div>

              <div className="lg:col-span-5 min-h-[480px] lg:min-h-0 lg:h-full">
                <SessionDetailPanel
                  candidate={selectedCandidate}
                  telemetry={telemetry}
                  onTriggerFailure={handleTriggerFailure}
                  onToggleRisk={handleToggleCandidateRisk}
                  isTriggering={isTriggering}
                />
              </div>

              <div className="lg:col-span-4 min-h-[460px] lg:min-h-0 lg:h-full flex flex-col gap-4">
                <div className="flex-1 min-h-0">
                  <ExplainableAuditCard report={report} />
                </div>
                <div className="h-[220px] min-h-[220px]">
                  <BehavioralLogStream logs={logs} />
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Global Floating ReviveX AI Bot Widget */}
      <ReviveXBotWidget />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8FF] text-[#1E1B4B]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
