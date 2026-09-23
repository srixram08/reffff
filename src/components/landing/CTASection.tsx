"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Shield } from "lucide-react";
import { GlowButton } from "../ui/GlowButton";
import { GlassCard } from "../ui/GlassCard";

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#05070A] cyber-grid">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="relative overflow-hidden border-[#00FF7F]/50 bg-gradient-to-br from-[#0B120E] to-[#101A14] p-10 text-center shadow-[0_0_50px_rgba(0,255,127,0.2)]">
          {/* Subtle Glow Overlay */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#00FF7F]/15 blur-3xl" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF7F]/40 bg-[#0A3D24] px-4 py-1.5 font-mono text-xs text-[#00FF7F] uppercase tracking-widest">
              <Shield className="h-3.5 w-3.5" />
              <span>Production-Grade Architecture Showcase</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#E8FCEF] leading-tight">
              Ready to Experience Zero-Downtime Examinations?
            </h2>

            <p className="text-sm sm:text-base text-[#7FA98F] leading-relaxed">
              Launch our simulated proctor & admin console to simulate network drops, view real-time candidate telemetry, and inspect explainable AI rollbacks.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/demo">
                <GlowButton
                  variant="primary"
                  size="lg"
                  icon={<Terminal className="h-5 w-5" />}
                  id="cta-launch-demo-btn"
                >
                  Launch Interactive Demo Console
                </GlowButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
