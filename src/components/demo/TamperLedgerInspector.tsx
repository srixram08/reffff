"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ExamLedgerEntry,
  createInitialExamLedger,
  verifyExamLedger,
} from "@/lib/cryptoEngine";

interface TamperLedgerInspectorProps {
  theme?: "amber" | "cyan" | "violet";
}

export const TamperLedgerInspector: React.FC<TamperLedgerInspectorProps> = ({
  theme = "amber",
}) => {
  const [ledger, setLedger] = useState<ExamLedgerEntry[]>([]);
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [verification, setVerification] = useState<{
    isValid: boolean;
    violatedIndex: number | null;
    expectedHash: string | null;
    actualHash: string | null;
  }>({ isValid: true, violatedIndex: null, expectedHash: null, actualHash: null });

  const themeColors = {
    amber: {
      accent: "#7C3AED",
      border: "border-purple-100",
    },
    cyan: {
      accent: "#0284C7",
      border: "border-sky-100",
    },
    violet: {
      accent: "#9333EA",
      border: "border-purple-100",
    },
  }[theme];

  useEffect(() => {
    createInitialExamLedger().then((initial) => {
      setLedger(initial);
      verifyExamLedger(initial).then(setVerification);
    });
  }, []);

  const handleToggleTamper = async () => {
    if (tamperedIndex !== null) {
      const fresh = await createInitialExamLedger();
      setLedger(fresh);
      setTamperedIndex(null);
      const res = await verifyExamLedger(fresh);
      setVerification(res);
    } else {
      const targetIdx = 3;
      const mutated = [...ledger];
      mutated[targetIdx] = {
        ...mutated[targetIdx],
        details: "MALICIOUS TAMPER: Modified answer text after submission deadline",
        isTampered: true,
      };
      setLedger(mutated);
      setTamperedIndex(targetIdx);
      const res = await verifyExamLedger(mutated);
      setVerification(res);
    }
  };

  return (
    <div className={`rounded-3xl border border-purple-100 bg-white/95 p-5 sm:p-6 text-[#1E1B4B] shadow-xl shadow-purple-900/5 relative overflow-hidden backdrop-blur-xl`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-600" />
            <span
              className="font-mono text-xs font-extrabold uppercase tracking-wider text-purple-600"
            >
              Cryptographic Immutability
            </span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#1E1B4B] mt-1">
            Tamper-Evident Exam Ledger
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {verification.isValid ? (
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="font-bold">Integrity: 100% VERIFIED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs text-rose-700 bg-rose-50 border border-rose-300 px-3.5 py-1.5 rounded-xl shadow-md animate-pulse">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span className="font-bold">VIOLATION DETECTED</span>
            </div>
          )}

          <button
            onClick={handleToggleTamper}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
              tamperedIndex !== null
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20"
            }`}
          >
            {tamperedIndex !== null ? (
              <>
                <RotateCcw className="h-4 w-4" />
                <span>Reset Ledger Integrity</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span>Simulate Tamper Attack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Violation Alert Banner */}
      {!verification.isValid && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs shadow-md">
          <div className="flex items-center gap-2 font-mono text-rose-800 font-extrabold">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <span>
              MERKLE CHAIN BREAK DETECTED AT BLOCK #{verification.violatedIndex! + 1}
            </span>
          </div>
          <p className="text-rose-950 mt-1.5 font-mono text-[11px] leading-relaxed">
            Adversary attempted to alter state payload. Cryptographic hash mismatch occurred. Autonomous protection protocol:{" "}
            <strong className="text-emerald-700 font-bold underline">
              Checkpoint rejected ➔ Rolled back to last verified uncorrupted state.
            </strong>
          </p>
        </div>
      )}

      {/* Ledger Block Chain List */}
      <div className="mt-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {ledger.map((entry, index) => {
          const isViolated = tamperedIndex === index;
          return (
            <div
              key={entry.sequenceId}
              className={`rounded-2xl border p-3.5 font-mono text-xs transition-all ${
                isViolated
                  ? "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400 shadow-xl"
                  : "border-purple-100 bg-purple-50/40 text-slate-700 hover:border-purple-200 hover:bg-purple-50/80 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-extrabold text-purple-700">
                  Block #{entry.sequenceId} • {entry.actionType}
                </span>
                <span className="text-slate-500 font-medium">
                  {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                </span>
              </div>

              <div className="font-sans text-sm text-[#1E1B4B] my-1.5 font-semibold">
                {entry.details}
              </div>

              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-2 border-t border-purple-100/80">
                <div className="truncate">
                  <span className="text-slate-500">Prev Hash: </span>
                  <span className="text-purple-600 font-bold">{entry.prevHash.slice(0, 18)}...</span>
                </div>
                <div className="truncate sm:text-right">
                  <span className="text-slate-500">Entry Hash: </span>
                  <span className={isViolated ? "text-rose-600 font-extrabold" : "text-emerald-700 font-bold"}>
                    {entry.entryHash.slice(0, 18)}...
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
