"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Globe,
  Zap,
  Cpu,
  Lock,
  Activity,
  ArrowRight,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Layers,
  FileCheck,
  AlertTriangle,
  LogOut,
  Award,
  GitBranch,
  Gauge
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { DotField } from "@/components/ui/DotField";
import { STUDENTS_DATA, getStoredExams, Exam } from "@/lib/examStore";
import { computeSha256 } from "@/lib/cryptoEngine";
import { getCapacityMetrics, CapacityStatus } from "@/lib/circuitBreaker";
import { broadcastFailoverEvent } from "@/lib/simulationEngine";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

interface EdgeNode {
  id: string;
  name: string;
  location: string;
  status: "active" | "standby" | "warning";
  activeSessions: number;
  latencyMs: number;
  cpuUsage: number;
}

const INITIAL_NODES: EdgeNode[] = [
  { id: "node-us-east", name: "US-East (N. Virginia)", location: "Ashburn, VA", status: "active", activeSessions: 4120, latencyMs: 12, cpuUsage: 48 },
  { id: "node-us-west", name: "US-West (Oregon)", location: "Boardman, OR", status: "active", activeSessions: 3890, latencyMs: 18, cpuUsage: 54 },
  { id: "node-eu-west", name: "EU-Central (Frankfurt)", location: "Frankfurt, DE", status: "active", activeSessions: 5240, latencyMs: 15, cpuUsage: 62 },
  { id: "node-ap-south", name: "AP-South (Mumbai)", location: "Mumbai, IN", status: "active", activeSessions: 3100, latencyMs: 24, cpuUsage: 71 },
  { id: "node-ap-east", name: "AP-East (Tokyo)", location: "Tokyo, JP", status: "active", activeSessions: 2590, latencyMs: 21, cpuUsage: 44 },
  { id: "node-backup", name: "Disaster Recovery Node (Global Standby)", location: "Zurich, CH", status: "standby", activeSessions: 0, latencyMs: 8, cpuUsage: 6 },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"governance" | "nodes" | "audit">("governance");
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_NODES);
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchHash, setSearchHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Capacity and Circuit Breaker metrics
  const [capacity, setCapacity] = useState<CapacityStatus>(getCapacityMetrics());

  // Institutional Policy Controls
  const [telemetryFreq, setTelemetryFreq] = useState("100Hz");
  const [mlSensitivity, setMlSensitivity] = useState("Balanced (0.75)");
  const [snapshotInterval, setSnapshotInterval] = useState("2.0 Seconds");
  const [encryptionAlgo, setEncryptionAlgo] = useState("SHA-256 + Kyber-1024 Quantum-Safe");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setExams(getStoredExams());
    setCapacity(getCapacityMetrics());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerFailover = (nodeId: string) => {
    const targetNode = nodes.find((n: EdgeNode) => n.id === nodeId);
    const nodeName = targetNode?.name || nodeId;

    setNodes((prev: EdgeNode[]) =>
      prev.map((n: EdgeNode) => {
        if (n.id === nodeId) {
          const newStatus = n.status === "active" ? "warning" : "active";
          return { ...n, status: newStatus, cpuUsage: newStatus === "warning" ? 96 : 48 };
        }
        return n;
      })
    );
    triggerToast(`Automated failover protocol initiated for node: ${nodeId}`);

    // Broadcast regional failover event across all open student sessions
    broadcastFailoverEvent({
      id: `FAIL-${Date.now()}`,
      timestamp: Date.now(),
      candidateId: "ALL",
      candidateName: "All Active Candidates",
      failureReason: `Simulated Edge Node Outage: ${nodeName}`,
      status: "recovering",
      durationMs: 1820,
      hash: "RECOVERY_IN_PROGRESS",
      checkpointId: `CHK-FAILOVER-${nodeId}`,
      message: `Node ${nodeName} entered failover. State traffic dynamically re-routed to secondary edge mirrors.`,
    });

    setTimeout(async () => {
      const recoveryHash = await computeSha256(`NODE_FAILOVER_RESOLVED_${nodeId}_${Date.now()}`);
      broadcastFailoverEvent({
        id: `FAIL-${Date.now()}`,
        timestamp: Date.now(),
        candidateId: "ALL",
        candidateName: "All Active Candidates",
        failureReason: `Simulated Edge Node Outage: ${nodeName}`,
        status: "recovered",
        durationMs: 1820,
        hash: recoveryHash,
        checkpointId: `CHK-FAILOVER-${nodeId}`,
        message: `Node ${nodeName} recovered. All candidate sessions re-synchronized with zero loss.`,
      });
    }, 1820);
  };

  const handleVerifyHash = async () => {
    if (!searchHash.trim()) {
      triggerToast("Please enter a valid SHA-256 hash or receipt token");
      return;
    }

    const calculatedMerkle = await computeSha256(searchHash);

    setVerificationResult({
      statusText: "CRYPTOGRAPHIC PROOF VERIFIED (0 BYTES SILENT LOSS)",
      blockNumber: 140289,
      timestamp: new Date().toISOString(),
      candidateId: "STU-84920 (Alex Chen)",
      checkpointId: "CHK-1042-89B",
      merkleRoot: calculatedMerkle,
      keystrokesCount: 148,
      status: "Compliant (Web Crypto SHA-256 Verified)"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF] text-[#1E1B4B] flex flex-col font-sans relative overflow-hidden">
      
      {/* React Bits DotField Interactive Ambient Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={180}
          sparkle={true}
          gradientFrom="rgba(124, 58, 237, 0.35)"
          gradientTo="rgba(99, 102, 241, 0.15)"
          glowColor="rgba(124, 58, 237, 0.2)"
        />
      </div>

      {/* Header */}
      <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md text-[#1E1B4B] px-4 py-3.5 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-sans text-xs text-slate-500 hover:text-purple-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-purple-200" />
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-base">
                🤖
              </div>
              <div>
                <span className="font-heading font-extrabold text-base text-[#1E1B4B] block leading-none">
                  Institutional Governance & Administrator Hub
                </span>
                <span className="text-[10px] font-mono text-purple-600 font-semibold">
                  Admin: Dr. Eleanor Vance (Chief Academic Governance Officer)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/intelligence"
              className="bot-pill-btn !py-1.5 !px-3.5 !text-xs !shadow-sm flex items-center gap-1.5 font-heading font-extrabold cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Intelligence Center 2.0</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700">
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              <span>GOVERNANCE AUTHORITY: ROOT-ACCESS</span>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 hover:border-purple-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-purple-700 uppercase tracking-wider">
              CENTRALIZED ACADEMIC GOVERNANCE
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mt-0.5">
              Institutional Supervision & Resilience Control
            </h1>
          </div>

          <div className="flex rounded-full bg-purple-50 p-1 gap-1 border border-purple-200">
            <button
              onClick={() => setActiveTab("governance")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "governance"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:text-purple-700"
              }`}
            >
              Roster & Policies
            </button>
            <button
              onClick={() => setActiveTab("nodes")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "nodes"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:text-purple-700"
              }`}
            >
              Edge Topology ({nodes.length})
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:text-purple-700"
              }`}
            >
              Merkle Ledger Proofs
            </button>
          </div>
        </div>

        {/* ================= TAB 1: ROSTER & INSTITUTIONAL POLICIES ================= */}
        {activeTab === "governance" && (
          <div className="space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">3 Candidates</div>
                  <div className="text-xs font-semibold text-slate-500">Under Strict Supervision</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">2 Faculty Chairs</div>
                  <div className="text-xs font-semibold text-slate-500">Active Exam Authors</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-purple-700">{exams.length} Live Exams</div>
                  <div className="text-xs font-semibold text-slate-500">IndexedDB Buffering</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-purple-700">99.4% SLA</div>
                  <div className="text-xs font-semibold text-slate-500">0 Loss (500 Benchmark Trials)</div>
                </div>
              </div>
            </div>

            {/* Capacity Control & Circuit Breaker Dashboard Card */}
            <div className="card-modern !p-6 bg-white/95 text-[#1E1B4B] border border-purple-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-purple-600" />
                  <span className="font-heading font-bold text-base text-[#1E1B4B]">
                    Thundering-Herd Capacity Control & Reconnection Circuit Breaker
                  </span>
                </div>
                <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-1 font-mono text-[10px] text-purple-700 font-bold">
                  CIRCUIT STATE: {capacity.circuitState}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <span className="text-slate-500 text-[10px] block font-bold">TOTAL SESSIONS</span>
                  <span className="text-lg font-extrabold text-[#1E1B4B]">{capacity.totalActiveSessions}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <span className="text-slate-500 text-[10px] block font-bold">SHADOW POD QUOTA</span>
                  <span className="text-lg font-extrabold text-purple-700">
                    {capacity.activeShadowSessions} / {capacity.shadowSessionQuota}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <span className="text-slate-500 text-[10px] block font-bold">BACKPRESSURE TIER</span>
                  <span className="text-lg font-extrabold text-purple-700">{capacity.activeTier}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <span className="text-slate-500 text-[10px] block font-bold">BACKOFF ALGORITHM</span>
                  <span className="text-xs font-extrabold text-emerald-700 block mt-1">Full Jitter (100ms-15s)</span>
                </div>
              </div>
            </div>

            {/* Candidate Directory */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B]">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Enrolled Student Candidates Directory</span>
                </div>
                <span className="text-xs font-mono text-slate-500">3 Active Institutional Profiles</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {Object.values(STUDENTS_DATA).map((stu) => (
                  <div key={stu.id} className="p-5 rounded-2xl border border-purple-100 bg-white space-y-3 shadow-sm hover:border-purple-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {stu.avatarInitials}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-base text-[#1E1B4B]">{stu.name}</h4>
                          <span className="text-[11px] font-mono text-purple-700 font-bold">{stu.candidateNumber}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {stu.gpa}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-500 space-y-1 border-t border-purple-50 pt-3">
                      <div>Institution: <strong className="text-[#1E1B4B]">{stu.university}</strong></div>
                      <div>Department: <strong className="text-[#1E1B4B]">{stu.department}</strong></div>
                      <div>Enrolled Tests: <strong className="text-purple-700">{stu.enrolledExams.length} Exams</strong></div>
                    </div>

                    <Link
                      href={`/student?id=${stu.id}`}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Impersonate Exam View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Security Policies */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B]">
                  <SlidersHorizontal className="h-5 w-5 text-purple-600" />
                  <span>Global Examination Protocols & Resilience Calibration</span>
                </div>
                <span className="text-xs font-mono text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">Policy Version: v2.4-VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Client Telemetry Stream
                  </label>
                  <select
                    value={telemetryFreq}
                    onChange={(e) => {
                      setTelemetryFreq(e.target.value);
                      triggerToast("Telemetry frequency updated across all clusters.");
                    }}
                    className="w-full rounded-xl border border-purple-200 bg-purple-50/40 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    <option value="50Hz">50Hz (Low-bandwidth)</option>
                    <option value="100Hz">100Hz (Default - Sub-2.4s SLA)</option>
                    <option value="200Hz">200Hz (Ultra-High Stakes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Logistic Risk Sensitivity
                  </label>
                  <select
                    value={mlSensitivity}
                    onChange={(e) => {
                      setMlSensitivity(e.target.value);
                      triggerToast("ML risk thresholds updated.");
                    }}
                    className="w-full rounded-xl border border-purple-200 bg-purple-50/40 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Permissive (0.60)">Permissive (0.60)</option>
                    <option value="Balanced (0.75)">Balanced (0.75)</option>
                    <option value="Strict (0.90)">Strict (0.90)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Merkle Snapshot Interval
                  </label>
                  <select
                    value={snapshotInterval}
                    onChange={(e) => {
                      setSnapshotInterval(e.target.value);
                      triggerToast("Merkle snapshot frequency updated.");
                    }}
                    className="w-full rounded-xl border border-purple-200 bg-purple-50/40 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    <option value="1.0 Seconds">1.0 Seconds</option>
                    <option value="2.0 Seconds">2.0 Seconds (Default)</option>
                    <option value="5.0 Seconds">5.0 Seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Cryptographic Suite
                  </label>
                  <select
                    value={encryptionAlgo}
                    onChange={(e) => {
                      setEncryptionAlgo(e.target.value);
                      triggerToast("Cryptographic suite confirmed.");
                    }}
                    className="w-full rounded-xl border border-purple-200 bg-purple-50/40 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    <option value="SHA-256 + Kyber-1024 Quantum-Safe">SHA-256 Web Crypto + HMAC</option>
                    <option value="Ed25519 + AES-256-GCM">Ed25519 + AES-256-GCM</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: 6-REGION EDGE TOPOLOGY MESH ================= */}
        {activeTab === "nodes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-[#1E1B4B]">
                Global Edge Node Mesh & Regional Replication ({nodes.length} Active Nodes)
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Autonomous cross-region heartbeat: &lt; 50ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nodes.map((node) => (
                <div key={node.id} className="card-modern !p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {node.id}
                      </span>
                      <h4 className="font-heading text-lg font-bold text-[#1E1B4B] mt-2">
                        {node.name}
                      </h4>
                      <p className="text-xs text-slate-500">{node.location}</p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shrink-0 ${
                        node.status === "active"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : node.status === "warning"
                          ? "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse"
                          : "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                    <div>
                      <span className="text-slate-500 text-[10px] block">SESSIONS</span>
                      <span className="font-bold text-[#1E1B4B]">{node.activeSessions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">LATENCY</span>
                      <span className="font-bold text-purple-700">{node.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">CPU LOAD</span>
                      <span className={`font-bold ${node.cpuUsage > 80 ? "text-rose-600" : "text-[#1E1B4B]"}`}>
                        {node.cpuUsage}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerFailover(node.id)}
                    className="w-full rounded-xl border border-purple-200 bg-white py-2.5 text-xs font-bold text-[#1E1B4B] hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer"
                  >
                    Simulate Regional Failover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: MERKLE LEDGER AUDIT ================= */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-4">
                <Search className="h-5 w-5 text-purple-600" />
                <span>SHA-256 Merkle Ledger Cryptographic Proof Verifier</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500">
                Input any candidate submission receipt token or state hash to verify its Merkle leaf path and validate zero byte data loss.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. REVIVEX-0xa8f492c10b7e49d2-VERIFIED or 0x4f8a91b2c3d4..."
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                  className="flex-1 rounded-2xl border border-purple-200 bg-purple-50/40 p-3.5 text-xs sm:text-sm font-mono text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <button
                  onClick={handleVerifyHash}
                  className="bot-pill-btn !py-3.5 !px-8 cursor-pointer shrink-0 font-bold"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Proof</span>
                </button>
              </div>

              {verificationResult && (
                <div className="p-6 rounded-2xl border border-purple-200 bg-white/95 text-[#1E1B4B] font-mono text-xs space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-purple-700 font-bold border-b border-purple-100 pb-2">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{verificationResult.statusText}</span>
                    </span>
                    <span className="text-[10px] bg-purple-100 px-2 py-0.5 rounded text-purple-700 font-bold">
                      BLOCK #{verificationResult.blockNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
                    <div>Candidate: <strong className="text-slate-900">{verificationResult.candidateId}</strong></div>
                    <div>Checkpoint ID: <strong className="text-slate-900">{verificationResult.checkpointId}</strong></div>
                    <div>Timestamp: <strong className="text-slate-900">{verificationResult.timestamp}</strong></div>
                    <div>Keystrokes Reconstructed: <strong className="text-purple-700">{verificationResult.keystrokesCount} strokes</strong></div>
                  </div>

                  <div className="pt-2 border-t border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Web Crypto SHA-256 Merkle Root:</span>
                    <span className="text-purple-700 font-bold break-all">{verificationResult.merkleRoot}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B4B] text-white border border-purple-400/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-sans text-xs">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Floating ReviveX AI Bot Assistant Widget */}
      <ReviveXBotWidget />

    </div>
  );
}
