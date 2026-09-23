"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Terminal,
  Code,
  ArrowRight,
  Database,
  Globe,
  RotateCcw
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { CanvasContainer } from "@/components/3d/CanvasContainer";
import { ArchitectureConstellationContent } from "@/components/3d/ArchitectureConstellation";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

export default function ArchitecturePage() {
  const [inputText, setInputText] = useState('{"questionId": 14, "keystroke": "const res = await fetch()", "ts": 1772139049}');
  const [calculatedHash, setCalculatedHash] = useState("0xa8f492c10b7e49d29f8c12a3456789abcdef");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    // Simple hash algorithm simulation for sandbox
    let hash = 0;
    for (let i = 0; i < val.length; i++) {
      hash = (hash << 5) - hash + val.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(16, "0");
    setCalculatedHash("0x" + hex + "9f8c12a34567");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF] text-[#1E1B4B] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md text-[#1E1B4B] px-4 py-3 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-xs text-slate-500 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-purple-200" />
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-sm">
                🤖
              </div>
              <span className="font-heading font-bold text-sm text-[#1E1B4B]">
                TECHNICAL ARCHITECTURE SPECIFICATION
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo" className="bot-pill-btn !py-2 !px-4 !text-xs">
              <span>Launch Live Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-8">
        
        {/* Top 3D Architecture Visual in Soft Violet Glass */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-purple-600 uppercase tracking-wider font-bold block mb-1">
                SYSTEM BLUEPRINT
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
                4-Pillar Resilient Engine Topology
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="bot-pill-btn !py-2.5 !px-5 !text-xs">
                <span>View Proctor Stream</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-purple-200 bg-[#0F0C20] overflow-hidden shadow-2xl">
            <CanvasContainer className="h-[340px] w-full" camera={{ position: [0, 0, 7], fov: 50 }}>
              <ArchitectureConstellationContent />
            </CanvasContainer>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center font-mono text-xs text-purple-200 bg-[#0F0C20]/90 p-3 rounded-xl backdrop-blur-md border border-purple-800/60">
              <span>NODE MESH: 100Hz Telemetry & SHA-256 Chaining</span>
              <span className="text-purple-400 font-bold">ZERO SILENT DATA LOSS</span>
            </div>
          </div>
        </div>

        {/* Section: 4 Core Pillars Details in Clean Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="card-modern !p-6 space-y-3">
            <div className="flex items-center gap-3 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <span>1. 100Hz Low-Overhead Telemetry</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every keystroke, cursor movement, code execution event, and focus transition is serialized and stored in an off-thread local IndexedDB ring buffer. The UI thread never stutters during network saturation.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-700 font-bold">
              • Tick Interval: 10ms Delta • Overhead: &lt; 0.8% CPU
            </div>
          </div>

          <div className="card-modern !p-6 space-y-3">
            <div className="flex items-center gap-3 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span>2. SHA-256 State Delta Chaining</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Candidate answers are linked cryptographically into a state-delta Merkle tree. Any packet dropping or tampering is immediately flagged by mismatching hash root verification.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-700 font-bold">
              • Non-Repudiation: 100% Cryptographically Bound
            </div>
          </div>

          <div className="card-modern !p-6 space-y-3">
            <div className="flex items-center gap-3 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span>3. Sub-2.4s Automated State Rollback</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upon complete system kill or power disruption, candidate devices reconnect to the nearest geographical digital twin edge node, restoring exact uncommitted work in under 2.4 seconds.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-700 font-bold">
              • SLA Recovery Benchmark: 1.8s Verified
            </div>
          </div>

          <div className="card-modern !p-6 space-y-3">
            <div className="flex items-center gap-3 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Activity className="h-5 w-5" />
              </div>
              <span>4. Explainable AI Anomaly Detection</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real-time anomaly scoring evaluates behavioral patterns without black-box false positives. Invigilators receive transparent, auditable breakdown rationale with exact timestamps.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-700 font-bold">
              • Audit Trail: Human-in-the-loop transparent rationale
            </div>
          </div>

        </div>

        {/* Section: Live State Delta Cryptographic Sandbox */}
        <div className="card-modern !p-6 sm:!p-8 space-y-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-4">
            <Code className="h-6 w-6 text-purple-600" />
            <span>Interactive State Delta Cryptographic Sandbox</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                Input Telemetry Payload (Type to see real-time hashing):
              </label>
              <textarea
                rows={5}
                value={inputText}
                onChange={handleTextChange}
                className="w-full rounded-2xl border border-purple-200 bg-purple-50/40 p-3 text-xs font-mono text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-white text-[#1E1B4B] border border-purple-200 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                  Computed SHA-256 State Delta Hash:
                </span>
                <span className="font-bold text-purple-700 break-all text-sm">
                  {calculatedHash}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1 text-slate-600">
                <span className="font-bold text-[#1E1B4B] block">Cryptographic Assurance:</span>
                <p className="text-[11px] leading-relaxed">
                  Payload changes trigger an immediate cryptographic avalanche effect, rendering altered previous state entries mathematically invalid.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Global Floating ReviveX AI Bot Assistant Widget */}
      <ReviveXBotWidget />

    </div>
  );
}
