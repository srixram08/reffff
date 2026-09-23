"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, BookmarkCheck, RefreshCw, Zap, ArrowRight } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionLabel } from "../ui/SectionLabel";

const STEPS = [
  {
    step: "01",
    title: "100Hz Telemetry Monitoring",
    subtitle: "Continuous Sensor Stream",
    icon: <Activity className="h-6 w-6 text-[#00FF7F]" />,
    description: "Every keystroke, navigation event, network round-trip latency, CPU load, and battery drain rate is streamed at 100Hz into a background telemetry queue.",
    accent: "#00FF7F",
  },
  {
    step: "02",
    title: "ML Risk Prediction",
    subtitle: "Anomaly Scoring Model",
    icon: <BrainCircuit className="h-6 w-6 text-[#FFB020]" />,
    description: "A lightweight on-device ML model evaluates risk scores. When network jitter or memory pressure spikes past 75%, an impending crash flag is raised.",
    accent: "#FFB020",
  },
  {
    step: "03",
    title: "Predictive Checkpointing",
    subtitle: "Pre-Crash Micro-Snapshot",
    icon: <BookmarkCheck className="h-6 w-6 text-[#00FF7F]" />,
    description: "Before the failure materializes, AROEP automatically freezes and commits a verified micro-checkpoint of the candidate's exact answer state.",
    accent: "#00FF7F",
  },
  {
    step: "04",
    title: "Digital Twin Shadow Sync",
    subtitle: "Real-Time State Mirror",
    icon: <RefreshCw className="h-6 w-6 text-[#00C853]" />,
    description: "The micro-checkpoint is mirrored synchronously across edge cache nodes and the cloud Digital Twin Store via persistent WebSocket buffers.",
    accent: "#00C853",
  },
  {
    step: "05",
    title: "Instant Explainable Rollback",
    subtitle: "< 3s Restoration",
    icon: <Zap className="h-6 w-6 text-[#00FF7F]" />,
    description: "Upon crash or connection loss, candidate session instantly restores to the pre-crash checkpoint with complete answer integrity and an automated audit report.",
    accent: "#00FF7F",
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative py-24 bg-[#05070A] cyber-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionLabel text="Predictive Execution Pipeline" icon={<BrainCircuit className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#E8FCEF]">
            How AROEP Prevents Exam Failures Before They Happen
          </h2>
          <p className="text-sm sm:text-base text-[#7FA98F]">
            Instead of reacting after a candidate disconnects, AROEP continuously monitors telemetry, predicts failure vectors, and creates verified digital twin snapshots.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-xs uppercase tracking-wider transition-all duration-200 shrink-0 ${
                activeStep === idx
                  ? "border-[#00FF7F] bg-[#0B120E] text-[#00FF7F] shadow-[0_0_15px_rgba(0,255,127,0.2)]"
                  : "border-[#0A3D24] bg-[#05070A] text-[#7FA98F] hover:border-[#00FF7F]/40"
              }`}
            >
              <span className="font-bold text-sm text-[#00FF7F]">{s.step}</span>
              <span>{s.title.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Step Highlight Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="border-[#00FF7F]/40 bg-[#0B120E] p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded bg-[#0A3D24] px-3 py-1 font-mono text-xs text-[#00FF7F]">
                  <span>STEP {STEPS[activeStep].step} OF 05</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#E8FCEF]">
                  {STEPS[activeStep].title}
                </h3>
                <p className="text-sm text-[#00FF7F] font-mono uppercase tracking-wider">
                  {STEPS[activeStep].subtitle}
                </p>
                <p className="text-base text-[#7FA98F] leading-relaxed">
                  {STEPS[activeStep].description}
                </p>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 4))}
                    className="font-mono text-xs uppercase tracking-widest text-[#7FA98F] hover:text-[#00FF7F]"
                  >
                    ← Previous Step
                  </button>
                  <span className="text-[#0A3D24]">|</span>
                  <button
                    onClick={() => setActiveStep((prev) => (prev < 4 ? prev + 1 : 0))}
                    className="font-mono text-xs uppercase tracking-widest text-[#00FF7F] hover:underline flex items-center gap-1"
                  >
                    Next Step <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Graphic Icon Box */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl border border-[#00FF7F]/30 bg-[#101A14] shadow-[0_0_30px_rgba(0,255,127,0.15)]">
                  <div className="absolute inset-0 rounded-2xl border border-[#00FF7F]/20 animate-pulse" />
                  <div className="p-6 rounded-full bg-[#0B120E] border border-[#00FF7F]/40">
                    {STEPS[activeStep].icon}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
