"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, Layers, Wifi, Database, HardDrive } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionLabel } from "../ui/SectionLabel";
import { CanvasContainer } from "../3d/CanvasContainer";
import { ArchitectureConstellationContent } from "../3d/ArchitectureConstellation";

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="relative py-24 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionLabel text="Distributed Topology" icon={<Network className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#E8FCEF]">
            Resilient Node Graph & Graceful Degradation
          </h2>
          <p className="text-sm sm:text-base text-[#7FA98F]">
            AROEP operates a multi-tiered distributed constellation. When cloud connectivity drops, the system gracefully steps down through localized edge caches and on-device isolated storage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left Column: 3D Constellation Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <GlassCard className="border-[#00FF7F]/30 bg-[#0B120E] p-4 shadow-[0_0_35px_rgba(0,255,127,0.1)]">
              <div className="flex items-center justify-between border-b border-[#0A3D24] pb-3 mb-4 px-2 font-mono text-xs text-[#00FF7F]">
                <span>3D NODE CONSTELLATION GRAPH</span>
                <span className="text-[10px] text-[#7FA98F]">HOVER NODE TO INSPECT</span>
              </div>

              <CanvasContainer
                className="h-[360px] sm:h-[420px] w-full"
                camera={{ position: [0, 0, 5.5], fov: 50 }}
              >
                <ArchitectureConstellationContent />
              </CanvasContainer>
            </GlassCard>
          </motion.div>

          {/* Right Column: Graceful Degradation Ladder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="border border-[#0A3D24] bg-[#0B120E] p-4 rounded-xl">
              <h3 className="font-heading text-lg font-bold text-[#E8FCEF] mb-1 flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#00FF7F]" />
                <span>Graceful Degradation Ladder</span>
              </h3>
              <p className="text-xs text-[#7FA98F]">
                3-tier failover guarantees candidate state is preserved at every level of connectivity.
              </p>
            </div>

            {/* Tier 1 */}
            <GlassCard className="border-[#00FF7F]/50 bg-[#101A14]">
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className="text-[#00FF7F] font-bold flex items-center gap-1.5">
                  <Wifi className="h-4 w-4" /> TIER 1: CLOUD SYNC
                </span>
                <span className="text-[#00FF7F] bg-[#0A3D24] px-2 py-0.5 rounded text-[10px]">
                  PRIMARY (100Hz)
                </span>
              </div>
              <p className="text-xs text-[#7FA98F]">
                Real-time WebSocket streaming to Cloud Digital Twin Store with multi-region replication.
              </p>
            </GlassCard>

            {/* Tier 2 */}
            <GlassCard className="border-[#FFB020]/40 bg-[#0B120E]">
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className="text-[#FFB020] font-bold flex items-center gap-1.5">
                  <Database className="h-4 w-4" /> TIER 2: EDGE CACHE
                </span>
                <span className="text-[#FFB020] bg-[#FFB020]/10 px-2 py-0.5 rounded text-[10px]">
                  LATENCY &gt; 200ms
                </span>
              </div>
              <p className="text-xs text-[#7FA98F]">
                Localized regional edge node buffers state micro-checkpoints during internet routing degradation.
              </p>
            </GlassCard>

            {/* Tier 3 */}
            <GlassCard className="border-[#0A3D24] bg-[#05070A]">
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className="text-[#7FA98F] font-bold flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4" /> TIER 3: OFFLINE RECOVERY
                </span>
                <span className="text-[#7FA98F] bg-[#0A3D24] px-2 py-0.5 rounded text-[10px]">
                  SEVERED LINK
                </span>
              </div>
              <p className="text-xs text-[#7FA98F]">
                Encrypted on-device IndexedDB container continues logging candidate answers offline until connection restores.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
