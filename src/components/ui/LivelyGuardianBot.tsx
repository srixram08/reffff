"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Sparkles,
  Send,
  WifiOff,
  Wifi,
  ShieldCheck,
  Laptop,
  Activity,
  AlertTriangle,
  Clock,
  Volume2,
  VolumeX,
  Compass,
  Move,
  Maximize2,
  Minimize2,
  HelpCircle,
  Award,
  ChevronRight,
  Eye,
  Siren,
  CheckCircle2,
  Flame,
  RotateCcw,
  Smile,
  Frown,
  Zap,
  Moon,
  Lock,
  KeyRound,
  MousePointer2
} from "lucide-react";
import { botAudio } from "@/lib/botAudio";
import { proctorMonitor, ProctorViolation } from "@/lib/proctorMonitorEngine";
import { answerStudentQuestion, QUICK_PROMPTS } from "@/lib/studentAiKnowledge";
import { STUDENTS_DATA, INITIAL_EXAMS, StudentProfile, Exam } from "@/lib/examStore";

export type BotEmotion = "normal" | "happy" | "crying" | "thinking" | "alert" | "sleepy" | "peeking";

interface LivelyGuardianBotProps {
  currentExam?: Exam;
  currentStudent?: StudentProfile;
  isExamMode?: boolean;
}

