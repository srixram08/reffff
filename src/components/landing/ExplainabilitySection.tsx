"use client";

import React from "react";
import { FileCheck2, ShieldCheck, CheckCircle2, Cpu, Clock, Database, AlertCircle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionLabel } from "../ui/SectionLabel";
import { HashBadge } from "../ui/HashBadge";

export const ExplainabilitySection: React.FC = () => {
  return (
    <section id="explainability" className="relative py-24 bg-[#05070A] cyber-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionLabel text="Transparent AI Governance" icon={<FileCheck2 className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#E8FCEF]">
            Explainable Recovery & Audit Transparency
          </h2>
          <p className="text-sm sm:text-base text-[#7FA98F]">
            No black-box decisions. When a candidate session recovers, AROEP automatically generates a verifiable administrative report detailing exact failure root causes, AI confidence, and cryptographic hash verification.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <GlassCard className="border-[#00FF7F]/40 bg-[#0B120E] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,127,0.15)]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#0A3D24] pb-6 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF7F]/10 border border-[#00FF7F]/40">
                  <ShieldCheck className="h-7 w-7 text-[#00FF7F]" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#E8FCEF]">
                    EXPLAINABLE RECOVERY REPORT
                  </h3>
                  <p className="font-mono text-xs text-[#7FA98F]">
                    Candidate ID: <span className="text-[#E8FCEF]">STU-84920</span> | Exam: Advanced Systems Engineering
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="rounded bg-[#0A3D24] px-3 py-1 font-mono text-xs text-[#00FF7F] font-bold border border-[#00FF7F]/30">
                  RECOVERY SUCCESSFUL
                </span>
                <span className="font-mono text-[10px] text-[#7FA98F] mt-1">
                  TIMESTAMP: 2026-07-28 20:44:12 UTC
                </span>
              </div>
            </div>

            {/* Metrics Grid inside Report */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono">
                <div className="text-[10px] text-[#7FA98F] uppercase flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-[#FFB020]" /> Failure Vector
                </div>
                <div className="text-xs font-bold text-[#E8FCEF] mt-1 truncate" title="Socket Dropped & Memory Spike">
                  Socket Drop + Spike
                </div>
              </div>

              <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono">
                <div className="text-[10px] text-[#7FA98F] uppercase flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-[#00FF7F]" /> AI Confidence
                </div>
                <div className="text-sm font-bold text-[#00FF7F] mt-1 green-glow-text">
                  99.4 % (High)
                </div>
              </div>

              <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono">
                <div className="text-[10px] text-[#7FA98F] uppercase flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#00FF7F]" /> Restored Duration
                </div>
                <div className="text-sm font-bold text-[#00FF7F] mt-1">
                  2.4 Seconds
                </div>
              </div>

              <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono">
                <div className="text-[10px] text-[#7FA98F] uppercase flex items-center gap-1">
                  <Database className="h-3 w-3 text-[#00FF7F]" /> Data Consistency
                </div>
                <div className="text-xs font-bold text-[#00FF7F] mt-1">
                  100% Match (0 B Lost)
                </div>
              </div>
            </div>

            {/* Diagnostic Reasoning Box */}
            <div className="rounded-lg border border-[#0A3D24] bg-[#101A14] p-4 font-mono text-xs space-y-2 mb-6">
              <div className="text-[#00FF7F] font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> AI Diagnostic Reasoning & Decision Tree
              </div>
              <p className="text-[#7FA98F] leading-relaxed">
                Network telemetry detected severe packet drop (84% loss) at 20:44:09. The ML Failure Prediction Engine identified an impending browser session disconnect 350ms prior and committed Checkpoint <code className="text-[#E8FCEF]">CHK-1042-89B</code>. Session state was seamlessly restored upon reconnect without invalidating candidate responses.
              </p>
            </div>

            {/* Hash Badge Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0A3D24] pt-4">
              <div className="text-xs font-mono text-[#7FA98F]">
                Cryptographic Verification Signature:
              </div>
              <HashBadge
                hash="0xa8f492c10b7e49d29f8c12a3456789abcdef"
                blockNumber={140289}
                verified
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
