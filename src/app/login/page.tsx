"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  User, 
  BookOpen, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Cpu,
  Play,
  GraduationCap,
  Bot
} from "lucide-react";
import { STUDENTS_DATA, getStoredStudents, StudentProfile } from "@/lib/examStore";
import { BotEmotionCharacter } from "@/components/ui/BotEmotionCharacter";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get("role") as "student" | "teacher" | "admin" | "proctor" | null;
  const intentParam = searchParams.get("intent");
  const studentParam = searchParams.get("id");

  const [activeRole, setActiveRole] = useState<"student" | "teacher" | "admin" | "proctor">(
    roleParam || "student"
  );
  
  // Dynamic Students Roster (includes candidates enrolled by teacher)
  const [students, setStudents] = useState<Record<string, StudentProfile>>(STUDENTS_DATA);

  // Student selection (Alex Chen by default, or URL parameter)
  const [selectedStudentId, setSelectedStudentId] = useState(
    studentParam && STUDENTS_DATA[studentParam] ? studentParam : "STU-84920"
  );

  // Credentials form
  const [email, setEmail] = useState(
    STUDENTS_DATA[selectedStudentId]?.email || "alex.chen@stanford.edu"
  );
  const [password, setPassword] = useState("••••••••••••");

  useEffect(() => {
    const loaded = getStoredStudents();
    setStudents(loaded);
    if (studentParam && loaded[studentParam]) {
      setSelectedStudentId(studentParam);
      setEmail(loaded[studentParam].email);
    }

    const handleSync = () => {
      const updated = getStoredStudents();
      setStudents(updated);
    };
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, [studentParam]);

  useEffect(() => {
    if (roleParam) {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleChange = (role: "student" | "teacher" | "admin" | "proctor") => {
    setActiveRole(role);
    if (role === "student") {
      const curr = students[selectedStudentId] || STUDENTS_DATA[selectedStudentId];
      setEmail(curr?.email || "alex.chen@stanford.edu");
    } else if (role === "teacher") {
      setEmail("robert.sterling@university.edu");
    } else if (role === "admin") {
      setEmail("eleanor.vance@governance.edu");
    } else {
      setEmail("lead.proctor@revivex.network");
    }
  };

  const handleStudentSelect = (stuId: string) => {
    setSelectedStudentId(stuId);
    const stu = students[stuId] || STUDENTS_DATA[stuId];
    setEmail(stu?.email || "");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "student") {
      router.push(`/student?id=${selectedStudentId}`);
    } else if (activeRole === "teacher") {
      router.push("/teacher");
    } else if (activeRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard?userId=PROCTOR-01");
    }
  };

  const currentStudent = students[selectedStudentId] || STUDENTS_DATA[selectedStudentId] || STUDENTS_DATA["STU-84920"];
  const isExamIntent = intentParam === "exam";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF] text-[#1E1B4B] flex flex-col justify-between font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden">
      
      {/* Ambient Violet Cones & Pulsing Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-200/50 via-purple-200/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-purple-200 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-xl">🤖</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-[#1E1B4B] leading-none">
              ReviveX <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-purple-600 font-sans mt-0.5 font-bold">
              Authentication Gateway
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-purple-600 transition-colors px-3 py-1.5 rounded-full hover:bg-white/80 border border-transparent hover:border-purple-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Login Area with Playful Personal Exam Guardian Robot */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 z-10 flex flex-col lg:flex-row items-center justify-center gap-10">
        
        {/* The Real Big Robot Mascot (Peeks on Password & Roams to click!) */}
        <div className="flex flex-col items-center shrink-0">
          <BotEmotionCharacter
            size="md"
            enableRoaming={true}
            customStatusText="Personal Guardian on Duty • Peeking on Password!"
          />
          <div className="mt-3 text-[11px] text-purple-700 font-semibold text-center max-w-[220px]">
            🤖 <em>Personal Exam Guardian</em>: Click anywhere to summon me, or focus password to watch me peek!
          </div>
        </div>

        {/* Main Login Card */}
        <div className="w-full max-w-xl rounded-3xl border border-purple-100 bg-white/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-purple-900/5 space-y-6">
          
          {/* Examee Pod Launch Initialized Notification Banner */}
          {isExamIntent && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3.5 text-left animate-in fade-in slide-in-from-top-2 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <Play className="h-5 w-5 fill-current" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-sm text-[#1E1B4B] flex items-center gap-2">
                  <span>Examee Pod Launch Initialized</span>
                  <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Select your candidate profile below to enter your protected exam pod.
                </div>
              </div>
            </div>
          )}

          {/* Title & Guardian Bot Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700">
              <Bot className="h-3.5 w-3.5 text-purple-600" />
              <span>ReviveX AI Zero-Trust Identity</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
              Institutional Access Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isExamIntent
                ? "Choose your student persona to enter the autonomous exam environment."
                : "Select your academic role to proceed with verified session keys."}
            </p>
          </div>

          {/* 4 Role Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-purple-50/70 border border-purple-100">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeRole === "student"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md"
                  : "text-slate-600 hover:text-purple-700 hover:bg-white/60"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("teacher")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeRole === "teacher"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md"
                  : "text-slate-600 hover:text-purple-700 hover:bg-white/60"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeRole === "admin"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md"
                  : "text-slate-600 hover:text-purple-700 hover:bg-white/60"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("proctor")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeRole === "proctor"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md"
                  : "text-slate-600 hover:text-purple-700 hover:bg-white/60"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Proctor</span>
            </button>
          </div>

          {/* Student Persona Picker (When role === student) */}
          {activeRole === "student" && (
            <div className="space-y-3 border-t border-purple-50 pt-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-purple-900 uppercase tracking-wider">
                  Choose Preferred Candidate Profile:
                </label>
                <span className="text-[11px] text-slate-500">
                  Selected: <strong className="text-purple-950">{currentStudent.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(students).map((stu) => {
                  const isSelected = selectedStudentId === stu.id;
                  return (
                    <button
                      key={stu.id}
                      type="button"
                      onClick={() => handleStudentSelect(stu.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-500 bg-purple-50/90 text-purple-950 ring-2 ring-purple-400 shadow-sm"
                          : "border-purple-100 bg-white text-slate-600 hover:border-purple-300 hover:bg-purple-50/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs border border-purple-200">
                          {stu.avatarInitials}
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-white text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                          {stu.gpa}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">{stu.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{stu.candidateNumber}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{stu.university.split(" ")[0]} • {stu.department.split(" ")[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Institutional Email / Identity Token
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-purple-200 bg-purple-50/40 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-inner"
                placeholder="identity@university.edu"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Cryptographic Key / Password
                </label>
                <span className="text-[10px] text-purple-600 font-semibold cursor-pointer hover:underline">
                  Auto-Signed via ED25519
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-purple-200 bg-purple-50/40 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-inner"
                placeholder="••••••••••••"
              />
            </div>

            {/* Launch CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bot-pill-btn py-3.5 px-6 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold shadow-lg shadow-indigo-500/25 group cursor-pointer"
              >
                <span>
                  {activeRole === "student"
                    ? `Launch Exam Pod as ${currentStudent.name}`
                    : activeRole === "teacher"
                    ? "Enter Teacher Studio"
                    : activeRole === "admin"
                    ? "Access Governance Hub"
                    : "Enter Proctor Console"}
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Bottom Security Footer */}
          <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
              ReviveX Cryptographic Trust Architecture
            </span>
            <span className="font-mono text-purple-700 font-semibold">
              TLS 1.3 • HMAC-SHA256
            </span>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="px-6 py-4 max-w-7xl mx-auto w-full text-center text-xs text-slate-500 z-10">
        © 2026 ReviveX Platform. Autonomous Resilient Online Examination Protocol.
      </footer>

      {/* Floating ReviveX AI Bot Widget */}
      <ReviveXBotWidget />

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center font-mono text-xs text-purple-700">
        Initializing ReviveX Gateway...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