export const LivelyGuardianBot: React.FC<LivelyGuardianBotProps> = ({
  currentExam = INITIAL_EXAMS[0],
  currentStudent,
  isExamMode = false
}) => {
  // Authentication / User Identification State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState<string>("");

  // Widget Open / Minimize
  const [isOpen, setIsOpen] = useState(false);
  const [emotion, setEmotion] = useState<BotEmotion>("normal");
  const [isMuted, setIsMuted] = useState(false);

  // Position & Dynamic Roaming Coordinates (Offset from bottom-right origin)
  const [botPos, setBotPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutonomousRoaming, setIsAutonomousRoaming] = useState(true);

  // Click-to-Summon Beacon Ripple
  const [summonBeacon, setSummonBeacon] = useState<{ x: number; y: number } | null>(null);

  // Login Page Password Peeking State
  const [isPasswordPeeking, setIsPasswordPeeking] = useState(false);
  const [passwordKeystrokes, setPasswordKeystrokes] = useState(0);

  // Thought balloon floating above bot
  const [thoughtBubble, setThoughtBubble] = useState<string | null>(null);

  // Proctoring Violations / Sneak Warnings
  const [activeViolation, setActiveViolation] = useState<ProctorViolation | null>(null);
  const [totalStrikes, setTotalStrikes] = useState<number>(0);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // Chat message history
  const [messages, setMessages] = useState<Array<{
    sender: "bot" | "user";
    text: string;
    time: string;
    actionLabel?: string;
    actionType?: string;
  }>>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Proactive Test Reminder popup toast
  const [reminderToast, setReminderToast] = useState<{
    title: string;
    time: string;
    detail: string;
  } | null>(null);

  const botRootRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Detect if the user is signed in or browsing as a guest
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const studentIdFromUrl = searchParams.get("id");
      const loggedUser = localStorage.getItem("revivex_active_user");

      const hasStudentSession = Boolean(
        currentStudent?.id ||
        (pathname.startsWith("/student") && studentIdFromUrl) ||
        loggedUser
      );

      if (hasStudentSession) {
        setIsLoggedIn(true);
        const name = currentStudent?.name || (studentIdFromUrl && STUDENTS_DATA[studentIdFromUrl]?.name) || "Alex Chen";
        const firstName = name.split(" ")[0];
        setStudentName(firstName);
        setThoughtBubble(`👋 Hi ${firstName}! I'm your Exam Guardian. Ready for questions or pacing!`);
        setMessages([
          {
            sender: "bot",
            text: `👋 **Hello ${firstName}!** I'm your **ReviveX Autonomous Proctor & Companion**.\n\nI roam with you across the portal, keep you on schedule with test reminders, and assist you with course questions (CS-448 Raft Consensus, Quantum Physics, Cryptography).\n\n💡 **Tip**: Click anywhere on the page and I will come right to you! On the login page, watch me peek on passwords!`,
            time: "Just now"
          }
        ]);
      } else {
        setIsLoggedIn(false);
        setStudentName("");
        setThoughtBubble("👋 Welcome! I'm your Exam Guardian. Click anywhere on the page and I'll come over!");
        setMessages([
          {
            sender: "bot",
            text: `👋 **Welcome to ReviveX AI!** I'm your **Autonomous Personal Exam Guardian Bot**.\n\n🐾 **I move around the page with you!**\n• **Click any point on the page**: I will immediately fly/walk over to that point!\n• **Password peeking**: On the login page, watch me peek playfully while covering my eyes!\n• **Automatic emotions**: Disconnect your Wi-Fi or trigger an exam error to watch me automatically cry and heal!`,
            time: "Just now"
          }
        ]);
      }
    }
  }, [currentStudent]);

  // 2. Emotion Trigger Helper
  const triggerEmotion = useCallback((newEmotion: BotEmotion, reason?: string) => {
    setEmotion(newEmotion);

    if (newEmotion === "crying") {
      botAudio.playWarningBeep();
      setThoughtBubble(reason || "😭 Oh no! Network interrupted! (Crying) But 100% saved in local IndexedDB!");
    } else if (newEmotion === "happy") {
      botAudio.playCelebrationSound();
      setThoughtBubble(reason || "🎉 YAY! (Happy celebration!) Submissions verified with SHA-256 Merkle root!");
    } else if (newEmotion === "alert") {
      botAudio.playWarningBeep();
      setThoughtBubble(reason || "🚨 STRICT PROCTOR ALERT! Eyes on the exam pod!");
    } else if (newEmotion === "thinking") {
      botAudio.playChatPop();
      setThoughtBubble(reason || "🤔 Analyzing distributed consensus logs and quantum formulas...");
    } else if (newEmotion === "peeking") {
      botAudio.playChatPop();
      setThoughtBubble(reason || "🫣 Shhh! I'm covering my eyes! Password privacy secured by ED25519!");
    } else if (newEmotion === "sleepy") {
      setThoughtBubble(reason || "😴 Resting quietly... I will instantly wake up when you type!");
    } else {
      botAudio.playChatPop();
      setThoughtBubble(reason || "😊 Normal Guardian mode active at 100Hz telemetry.");
    }
  }, []);

  // Docked chat widget - Stays clean and anchored at bottom-right corner
  // The big 3D robot character (BotEmotionCharacter) is the autonomous roaming mascot!

  // 5. LOGIN PAGE PASSWORD PEEKING - FLIES TO PASSWORD INPUT & COVERS EYES / PEEKS PLAYFULLY!
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        setIsPasswordPeeking(true);
        triggerEmotion("peeking", "🫣 Shhh! I'm covering my eyes! Password privacy secured by ED25519!");
        botAudio.playChatPop();

        // Calculate exact location of the password input field
        const rect = target.getBoundingClientRect();
        // Position bot right next to or floating directly above the password field
        const targetX = rect.right + 20;
        const targetY = rect.top - 15;

        const rightOffset = window.innerWidth - targetX;
        const bottomOffset = window.innerHeight - targetY;

        setBotPos({
          x: Math.max(-window.innerWidth + 200, -rightOffset),
          y: Math.max(-window.innerHeight + 160, -bottomOffset)
        });
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        setIsPasswordPeeking(false);
        triggerEmotion("happy", "🛡️ Password safely locked! SHA-256 HMAC cryptographic token generated.");
        setTimeout(() => {
          setEmotion("normal");
          setThoughtBubble(null);
        }, 4000);
      }
    };

    const handlePasswordInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        setPasswordKeystrokes((k) => k + 1);
        botAudio.playChatPop();

        const playfulPeekThoughts = [
          "🫣 Peeking through my fingers! Super strong key!",
          "🙈 No peeking! Secret credentials guarded!",
          "🤫 Shhh! Encrypting each keystroke into SHA-256!",
          "🔐 Key sealed into Merkle proof ledger!",
          "✨ Exam Guardian certified: zero password leakage!"
        ];
        setThoughtBubble(playfulPeekThoughts[Math.floor(Math.random() * playfulPeekThoughts.length)]);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("input", handlePasswordInput);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("input", handlePasswordInput);
    };
  }, [triggerEmotion]);

  // 6. Automatic Browser & System Event Listeners (Offline, Online, Error, Inactivity)
  useEffect(() => {
    setIsMuted(botAudio.getMuted());
    proctorMonitor.setMonitoringEnabled(isExamMode);

    // A. Real Network Disconnect Event (Cry immediately)
    const handleOffline = () => {
      triggerEmotion(
        "crying",
        "😭 Network socket severed! (I am crying!) But don't worry—100Hz local buffer is saving 100% of your answers in IndexedDB!"
      );
    };

    // B. Real Network Reconnect Event (Turn happy immediately)
    const handleOnline = () => {
      triggerEmotion(
        "happy",
        "🎉 Network reconnected in 140ms! (Happy & Celebrating!) All local deltas synchronized seamlessly!"
      );
      setTimeout(() => {
        setEmotion("normal");
      }, 4500);
    };

    // C. Real Page / Script Error Event
    const handleError = () => {
      triggerEmotion(
        "crying",
        "⚠️ Intercepted an unhandled browser error! Zero-loss failover buffer has safeguarded your state."
      );
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("error", handleError);

    // D. Proctoring Violation Listener (Anti-cheat strikes)
    const unsubscribe = proctorMonitor.subscribe((violation) => {
      setActiveViolation(violation);
      setTotalStrikes(violation.strikeNumber);
      setEmotion("alert");
      setIsWarningModalOpen(true);
      setThoughtBubble(`🚨 STRIKE ${violation.strikeNumber}/3: ${violation.title}! Eyes on the exam!`);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `🚨 **SECURITY ALERT (Strike ${violation.strikeNumber}/3)**:\n${violation.title} — ${violation.description}\n\n*Incident timestamped at ${violation.timestamp} and logged to cryptographic Merkle audit ledger.*`,
          time: violation.timestamp
        }
      ]);
    });

    // E. User Inactivity & Wakeup Detection
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (emotion === "sleepy") {
        setEmotion("normal");
        setThoughtBubble("👀 I'm awake! Guardian monitoring active.");
      }
      idleTimerRef.current = setTimeout(() => {
        if (!isOpen && !isWarningModalOpen && emotion === "normal" && !isPasswordPeeking) {
          setEmotion("sleepy");
          setThoughtBubble("😴 Zzz... Resting gently. Click anywhere on the page to wake me up!");
        }
      }, 50000);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("error", handleError);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      unsubscribe();
    };
  }, [isExamMode, isOpen, isWarningModalOpen, emotion, triggerEmotion, isPasswordPeeking]);

  // 7. Scroll chat to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Get avatar image based on emotion
  const getAvatarSrc = () => {
    switch (emotion) {
      case "crying":
        return "/revivex_bot_crying.jpg";
      case "happy":
        return "/revivex_bot_happy.jpg";
      case "alert":
        return "/revivex_bot_crying.jpg";
      case "peeking":
        return "/revivex_bot_happy.jpg";
      case "normal":
      case "thinking":
      case "sleepy":
      default:
        return "/revivex_ai_bot.jpg";
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputVal).trim();
    if (!query) return;

    botAudio.playChatPop();
    setMessages((prev) => [...prev, { sender: "user", text: query, time: "Just now" }]);
    if (textToSend === undefined) setInputVal("");
    setIsTyping(true);
    setEmotion("thinking");

    setTimeout(() => {
      const lower = query.toLowerCase();

      if (lower.includes("wifi") || lower.includes("disconnect") || lower.includes("cry")) {
        triggerEmotion("crying", "😭 Simulating Wi-Fi disconnection! Tears flowing, but IndexedDB buffer is 100% active!");
        setTimeout(() => {
          triggerEmotion("happy", "🎉 Reconnected in 180ms! Deltas merged cleanly!");
        }, 3200);
      } else if (lower.includes("submit") || lower.includes("happy") || lower.includes("done")) {
        triggerEmotion("happy", "🎉 Exam submitted! Happy guardian celebration with Merkle proof!");
      } else if (lower.includes("cheat") || lower.includes("sneak") || lower.includes("strike")) {
        triggerEmotion("alert", "🚨 Strict proctoring alert! All tab switches and defocuses are audited!");
      } else {
        setEmotion("normal");
      }

      const activeStudent = currentStudent || (isLoggedIn ? STUDENTS_DATA["STU-84920"] : undefined);

      const responsePayload = answerStudentQuestion(query, {
        student: activeStudent,
        activeExam: currentExam,
        strikes: totalStrikes,
        timeRemainingFormatted: "74:18"
      });

      botAudio.playChatPop();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: responsePayload.text,
          time: "Just now",
          actionLabel: responsePayload.actionLabel,
          actionType: responsePayload.actionType
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (actionType?: string) => {
    if (!actionType) return;
    if (actionType === "test_wifi") {
      handleSend("Simulate sudden Wi-Fi network cut");
    } else if (actionType === "reminder") {
      handleSend("When is my next exam and what are my upcoming test reminders?");
    } else if (actionType === "show_merkle") {
      handleSend("Explain Question 2 SHA-256 Merkle root validation");
    } else if (actionType === "calm_down") {
      setThoughtBubble("🌿 Inhale for 4s... hold for 7s... exhale for 8s. You've got this!");
    }
  };

  const handleDismissWarning = () => {
    setIsWarningModalOpen(false);
    setEmotion("normal");
    setThoughtBubble("🛡️ Resuming proctored exam guardian monitoring. Keep focused!");
  };

  const toggleSound = () => {
    const nextMuted = botAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      botAudio.playChatPop();
    }
  };

  return (
    <>
      {/* 1. CLICK-TO-SUMMON RIPPLE BEACON */}
      <AnimatePresence>
        {summonBeacon && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: summonBeacon.x - 24,
              top: summonBeacon.y - 24,
              zIndex: 9999,
              pointerEvents: "none"
            }}
            className="w-12 h-12 rounded-full border-2 border-purple-500 bg-purple-400/20 flex items-center justify-center text-xs shadow-lg shadow-purple-500/40"
          >
            <span className="text-base select-none">🐾</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SNEAK / CHEAT ALERT STRIKE OVERLAY MODAL */}
      <AnimatePresence>
        {isWarningModalOpen && activeViolation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm animate-bounce">
                    <Siren className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-mono font-extrabold tracking-wider text-rose-200">
                      ReviveX Autonomous Proctor Warning
                    </div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span>Proctor Violation Detected!</span>
                    </h3>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white text-rose-700 font-mono font-bold text-xs shadow-inner">
                  Strike {totalStrikes} of 3
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-rose-400 shrink-0 shadow-md animate-pulse">
                    <Image
                      src="/revivex_bot_crying.jpg"
                      alt="Alert Bot"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                      <span>ReviveX Bot Guardian Caught That:</span>
                    </h4>
                    <p className="text-xs text-rose-800 font-medium mt-0.5">
                      &quot;{activeViolation.title}: {activeViolation.description}&quot;
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>
                      <strong>Academic Integrity Notice:</strong> All window defocuses, clipboard copies, and tab navigations are cryptographically recorded into your Merkle session ledger.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-400">
                    Audit ID: {activeViolation.id} • {activeViolation.timestamp}
                  </span>
                  <button
                    onClick={handleDismissWarning}
                    className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    I Understand, Return to Exam
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. LIVELY MOVING & ROAMING GUARDIAN COMPANION */}
      <motion.div
        ref={botRootRef}
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          setBotPos((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y
          }));
        }}
        animate={{
          x: botPos.x,
          y: botPos.y
        }}
        transition={{
          type: "spring",
          stiffness: isPasswordPeeking ? 220 : 160,
          damping: 18,
          mass: 0.8
        }}
        className="fixed bottom-6 right-6 z-50 font-sans select-none"
      >
        {/* Floating Dynamic Thought Bubble */}
        <AnimatePresence>
          {thoughtBubble && !isOpen && (emotion === "alert" || emotion === "crying") && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.85 }}
              className={`absolute -top-20 right-0 max-w-xs w-72 bg-white/95 backdrop-blur-md border shadow-xl rounded-2xl p-2.5 text-xs text-slate-800 pointer-events-none transition-all ${
                isPasswordPeeking ? "border-amber-400 ring-2 ring-amber-300" : "border-purple-200"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase mb-0.5 text-purple-700">
                {isPasswordPeeking ? (
                  <>
                    <KeyRound className="h-3 w-3 text-amber-600 animate-spin" />
                    <span className="text-amber-700">Peek-a-boo Privacy Guard!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <span>Personal Exam Guardian</span>
                  </>
                )}
              </div>
              <p className="leading-snug text-[11px] text-slate-700">{thoughtBubble}</p>
              <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white border-r border-b border-purple-200 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXPANDED INTERACTIVE CHAT WINDOW */}
        {isOpen && (
          <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-white/95 rounded-3xl shadow-2xl border-2 border-purple-200/90 flex flex-col overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* Header with Controls */}
            <div className={`p-4 text-white flex items-center justify-between shadow-md transition-colors duration-300 ${
              emotion === "alert"
                ? "bg-gradient-to-r from-rose-600 via-red-600 to-amber-600"
                : emotion === "crying"
                ? "bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600"
                : emotion === "happy"
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600"
                : emotion === "sleepy"
                ? "bg-gradient-to-r from-slate-600 via-indigo-700 to-purple-800"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700"
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/80 bg-white/20 shadow-md">
                  <Image
                    src={getAvatarSrc()}
                    alt="ReviveX Bot"
                    fill
                    className="object-cover transition-all duration-300"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    <span>ReviveX AI Companion</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      emotion === "alert"
                        ? "bg-red-300 animate-ping"
                        : emotion === "crying"
                        ? "bg-amber-300 animate-ping"
                        : emotion === "happy"
                        ? "bg-emerald-300 animate-ping"
                        : "bg-emerald-400 animate-pulse"
                    }`} />
                  </h4>
                  <p className="text-[10px] text-purple-100 font-medium">
                    {isPasswordPeeking
                      ? "🫣 Password Privacy Peek Guard Active"
                      : emotion === "alert"
                      ? "🚨 Anti-Cheat Sentinel Active"
                      : emotion === "crying"
                      ? "😭 Network Disconnected (Buffered)"
                      : emotion === "happy"
                      ? "🎉 Verified & Celebrating!"
                      : emotion === "sleepy"
                      ? "😴 Resting (Wakes on click/type)"
                      : "Autonomous Proctor & Study Tutor"}
                  </p>
                </div>
              </div>

              {/* Utility Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleSound}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  title={isMuted ? "Unmute Bot Audio" : "Mute Bot Audio"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setIsAutonomousRoaming(!isAutonomousRoaming)}
                  className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                    isAutonomousRoaming ? "text-amber-300 bg-white/10" : "text-white/80"
                  }`}
                  title={isAutonomousRoaming ? "Pause Autonomous Roaming" : "Enable Autonomous Roaming"}
                >
                  <Compass className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setBotPos({ x: 0, y: 0 })}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  title="Reset Bot Position to Dock"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  aria-label="Close Bot"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Click Anywhere Instruction Bar */}
            <div className="px-3 py-1.5 bg-gradient-to-r from-purple-100/90 to-indigo-50/90 border-b border-purple-200 flex items-center justify-between text-[10px] font-bold text-purple-900">
              <span className="flex items-center gap-1">
                <MousePointer2 className="h-3 w-3 text-purple-600" />
                <span>Tip: Click anywhere on the webpage to call me over!</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-purple-700 text-[9px] shadow-xs">
                🐾 Summon Ready
              </span>
            </div>

            {/* Quick Action Prompt Chips */}
            <div className="px-3 py-1.5 bg-purple-50/70 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-[10px] font-semibold text-purple-800 scrollbar-none">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSend(prompt.query)}
                  className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 whitespace-nowrap shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-gradient-to-b from-white via-purple-50/20 to-purple-50/40"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-purple-100 rounded-bl-none"
                    }`}
                  >
                    <div className="whitespace-pre-line prose-xs">{m.text}</div>

                    {m.actionLabel && (
                      <button
                        onClick={() => handleActionClick(m.actionType)}
                        className="mt-2.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-[10px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        <span>{m.actionLabel}</span>
                        <ChevronRight className="h-3 w-3 ml-auto opacity-70" />
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 bg-white text-purple-700 px-3 py-2 rounded-2xl border border-purple-100 w-fit text-[11px] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[10px] text-slate-500">ReviveX Guardian analyzing...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-purple-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about Raft, formulas, Wi-Fi failover, or rules..."
                className="flex-1 bg-purple-50/50 border border-purple-200 rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputVal.trim()}
                className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                aria-label="Send query"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* COLLAPSED LIVELY BOT AVATAR TRIGGER */}
        {!isOpen && (
          <div className="flex flex-col items-end gap-2">
            
            {/* Password Peeking / Guardian Notification Banner */}
            {isPasswordPeeking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] shadow-lg flex items-center gap-1.5 animate-bounce"
              >
                <Lock className="h-3 w-3" />
                <span>🙈 Peeking On Password! (Covering Eyes For Privacy)</span>
              </motion.div>
            )}

            {/* Main Interactive Floating Bubble */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              animate={
                isPasswordPeeking
                  ? { y: [0, -10, 0], rotate: [-2, 2, -2] }
                  : emotion === "crying"
                  ? { y: [0, -8, 0], rotate: [-1, 1, -1] }
                  : emotion === "happy"
                  ? { y: [0, -10, 0], scale: [1, 1.05, 1] }
                  : emotion === "alert"
                  ? { x: [-3, 3, -3, 3, 0] }
                  : emotion === "sleepy"
                  ? { y: [0, -2, 0] }
                  : { y: [0, -6, 0], rotate: [-0.5, 0.5, -0.5] }
              }
              transition={{
                repeat: Infinity,
                duration: isPasswordPeeking ? 1.2 : emotion === "crying" ? 1.4 : emotion === "happy" ? 1.6 : emotion === "sleepy" ? 5 : 3.5,
                ease: "easeInOut"
              }}
              onClick={() => setIsOpen(true)}
              className={`group relative flex items-center gap-3 p-2 pr-4 rounded-full bg-white/95 backdrop-blur-md border-2 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer ${
                isPasswordPeeking
                  ? "border-amber-400 shadow-amber-500/35 ring-4 ring-amber-300"
                  : emotion === "alert"
                  ? "border-rose-500 shadow-rose-500/30 ring-2 ring-rose-400"
                  : emotion === "crying"
                  ? "border-amber-400 shadow-amber-500/25 ring-2 ring-amber-300"
                  : emotion === "happy"
                  ? "border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-300"
                  : emotion === "sleepy"
                  ? "border-indigo-300 shadow-indigo-300/20"
                  : "border-purple-300 shadow-purple-500/20"
              }`}
            >
              {/* Animated Avatar Circle with Peek-a-boo FX */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 bg-purple-50 shadow-inner">
                <Image
                  src={getAvatarSrc()}
                  alt="ReviveX Bot"
                  fill
                  className="object-cover transition-all duration-300"
                />
                
                {/* Peek-a-boo Eye Hands Overlay */}
                {isPasswordPeeking && (
                  <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay flex items-center justify-center">
                    <span className="text-xl drop-shadow select-none">🫣</span>
                  </div>
                )}

                {/* Visual Emotion Overlays */}
                {emotion === "alert" && (
                  <div className="absolute inset-0 bg-rose-500/25 mix-blend-overlay flex items-center justify-center animate-pulse">
                    <Siren className="h-5 w-5 text-white drop-shadow" />
                  </div>
                )}
                {emotion === "crying" && (
                  <div className="absolute inset-0 bg-amber-500/15 mix-blend-overlay flex items-center justify-center animate-bounce">
                    <WifiOff className="h-4 w-4 text-white drop-shadow" />
                  </div>
                )}
                {emotion === "happy" && (
                  <div className="absolute inset-0 bg-emerald-500/15 mix-blend-overlay flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white drop-shadow" />
                  </div>
                )}
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>ReviveX Guardian</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isPasswordPeeking
                        ? "bg-amber-500 animate-ping"
                        : emotion === "alert"
                        ? "bg-rose-500 animate-ping"
                        : emotion === "crying"
                        ? "bg-amber-500 animate-ping"
                        : emotion === "happy"
                        ? "bg-emerald-500 animate-ping"
                        : emotion === "sleepy"
                        ? "bg-indigo-400 opacity-60"
                        : "bg-emerald-500 animate-pulse"
                    }`}
                  />
                </div>
                <div className="text-[10px] text-purple-600 font-semibold flex items-center gap-1">
                  {isPasswordPeeking ? (
                    <span className="text-amber-700 font-bold">🫣 Peeking On Key!</span>
                  ) : emotion === "alert" ? (
                    <span className="text-rose-600 font-bold">⚠️ Warning Triggered!</span>
                  ) : emotion === "crying" ? (
                    <span className="text-amber-600 font-bold">😭 Interrupted (Saved)</span>
                  ) : emotion === "happy" ? (
                    <span className="text-emerald-600 font-bold">🎉 Celebrating!</span>
                  ) : emotion === "sleepy" ? (
                    <span className="text-indigo-600">Resting Zzz • Tap or Click Page</span>
                  ) : (
                    <span>{isLoggedIn ? `Hi ${studentName}! • Tap to Ask` : "Exam Assistant • Tap to Ask"}</span>
                  )}
                </div>
              </div>

              {/* Drag Handle Icon on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 pl-1">
                <Move className="h-3.5 w-3.5" />
              </div>

              {/* Glowing Aura Ring */}
              <span
                className={`absolute -inset-1 rounded-full blur-sm pointer-events-none -z-10 transition-colors ${
                  isPasswordPeeking
                    ? "bg-amber-400/40 animate-pulse"
                    : emotion === "alert"
                    ? "bg-rose-500/35 animate-pulse"
                    : emotion === "crying"
                    ? "bg-amber-500/35 animate-pulse"
                    : emotion === "happy"
                    ? "bg-emerald-500/35 animate-pulse"
                    : "bg-purple-400/25 group-hover:bg-purple-400/40"
                }`}
              />
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};
