"use client";

import React, { useState } from "react";
import { Zap, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlowButton } from "../ui/GlowButton";
import { SectionLabel } from "../ui/SectionLabel";
import { CanvasContainer } from "../3d/CanvasContainer";
import { RollbackTimeline3DContent } from "../3d/RollbackTimeline3D";

export const TimelineSection: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "10:42:01.002 - Telemetry stream normal at 100Hz",
    "10:42:02.150 - Checkpoint #1042 verified (SHA-256: 0x9f8b...)",
  ]);

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    setLogs((prev) => [
      "10:42:03.010 - [CRITICAL] Sudden network packet drop detected!",
      "10:42:03.045 - ML Model triggers emergency checkpoint rollback",
      ...prev,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        "10:42:03.620 - State restored to Checkpoint #1042 in 2.8s",
        "10:42:03.650 - Audit Hash Chain verified (Zero Data Loss)",
        ...prev,
      ]);
      setIsSimulating(false);
    }, 2800);
  };

  return (
    <section id="timeline" className="relative py-24 bg-[#05070A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <SectionLabel text="Predictive Checkpoint Engine" icon={<Zap className="h-3.5 w-3.5" />} />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#E8FCEF]">
            Instant Rollback in Action
          </h2>
          <p className="text-sm sm:text-base text-[#7FA98F]">
            Test the predictive rollback mechanism. Watch how an abrupt crash event glitches the timeline, triggers displacement shaders, and instantly snaps back to the verified green checkpoint.
          </p>
        </div>

        <GlassCard className="border-[#00FF7F]/30 bg-[#0B120E] p-6 shadow-[0_0_40px_rgba(0,255,127,0.1)]">
          <div className="flex flex-wrap items-center justify-between border-b border-[#0A3D24] pb-4 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#00FF7F] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#00FF7F]">
                3D TIMELINE VISUALIZER (INTERACTIVE)
              </span>
            </div>

            <GlowButton
              variant={isSimulating ? "danger" : "primary"}
              size="md"
              onClick={handleSimulate}
              disabled={isSimulating}
              icon={isSimulating ? <AlertTriangle className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
            >
              {isSimulating ? "SIMULATING INTERRUPTION..." : "TRIGGER INTERRUPTION GLITCH"}
            </GlowButton>
          </div>

          {/* 3D Timeline Canvas */}
          <CanvasContainer
            className="h-[280px] sm:h-[340px] w-full"
            camera={{ position: [0, 0, 6], fov: 50 }}
          >
            <RollbackTimeline3DContent isSimulatingFailure={isSimulating} />
          </CanvasContainer>

          {/* Live Telemetry Action Log */}
          <div className="mt-6 rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono text-xs text-[#7FA98F]">
            <div className="flex items-center justify-between border-b border-[#0A3D24] pb-2 mb-3 text-[#E8FCEF]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00FF7F]" />
                <span>STATE RECOVERY EVENT STREAM</span>
              </div>
              <span className="text-[10px] text-[#00FF7F]">REAL-TIME TELEMETRY</span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    log.includes("CRITICAL")
                      ? "text-[#FF4D4D] font-bold"
                      : log.includes("restored")
                      ? "text-[#00FF7F] font-bold"
                      : "text-[#7FA98F]"
                  }`}
                >
                  <span className="text-[#0A3D24]">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
