"use client";

import React, { useState } from "react";
import { Search, Cpu, Users } from "lucide-react";
import { CandidateSession } from "@/lib/simulationEngine";
import { StatusRing, SessionStatus } from "../ui/StatusRing";

interface SessionGridProps {
  candidates: CandidateSession[];
  selectedCandidateId: string;
  onSelectCandidate: (id: string) => void;
}

export const SessionGrid: React.FC<SessionGridProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const [filter, setFilter] = useState<"all" | SessionStatus>("all");
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.examSubject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full rounded-2xl border border-purple-200/80 bg-white/95 shadow-sm p-4 text-[#1E1B4B]">
      {/* Header & Filter Controls */}
      <div className="space-y-3 border-b border-purple-100 pb-4 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E1B4B] flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span>Examinee Sessions</span>
          </h3>
          <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold">
            {filteredCandidates.length} ACTIVE
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3 py-2 font-sans text-xs text-[#1E1B4B] placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono">
          {(["all", "stable", "at-risk", "recovering"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                filter === f
                  ? "bg-purple-600 text-white font-bold shadow-sm"
                  : "bg-purple-50 text-slate-600 hover:text-[#1E1B4B] hover:bg-purple-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List Stream */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {filteredCandidates.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-slate-500 space-y-2 rounded-xl border border-dashed border-purple-200 bg-purple-50/20 my-auto">
            <p className="font-bold text-[#1E1B4B]">No examinee sessions matching &quot;{filter.toUpperCase()}&quot; filter.</p>
            <p className="text-[11px] text-slate-500">All candidate sessions are currently healthy with low risk scores.</p>
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="bot-pill-btn !py-1 !px-3 !text-[11px] mt-2 cursor-pointer"
              >
                View All Candidates
              </button>
            )}
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const isSelected = candidate.id === selectedCandidateId;

            return (
              <div
                key={candidate.id}
                onClick={() => onSelectCandidate(candidate.id)}
                className={`group relative cursor-pointer rounded-xl border p-3 font-sans transition-all duration-200 ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-md ring-1 ring-purple-400"
                    : "border-purple-100 bg-[#FAF8FF] hover:border-purple-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusRing status={candidate.status} size="sm" />
                    <span className="font-heading font-bold text-xs text-[#1E1B4B] group-hover:text-purple-600">
                      {candidate.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{candidate.id}</span>
                </div>

                <div className="text-[11px] text-slate-600 truncate mb-2">
                  {candidate.examSubject}
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 border-t border-purple-100 pt-1.5">
                  <span>Latency: <strong className="text-purple-600">{candidate.latency}ms</strong></span>
                  <span>Risk: <strong className={candidate.riskScore > 60 ? "text-[#D97706]" : "text-emerald-600"}>{candidate.riskScore}%</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
