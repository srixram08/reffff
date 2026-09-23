"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Play, ArrowRight, Activity, Cpu, Lock, Database } from "lucide-react";
import { GlowButton } from "../ui/GlowButton";
import { SectionLabel } from "../ui/SectionLabel";
import { CanvasContainer } from "../3d/CanvasContainer";
import { DigitalTwinCoreContent } from "../3d/DigitalTwinCore";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-16 overflow-hidden cyber-grid flex flex-col justify-center">
      {/* Glow Background Gradient Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#00FF7F]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-[#00C853]/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <SectionLabel text="Autonomous Resilient Architecture" icon={<Cpu className="h-3.5 w-3.5" />} />

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#E8FCEF] leading-[1.1]">
              Examinations that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF7F] via-[#00C853] to-[#E8FCEF] green-glow-text">
                never go down.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-[#7FA98F] leading-relaxed">
              Predictive state checkpointing, real-time digital twin shadow synchronization, and explainable AI recovery for high-stakes online examinations. Zero silent data loss under catastrophic failures.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/demo">
                <GlowButton
                  variant="primary"
                  size="lg"
                  icon={<Play className="h-4 w-4 fill-current" />}
                  id="hero-view-demo-btn"
                >
                  View Live Demo
                </GlowButton>
              </Link>

              <a href="#how-it-works">
                <GlowButton
                  variant="secondary"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  See How Recovery Works
                </GlowButton>
              </a>
            </div>

            {/* Micro Badge Stream */}
            <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-[#0A3D24]/60 text-xs font-mono text-[#7FA98F]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00FF7F]" />
                <span>SHA-256 HASH CHAIN VERIFIED</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-[#00FF7F]" />
                <span>100Hz STATE SYNC STREAM</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#00FF7F]" />
                <span>FAULT-TOLERANT SPEC</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column 3D Digital Twin Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl border border-[#00FF7F]/30 bg-[#0B120E]/90 p-2 shadow-[0_0_40px_rgba(0,255,127,0.15)] backdrop-blur-xl">
              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-[#0A3D24] px-4 py-2.5 font-mono text-xs text-[#00FF7F]">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-[#00FF7F] animate-pulse" />
                  <span>DIGITAL TWIN CORE v2.4</span>
                </div>
                <span className="rounded bg-[#0A3D24] px-2 py-0.5 text-[10px] text-[#00FF7F]">
                  100Hz STREAMING
                </span>
              </div>

              {/* 3D Scene */}
              <CanvasContainer
                className="h-[360px] sm:h-[420px] w-full"
                camera={{ position: [0, 0, 5], fov: 55 }}
              >
                <DigitalTwinCoreContent />
              </CanvasContainer>

              {/* Floating Node Badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-[#0A3D24] bg-[#05070A]/90 p-3 font-mono text-xs text-[#E8FCEF] backdrop-blur-md flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#7FA98F] uppercase">Shadow State Sync</div>
                  <div className="text-[#00FF7F] font-bold">1,482,091 Telemetry Nodes Synced</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-[#00FF7F] pulse-dot" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Telemetry Ticker Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 rounded-xl border border-[#0A3D24] bg-[#0B120E]/90 p-4 backdrop-blur-md shadow-2xl"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-center division-line">
            <div className="border-r border-[#0A3D24] last:border-r-0 px-2">
              <div className="text-[11px] uppercase text-[#7FA98F]">Edge Latency</div>
              <div className="text-xl sm:text-2xl font-bold text-[#00FF7F] tabular-nums">14 ms</div>
            </div>
            <div className="border-r border-[#0A3D24] last:border-r-0 px-2">
              <div className="text-[11px] uppercase text-[#7FA98F]">Platform Uptime</div>
              <div className="text-xl sm:text-2xl font-bold text-[#00FF7F] tabular-nums">99.999 %</div>
            </div>
            <div className="border-r border-[#0A3D24] last:border-r-0 px-2">
              <div className="text-[11px] uppercase text-[#7FA98F]">Protected Sessions</div>
              <div className="text-xl sm:text-2xl font-bold text-[#00FF7F] tabular-nums">1,482,091</div>
            </div>
            <div className="px-2">
              <div className="text-[11px] uppercase text-[#7FA98F]">Silent Data Loss</div>
              <div className="text-xl sm:text-2xl font-bold text-[#00FF7F] tabular-nums">0 B</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
