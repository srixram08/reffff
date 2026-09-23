"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Mail, Globe, ArrowRight, CheckCircle2, Server, Cpu, Check } from "lucide-react";
import { DottedLogo } from "./DottedLogo";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#F3EFFF] to-[#FAF8FF] text-[#1E1B4B] border-t border-purple-100 font-sans">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                🤖
              </div>
              <div>
                <span className="font-heading text-2xl font-bold tracking-tight text-[#1E1B4B] block">
                  ReviveX <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-purple-600 font-bold block">
                  Autonomous Exam Guardian
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Next-generation autonomous exam resilience assistant powered by 100Hz local telemetry buffering, real-time emotion-aware guardian bot, and sub-2.4s state recovery.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-purple-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/70 border border-purple-200">
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                <span className="font-bold">GLOBAL EDGE MESH ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Col 2: Platform Workspaces */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-purple-700">
              Workspaces
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/student" className="hover:text-purple-600 transition-colors">
                  Student Exam Pod
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-purple-600 transition-colors">
                  Teacher Exam Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-purple-600 transition-colors">
                  Proctor Console
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-purple-600 transition-colors">
                  Edge Failover Hub
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-purple-600 transition-colors">
                  3D Architecture Spec
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-purple-600 transition-colors">
                  Chaos Benchmark Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-purple-700">
              Specifications
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <span className="hover:text-purple-600 cursor-pointer">100Hz Local Buffering</span>
              </li>
              <li>
                <span className="hover:text-purple-600 cursor-pointer">SHA-256 Merkle Ledger</span>
              </li>
              <li>
                <span className="hover:text-purple-600 cursor-pointer">Dynamic Bot Emotions</span>
              </li>
              <li>
                <span className="hover:text-purple-600 cursor-pointer">Sub-2.4s State Rollback</span>
              </li>
              <li>
                <span className="hover:text-purple-600 cursor-pointer">Kyber-1024 Post-Quantum</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Dispatch Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-purple-700">
              Stay Connected
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get monthly updates on edge resilience, AI proctoring guardians, and zero-loss integrity protocols.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-purple-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-inner"
                />
                <button
                  type="submit"
                  className="bot-pill-btn !py-2.5 !px-4 !text-xs shrink-0 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-purple-700 font-bold flex items-center gap-1 mt-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Metrics Strip */}
      <div className="border-t border-purple-100 bg-[#EFEAFF]/60 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} ReviveX AI Resilience Platform. Capella CSL Architecture. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-purple-800 font-semibold">
            <span>SLA: 99.999%</span>
            <span>•</span>
            <span>ZERO DATA LOSS</span>
            <span>•</span>
            <span>AI GUARDIAN ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
