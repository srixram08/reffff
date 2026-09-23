"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Send, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Laptop, 
  Cpu, 
  Star,
  Activity,
  Smile,
  Frown,
  Move,
  Zap,
  Eye
} from "lucide-react";
import { BotEmotionCharacter, BotEmotionState } from "@/components/ui/BotEmotionCharacter";
import { botAudio } from "@/lib/botAudio";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp?: string;
  badge?: string;
  actionResult?: {
    type: "success" | "warning" | "info";
    label: string;
    details: string;
  };
}

const PRESET_QUERIES = [
  {
    id: "q1",
    label: "Is my exam session protected if WiFi drops?",
    response: "Yes! At 100Hz frequency, ReviveX buffers every keystroke, MCQ selection, and code mutation directly into IndexedDB on your device. Even if your router catches fire, not a single byte of your work is lost."
  },
  {
    id: "q2",
    label: "How does the Digital Twin prevent answer loss?",
    response: "Your exam maintains an active shadow replica on the edge. Whenever you answer, delta hashes are mirrored. If your browser freezes, opening the link immediately recovers your exact timer, cursor, and responses in under 350ms."
  },
  {
    id: "q3",
    label: "Can I switch to another laptop mid-exam?",
    response: "Seamlessly! Enter your Session ID & cryptographic OTP on the new device. ReviveX re-hydrates your full state with cryptographic SHA-256 Merkle proof without requiring proctor intervention."
  }
];

