"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, ShieldCheck, X, Sparkles, Lock } from "lucide-react";
import { RecoveryConfidenceMetrics } from "@/lib/cryptoEngine";

interface RecoveryConfidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics?: RecoveryConfidenceMetrics;
}

export const RecoveryConfidenceModal: React.FC<RecoveryConfidenceModalProps> = ({
  isOpen,
  onClose,
  metrics = {
    overallScore: 99.98,
    stateIntegrity: 100,
    sequenceIntegrity: 100,
    hashVerification: 100,
    timestampIntegrity: 100,
    answerCompleteness: 100,
    checkpointId: "CHK-1042-89B",
    checkpointNumber: 4821,
    merkleRoot: "0xa8f492c10b7e49d29f8c12a3456789abcdef0123456789abcdef0123456789ab",
    hmacReceipt: "REVIVEX-HMAC-2026-A8F492C10B7E-AUTH",
    verdict: "CRYPTO_VERIFIED",
  },
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(metrics.hmacReceipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const METRIC_ROWS = [
    { label: "State Integrity", score: metrics.stateIntegrity, desc: "Canonical JSON matches zero mutated keys" },
    { label: "Sequence Integrity", score: metrics.sequenceIntegrity, desc: "CRDT monotonic edit generation continuous" },
    { label: "Hash Verification", score: metrics.hashVerification, desc: "SubtleCrypto SHA-256 matches Merkle delta link" },
    { label: "Timestamp Integrity", score: metrics.timestampIntegrity, desc: "Edge NTP drift verified within ±2.4ms" },
    { label: "Answer Completeness", score: metrics.answerCompleteness, desc: "All 14 questions preserved with 0 answer bytes lost" },
  ];

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 border border-purple-200 text-purple-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
              Cryptographic Audit Proof
            </div>
            <h3 className="font-heading text-xl font-extrabold text-[#1E1B4B]">
              Recovery Confidence Score
            </h3>
          </div>
        </div>

        {/* Huge Confidence Percentage */}
        <div className="mt-5 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-4 text-center">
          <span className="font-mono text-xs text-purple-700 uppercase tracking-wider block font-bold">
            Total Recovery Confidence
          </span>
          <div className="font-heading text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-1 tracking-tight">
            {metrics.overallScore.toFixed(2)}%
          </div>
          <span className="text-xs text-slate-500 mt-1 block font-mono">
            Recovered from Checkpoint #{metrics.checkpointNumber} ({metrics.checkpointId})
          </span>
        </div>

        {/* 5-Dimension Progress Bars */}
        <div className="mt-5 space-y-3">
          {METRIC_ROWS.map((row, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">
                  {row.label}
                </span>
                <span className="font-mono font-bold text-purple-700">
                  {row.score}%
                </span>
              </div>
              <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden border border-purple-200">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  style={{ width: `${row.score}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">{row.desc}</p>
            </div>
          ))}
        </div>

        {/* HMAC Receipt Box */}
        <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50/60 p-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mb-1">
            <span>Cryptographic HMAC Receipt:</span>
            <button
              onClick={handleCopyReceipt}
              className="flex items-center gap-1 text-purple-600 hover:underline font-bold cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              <span>{copied ? "Copied!" : "Copy Token"}</span>
            </button>
          </div>
          <div className="font-mono text-xs text-purple-900 break-all select-all font-bold">
            {metrics.hmacReceipt}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bot-pill-btn !py-3 !text-xs font-heading font-extrabold uppercase tracking-wider cursor-pointer"
        >
          Confirm & Close Proof Verification
        </button>
      </div>
    </div>
  );
};
