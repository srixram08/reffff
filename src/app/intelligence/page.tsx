"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Laptop,
  Layers,
  Lock,
  Palette,
  Play,
  RotateCcw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { FailureCausalityGraph } from "@/components/demo/FailureCausalityGraph";
import { DigitalTwinCard } from "@/components/demo/DigitalTwinCard";
import { AdaptiveReplicationVisualizer } from "@/components/demo/AdaptiveReplicationVisualizer";
import { RecoveryConfidenceModal } from "@/components/demo/RecoveryConfidenceModal";
import { CrossDeviceRecoveryModal } from "@/components/demo/CrossDeviceRecoveryModal";
import { TamperLedgerInspector } from "@/components/demo/TamperLedgerInspector";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";
import {
  CHAOS_SCENARIOS,
  ChaosScenario,
  BASE_CHAOS_TIMELINE,
  ChaosTimelineStep,
} from "@/lib/chaosLabEngine";
import { inferRisk, RiskInferenceResult } from "@/lib/riskEngine";
import { calculateRecoveryConfidence, RecoveryConfidenceMetrics } from "@/lib/cryptoEngine";

export type ContrastTheme = "amber" | "cyan" | "violet";

export default function IntelligenceCenterPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "twin" | "planner" | "chaos" | "ledger"
  >("overview");

  // Theme Switcher State
  const [contrastTheme, setContrastTheme] = useState<ContrastTheme>("violet");

  // Theme-specific styling variables aligned with soft-violet glassmorphic UI
  const themeStyles = {
    amber: {
      accentColor: "#D97706",
      secondaryColor: "#0284C7",
      glowColor: "rgba(217, 119, 6, 0.12)",
      bgCanvas: "bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF]",
      headerBg: "bg-white/85",
      cardBg: "bg-white/95",
      cardBorder: "border-purple-100",
      headerBadge: "bg-amber-100 text-amber-800 border border-amber-200 font-bold",
      navActive: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20",
      primaryButton: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-95 shadow-md shadow-purple-500/20",
      riskText: "text-amber-600",
      borderGlow: "shadow-xl shadow-purple-900/5",
    },
    cyan: {
      accentColor: "#0284C7",
      secondaryColor: "#059669",
      glowColor: "rgba(2, 132, 199, 0.12)",
      bgCanvas: "bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF]",
      headerBg: "bg-white/85",
      cardBg: "bg-white/95",
      cardBorder: "border-sky-100",
      headerBadge: "bg-sky-100 text-sky-800 border border-sky-200 font-bold",
      navActive: "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-600/20",
      primaryButton: "bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold hover:opacity-95 shadow-md shadow-sky-500/20",
      riskText: "text-sky-600",
      borderGlow: "shadow-xl shadow-sky-900/5",
    },
    violet: {
      accentColor: "#7C3AED",
      secondaryColor: "#DB2777",
      glowColor: "rgba(124, 58, 237, 0.12)",
      bgCanvas: "bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF]",
      headerBg: "bg-white/85",
      cardBg: "bg-white/95",
      cardBorder: "border-purple-100",
      headerBadge: "bg-purple-100 text-purple-700 border border-purple-200 font-bold",
      navActive: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20",
      primaryButton: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-95 shadow-md shadow-purple-500/20",
      riskText: "text-purple-700",
      borderGlow: "shadow-xl shadow-purple-900/5",
    },
  }[contrastTheme];

  // Live Telemetry & AI Failure Predictor 2.0 State
  const [telemetry, setTelemetry] = useState({
    rtt: 16,
    jitter: 4,
    eventLoopLag: 2.4,
    offlineDurationSec: 0,
    inputCadenceVariance: 22,
    sessionAgeSec: 360,
    packetLossPercent: 0,
    connectionRetries: 0,
  });

  const [riskInference, setRiskInference] = useState<RiskInferenceResult>(() =>
    inferRisk(telemetry)
  );

  // Chaos Test State
  const [selectedChaosScenario, setSelectedChaosScenario] = useState<ChaosScenario>(
    CHAOS_SCENARIOS[0]
  );
  const [isChaosRunning, setIsChaosRunning] = useState(false);
  const [chaosTimeline, setChaosTimeline] = useState<ChaosTimelineStep[]>(BASE_CHAOS_TIMELINE);
  const [chaosLog, setChaosLog] = useState<string[]>([
    "10:42:01 - High-Contrast Intelligence Center initialized. 100Hz telemetry engine active.",
    "10:42:05 - Digital Twin synchronized with primary exam session (STU-84920).",
    "10:42:10 - Adaptive replication policy set to Tier 1 (Local CRDT Only).",
  ]);

  // Modals
  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);
  const [isCrossDeviceModalOpen, setIsCrossDeviceModalOpen] = useState(false);
  const [confidenceMetrics, setConfidenceMetrics] = useState<RecoveryConfidenceMetrics | undefined>();

  // Continuous Telemetry Drift
  useEffect(() => {
    const interval = setInterval(() => {
      if (isChaosRunning) return;

      setTelemetry((prev) => {
        const jitterRtt = Math.max(12, Math.min(45, prev.rtt + Math.floor((Math.random() - 0.5) * 4)));
        const jitterLag = Math.max(1.8, Math.min(4.5, prev.eventLoopLag + (Math.random() - 0.5) * 0.4));
        const newTel = {
          ...prev,
          rtt: jitterRtt,
          jitter: Math.floor(jitterRtt * 0.15),
          eventLoopLag: Math.round(jitterLag * 10) / 10,
          sessionAgeSec: prev.sessionAgeSec + 3,
        };
        setRiskInference(inferRisk(newTel));
        return newTel;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isChaosRunning]);

  // Automated Chaos Test Runner
  const handleStartChaosTest = () => {
    if (isChaosRunning) return;
    setIsChaosRunning(true);

    setChaosTimeline(
      BASE_CHAOS_TIMELINE.map((step) => ({ ...step, status: "pending" }))
    );

    const scenario = selectedChaosScenario;
    const nowTime = new Date().toLocaleTimeString("en-US", { hour12: false });

    setChaosLog((prev) => [
      `${nowTime} - [CHAOS INJECTION] Initiated '${scenario.name}' (${scenario.category})...`,
      ...prev,
    ]);

    setTelemetry((prev) => {
      const injected = {
        ...prev,
        rtt: scenario.injectionParams.rtt ?? 280,
        jitter: scenario.injectionParams.jitter ?? 65,
        packetLossPercent: scenario.injectionParams.packetLoss ?? 20,
        eventLoopLag: scenario.injectionParams.eventLoopLag ?? 68,
        offlineDurationSec: scenario.injectionParams.offlineSec ?? 6,
        connectionRetries: 3,
      };
      setRiskInference(inferRisk(injected));
      return injected;
    });

    let currentStep = 0;
    const executeStep = () => {
      if (currentStep >= BASE_CHAOS_TIMELINE.length) {
        setIsChaosRunning(false);
        calculateRecoveryConfidence(
          "CHK-CHAOS-RECOVERED",
          "0xRECOVERY_CANONICAL_HASH",
          scenario.injectionParams.corruptHash
        ).then((metrics) => {
          setConfidenceMetrics(metrics);
          setIsConfidenceModalOpen(true);
        });

        setTimeout(() => {
          setTelemetry({
            rtt: 14,
            jitter: 3,
            eventLoopLag: 2.2,
            offlineDurationSec: 0,
            inputCadenceVariance: 20,
            sessionAgeSec: 420,
            packetLossPercent: 0,
            connectionRetries: 0,
          });
          setRiskInference(
            inferRisk({
              rtt: 14,
              jitter: 3,
              eventLoopLag: 2.2,
              offlineDurationSec: 0,
              inputCadenceVariance: 20,
              sessionAgeSec: 420,
            })
          );
        }, 1200);
        return;
      }

      setChaosTimeline((prev) =>
        prev.map((s, idx) =>
          idx === currentStep
            ? { ...s, status: "completed" }
            : idx === currentStep + 1
            ? { ...s, status: "running" }
            : s
        )
      );

      const stepData = BASE_CHAOS_TIMELINE[currentStep];
      setChaosLog((prev) => [
        `${new Date().toLocaleTimeString("en-US", { hour12: false })} - Milestone ${currentStep + 1}/8: ${stepData.milestone} (${stepData.details})`,
        ...prev,
      ]);

      currentStep++;
      setTimeout(executeStep, stepData.delayMs);
    };

    setTimeout(executeStep, 200);
  };

  return (
    <div
      className={`min-h-screen ${themeStyles.bgCanvas} text-[#1E1B4B] flex flex-col font-sans transition-colors duration-500 selection:bg-purple-200 selection:text-purple-900 relative overflow-x-hidden`}
    >
      {/* Ambient background soft glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-pink-300/15 blur-3xl" />
      </div>

      {/* Top Intelligence Console Bar */}
      <header
        className={`border-b border-purple-100/80 ${themeStyles.headerBg} px-4 py-3 sm:px-6 sticky top-0 z-40 shadow-sm backdrop-blur-md relative`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-xs text-slate-500 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>

            <div className="h-4 w-px bg-purple-200" />

            <div className="flex items-center gap-2.5">
              <DottedLogo size={30} />
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-wide text-[#1E1B4B]">
                  REVIVEX INTELLIGENCE CENTER
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase shadow-sm ${themeStyles.headerBadge}`}
                >
                  2.0 Autonomous
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls: Contrast Theme Selector & Cross-Device Action */}
          <div className="flex items-center gap-3">
            {/* Live Contrast Theme Palette Switcher */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50/70 p-1">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold pl-2 pr-1 flex items-center gap-1">
                <Palette className="h-3 w-3 text-purple-600" />
                Theme:
              </span>
              <button
                onClick={() => setContrastTheme("amber")}
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold transition-all cursor-pointer ${
                  contrastTheme === "amber"
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                    : "text-slate-600 hover:text-purple-700"
                }`}
              >
                <span>⚡ Amber</span>
              </button>
              <button
                onClick={() => setContrastTheme("cyan")}
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold transition-all cursor-pointer ${
                  contrastTheme === "cyan"
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                    : "text-slate-600 hover:text-purple-700"
                }`}
              >
                <span>💎 Cyan</span>
              </button>
              <button
                onClick={() => setContrastTheme("violet")}
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold transition-all cursor-pointer ${
                  contrastTheme === "violet"
                    ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
                    : "text-slate-600 hover:text-purple-700"
                }`}
              >
                <span>🔮 Violet</span>
              </button>
            </div>

            <button
              onClick={() => setIsCrossDeviceModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white/80 px-3 py-1.5 font-mono text-xs text-purple-700 hover:bg-purple-50 shadow-sm transition-all cursor-pointer font-medium"
            >
              <Laptop className="h-3.5 w-3.5 text-purple-600" />
              <span>Cross-Device Recovery</span>
            </button>

            <Link
              href="/student"
              className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-mono text-xs font-bold transition-all shadow-md ${themeStyles.primaryButton}`}
            >
              <span>Student Pod</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6 relative z-10">
        {/* High-Contrast Flagship Stat Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Session Health */}
          <div
            className={`rounded-3xl border border-purple-100 bg-white/95 p-5 shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-emerald-800 uppercase font-bold tracking-wider">
                Session Overall Health
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="font-heading text-4xl font-extrabold text-emerald-700 mt-2 flex items-baseline gap-2">
              <span>{Math.max(15, 100 - riskInference.score)}%</span>
              <span className="text-xs font-semibold text-slate-500">Optimal</span>
            </div>
            <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(15, 100 - riskInference.score)}%` }}
              />
            </div>
          </div>

          {/* Card 2: AI Failure Risk Score */}
          <div
            className={`rounded-3xl border border-purple-100 bg-white/95 p-5 shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[11px] uppercase font-bold tracking-wider"
                style={{ color: themeStyles.accentColor }}
              >
                AI Failure Risk Score
              </span>
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: themeStyles.accentColor }}
              />
            </div>
            <div className="font-heading text-4xl font-extrabold text-[#1E1B4B] mt-2 flex items-baseline gap-2">
              <span className={themeStyles.riskText}>{riskInference.score}%</span>
              <span className="text-xs font-mono font-bold uppercase text-slate-500">
                {riskInference.tier}
              </span>
            </div>
            <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  riskInference.score >= 85
                    ? "bg-rose-500"
                    : riskInference.score >= 65
                    ? "bg-amber-500"
                    : "bg-sky-500"
                }`}
                style={{ width: `${riskInference.score}%` }}
              />
            </div>
          </div>

          {/* Card 3: Predicted Failure Window */}
          <div
            className={`rounded-3xl border border-purple-100 bg-white/95 p-5 shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-amber-800 uppercase font-bold tracking-wider">
                Predicted Failure Window
              </span>
              <ClockIcon className="h-4 w-4 text-amber-600" />
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2 truncate">
              {riskInference.predictedFailureType === "None"
                ? "Nominal Window"
                : `${riskInference.estimatedFailureWindowSec[0]}–${riskInference.estimatedFailureWindowSec[1]}s`}
            </div>
            <span className="text-xs text-slate-600 mt-1 block font-mono font-medium truncate">
              Type: <strong className="text-[#1E1B4B]">{riskInference.predictedFailureType}</strong>
            </span>
          </div>

          {/* Card 4: Autonomous Strategy */}
          <div
            className={`rounded-3xl border border-purple-100 bg-white/95 p-5 shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-indigo-800 uppercase font-bold tracking-wider">
                Autonomous Strategy
              </span>
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="font-heading text-xl sm:text-2xl font-extrabold text-indigo-700 mt-2 truncate">
              {riskInference.recoveryStrategy}
            </div>
            <span className="text-xs text-emerald-700 mt-1 block font-mono font-bold">
              SLA: &lt; 2.4s • 0 Bytes Lost
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/80 backdrop-blur-md border border-purple-100 rounded-2xl p-1.5 gap-1.5 overflow-x-auto shadow-sm shadow-purple-900/5">
          {[
            { id: "overview", label: "Cockpit Overview", icon: Activity },
            { id: "twin", label: "Digital Twin & Forecast", icon: Sparkles },
            { id: "planner", label: "Adaptive Replication", icon: Layers },
            { id: "chaos", label: "Chaos Lab (10+ Scenarios)", icon: Zap },
            { id: "ledger", label: "Tamper-Evident Ledger", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-heading text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `${themeStyles.navActive} font-bold`
                    : "text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 font-semibold"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW COCKPIT */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* AI Failure Prediction 2.0 Factor Breakdown Card */}
            <div
              className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 shadow-xl shadow-purple-900/5 backdrop-blur-xl`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
                <div>
                  <span
                    className="font-mono text-xs uppercase font-extrabold tracking-wider block text-purple-600"
                  >
                    AI FAILURE PREDICTION 2.0
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#1E1B4B] mt-1">
                    Root-Cause Telemetry Attribution & Failure Forecast
                  </h3>
                </div>
                <div className="font-mono text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl shadow-sm">
                  Prediction Probability:{" "}
                  <strong className="text-emerald-950 text-sm font-bold">
                    {riskInference.failureProbability}%
                  </strong>
                </div>
              </div>

              {/* 5-Factor Telemetry Cards */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {riskInference.factorBreakdown.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5 shadow-sm hover:border-purple-200 hover:bg-purple-50/70 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#1E1B4B] font-bold">{f.name}</span>
                      <span
                        className={`font-extrabold text-sm ${
                          f.severity === "critical"
                            ? "text-rose-600"
                            : f.severity === "warning"
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {f.trend === "up" ? "↑ " : "→ "}
                        {f.value}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 font-medium">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <span className="text-slate-600">
                  Recommended Autonomous Action:{" "}
                  <strong className="text-purple-900 font-bold bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200">
                    {riskInference.recommendedAction}
                  </strong>
                </span>
                <button
                  onClick={() => setIsConfidenceModalOpen(true)}
                  className="text-purple-700 hover:text-purple-900 hover:underline cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span>Inspect Recovery Confidence (99.98%)</span>
                </button>
              </div>
            </div>

            {/* Failure Causality Graph */}
            <FailureCausalityGraph
              currentRiskScore={riskInference.score}
              theme={contrastTheme}
            />

            {/* Digital Twin & Adaptive Replication Dual Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DigitalTwinCard theme={contrastTheme} />
              <AdaptiveReplicationVisualizer
                initialRiskScore={riskInference.score}
                theme={contrastTheme}
              />
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL TWIN */}
        {activeTab === "twin" && (
          <div className="space-y-6">
            <DigitalTwinCard theme={contrastTheme} />
            <FailureCausalityGraph
              currentRiskScore={riskInference.score}
              theme={contrastTheme}
            />
          </div>
        )}

        {/* TAB 3: ADAPTIVE REPLICATION & PLANNER */}
        {activeTab === "planner" && (
          <div className="space-y-6">
            <AdaptiveReplicationVisualizer
              initialRiskScore={riskInference.score}
              theme={contrastTheme}
            />
            <div
              className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 shadow-xl shadow-purple-900/5 backdrop-blur-xl`}
            >
              <h3 className="font-heading text-lg font-extrabold text-[#1E1B4B] mb-2">
                Autonomous Strategy Decision Matrix
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                ReviveX continuously transitions candidate sessions through 4 distinct state protection tiers to minimize unnecessary cloud network egress while guaranteeing instantaneous recovery during elevated risk conditions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 font-mono text-xs">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-emerald-800 text-sm">
                    NORMAL (&lt;35% Risk)
                  </span>
                  <p className="text-xs text-slate-700 font-bold">Strategy: CHECKPOINT</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Local-only IndexedDB writes every 2.0s. 0B cloud bandwidth used.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-sky-800 text-sm">
                    MEDIUM (35–64% Risk)
                  </span>
                  <p className="text-xs text-slate-700 font-bold">Strategy: FREQUENT DELTA</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Cadence escalated to 500ms. Compressed batch deltas streamed to edge cache.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-amber-800 text-sm">
                    HIGH (65–84% Risk)
                  </span>
                  <p className="text-xs text-slate-700 font-bold">Strategy: STREAM + REPLICA</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Continuous RFC 6902 JSON-patch streaming. Pre-fetches penultimate snapshot.
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-rose-800 text-sm">
                    CRITICAL (&gt;=85% Risk)
                  </span>
                  <p className="text-xs text-slate-700 font-bold">Strategy: SHADOW SESSION</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Spins up live cloud shadow pod replica. Immediate failover standby.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADVANCED CHAOS LAB (10+ SCENARIOS) */}
        {activeTab === "chaos" && (
          <div className="space-y-6">
            <div
              className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 shadow-xl shadow-purple-900/5 backdrop-blur-xl`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span className="font-mono text-xs font-extrabold text-purple-600 uppercase tracking-wider">
                      Resilience Benchmark Lab
                    </span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#1E1B4B] mt-1">
                    10+ Scenario Automated Chaos Test Runner
                  </h3>
                </div>

                <button
                  onClick={handleStartChaosTest}
                  disabled={isChaosRunning}
                  className={`rounded-xl px-5 py-3 font-heading font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50 ${themeStyles.primaryButton}`}
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>{isChaosRunning ? "Chaos Test In Progress..." : "Start Chaos Test"}</span>
                </button>
              </div>

              {/* Scenario Selector Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHAOS_SCENARIOS.map((s) => {
                  const isSelected = selectedChaosScenario.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedChaosScenario(s)}
                      disabled={isChaosRunning}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-400 bg-purple-50/80 text-[#1E1B4B] ring-2 ring-purple-300 shadow-md"
                          : "border-purple-100 bg-white/80 text-slate-700 hover:border-purple-200 hover:bg-purple-50/40 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-extrabold text-purple-700 uppercase">{s.category}</span>
                        <span
                          className={`font-extrabold px-2 py-0.5 rounded-full ${
                            s.severity === "CATASTROPHIC"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : s.severity === "HIGH"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {s.severity}
                        </span>
                      </div>
                      <div className="font-heading font-extrabold text-xs sm:text-sm text-[#1E1B4B] mt-2">
                        {s.name}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-medium">
                        {s.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* 8-Milestone Chronological Timeline */}
              <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 sm:p-5 shadow-sm">
                <span className="font-mono text-xs font-extrabold text-purple-700 uppercase tracking-wider block mb-3.5">
                  8-Milestone Self-Healing Recovery Timeline:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {chaosTimeline.map((step) => {
                    let border = "border-purple-100 bg-white text-slate-600 shadow-sm";
                    if (step.status === "completed") {
                      border = "border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm";
                    } else if (step.status === "running") {
                      border = "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400 animate-pulse shadow-md";
                    }

                    return (
                      <div
                        key={step.stepNumber}
                        className={`rounded-2xl border p-3.5 font-mono text-xs ${border}`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span>{step.timeLabel}</span>
                          {step.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="text-slate-400">Step 0{step.stepNumber}</span>
                          )}
                        </div>
                        <div className="font-extrabold text-xs sm:text-sm text-[#1E1B4B] mt-1.5">
                          {step.milestone}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 font-medium">
                          {step.details}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Chaos Terminal Log */}
              <div className="mt-4 rounded-2xl border border-purple-950/20 bg-[#120F24] p-4 font-mono text-xs max-h-48 overflow-y-auto shadow-inner text-purple-200">
                <span className="text-purple-300 block text-[10px] uppercase font-bold border-b border-purple-800/40 pb-1.5 mb-2.5">
                  Chaos Orchestrator Audit Log:
                </span>
                <div className="space-y-1.5">
                  {chaosLog.map((log, i) => (
                    <div key={i} className="text-emerald-300 text-[11px] flex items-start gap-2">
                      <span className="text-amber-400 shrink-0 font-bold">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TAMPER LEDGER */}
        {activeTab === "ledger" && (
          <div className="space-y-6">
            <TamperLedgerInspector theme={contrastTheme} />
          </div>
        )}
      </main>

      {/* Global Floating ReviveX AI Bot Widget */}
      <ReviveXBotWidget />

      {/* Recovery Confidence Modal */}
      <RecoveryConfidenceModal
        isOpen={isConfidenceModalOpen}
        onClose={() => setIsConfidenceModalOpen(false)}
        metrics={confidenceMetrics}
      />

      {/* Cross Device Recovery Modal */}
      <CrossDeviceRecoveryModal
        isOpen={isCrossDeviceModalOpen}
        onClose={() => setIsCrossDeviceModalOpen(false)}
      />
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
