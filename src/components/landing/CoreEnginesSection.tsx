"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  RefreshCw,
  Zap,
  FileCheck2,
  Eye,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionLabel } from "../ui/SectionLabel";

const ENGINES = [
  {
    icon: <BrainCircuit className="h-7 w-7 text-[#00FF7F]" />,
    title: "Predictive Failure Detection",
    tag: "ML RISK SCORING",
    description:
      "Evaluates network packet loss, memory pressure, and browser event queue latency in real time to anticipate crashes before candidate state is compromised.",
  },
  {
    icon: <RefreshCw className="h-7 w-7 text-[#00FF7F]" />,
    title: "Digital Twin Synchronization",
    tag: "100Hz STATE STREAM",
    description:
      "Maintains a mirrored shadow copy of every candidate's exam session across localized edge caches and cloud stores using lightweight differential state sync.",
  },
  {
    icon: <Zap className="h-7 w-7 text-[#00FF7F]" />,
    title: "Intelligent Rollback Engine",
    tag: "< 3s RESTORATION",
    description:
      "Instantly rewinds candidate session state to the exact verified pre-failure micro-checkpoint without forcing full page reloads or invalidating answers.",
  },
  {
    icon: <FileCheck2 className="h-7 w-7 text-[#00FF7F]" />,
    title: "Explainable Recovery Engine",
    tag: "AUDIT TRANSPARENCY",
    description:
      "Generates clear administrative diagnostic cards highlighting failure root cause, confidence score %, checkpoint timestamp, and data consistency verification.",
  },
  {
    icon: <Eye className="h-7 w-7 text-[#FFB020]" />,
    title: "Behavioral Risk Detection",
    tag: "ANOMALY MONITOR",
    description:
      "Flags anomalous navigation events, sudden device switches, focus losses, and network reconnect bursts to distinguish genuine crashes from proctoring evasion.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-[#00FF7F]" />,
    title: "Tamper-Evident Audit Chain",
    tag: "SHA-256 HASH CHAIN",
    description:
      "Cryptographically signs every state delta into an append-only block ledger, preventing post-hoc answer manipulation or unauthorized admin state edits.",
  },
];

export const CoreEnginesSection: React.FC = () => {
  return (
    <section id="engines" className="relative py-24 bg-[#05070A] cyber-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionLabel text="Core Platform Engines" icon={<Cpu className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#E8FCEF]">
            Powered by Deep-Tech Resilience Architecture
          </h2>
          <p className="text-sm sm:text-base text-[#7FA98F]">
            Six autonomous micro-engines work synchronously to provide zero-downtime exam delivery with mathematical cryptographic guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENGINES.map((engine, idx) => (
            <motion.div
              key={engine.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard enableTilt glowOnHover className="h-full group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg border border-[#0A3D24] bg-[#101A14] group-hover:border-[#00FF7F]/50 group-hover:shadow-[0_0_15px_rgba(0,255,127,0.2)] transition-all">
                    {engine.icon}
                  </div>
                  <span className="font-mono text-[10px] text-[#00FF7F] bg-[#0A3D24] px-2 py-0.5 rounded tracking-widest border border-[#00FF7F]/30">
                    {engine.tag}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#E8FCEF] mb-2 group-hover:text-[#00FF7F] transition-colors">
                  {engine.title}
                </h3>
                <p className="text-xs text-[#7FA98F] leading-relaxed">
                  {engine.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
