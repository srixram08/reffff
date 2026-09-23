"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionLabel } from "../ui/SectionLabel";

export const ProblemComparisonSection: React.FC = () => {
  return (
    <section id="problem" className="relative py-24 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionLabel text="The Architectural Gap" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#E8FCEF]">
            Why Traditional Auto-Save Fails in High-Stakes Exams
          </h2>
          <p className="text-sm sm:text-base text-[#7FA98F]">
            Standard exam software relies on legacy periodic HTTP polling. When network drops or browser tabs crash between cycles, answers are silently lost. AROEP introduces predictive digital twin state mirroring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traditional Legacy Model */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="h-full border-[#FF4D4D]/30 bg-[#101A14]/60 hover:border-[#FF4D4D]/50">
              <div className="flex items-center justify-between border-b border-[#FF4D4D]/20 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/30">
                    <XCircle className="h-6 w-6 text-[#FF4D4D]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#FF4D4D]">
                      Traditional Auto-Save
                    </h3>
                    <p className="font-mono text-xs text-[#7FA98F]">Legacy Batch Polling</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#FF4D4D] bg-[#FF4D4D]/10 px-2.5 py-1 rounded border border-[#FF4D4D]/30">
                  HIGH RISK
                </span>
              </div>

              <ul className="space-y-4 text-sm text-[#7FA98F]">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#FF4D4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">Periodic 30-60s Save Interval</strong>
                    Any browser crash or power outage within the interval loses all work produced during that window.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#FF4D4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">Silent Data Loss & Corruption</strong>
                    Network disconnects fail silently in the background while students continue typing into non-persisted buffers.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#FF4D4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">Blind Page Reloads</strong>
                    When connection restores, the candidate is forced to refresh, wiping uncommitted state and triggering proctor flags.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#FF4D4D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">Zero Root Cause Explainability</strong>
                    Admins have no insight into why candidate state broke or which precise timestamp was last valid.
                  </div>
                </li>
              </ul>
            </GlassCard>
          </motion.div>

          {/* AROEP Predictive Digital Twin Model */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="h-full border-[#00FF7F]/50 bg-[#0B120E] shadow-[0_0_30px_rgba(0,255,127,0.1)] hover:border-[#00FF7F]">
              <div className="flex items-center justify-between border-b border-[#00FF7F]/30 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00FF7F]/10 border border-[#00FF7F]/40">
                    <CheckCircle2 className="h-6 w-6 text-[#00FF7F]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#00FF7F] green-glow-text">
                      AROEP Digital Twin Model
                    </h3>
                    <p className="font-mono text-xs text-[#7FA98F]">Predictive ML + Rollback</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#00FF7F] bg-[#0A3D24] px-2.5 py-1 rounded border border-[#00FF7F]/40">
                  RESILIENT
                </span>
              </div>

              <ul className="space-y-4 text-sm text-[#7FA98F]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF7F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">100Hz Continuous Telemetry Stream</strong>
                    Keystrokes, cursor positions, network metrics, and state deltas are continuously streamed to a shadow digital twin.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF7F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">ML Predictive Checkpointing</strong>
                    AI risk models detect impending network instability or CPU spikes, saving a micro-checkpoint <em>before</em> the crash occurs.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF7F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">Instant &lt; 3s Explainable Rollback</strong>
                    Upon crash recovery, state instantly rolls back to the verified checkpoint with full candidate answer preservation.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00FF7F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E8FCEF] block">Cryptographic Hash Chain Ledger</strong>
                    Every state delta is cryptographically signed with SHA-256 hash chaining for audit integrity.
                  </div>
                </li>
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