export const ReviveXBotHero: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "bot",
      text: "At 100Hz frequency, ReviveX captures every keystroke into non-volatile storage. If your network or browser drops, zero answers are lost.",
      badge: "Autonomous Guardian"
    },
    {
      id: "m2",
      sender: "user",
      text: "What happens if my laptop battery dies in the middle of Question 4?"
    },
    {
      id: "m3",
      sender: "bot",
      text: "No panic! Your answers are cryptographically sealed. Power on any backup device, visit the recovery portal, and ReviveX restores your exact session and remaining exam timer in <2.4 seconds.",
      badge: "Self-Healing Engine"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [simulatingEvent, setSimulatingEvent] = useState<string | null>(null);
  const [botEmotion, setBotEmotion] = useState<BotEmotionState>("normal");
  const [automaticTriggerReason, setAutomaticTriggerReason] = useState("100Hz Sensor Driven • Normal");

  // Real-time automatic browser & network event listeners (Automatic emotion determination)
  useEffect(() => {
    // 1. Real Wi-Fi Disconnect Event
    const handleOffline = () => {
      setBotEmotion("crying");
      setAutomaticTriggerReason("Auto-Detected: Real Wi-Fi Cut");
      botAudio.playWarningBeep();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "😭 OH NO! Network socket severed! (Bot is crying with tears!) But 100% of your keystrokes are automatically safe in local IndexedDB!",
          badge: "Auto-Detected: Offline • Crying"
        }
      ]);
    };

    // 2. Real Wi-Fi Reconnect Event
    const handleOnline = () => {
      setBotEmotion("happy");
      setAutomaticTriggerReason("Auto-Detected: Reconnected (140ms Sync)");
      botAudio.playCelebrationSound();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "🎉 YAY! Network reconnected in 140ms! (Bot is celebrating with stars!) All state deltas merged cleanly!",
          badge: "Auto-Detected: Online • Happy"
        }
      ]);
      setTimeout(() => {
        setBotEmotion("normal");
        setAutomaticTriggerReason("100Hz Sensor Driven • Normal");
      }, 5000);
    };

    // 3. Tab Visibility & Inattention Check
    const handleVisibility = () => {
      if (document.hidden) {
        setBotEmotion("crying");
        setAutomaticTriggerReason("Auto-Detected: Tab Defocus / Sneak");
      }
    };

    // 4. Runtime Error Detection
    const handleError = () => {
      setBotEmotion("crying");
      setAutomaticTriggerReason("Auto-Detected: Browser Error Caught");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("error", handleError);
    };
  }, []);

  const handleSendQuery = (queryText: string, customReply?: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    setBotEmotion("thinking");
    setAutomaticTriggerReason("Analyzing Candidate Query • 100Hz");

    setTimeout(() => {
      let botReply = customReply;
      if (!botReply) {
        const lower = queryText.toLowerCase();
        if (lower.includes("wifi") || lower.includes("network") || lower.includes("internet")) {
          botReply = "I continuously monitor network telemetry. If packet loss exceeds 12%, I proactively transition your exam to Offline-First CRDT mode so you can continue typing without interruptions.";
        } else if (lower.includes("cheat") || lower.includes("security") || lower.includes("ledger")) {
          botReply = "Every state change is appended to a SHA-256 Merkle Ledger. The integrity hash prevents retroactive answer tampering, guaranteeing full academic fairness.";
        } else if (lower.includes("simulate") || lower.includes("crash") || lower.includes("failure")) {
          botReply = "Simulating instant disruption test: local IndexedDB snapshot verified (12 answers saved), edge shadow replica synchronized. System confidence 99.98%.";
        } else {
          botReply = "I am ReviveX Guardian Bot! I ensure 0% data loss, continuous client buffering, and autonomous sub-second session recovery for every candidate.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botReply!,
          badge: "ReviveX AI"
        }
      ]);
      setIsTyping(false);
      setBotEmotion("happy");
      setAutomaticTriggerReason("Query Answered • Happy");
      setTimeout(() => {
        setBotEmotion("normal");
        setAutomaticTriggerReason("100Hz Sensor Driven • Normal");
      }, 4000);
    }, 600);
  };

  const handleSimulateDisruption = () => {
    setSimulatingEvent("⚠️ Network Interrupt! Socket Severed...");
    setIsTyping(true);
    setBotEmotion("crying");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "😭 WAAAH! Network socket severed! (Bot is crying with tears!) But DON'T PANIC—my 100Hz local CRDT buffer already caught all your answers in IndexedDB! Healing connection...",
        badge: "Network Drop • Bot Crying"
      }
    ]);

    setTimeout(() => {
      setSimulatingEvent(null);
      setIsTyping(false);
      setBotEmotion("happy");

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "🎉 YAY! Connection restored in 180ms! (Bot is happy & celebrating!) All deltas synchronized to the edge digital twin with zero data loss!",
          badge: "Self-Healing Success • Bot Happy",
          actionResult: {
            type: "success",
            label: "0ms Downtime • Zero Data Loss",
            details: "Recovery Time: 180ms • SHA-256 State Intact"
          }
        }
      ]);
    }, 2400);
  };

  const handleExamSubmitted = () => {
    setBotEmotion("happy");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "🎉 HOORAY! Exam submitted successfully! (Bot is super happy with stars & confetti!) 100% of answers cryptographically sealed into SHA-256 Merkle Ledger!",
        badge: "Submitted • Ecstatic Celebration",
        actionResult: {
          type: "success",
          label: "Submission Confirmed • Gradebook Synced",
          details: "Merkle Root: 0x8f4c...3e19 • Zero Latency"
        }
      }
    ]);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32 bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF]">
      
      {/* Background Soft Glow & Atmospheric Cones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-indigo-200/50 via-purple-200/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-purple-200 text-purple-700 text-xs font-semibold mb-4 shadow-sm backdrop-blur-md">
            <Bot className="h-4 w-4 text-purple-600 animate-pulse" />
            <span>Autonomous Exam Resilience Assistant</span>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">v2.4</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E1B4B] font-heading mb-4 leading-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700">ReviveX AI</span>, <br />
            Your Personal Exam Guardian
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto">
            Ask anything about exam disruptions, zero-data-loss buffering, instant failover, or device switching. ReviveX gives autonomous, cryptographically verified recovery answers instantly.
          </p>
        </div>

        {/* 3-Column Interactive Layout (Prompts | Bot | Chat) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ================= LEFT COLUMN: Floating Prompts & Rating Card ================= */}
          <div className="lg:col-span-4 flex flex-col gap-4 z-10">
            
            <div className="space-y-3">
              {PRESET_QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSendQuery(q.label, q.response)}
                  className="w-full text-left p-4 rounded-2xl bg-white/80 hover:bg-white border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-between backdrop-blur-sm"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-purple-900 transition-colors">
                    {q.label}
                  </span>
                  <Sparkles className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Social Proof & Rating Badge Card */}
            <div className="p-4 rounded-2xl bg-white/80 border border-purple-100 shadow-sm backdrop-blur-sm mt-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 font-bold text-sm">
                4.9★
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Rated 4.9 ★ by 50,000+ candidates globally
                </p>
                <p className="text-[11px] text-slate-500">
                  Zero silent exam loss recorded
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link
                href="/login?role=student&intent=exam"
                className="w-full bot-pill-btn py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-indigo-500/25 group"
              >
                <span>Start Protected Exam Pod</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* ================= CENTER COLUMN: Animated 3D Bot & Sonar Rings ================= */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-8 lg:py-0">
            
            {/* Concentric Expanding Sonar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              {/* Ring 1 */}
              <div className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border border-purple-300/40 animate-sonar-ring-1" />
              {/* Ring 2 */}
              <div className="w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] rounded-full border border-indigo-300/30 animate-sonar-ring-2" />
              {/* Ring 3 */}
              <div className="w-[480px] h-[480px] sm:w-[580px] sm:h-[580px] rounded-full border border-purple-200/20 animate-sonar-ring-3" />
              {/* Core Soft Ambient Violet Glow */}
              <div className="w-52 h-52 rounded-full bg-purple-400/25 blur-3xl" />
            </div>

            {/* Dynamic Emotion Character - Playful, Draggable & Automatically Reactive */}
            <div className="relative z-10 flex flex-col items-center">
              <BotEmotionCharacter
                emotion={botEmotion}
                allowDrag={true}
                isInteractive={true}
                customStatusText={
                  botEmotion === "crying"
                    ? "Network Interrupted! (Auto-Crying, 100% saved locally 🛡️)"
                    : botEmotion === "happy"
                    ? "Exam Event Resolved! Happy Guardian Celebration 🎉"
                    : botEmotion === "thinking"
                    ? "Analyzing Telemetry & Keystrokes • 100Hz Active"
                    : "Autonomous Guardian: 100Hz Active"
                }
              />

              {/* Autonomous Emotion Perception Cortex */}
              <div className="mt-4 flex flex-col items-center gap-2 max-w-sm text-center">
                {/* Real-time Event Indicator */}
                <div className="px-3.5 py-1.5 rounded-full bg-white/95 border border-purple-200/90 text-purple-900 text-[11px] font-bold flex items-center gap-2 shadow-xs backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                  </span>
                  <span>Autonomous Mood: {automaticTriggerReason}</span>
                </div>

                <div className="text-[10px] text-slate-500 font-medium">
                  🤖 <em>Playful & Alive</em>: Click to poke, drag to move, or disconnect Wi-Fi to watch it cry automatically!
                </div>

                {/* Instant Simulation Triggers (Optional Testing) */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 border border-purple-200 shadow-xs backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => handleSimulateDisruption()}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Simulate network cut to test automatic crying"
                  >
                    <span>😭</span>
                    <span>Test Disconnect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExamSubmitted()}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Simulate exam submission to test celebration"
                  >
                    <span>🎉</span>
                    <span>Test Submit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBotEmotion("normal");
                      setAutomaticTriggerReason("100Hz Sensor Driven • Normal");
                    }}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                    title="Reset to calm normal state"
                  >
                    <span>😊 Reset</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Live Interactive Chat Card ================= */}
          <div className="lg:col-span-4 z-10">
            <div className="bg-white/95 border border-purple-100 rounded-3xl shadow-xl shadow-purple-900/5 p-5 backdrop-blur-md flex flex-col h-[460px] justify-between">
              
              {/* Chat Card Header */}
              <div className="flex items-center justify-between border-b border-purple-50 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">ReviveX AI Assistant</h3>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Session Replica Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-100">
                    &lt; 2.4s Rollback
                  </span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    {m.badge && (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-purple-600 mb-1 px-1">
                        {m.badge}
                      </span>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        m.sender === "user"
                          ? "bg-purple-600 text-white rounded-br-none shadow-sm"
                          : "bg-purple-50/80 text-slate-800 border border-purple-100/80 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>

                    {m.actionResult && (
                      <div className="mt-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono flex items-center gap-2 max-w-[85%]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold">{m.actionResult.label}</div>
                          <div className="text-[9px] text-emerald-600">{m.actionResult.details}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-2 rounded-2xl w-fit text-[11px] border border-purple-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[10px] font-medium text-slate-500">
                      {simulatingEvent || "ReviveX is calculating..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Fast Scenario Simulator Triggers */}
              <div className="pt-2 border-t border-purple-50 flex items-center gap-1.5 overflow-x-auto pb-2">
                <button
                  onClick={handleSimulateDisruption}
                  className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-semibold border border-rose-200 flex items-center gap-1 whitespace-nowrap transition-colors"
                >
                  <WifiOff className="h-3 w-3 text-rose-600" />
                  Simulate WiFi Cut (Cry)
                </button>
                <button
                  onClick={handleExamSubmitted}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold border border-emerald-200 flex items-center gap-1 whitespace-nowrap transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  Submit Exam (Happy)
                </button>
                <button
                  onClick={() => handleSendQuery("Simulate switching device to an iPad")}
                  className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold border border-purple-200 flex items-center gap-1 whitespace-nowrap transition-colors"
                >
                  <Laptop className="h-3 w-3 text-purple-600" />
                  Device Switch
                </button>
                <button
                  onClick={() => handleSendQuery("Verify academic integrity SHA-256 ledger")}
                  className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold border border-purple-200 flex items-center gap-1 whitespace-nowrap transition-colors"
                >
                  <ShieldCheck className="h-3 w-3 text-purple-600" />
                  Ledger Audit
                </button>
              </div>

              {/* Text Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery(inputVal);
                }}
                className="relative flex items-center mt-1"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask ReviveX AI about resilience..."
                  className="w-full bg-purple-50/50 border border-purple-200 rounded-full pl-4 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className="absolute right-1.5 p-1.5 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
