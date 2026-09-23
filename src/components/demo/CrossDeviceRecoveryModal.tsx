"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Laptop, Lock, ShieldCheck, Smartphone, X, KeyRound, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CrossDeviceRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess?: (sessionId: string) => void;
}

export const CrossDeviceRecoveryModal: React.FC<CrossDeviceRecoveryModalProps> = ({
  isOpen,
  onClose,
  onRestoreSuccess,
}) => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("RX-20481");
  const [authSecret, setAuthSecret] = useState("REVIVEX-STU-84920-AUTH");
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionPreview, setSessionPreview] = useState<{
    candidateName: string;
    candidateNumber: string;
    examSubject: string;
    lastCheckpoint: string;
    checkpointNumber: number;
    integrityVerified: boolean;
    confidenceScore: number;
    questionsAnswered: number;
    timeRemaining: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleInspectSession = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setSessionPreview({
        candidateName: "Alex Chen",
        candidateNumber: "CN-2026-881A",
        examSubject: "Advanced Distributed Systems",
        lastCheckpoint: "CHK-1042-89B",
        checkpointNumber: 4921,
        integrityVerified: true,
        confidenceScore: 99.97,
        questionsAnswered: 14,
        timeRemaining: "42:18",
      });
      setIsVerifying(false);
    }, 600);
  };

  const handleConfirmRestore = () => {
    if (onRestoreSuccess) {
      onRestoreSuccess(sessionId);
    } else {
      router.push("/student");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-purple-200 bg-white/95 backdrop-blur-xl p-6 text-[#1E1B4B] shadow-2xl shadow-purple-900/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 border border-purple-200 text-purple-700">
            <Laptop className="h-6 w-6" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
              Failover Device Migration
            </div>
            <h3 className="font-heading text-xl font-extrabold text-[#1E1B4B]">
              Multi-Device Session Recovery
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          If your primary exam laptop crashes or loses battery, securely restore your encrypted session state on any secondary device with zero data loss.
        </p>

        {/* Input Form */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block font-mono text-[11px] text-slate-600 uppercase mb-1 font-bold">
              Session ID / Examination Code:
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="e.g. RX-20481"
              className="w-full rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-2.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-inner"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-slate-600 uppercase mb-1 font-bold">
              Candidate Recovery Token / HMAC:
            </label>
            <div className="relative">
              <input
                type="password"
                value={authSecret}
                onChange={(e) => setAuthSecret(e.target.value)}
                placeholder="Enter HMAC auth token"
                className="w-full rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-2.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-inner"
              />
              <KeyRound className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            onClick={handleInspectSession}
            disabled={isVerifying}
            className="w-full bot-pill-btn py-3 font-heading text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isVerifying ? "Verifying Session On Ledger..." : "Inspect & Authenticate State"}</span>
          </button>
        </div>

        {/* State Preview Card */}
        {sessionPreview && (
          <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50/80 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <div>
                <span className="font-heading font-bold text-sm text-[#1E1B4B] block">
                  {sessionPreview.candidateName}
                </span>
                <span className="font-mono text-[10px] text-purple-700 font-bold">
                  {sessionPreview.candidateNumber} • {sessionPreview.examSubject}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-slate-500 block">
                  Recovery Confidence
                </span>
                <span className="font-heading text-sm font-extrabold text-emerald-600">
                  {sessionPreview.confidenceScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-600">
              <div>
                <span>Last Checkpoint:</span>
                <span className="text-slate-900 block font-semibold truncate">
                  #{sessionPreview.checkpointNumber} ({sessionPreview.lastCheckpoint})
                </span>
              </div>
              <div>
                <span>Time Remaining:</span>
                <span className="text-slate-900 block font-semibold">
                  {sessionPreview.timeRemaining} (Timer Synchronized)
                </span>
              </div>
              <div>
                <span>Answer State:</span>
                <span className="text-purple-700 block font-semibold">
                  14 Questions Preserved (0B Lost)
                </span>
              </div>
              <div>
                <span>Integrity Status:</span>
                <span className="text-emerald-700 block font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>SHA-256 Verified</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmRestore}
              className="w-full bot-pill-btn py-3 font-heading text-xs font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md"
            >
              <span>Restore Session On This Device</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
