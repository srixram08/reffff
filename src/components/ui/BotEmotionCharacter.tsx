"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  Sparkles,
  WifiOff,
  Move,
  Eye,
  Activity,
  Zap,
  Flame,
  Laugh,
  Lock,
  KeyRound,
  MousePointer2
} from "lucide-react";
import { botAudio } from "@/lib/botAudio";

export type BotEmotionState = "normal" | "crying" | "happy" | "thinking" | "alert" | "playful" | "peeking";

interface BotEmotionCharacterProps {
  emotion?: BotEmotionState;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showStatusBadge?: boolean;
  customStatusText?: string;
  isInteractive?: boolean;
  enableRoaming?: boolean;
  onEmotionChange?: (newEmotion: BotEmotionState) => void;
}

export const BotEmotionCharacter: React.FC<BotEmotionCharacterProps> = ({
  emotion: externalEmotion = "normal",
  size = "lg",
  className = "",
  showStatusBadge = true,
  customStatusText,
  isInteractive = true,
  enableRoaming = true,
  onEmotionChange
}) => {
  // Current active emotion (can be driven by external props or internal autonomous triggers)
  const [internalEmotion, setInternalEmotion] = useState<BotEmotionState>(externalEmotion);
  const emotion = externalEmotion !== "normal" ? externalEmotion : internalEmotion;

  const [isHovered, setIsHovered] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [playfulSpeech, setPlayfulSpeech] = useState<string | null>(null);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0, rotate: 0 });

  // Free movement & click-to-summon coordinates
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [summonBeacon, setSummonBeacon] = useState<{ x: number; y: number } | null>(null);

  // Password Peeking State
  const [isPasswordPeeking, setIsPasswordPeeking] = useState(false);
  const [passwordKeystrokes, setPasswordKeystrokes] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-44 h-44",
    lg: "w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80",
    xl: "w-80 h-80 sm:w-96 sm:h-96",
  }[size];

  // Image source based on emotion
  const getImageSrc = () => {
    switch (emotion) {
      case "crying":
        return "/revivex_bot_crying.jpg";
      case "happy":
      case "playful":
      case "peeking":
        return "/revivex_bot_happy.jpg";
      case "alert":
        return "/revivex_bot_crying.jpg";
      case "normal":
      case "thinking":
      default:
        return "/revivex_ai_bot.jpg";
    }
  };

  // 1. Playful cursor tracking: Bot's eyes and head subtly follow cursor
  useEffect(() => {
    if (!isInteractive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - botCenterX;
      const deltaY = e.clientY - botCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 700) {
        const clampX = Math.max(-14, Math.min(14, deltaX / 25));
        const clampY = Math.max(-10, Math.min(10, deltaY / 30));
        const clampRotate = Math.max(-6, Math.min(6, deltaX / 40));
        setCursorOffset({ x: clampX, y: clampY, rotate: clampRotate });
      } else {
        setCursorOffset({ x: 0, y: 0, rotate: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInteractive]);

  // 2. CLICK ANYWHERE ON THE PAGE TO SUMMON THE ROBOT OVER!
  useEffect(() => {
    if (!enableRoaming || typeof window === "undefined") return;

    const handleDocumentClick = (e: MouseEvent) => {
      // Don't move if clicking inside the bot itself or interactive elements like buttons/inputs
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        return;
      }
      if (isDragging) return;

      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        return; // Password focus handler handles this!
      }

      // Record initial origin on first click
      if (!initialPosRef.current && containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        initialPosRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }

      // Show summon beacon at click coordinates
      setSummonBeacon({ x: e.clientX, y: e.clientY });
      setTimeout(() => setSummonBeacon(null), 900);

      // Move robot to clicked position
      if (containerRef.current) {
        const botRect = containerRef.current.getBoundingClientRect();
        // Compute delta from original starting center
        const originX = initialPosRef.current ? initialPosRef.current.x : (botRect.left - coords.x + botRect.width / 2);
        const originY = initialPosRef.current ? initialPosRef.current.y : (botRect.top - coords.y + botRect.height / 2);

        const deltaX = e.clientX - originX;
        const deltaY = e.clientY - originY;

        setCoords({ x: deltaX, y: deltaY });
        botAudio.playChatPop();

        const summonPhrases = [
          "🐾 Coming over to your click!",
          "✨ Swooping right here!",
          "👀 Checking out this area for you!",
          "🚀 Personal guardian standing by!",
          "👋 Right beside you!"
        ];
        setPlayfulSpeech(summonPhrases[Math.floor(Math.random() * summonPhrases.length)]);
        setTimeout(() => setPlayfulSpeech(null), 3500);
      }
    };

    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, [enableRoaming, isDragging, coords]);

  // 3. AUTONOMOUS GENTLE ROAMING AROUND THE WEB PAGE
  useEffect(() => {
    if (!enableRoaming || typeof window === "undefined" || isDragging || isPasswordPeeking) return;

    const wanderTimer = setInterval(() => {
      // Random gentle drift around current area
      const randomOffsetX = (Math.random() - 0.5) * 160;
      const randomOffsetY = (Math.random() - 0.5) * 80;

      setCoords((prev) => ({
        x: prev.x + randomOffsetX,
        y: prev.y + randomOffsetY
      }));
    }, 7500);

    return () => clearInterval(wanderTimer);
  }, [enableRoaming, isDragging, isPasswordPeeking]);

  // 4. PASSWORD PEEKING: FLIES TO PASSWORD INPUT & COVERS EYES / PEEKS PLAYFULLY!
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        setIsPasswordPeeking(true);
        setInternalEmotion("peeking");
        botAudio.playChatPop();

        // Calculate location of password field and fly right next to it!
        if (containerRef.current) {
          const targetRect = target.getBoundingClientRect();
          const botRect = containerRef.current.getBoundingClientRect();

          const originX = initialPosRef.current ? initialPosRef.current.x : (botRect.left - coords.x + botRect.width / 2);
          const originY = initialPosRef.current ? initialPosRef.current.y : (botRect.top - coords.y + botRect.height / 2);

          // Fly next to or directly above the password box
          const destX = targetRect.right + 120;
          const destY = targetRect.top - 40;

          setCoords({
            x: destX - originX,
            y: destY - originY
          });

          setPlayfulSpeech("🫣 Shhh! I'm covering my eyes! Password privacy secured by ED25519!");
        }
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        setIsPasswordPeeking(false);
        setInternalEmotion("happy");
        setPlayfulSpeech("🛡️ Credentials secured! Sealed into SHA-256 HMAC.");
        setTimeout(() => {
          setInternalEmotion("normal");
          setPlayfulSpeech(null);
        }, 4000);
      }
    };

    const handlePasswordInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && target.getAttribute("type") === "password") {
        setPasswordKeystrokes((k) => k + 1);
        botAudio.playChatPop();

        const peekThoughts = [
          "🫣 Peeking through my fingers! Super strong password!",
          "🙈 No peeking! Secret credentials encrypted!",
          "🤫 Shhh! Encrypting keystroke with SHA-256!",
          "🔐 Zero password leakage guaranteed!"
        ];
        setPlayfulSpeech(peekThoughts[Math.floor(Math.random() * peekThoughts.length)]);
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
  }, [coords]);

  // 5. Handle playful poke on clicking the bot
  const handlePoke = () => {
    if (!isInteractive) return;
    setPokeCount((c) => c + 1);
    botAudio.playChatPop();

    const playfulLines = [
      "👋 Hehe! That tickles! I'm your Personal Exam Guardian!",
      "✨ Waving at you! Click anywhere on the webpage and I'll fly there!",
      "🤖 Telemetry active at 100Hz! Zero byte loss guaranteed!",
      "⚡ Try disconnecting your Wi-Fi to watch me cry!",
      "🚀 Drag me anywhere or click to summon me!",
      "🎉 You're doing amazing! Academic integrity protected!"
    ];

    const randomLine = playfulLines[pokeCount % playfulLines.length];
    setPlayfulSpeech(randomLine);

    setTimeout(() => {
      setPlayfulSpeech(null);
    }, 4500);
  };

  return (
    <>
      {/* Visual Ripple Beacon when clicking on page to summon robot */}
      <AnimatePresence>
        {summonBeacon && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: summonBeacon.x - 24,
              top: summonBeacon.y - 24,
              zIndex: 9999,
              pointerEvents: "none"
            }}
            className="w-12 h-12 rounded-full border-2 border-purple-500 bg-purple-400/25 flex items-center justify-center text-xs shadow-lg shadow-purple-500/40"
          >
            <span className="text-base select-none">🐾</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className={`relative flex flex-col items-center select-none ${className}`}
      >
        {/* Floating Playful Speech Bubble */}
        <AnimatePresence>
          {playfulSpeech && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.85 }}
              className={`absolute -top-16 z-30 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border shadow-xl text-xs font-semibold text-purple-900 pointer-events-none max-w-xs text-center ${
                isPasswordPeeking ? "border-amber-400 ring-2 ring-amber-300" : "border-purple-200"
              }`}
            >
              <span>{playfulSpeech}</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-purple-200 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Human-like Animated Body Container with Spring Physics */}
        <motion.div
          drag
          dragElastic={0.15}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            setCoords((prev) => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y
            }));
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePoke}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            x: coords.x + cursorOffset.x,
            y: coords.y + cursorOffset.y + (isPasswordPeeking ? (passwordKeystrokes % 2 === 0 ? -4 : 4) : 0),
            rotate: cursorOffset.rotate,
          }}
          transition={{
            type: "spring",
            stiffness: isPasswordPeeking ? 220 : 160,
            damping: 18,
            mass: 0.8
          }}
          className={`relative ${sizeClasses} rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm cursor-grab active:cursor-grabbing ${
            isPasswordPeeking
              ? "border-amber-400 shadow-amber-500/40 ring-4 ring-amber-300"
              : emotion === "crying"
              ? "border-amber-400 shadow-amber-500/30"
              : emotion === "happy" || emotion === "playful"
              ? "border-purple-400 shadow-purple-500/40"
              : emotion === "thinking"
              ? "border-indigo-400 shadow-indigo-500/30"
              : "border-white/90 shadow-indigo-900/15"
          }`}
        >
          <Image
            src={getImageSrc()}
            alt={`ReviveX AI Bot - ${emotion}`}
            fill
            sizes="(max-width: 768px) 256px, 320px"
            className="object-cover object-center transition-all duration-300"
            priority
          />

          {/* Peek-a-boo Eye Hands Overlay when peeking on password */}
          {isPasswordPeeking && (
            <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay flex items-center justify-center animate-bounce">
              <span className="text-3xl select-none drop-shadow">🫣</span>
            </div>
          )}

          {/* Emotion Overlay FX: Crying Animated Tears / Sparks */}
          {emotion === "crying" && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-amber-500/20 via-transparent to-rose-500/15 mix-blend-overlay">
              <div className="absolute top-2 left-4 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg animate-pulse">
                <WifiOff className="h-3.5 w-3.5" />
                <span>NETWORK DISCONNECTED • CRYING</span>
              </div>
            </div>
          )}

          {/* Emotion Overlay FX: Happy Confetti & Sparkles */}
          {(emotion === "happy" || emotion === "playful") && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-500/20 via-transparent to-emerald-400/15">
              <div className="absolute top-2 right-4 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>SUBMISSION SECURED • HAPPY</span>
              </div>
            </div>
          )}

          {/* Thinking Overlay FX: Pulsing analysis ring */}
          {emotion === "thinking" && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-indigo-500/15 via-transparent to-purple-400/10 flex items-center justify-center">
              <div className="absolute top-2 left-4 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span>ANALYZING TELEMETRY</span>
              </div>
            </div>
          )}

          {/* Hover Hint Overlay */}
          {isHovered && (
            <div className="absolute bottom-2 inset-x-0 mx-auto w-fit px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium flex items-center gap-1 opacity-90 transition-opacity">
              <Move className="h-2.5 w-2.5" />
              <span>Click to poke • Click anywhere to call me</span>
            </div>
          )}
        </motion.div>

        {/* Floating Status Pill Indicator */}
        {showStatusBadge && (
          <div
            className={`mt-4 px-4 py-2 rounded-full border shadow-md flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
              isPasswordPeeking
                ? "bg-amber-100 border-amber-300 text-amber-950 shadow-amber-200"
                : emotion === "crying"
                ? "bg-rose-50/95 border-rose-300 text-rose-900 shadow-rose-200"
                : emotion === "happy" || emotion === "playful"
                ? "bg-emerald-50/95 border-emerald-300 text-emerald-900 shadow-emerald-200"
                : emotion === "thinking"
                ? "bg-indigo-50/95 border-indigo-300 text-indigo-900 shadow-indigo-200"
                : "bg-white/95 border-purple-200/80 text-purple-900 shadow-purple-100"
            }`}
          >
            {isPasswordPeeking ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>
                  {customStatusText || "🫣 Peeking On Password! (Covering Eyes For Privacy)"}
                </span>
              </>
            ) : emotion === "crying" ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span>
                  {customStatusText || "Network Interrupted! (Crying, but 100% saved in IndexedDB 🛡️)"}
                </span>
              </>
            ) : emotion === "happy" || emotion === "playful" ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>
                  {customStatusText || "Exam Submitted! Happy Guardian Celebration 🎉"}
                </span>
              </>
            ) : emotion === "thinking" ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
                <span>
                  {customStatusText || "Analyzing Keystroke Stream • 100Hz Active"}
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>
                  {customStatusText || "Autonomous Guardian: 100Hz Active"}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
