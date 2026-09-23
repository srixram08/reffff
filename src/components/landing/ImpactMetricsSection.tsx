"use client";

import React from "react";
import { MetricCounter } from "../ui/MetricCounter";
import { GlassCard } from "../ui/GlassCard";
import { SectionLabel } from "../ui/SectionLabel";
import { ShieldCheck } from "lucide-react";

export const ImpactMetricsSection: React.FC = () => {
  return (
    <section id="impact" className="relative py-20 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionLabel text="Measured Performance Impact" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl font-bold text-[#E8FCEF] mt-2">
            Engineered for High-Stakes Reliability
          </h2>
        </div>

        <GlassCard className="border-[#00FF7F]/30 bg-[#0B120E] p-8 shadow-[0_0_30px_rgba(0,255,127,0.1)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#0A3D24]">
            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left">
              <MetricCounter
                value={2.8}
                decimals={1}
                prefix="< "
                suffix="s"
                label="Average Recovery Time"
                description="Sub-3-second state restoration"
              />
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left">
              <MetricCounter
                value={99.999}
                decimals={3}
                suffix="%"
                label="Answer Retention"
                description="Zero candidate keystroke loss"
              />
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left">
              <MetricCounter
                value={0}
                decimals={0}
                suffix=" Bytes"
                label="Silent Data Loss"
                description="Verified across 1.4M sessions"
              />
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left">
              <MetricCounter
                value={100}
                decimals={0}
                suffix=" Hz"
                label="Telemetry Frequency"
                description="Continuous shadow twin streaming"
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
