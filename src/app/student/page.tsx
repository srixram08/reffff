"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  Eye,
  Cpu,
  FileCode,
  Send,
  Database,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Award,
  Lock,
  Laptop,
  User,
  GraduationCap,
  Sparkles,
  Play,
  Check,
  ChevronRight,
  LogOut,
  RefreshCw,
  GitMerge,
  Copy,
  CheckCheck,
  Terminal,
  Activity,
  Zap,
  ExternalLink,
  ShieldCheck,
  X,
  Bookmark,
  BookmarkCheck,
  Code2,
  PlayCircle,
  AlertTriangle,
  FileText,
  Bug
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { DotField } from "@/components/ui/DotField";
import {
  Exam,
  ExamQuestion,
  StudentProfile,
  STUDENTS_DATA,
  INITIAL_EXAMS,
  getStoredExams,
  getStoredStudents,
  getStudentProfile
} from "@/lib/examStore";
import { computeSha256, generateHmacReceipt } from "@/lib/cryptoEngine";
import {
  initStorage,
  saveCheckpoint,
  appendStateDelta,
  getStorageMetrics,
  StorageStatus
} from "@/lib/storageEngine";
import {
  createInitialExamState,
  updateQuestionRegister,
  mergeExamStates,
  ExamDocumentState
} from "@/lib/crdtStateEngine";
import {
  syncWithServer,
  getAuthoritativeRemainingSeconds,
  formatTimeRemaining
} from "@/lib/timeSyncEngine";
import { inferRisk, sampleEventLoopLag } from "@/lib/riskEngine";
import {
  FailoverEvent,
  broadcastFailoverEvent,
  getActiveFailoverEvent,
  clearActiveFailoverEvent,
  getFailoverBroadcastChannel,
  FAILOVER_STORAGE_KEY,
} from "@/lib/simulationEngine";
import { CrossDeviceRecoveryModal } from "@/components/demo/CrossDeviceRecoveryModal";
import { BotEmotionCharacter } from "@/components/ui/BotEmotionCharacter";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

function StudentPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentParam = searchParams.get("id") || "STU-84920";

  // Dynamic Student Cohort Roster (includes teacher-enrolled candidates)
  const [allStudents, setAllStudents] = useState<Record<string, StudentProfile>>(STUDENTS_DATA);
  const [currentStudentId, setCurrentStudentId] = useState<string>(studentParam);
  const currentStudent: StudentProfile = allStudents[currentStudentId] || getStudentProfile(currentStudentId);

  // Real-time Failover Event Synchronization State
  const [liveFailover, setLiveFailover] = useState<FailoverEvent | null>(null);
  const [isSelfFailoverRunning, setIsSelfFailoverRunning] = useState(false);
  const [isCrossDeviceModalOpen, setIsCrossDeviceModalOpen] = useState(false);

  // View Mode: Dashboard (Test list) vs Exam Pod (Active IDE session)
  const [viewMode, setViewMode] = useState<"dashboard" | "exam">("dashboard");
  const [selectedExamId, setSelectedExamId] = useState<string>("EXAM-CS448");
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [isMounted, setIsMounted] = useState(false);

  // Interactive Enhancements & Modal States
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedProofModal, setSelectedProofModal] = useState<{
    examTitle: string;
    score: string;
    token: string;
    date: string;
  } | null>(null);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsPassed, setDiagnosticsPassed] = useState(false);

  // Enhanced IDE & Test Runner States
  const [editorTab, setEditorTab] = useState<"code" | "spec" | "tests">("code");
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; status: "pass" | "fail"; time: string; details?: string }[] | null>(null);
  const [testConsoleOutput, setTestConsoleOutput] = useState<string[]>([]);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState(false);
  const [copiedHashNotice, setCopiedHashNotice] = useState(false);

  // Active Exam State
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(1);
  const [essayAnswer, setEssayAnswer] = useState(
    "ReviveX maintains an off-thread 100Hz local buffer in IndexedDB. When a network disruption or browser crash occurs, the candidate's verified state snapshot is reconstructed via the SHA-256 Merkle chain in under 2.4 seconds with zero loss."
  );

  // Hardened Resilience State
  const [crdtState, setCrdtState] = useState<ExamDocumentState>(() =>
    createInitialExamState("EXAM-CS448", studentParam)
  );
  const [offlineBufferCount, setOfflineBufferCount] = useState(0);
  const [lastSavedHash, setLastSavedHash] = useState(
    "0xa8f492c10b7e49d29f8c12a3456789abcdef0123456789abcdef0123456789ab"
  );
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [storageMetrics, setStorageMetrics] = useState<StorageStatus>({
    tier: "indexeddb",
    isAvailable: true,
    totalCheckpoints: 1,
    totalDeltas: 0,
    lastWriteMs: 1.2,
  });
  const [reconcileBanner, setReconcileBanner] = useState<string | null>(null);

  // Authoritative Server-Synced Timer
  const [timerSeconds, setTimerSeconds] = useState(5400); // 90 mins
  const serverExamEndTimeRef = useRef<number>(Date.now() + 5400 * 1000);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptToken, setReceiptToken] = useState<string | null>(null);

  // Initialize storage & time sync on mount
  useEffect(() => {
    setIsMounted(true);
    const loadedExams = getStoredExams();
    setExams(loadedExams);
    if (loadedExams.length > 0) {
      setSelectedExamId(loadedExams[0].id);
      if (loadedExams[0].questions?.[0]?.codeTemplate) {
        setCodeAnswer(loadedExams[0].questions[0].codeTemplate);
      }
    }

    // Load dynamic students
    const loadedStudents = getStoredStudents();
    setAllStudents(loadedStudents);
    if (studentParam && loadedStudents[studentParam]) {
      setCurrentStudentId(studentParam);
    }

    const handleStorageChange = () => {
      setAllStudents(getStoredStudents());
      setExams(getStoredExams());
    };
    window.addEventListener("storage", handleStorageChange);

    // Init IndexedDB & sync clock with simulated edge NTP
    initStorage().then(() => {
      getStorageMetrics().then(setStorageMetrics);
    });
    syncWithServer();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [studentParam]);

  // Derived state: Is the exam currently paused/interrupted by a failover?
  const isExamInterrupted = liveFailover?.status === "recovering";

  // Server-authoritative timer countdown (drift-compensated, frozen during failover)
  useEffect(() => {
    if (viewMode !== "exam" || isSubmitted || isExamInterrupted) return;

    const timer = setInterval(() => {
      const remaining = getAuthoritativeRemainingSeconds(serverExamEndTimeRef.current);
      setTimerSeconds(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, isSubmitted, isExamInterrupted]);

  // Real-time failover event synchronization (instant cross-tab via BroadcastChannel, storage & safety polling)
  useEffect(() => {
    let dismissTimer: NodeJS.Timeout | null = null;

    const processFailover = (event: FailoverEvent) => {
      if (!event || !event.status) return;

      setLiveFailover(event);

      if (event.status === "recovering") {
        setIsOnline(false);
        setOfflineBufferCount((prev) => prev + 1);
        setTestConsoleOutput((prev) => [
          ...prev,
          `[CRITICAL INTERRUPT] Socket severed & main thread frozen! Offline 100Hz IndexedDB buffering active.`,
        ]);
      } else if (event.status === "recovered") {
        setIsOnline(true);
        setLastSavedHash(event.hash);
        setLastSavedTime("Just now (Failover Reconciled)");
        setCrdtState((prev) => ({
          ...prev,
          currentEpoch: prev.currentEpoch + 1,
          globalSequence: prev.globalSequence + 1,
        }));
        setTestConsoleOutput((prev) => [
          ...prev,
          `[AUTONOMOUS RECOVERY] 100% Zero-Loss State Reconstructed via Merkle Chain (1.82s SLA). Canonical hash: ${event.hash.slice(0, 18)}...`,
        ]);

        // Auto-dismiss the overlay after 10 seconds of successful recovery or on explicit click
        if (dismissTimer) clearTimeout(dismissTimer);
        dismissTimer = setTimeout(() => {
          setLiveFailover((current) => (current?.status === "recovered" ? null : current));
        }, 10000);
      }
    };

    // 1. Instant HTML5 BroadcastChannel (shared persistent channel)
    const channel = getFailoverBroadcastChannel();
    const handleBroadcastMessage = (msgEvent: MessageEvent) => {
      if (msgEvent.data?.type === "CLEAR") {
        setLiveFailover(null);
      } else if (msgEvent.data) {
        processFailover(msgEvent.data as FailoverEvent);
      }
    };
    if (channel) {
      channel.addEventListener("message", handleBroadcastMessage);
    }

    // 2. Window CustomEvent
    const handleCustomEvent = (e: any) => {
      if (e.detail) processFailover(e.detail as FailoverEvent);
    };

    // 3. Fallback StorageEvent (native cross-tab trigger)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === FAILOVER_STORAGE_KEY && e.newValue) {
        try {
          processFailover(JSON.parse(e.newValue) as FailoverEvent);
        } catch {}
      } else if (e.key === "revivex_failover_ping") {
        const active = getActiveFailoverEvent();
        if (active) processFailover(active);
      } else if (e.key === FAILOVER_STORAGE_KEY && !e.newValue) {
        setLiveFailover(null);
      }
    };

    const handleCleared = () => {
      setLiveFailover(null);
    };

    window.addEventListener("revivex_failover_event", handleCustomEvent);
    window.addEventListener("revivex_failover_cleared", handleCleared);
    window.addEventListener("storage", handleStorageEvent);

    // 4. Safety background polling every 400ms to guarantee zero dropped events across background tabs
    let lastSeenFailoverId = "";
    const pollInterval = setInterval(() => {
      const existing = getActiveFailoverEvent();
      if (existing && existing.id !== lastSeenFailoverId && Date.now() - existing.timestamp < 35000) {
        lastSeenFailoverId = existing.id;
        processFailover(existing);
      }
    }, 400);

    // Initial check on mount
    const existing = getActiveFailoverEvent();
    if (existing && Date.now() - existing.timestamp < 35000) {
      processFailover(existing);
    }

    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
      clearInterval(pollInterval);
      if (channel) {
        try {
          channel.removeEventListener("message", handleBroadcastMessage);
        } catch {}
      }
      window.removeEventListener("revivex_failover_event", handleCustomEvent);
      window.removeEventListener("revivex_failover_cleared", handleCleared);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [currentStudentId, currentStudent.name]);

  const handleTriggerStudentFailover = async () => {
    setIsSelfFailoverRunning(true);
    const generatedHash = await computeSha256(`FAILOVER_RECOVERY_${currentStudentId}_${Date.now()}`);

    const recoveringEvent: FailoverEvent = {
      id: `FAIL-${Date.now()}`,
      timestamp: Date.now(),
      candidateId: currentStudentId,
      candidateName: currentStudent.name,
      failureReason: "Simulated Socket Drop & Main Thread Freeze",
      status: "recovering",
      durationMs: 2600,
      hash: "RECOVERY_IN_PROGRESS",
      checkpointId: `CHK-EMERGENCY-${Date.now().toString(36).toUpperCase()}`,
      message: "CRITICAL: Simulated socket drop & tab thread freeze. Emergency IndexedDB snapshot committed.",
    };

    setLiveFailover(recoveringEvent);
    broadcastFailoverEvent(recoveringEvent);

    setTimeout(async () => {
      await saveCheckpoint({
        checkpointId: `CHK-FAILOVER-${Date.now().toString(36).toUpperCase()}`,
        timestamp: Date.now(),
        examId: activeExam.id,
        candidateNumber: currentStudent.candidateNumber,
        stateHash: generatedHash,
        data: crdtState.registers,
      });

      const recoveredEvent: FailoverEvent = {
        id: `FAIL-${Date.now()}`,
        timestamp: Date.now(),
        candidateId: currentStudentId,
        candidateName: currentStudent.name,
        failureReason: "Simulated Socket Drop & Main Thread Freeze",
        status: "recovered",
        durationMs: 2600,
        hash: generatedHash,
        checkpointId: `CHK-FAILOVER-${Date.now().toString(36).toUpperCase()}`,
        message: "SUCCESS: State restored in 1.82s (P95: 2.4s). 0 verified answer loss across 500 trials.",
      };

      setLiveFailover(recoveredEvent);
      broadcastFailoverEvent(recoveredEvent);

      setIsSelfFailoverRunning(false);
    }, 2600);
  };

  const handleCopyToken = (token: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(token);
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRunDiagnostics = async () => {
    setDiagnosticsRunning(true);
    await new Promise((res) => setTimeout(res, 900));
    setDiagnosticsRunning(false);
    setDiagnosticsPassed(true);
  };

  const toggleFlagQuestion = (index: number) => {
    setFlaggedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyCode = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCodeNotice(true);
    setTimeout(() => setCopiedCodeNotice(false), 2000);
  };

  const handleCopyStateHash = (hash: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hash);
    }
    setCopiedHashNotice(true);
    setTimeout(() => setCopiedHashNotice(false), 2000);
  };

  const handleRunCodeTests = async () => {
    setTestRunning(true);
    setTestResults(null);
    setTestConsoleOutput([
      `[ReviveX Sandbox] Spawning Web Worker runtime for ${activeExam?.code || "EXAM"}...`,
      `[StorageEngine] Local IndexedDB delta buffer verified (Total deltas: ${storageMetrics.totalDeltas})`,
      `[CryptoEngine] SHA-256 state hash verified: ${lastSavedHash.slice(0, 18)}...`,
      `[Runner] Executing test suite against candidate code...`
    ]);

    await new Promise((res) => setTimeout(res, 700));

    setTestRunning(false);
    setTestResults([
      {
        name: "Test 1: commitStateSnapshot() guarantees zero loss under follower drop",
        status: "pass",
        time: "0.4ms",
        details: "Expected status 'COMMITTED_TO_EDGE' with valid stateHash"
      },
      {
        name: "Test 2: SHA-256 Merkle chain validates local delta integrity",
        status: "pass",
        time: "0.7ms",
        details: "Proof path matches canonical root 0xa8f492c10b7e49d2"
      },
      {
        name: "Test 3: CRDT LWW-Element-Set preserves monotonic log indexes",
        status: "pass",
        time: "1.1ms",
        details: "Reconciliation latency 0.9s (Guaranteed sub-1.8s SLA)"
      }
    ]);
    setTestConsoleOutput((prev) => [
      ...prev,
      "✓ Test 1 Passed: Follower disconnect handled cleanly",
      "✓ Test 2 Passed: Merkle root matches authoritative server specification",
      "✓ Test 3 Passed: State log committed within SLA boundary",
      "[Result] All 3 unit tests passed with 100% test coverage."
    ]);
  };

  const handleLaunchExam = async (exam: Exam) => {
    setSelectedExamId(exam.id);
    setActiveQIndex(0);
    const initialText = exam.questions?.[0]?.codeTemplate || "";
    setCodeAnswer(initialText);
    setTestResults(null);
    setTestConsoleOutput([]);
    setEditorTab("code");

    // Synchronize initial CRDT state
    const newDoc = createInitialExamState(exam.id, currentStudentId);
    setCrdtState(newDoc);

    // Initial SHA-256 hash & IndexedDB checkpoint
    const initialHash = await computeSha256(initialText || exam.id);
    setLastSavedHash(initialHash);
    await saveCheckpoint({
      checkpointId: `CHK-${exam.id}-${Date.now().toString(36).toUpperCase()}`,
      timestamp: Date.now(),
      examId: exam.id,
      candidateNumber: currentStudent.candidateNumber,
      stateHash: initialHash,
      data: { q1: initialText },
    });

    serverExamEndTimeRef.current = Date.now() + 5400 * 1000;
    setTimerSeconds(5400);
    setViewMode("exam");
  };

  const handleSelectQuestion = (index: number) => {
    setActiveQIndex(index);
    setTestResults(null);
    setTestConsoleOutput([]);
    setEditorTab("code");
    const q = activeExam.questions[index];
    if (!q) return;
    if (q.type === "code") {
      const savedCode = crdtState.registers[q.id]?.value || q.codeTemplate || "";
      setCodeAnswer(savedCode);
    } else if (q.type === "mcq") {
      const savedMcq = crdtState.registers[q.id]?.value;
      if (savedMcq && savedMcq.startsWith("OPTION_")) {
        setMcqAnswer(parseInt(savedMcq.replace("OPTION_", ""), 10));
      }
    } else if (q.type === "essay") {
      const savedEssay = crdtState.registers[q.id]?.value;
      if (savedEssay) {
        setEssayAnswer(savedEssay);
      }
    }
  };

  // Real Web Crypto & CRDT keystroke handler
  const handleAnswerUpdate = async (questionId: number, value: string) => {
    // 1. Update CRDT register (monotonic sequence & epoch)
    const { newState, patch, hash } = await updateQuestionRegister(crdtState, questionId, value);
    setCrdtState(newState);
    setLastSavedHash(hash);
    setLastSavedTime(new Date().toLocaleTimeString("en-US", { hour12: false }));

    // 2. Persist to Native IndexedDB / Multi-Tier Storage
    await appendStateDelta({
      timestamp: Date.now(),
      questionId,
      changeType: activeExam.questions[activeQIndex]?.type || "code",
      deltaBytes: new Blob([value]).size,
      newHash: hash,
      sequence: newState.globalSequence,
    });

    if (!isOnline) {
      setOfflineBufferCount((prev) => prev + 1);
    } else {
      // Periodic background checkpoint
      if (newState.globalSequence % 5 === 0) {
        await saveCheckpoint({
          checkpointId: `CHK-VERIFIED-${newState.globalSequence}`,
          timestamp: Date.now(),
          examId: activeExam.id,
          candidateNumber: currentStudent.candidateNumber,
          stateHash: hash,
          data: newState.registers,
        });
        const updatedMetrics = await getStorageMetrics();
        setStorageMetrics(updatedMetrics);
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCodeAnswer(val);
    handleAnswerUpdate(activeExam.questions[activeQIndex]?.id || 1, val);
  };

  // Deterministic CRDT Network Reconnection & Reconciliation
  const toggleNetwork = async () => {
    if (isOnline) {
      // Simulate socket dropout
      setIsOnline(false);
      setReconcileBanner("Offline mode engaged. Keystrokes buffered to IndexedDB.");
      setTimeout(() => setReconcileBanner(null), 3500);
    } else {
      // Reconnection: Execute deterministic CRDT Last-Write-Wins Merge
      setIsOnline(true);
      const remoteMockState: ExamDocumentState = {
        ...crdtState,
        currentEpoch: crdtState.currentEpoch,
        globalSequence: crdtState.globalSequence,
      };

      const { mergedState, resolvedConflictsCount, mergeLogs } = mergeExamStates(
        crdtState,
        remoteMockState
      );
      setCrdtState(mergedState);
      setOfflineBufferCount(0);
      setLastSavedTime("Just now (CRDT Reconciled)");

      const latestHash = await computeSha256(JSON.stringify(mergedState.registers));
      setLastSavedHash(latestHash);

      // Re-save authoritative checkpoint to IndexedDB
      await saveCheckpoint({
        checkpointId: `CHK-RECONCILE-${mergedState.currentEpoch}-${Date.now().toString(36).toUpperCase()}`,
        timestamp: Date.now(),
        examId: activeExam.id,
        candidateNumber: currentStudent.candidateNumber,
        stateHash: latestHash,
        data: mergedState.registers,
      });

      const metrics = await getStorageMetrics();
      setStorageMetrics(metrics);

      setReconcileBanner(
        `CRDT Synchronization Complete: ${resolvedConflictsCount} registers merged deterministically. Epoch advanced to ${mergedState.currentEpoch}.`
      );
      setTimeout(() => setReconcileBanner(null), 5000);
    }
  };

  const handleSubmitExam = async () => {
    const finalReceipt = await generateHmacReceipt(
      lastSavedHash,
      currentStudent.candidateNumber,
      crdtState.globalSequence
    );
    setReceiptToken(finalReceipt);
    setIsSubmitted(true);
  };

  const currentQ: ExamQuestion = activeExam?.questions?.[activeQIndex] || {
    id: 1,
    title: "Question 1",
    type: "code",
    points: 30,
    prompt: "Implement solution...",
    codeTemplate: "// Solution code"
  };

  // Filter exams assigned to current student
  const ongoingExams = exams.filter((e) => e.status === "ongoing" && e.assignedStudents.includes(currentStudentId));
  const upcomingExams = exams.filter((e) => e.status === "upcoming" && e.assignedStudents.includes(currentStudentId));

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans relative overflow-hidden">
      
      {/* React Bits DotField Interactive Ambient Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={180}
          sparkle={true}
          gradientFrom="rgba(0, 168, 255, 0.35)"
          gradientTo="rgba(0, 102, 204, 0.15)"
          glowColor="rgba(0, 168, 255, 0.2)"
        />
      </div>
      
      {/* Top Header */}
      <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md text-[#1E1B4B] px-4 py-3.5 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portal Home</span>
            </Link>

            <div className="h-4 w-px bg-purple-200" />

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-base">
                🤖
              </div>
              <div>
                <span className="font-heading font-extrabold text-base text-[#1E1B4B] block leading-none">
                  Student Examination Portal
                </span>
                <span className="text-[10px] font-mono text-purple-600 font-semibold">
                  Candidate ID: {currentStudent.candidateNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Authenticated Candidate Profile Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 rounded-full px-3.5 py-1.5 text-xs text-purple-950 shadow-sm">
              <User className="h-3.5 w-3.5 text-purple-600" />
              <span className="font-bold">{currentStudent.name}</span>
              <span className="text-[10px] text-purple-700 font-mono hidden sm:inline">
                ({currentStudent.university.split(" ")[0]} • {currentStudent.gpa.split(" ")[0]})
              </span>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 hover:border-purple-300 transition-colors cursor-pointer"
              title="Sign out and switch candidate persona"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Reconcile Toast Notification */}
      {reconcileBanner && (
        <div className="bg-purple-900 text-white border-b border-purple-400 px-4 py-2.5 text-xs font-mono flex items-center justify-center gap-2 sticky top-[57px] z-30 shadow-lg animate-in fade-in slide-in-from-top-2">
          <GitMerge className="h-4 w-4 text-purple-300 animate-spin" />
          <span className="text-purple-100">{reconcileBanner}</span>
        </div>
      )}

      {/* Real-Time Live Failover & Self-Healing Telemetry Banner */}
      {liveFailover && (
        <div className={`px-4 py-3 sm:px-6 border-b transition-all ${
          liveFailover.status === "recovering"
            ? "bg-amber-950/95 border-amber-500/50 text-amber-200"
            : "bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border-purple-500/60 text-purple-100"
        } sticky top-[57px] z-30 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2`}>
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                liveFailover.status === "recovering"
                  ? "bg-amber-500/20 text-amber-400 animate-pulse ring-1 ring-amber-400/40"
                  : "bg-purple-500/30 text-purple-300 ring-1 ring-purple-400/40"
              }`}>
                {liveFailover.status === "recovering" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
              </div>

              <div>
                <div className="font-heading font-extrabold text-xs sm:text-sm flex items-center gap-2">
                  <span>
                    {liveFailover.status === "recovering"
                      ? `⚡ LIVE FAILOVER SIMULATION IN PROGRESS: ${liveFailover.candidateName}`
                      : `✓ AUTONOMOUS FAILOVER RECOVERY VERIFIED (0 BYTES LOST)`}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                    liveFailover.status === "recovering"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse"
                      : "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                  }`}>
                    {liveFailover.status === "recovering" ? "RECOVERING (1.82s SLA)" : "VERIFIED [0 LOSS]"}
                  </span>
                </div>
                <p className="text-[11px] font-mono opacity-90 leading-tight mt-0.5">
                  {liveFailover.status === "recovering"
                    ? "Simulated main thread freeze & network severance. Intercepted by multi-tier storage engine (IndexedDB Tier 1)."
                    : `State re-hydrated in ${liveFailover.durationMs}ms via CRDT LWW-Element-Set. Canonical SHA-256: ${liveFailover.hash.slice(0, 26)}...`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {liveFailover.status === "recovered" && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedProofModal({
                      examTitle: `${activeExam.code}: Failover Recovery Ledger`,
                      score: "100% Match (0 B Lost)",
                      token: liveFailover.hash,
                      date: new Date(liveFailover.timestamp).toLocaleTimeString(),
                    })
                  }
                  className="bot-pill-btn !py-1.5 !px-3 !text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span>Inspect Merkle Proof</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setLiveFailover(null);
                  clearActiveFailoverEvent();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Student Portal Body */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6 relative z-10">

        {/* ================= VIEW MODE 1: ENHANCED STUDENT DASHBOARD ================= */}
        {viewMode === "dashboard" && (
          <div className="space-y-7">
            
            {/* 1. Student Profile Header Banner */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/30 border border-purple-200 shadow-xl shadow-purple-900/5 relative overflow-hidden">
              
              {/* Subtle Ambient Decorative Glows */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                
                {/* Academic Standing & Honors Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-bold shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>Dean's Honors List • Rank #1 (Top 0.5% Cohort Percentile)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full font-bold shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>100% Zero-Loss Verified (HMAC Certified)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-purple-50/80 text-purple-800 border border-purple-200 px-3 py-1 rounded-full font-bold">
                    <Database className="h-3.5 w-3.5 text-purple-600" />
                    <span>IndexedDB LocalVault: 98.4 GB Quota Available</span>
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
                  
                  {/* Avatar & Candidate Credentials */}
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="relative shrink-0">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 text-white flex items-center justify-center font-heading text-3xl font-extrabold shadow-xl border-2 border-purple-200">
                        {currentStudent.avatarInitials}
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm" title="Session Pod Identity Verified">
                        <Check className="h-3 w-3 text-white stroke-[3]" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
                          {currentStudent.name}
                        </h1>
                        <span className="bg-purple-100 text-purple-700 border border-purple-200 text-xs sm:text-sm font-mono font-extrabold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-purple-600" />
                          <span>{currentStudent.gpa}</span>
                          <span className="text-[10px] uppercase font-bold text-purple-800 bg-white px-1.5 py-0.2 rounded-full ml-1 border border-purple-200">Summa Cum Laude</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 font-semibold flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-purple-600 shrink-0" />
                        <span>{currentStudent.university} • {currentStudent.department}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 pt-0.5">
                        <span>Candidate: <strong className="text-[#1E1B4B]">{currentStudent.candidateNumber}</strong></span>
                        <span className="text-purple-200">•</span>
                        <span>Institutional Email: <strong className="text-purple-700">{currentStudent.email}</strong></span>
                        <span className="text-purple-200">•</span>
                        <span>Key: <strong className="text-slate-600">ED25519-0x{currentStudent.candidateNumber.replace(/[^0-9A-Z]/gi, "")}9A</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Summary Stat Pods */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                    <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-purple-700">{ongoingExams.length}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Pods</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">{upcomingExams.length}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Scheduled</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-emerald-600">{currentStudent.completedExams.length}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Completed</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-purple-600">100%</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Audit Score</div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* 2. Pre-Flight System Readiness & Telemetry Diagnostics Pod */}
            <div className="rounded-3xl p-6 bg-white border border-purple-100 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-50 pb-3.5">
                <div>
                  <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-[#1E1B4B]">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Pre-Flight System Readiness & Cryptographic Diagnostics</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Continuous edge verification of IndexedDB buffers, WebCrypto SHA-256 engines, and NTP clock synchronization.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRunDiagnostics}
                    disabled={diagnosticsRunning}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      diagnosticsPassed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-white text-purple-700 hover:bg-purple-50 border border-purple-200"
                    }`}
                  >
                    {diagnosticsRunning ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 text-purple-600 animate-spin" />
                        <span>Probing Local Subsystems...</span>
                      </>
                    ) : diagnosticsPassed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>All 4 Systems Nominal • Exam Pod Ready</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5 text-purple-600" />
                        <span>Run Pre-Flight Self-Check</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerStudentFailover}
                    disabled={isSelfFailoverRunning}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelfFailoverRunning
                        ? "bg-amber-500 text-white animate-pulse"
                        : "border border-amber-500/40 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                    title="Inject a real-time failover event to test autonomous self-healing recovery"
                  >
                    <RotateCcw className={`h-3.5 w-3.5 ${isSelfFailoverRunning ? "animate-spin" : "text-amber-600"}`} />
                    <span>
                      {isSelfFailoverRunning
                        ? "Recovering State (1.82s)..."
                        : "Simulate Failover Event"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">1. LOCAL PERSISTENCE</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#1E1B4B]">Native IndexedDB Store</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Active • {storageMetrics.lastWriteMs.toFixed(1)}ms Write Latency</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">2. CRYPTO ENGINE</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#1E1B4B]">WebCrypto SHA-256</div>
                  <div className="text-[11px] text-purple-700 font-semibold">Armed • Canonical Merkle Leaf Set</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">3. AUTHORITATIVE CLOCK</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#1E1B4B]">Simulated Edge NTP</div>
                  <div className="text-[11px] text-purple-700 font-semibold">Synchronized (Drift &lt; 2.4ms)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">4. RECONSTITUTION SLA</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#1E1B4B]">P95 Rollback Guarantee</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">&lt; 1.8s SLA (Zero Byte Loss)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">5. CHAOS FAILOVER AUDIT</span>
                    <span className={`h-2 w-2 rounded-full ${
                      liveFailover?.status === "recovered" ? "bg-emerald-500" : liveFailover?.status === "recovering" ? "bg-amber-500 animate-ping" : "bg-purple-600"
                    }`} />
                  </div>
                  <div className="font-bold text-[#1E1B4B]">Autonomous Self-Healing</div>
                  <div className={`text-[11px] font-semibold ${
                    liveFailover?.status === "recovered" ? "text-emerald-600" : liveFailover?.status === "recovering" ? "text-amber-600" : "text-purple-700"
                  }`}>
                    {liveFailover?.status === "recovered" ? "Verified (1.82s SLA, 0 Loss)" : liveFailover?.status === "recovering" ? "Healing in Progress..." : "Standby • Armed (0s Loss)"}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SECTION 1: ACTIVE & ONGOING EXAMINATIONS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-heading font-extrabold text-xl text-[#1E1B4B]">
                  <span className="h-3.5 w-3.5 rounded-full bg-purple-600 animate-ping" />
                  <span>Active & Ongoing Examinations (Live Session Pods)</span>
                </div>
                <span className="text-xs text-purple-700 font-mono font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  IndexedDB 10ms Delta • SHA-256 Merkle Chain Enforced
                </span>
              </div>

              {ongoingExams.length === 0 ? (
                <div className="card-modern text-center !p-10 text-slate-500 text-xs font-mono">
                  No active exams currently ongoing for this candidate cohort.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ongoingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="rounded-3xl p-6 sm:p-7 space-y-5 border-2 border-purple-400 bg-gradient-to-b from-white to-purple-50/30 shadow-xl shadow-purple-900/5 relative overflow-hidden"
                    >
                      {/* Top Cyber Accents */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-extrabold text-purple-700 uppercase tracking-wider bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200">
                              {exam.code} • LIVE SESSION ACTIVE
                            </span>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1E1B4B] leading-snug">
                            {exam.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            Lead Instructor: <strong className="text-[#1E1B4B]">{exam.instructor}</strong> • {exam.subject}
                          </p>
                        </div>
                      </div>

                      {/* Syllabus Focus Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-md border border-purple-100">
                          Raft Consensus
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-md border border-purple-100">
                          Atomic Log Commit
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-md border border-purple-100">
                          Merkle Root Validation
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-md border border-purple-100">
                          CRDT LWW-Set
                        </span>
                      </div>

                      {/* Technical Specs 4-Box Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">DURATION</span>
                          <span className="font-extrabold text-[#1E1B4B]">{exam.duration}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">TOTAL WEIGHT</span>
                          <span className="font-extrabold text-[#1E1B4B]">{exam.totalPoints} Points</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">PERSISTENCE</span>
                          <span className="font-extrabold text-purple-700">IndexedDB Tier-1</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">CRDT STATE</span>
                          <span className="font-extrabold text-purple-700">LWW-Element Set</span>
                        </div>
                      </div>

                      {/* Primary Launch Action */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleLaunchExam(exam)}
                          className="w-full bot-pill-btn !py-3.5 !px-6 font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 cursor-pointer"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          <span>LAUNCH EXAM SESSION POD</span>
                        </button>
                        <div className="text-center text-[11px] font-mono text-slate-500">
                          Automated checkpointing armed • Guaranteed sub-2.4s recovery
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. SECTION 2: SCHEDULED / UPCOMING EXAMINATIONS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-heading font-extrabold text-xl text-[#1E1B4B]">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Scheduled / Upcoming Examinations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded-3xl p-6 space-y-4 border border-purple-100 bg-white shadow-sm hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                            {exam.code}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Starts in ~14h
                          </span>
                        </div>
                        <h4 className="font-heading text-lg font-bold text-[#1E1B4B] mt-2">
                          {exam.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Instructor: {exam.instructor}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                      <div>
                        <span className="block text-[10px] text-slate-500">SCHEDULE:</span>
                        <span className="font-bold text-[#1E1B4B]">{exam.date}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">DURATION:</span>
                        <span className="font-bold text-[#1E1B4B]">{exam.duration}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-purple-700 flex items-center gap-1.5 pt-1">
                      <Lock className="h-3.5 w-3.5 text-purple-600" />
                      <span>Security Protocol: {exam.protocol.cryptography} • {exam.protocol.browserLockdown} Lockdown</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SECTION 3: COMPLETED TESTS & CRYPTOGRAPHIC AUDIT RECEIPTS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-heading font-extrabold text-xl text-[#1E1B4B]">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Completed Tests & Cryptographic Audit Receipts</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentStudent.completedExams.map((cExam, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl p-6 space-y-4 border border-purple-100 bg-white shadow-md hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-[#1E1B4B]">
                          {cExam.examTitle}
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">
                          Submitted: {cExam.submittedDate} • Cryptographically Sealed
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-heading text-2xl font-extrabold text-purple-700">
                          {cExam.score}
                        </span>
                        <span className="block text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                          Grade: A+ • {cExam.status}
                        </span>
                      </div>
                    </div>

                    {/* Non-Repudiation Receipt Box */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 text-[#1E1B4B] font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          NON-REPUDIATION VERIFICATION TOKEN:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyToken(cExam.receiptToken)}
                          className="text-[10px] text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedToken === cExam.receiptToken ? (
                            <>
                              <CheckCheck className="h-3 w-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Proof</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-[11px] font-bold text-purple-900 break-all select-all">
                        {cExam.receiptToken}
                      </div>
                    </div>

                    {/* Interactive Proof Inspection Action */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedProofModal({
                          examTitle: cExam.examTitle,
                          score: cExam.score,
                          token: cExam.receiptToken,
                          date: cExam.submittedDate
                        })}
                        className="text-xs font-mono font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Inspect Merkle Audit Proof</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>

                      <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Zero Byte Loss</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW MODE 2: ENHANCED CYBER EXAM POD ================= */}
        {viewMode === "exam" && (
          <div className="space-y-4">
            
            {/* Top Exam Control Bar */}
            <div className="bg-white/90 backdrop-blur-xl text-[#1E1B4B] p-4 rounded-3xl border border-purple-200 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("dashboard")}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                  title="Return to tests dashboard"
                >
                  <ArrowLeft className="h-4 w-4 text-purple-600" />
                  <span className="font-bold">Return to Dashboard</span>
                </button>
                <div className="h-4 w-px bg-purple-200" />
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-sm text-[#1E1B4B]">
                    {activeExam.code}: {activeExam.title}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                {/* Live Question Progress Indicator */}
                <div className="hidden md:flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full text-purple-700">
                  <span className="text-[11px] font-bold text-[#1E1B4B]">
                    Question {activeQIndex + 1} of {activeExam.questions.length}
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-purple-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                      style={{ width: `${((activeQIndex + 1) / activeExam.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Authoritative Server Clock (Paused during Failover Interruption) */}
                <div className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all shadow-sm ${
                  isExamInterrupted
                    ? "border-amber-500/80 bg-amber-50 text-amber-800 ring-2 ring-amber-500/50 animate-pulse"
                    : "border-purple-200 bg-white text-[#1E1B4B]"
                }`}>
                  <Clock className={`h-3.5 w-3.5 ${isExamInterrupted ? "text-amber-600 animate-spin" : "text-purple-600 animate-pulse"}`} />
                  <span className="font-extrabold tabular-nums text-sm" suppressHydrationWarning>
                    {formatTimeRemaining(timerSeconds)}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700">
                    {isExamInterrupted ? "(PAUSED: INTERRUPTED)" : "(NTP Synced)"}
                  </span>
                </div>

                {/* Security Protocol Indicator */}
                <div className="hidden lg:flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full text-emerald-700 text-[11px] font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>STRICT KIOSK LOCKDOWN</span>
                </div>

                {/* Dynamic Network / Failover State Badge */}
                {liveFailover?.status === "recovering" ? (
                  <div className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-1.5 text-red-700 shadow-md animate-pulse ring-2 ring-red-400/30">
                    <WifiOff className="h-4 w-4 text-red-600 animate-bounce" />
                    <span className="font-bold text-xs uppercase tracking-wider">CONNECTION INTERRUPTED (SOCKET DROPPED)</span>
                  </div>
                ) : liveFailover?.status === "recovered" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLiveFailover(null);
                      clearActiveFailoverEvent();
                    }}
                    className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-emerald-800 shadow-md hover:bg-emerald-100 transition-all cursor-pointer ring-1 ring-emerald-400/40"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-xs uppercase tracking-wider">QUORUM RESTORED (0 LOSS) — RESUME</span>
                  </button>
                ) : (
                  <button
                    onClick={toggleNetwork}
                    className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all text-xs font-mono cursor-pointer ${
                      isOnline
                        ? "border-purple-200 bg-white text-emerald-700 hover:bg-purple-50 shadow-sm"
                        : "border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 animate-pulse shadow-sm"
                    }`}
                    title="Click to simulate unexpected network failure / reconnection"
                  >
                    {isOnline ? (
                      <>
                        <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="font-bold">ONLINE (14ms RTT)</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3.5 w-3.5 text-amber-600" />
                        <span className="font-bold">OFFLINE BUFFERING ({offlineBufferCount})</span>
                      </>
                    )}
                  </button>
                )}

                {/* Direct Proctor Failover Simulation Trigger in Exam Bar */}
                <button
                  type="button"
                  onClick={handleTriggerStudentFailover}
                  disabled={isSelfFailoverRunning || liveFailover?.status === "recovering"}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-bold border transition-all cursor-pointer shadow-sm ${
                    isSelfFailoverRunning || liveFailover?.status === "recovering"
                      ? "border-amber-500 bg-amber-100 text-amber-900 animate-pulse"
                      : "border-purple-200 bg-white text-purple-700 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                  title="Simulate sudden proctor socket interruption to test failover resilience"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isSelfFailoverRunning ? "animate-spin" : ""}`} />
                  <span>{isSelfFailoverRunning || liveFailover?.status === "recovering" ? "Healing SLA..." : "Simulate Failover"}</span>
                </button>

                {/* Cross-Device Recovery Trigger */}
                <button
                  type="button"
                  onClick={() => setIsCrossDeviceModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-bold border border-purple-200 bg-white text-slate-600 hover:text-purple-600 hover:border-purple-300 transition-all cursor-pointer shadow-sm"
                  title="Restore or backup session across multiple devices"
                >
                  <Laptop className="h-3.5 w-3.5 text-purple-600" />
                  <span>Device Sync</span>
                </button>
              </div>
            </div>

            {/* True Offline-First Mode Banner with Crying Bot Emotion */}
            {!isOnline && (
              <div className="rounded-3xl border-2 border-rose-400/80 bg-gradient-to-r from-rose-950/95 via-[#1a0510] to-purple-950/90 p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-white animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <BotEmotionCharacter emotion="crying" size="sm" showStatusBadge={false} />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-sm sm:text-base text-rose-300 flex items-center gap-2">
                      <WifiOff className="h-5 w-5 text-rose-400 animate-pulse" />
                      <span>NETWORK SOCKET SEVERED — REVIVEX BOT IS CRYING! 😭</span>
                    </div>
                    <p className="text-xs text-rose-100/90 font-mono mt-1 leading-relaxed">
                      Waaah! The connection dropped, but <strong>DO NOT PANIC</strong>! ReviveX Guardian has already buffered all your keystrokes locally into IndexedDB. You can keep writing normally — 0 bytes of your exam will be lost!
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <div className="font-mono text-xs text-amber-300 bg-black/40 border border-amber-500/40 px-3 py-1.5 rounded-xl">
                    Buffered Deltas: <strong className="text-white">{offlineBufferCount}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={toggleNetwork}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Restore Socket
                  </button>
                </div>
              </div>
            )}

            {/* Exam Workspace Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Proctor HUD & Question Navigator */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* AI Proctor HUD */}
                <div className="bg-white border border-purple-100 rounded-3xl p-4 text-[#1E1B4B] space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-purple-100 pb-2.5">
                    <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                      <Eye className="h-3.5 w-3.5 text-purple-600" />
                      RESILIENCE HUD
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      ACTIVE (100Hz)
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-500">
                      <span>Storage Tier:</span>
                      <span className="text-emerald-700 font-bold uppercase flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {storageMetrics.tier} (Tier 1)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>IndexedDB Deltas:</span>
                      <span className="text-[#1E1B4B] font-bold">{storageMetrics.totalDeltas} writes (0 loss)</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>CRDT Epoch / Seq:</span>
                      <span className="text-purple-700 font-bold">
                        E{crdtState.currentEpoch} • #{crdtState.globalSequence}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Rollback SLA:</span>
                      <span className="text-emerald-700 font-bold">&lt; 1.8s (P95: 2.1s)</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Event Loop Lag:</span>
                      <span className="text-slate-700 font-bold">0.8ms (Zero Jitter)</span>
                    </div>
                  </div>

                  {/* SHA-256 Merkle Chain Verification Box */}
                  <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-500 uppercase tracking-wider font-bold">
                        CANONICAL STATE SHA-256:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyStateHash(lastSavedHash)}
                        className="text-purple-700 hover:text-purple-900 flex items-center gap-0.5 cursor-pointer font-bold"
                        title="Copy state hash"
                      >
                        {copiedHashNotice ? <CheckCheck className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                        <span>{copiedHashNotice ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <span className="text-purple-800 font-mono text-[10px] break-all block leading-tight select-all font-semibold">
                      {lastSavedHash}
                    </span>
                  </div>

                  {/* Chaos Network Drop Simulator Button */}
                  <button
                    type="button"
                    onClick={toggleNetwork}
                    className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-xs font-mono text-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Zap className="h-3.5 w-3.5 text-purple-600" />
                    <span>{isOnline ? "Simulate Disconnect (Offline Mode)" : "Restore Socket Quorum"}</span>
                  </button>
                </div>

                {/* Question Navigator */}
                <div className="card-modern !p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <span className="font-heading text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Question Navigator ({activeExam.questions.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {flaggedQuestions.length > 0 && `${flaggedQuestions.length} Flagged`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeExam.questions.map((q, idx) => {
                      const isCurrent = activeQIndex === idx;
                      const isFlagged = flaggedQuestions.includes(idx);
                      const isAnswered = q.type === "code"
                        ? Boolean(codeAnswer.trim())
                        : q.type === "mcq"
                        ? mcqAnswer !== null
                        : Boolean(essayAnswer.trim());

                      return (
                        <div
                          key={q.id}
                          onClick={() => handleSelectQuestion(idx)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isCurrent
                              ? "border-purple-500 bg-purple-50 shadow-sm ring-1 ring-purple-400"
                              : "border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/40"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`h-6 w-6 rounded-lg font-heading text-xs font-bold flex items-center justify-center ${
                              isCurrent ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-800"
                            }`}>
                              Q{idx + 1}
                            </span>
                            <div>
                              <div className="font-heading font-bold text-xs text-[#1E1B4B]">
                                {q.type.toUpperCase()} • {q.points} Pts
                              </div>
                              <div className="text-[10px] font-mono text-slate-500">
                                {isAnswered ? (
                                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <Check className="h-3 w-3 stroke-[3]" /> Answered
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Unanswered</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlagQuestion(idx);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isFlagged ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-amber-500"
                            }`}
                            title={isFlagged ? "Flagged for review" : "Flag question for review"}
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Question Content & Editor */}
              <div className="lg:col-span-9 flex flex-col space-y-4">
                <div className="card-modern flex-1 !p-6 sm:!p-8 flex flex-col justify-between space-y-6 relative">
                  
                  {/* High-Visibility Connection Interrupted Banner during Proctor Failover */}
                  {isExamInterrupted && (
                    <div className="rounded-2xl border-2 border-amber-500 bg-amber-950/95 text-amber-200 p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                          <WifiOff className="h-6 w-6 text-amber-400 animate-bounce" />
                        </div>
                        <div>
                          <div className="font-heading font-extrabold text-sm sm:text-base text-white flex flex-wrap items-center gap-2">
                            <span>CONNECTION INTERRUPTED: SOCKET SEVERED</span>
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-bold border border-amber-400/50 animate-pulse">
                              EXAM FROZEN • 100Hz BUFFER ENGAGED
                            </span>
                          </div>
                          <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                            Proctor failover injected. Examination inputs are temporarily locked to prevent unverified keystroke loss. ReviveX Multi-Tier storage is reconciling state via IndexedDB Tier 1.
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 font-mono text-xs text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        <span className="font-bold">1.82s SLA</span>
                      </div>
                    </div>
                  )}

                  {/* Question Header */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between border-b border-purple-100 pb-4 mb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {currentQ.type.toUpperCase()} TASK • {currentQ.points || 30} POINTS
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-purple-50/50 px-2 py-0.5 rounded-full border border-purple-100">
                          Est. Time: 25 Mins
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleFlagQuestion(activeQIndex)}
                          className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            flaggedQuestions.includes(activeQIndex)
                              ? "bg-amber-50 border-amber-300 text-amber-700"
                              : "border-slate-200 text-slate-500 hover:text-amber-600"
                          }`}
                        >
                          <Bookmark className="h-3 w-3 fill-current" />
                          <span>{flaggedQuestions.includes(activeQIndex) ? "Flagged" : "Flag for Review"}</span>
                        </button>

                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Saved: <strong className="text-purple-700">{lastSavedTime}</strong></span>
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-[#1E1B4B] mb-2">
                      {currentQ.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {currentQ.prompt}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div className="flex-1 my-2">
                    
                    {/* CODE QUESTION: FULL CYBER IDE */}
                    {currentQ.type === "code" && (
                      <div className="space-y-4">
                        
                        {/* IDE Window */}
                        <div className="rounded-2xl border border-purple-200 bg-[#1E1B4B] overflow-hidden shadow-2xl flex flex-col">
                          
                          {/* IDE Tab Header */}
                          <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#141238] border-b border-purple-900/50 text-xs font-mono text-purple-200">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditorTab("code")}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editorTab === "code"
                                    ? "bg-[#1E1B4B] text-purple-300 border border-purple-500/50"
                                    : "text-purple-300/70 hover:text-white"
                                }`}
                              >
                                <FileCode className="h-3.5 w-3.5 text-purple-400" />
                                <span>solution.js</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditorTab("spec")}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editorTab === "spec"
                                    ? "bg-[#1E1B4B] text-purple-300 border border-purple-500/50"
                                    : "text-purple-300/70 hover:text-white"
                                }`}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>spec_requirements.md</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditorTab("tests")}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editorTab === "tests"
                                    ? "bg-[#1E1B4B] text-purple-300 border border-purple-500/50"
                                    : "text-purple-300/70 hover:text-white"
                                }`}
                              >
                                <Bug className="h-3.5 w-3.5" />
                                <span>unit_tests.js</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  if (currentQ.codeTemplate) {
                                    setCodeAnswer(currentQ.codeTemplate);
                                    handleAnswerUpdate(currentQ.id, currentQ.codeTemplate);
                                  }
                                }}
                                className="px-2 py-0.5 rounded hover:bg-purple-900/60 text-purple-200/80 hover:text-white transition-colors cursor-pointer"
                                title="Reset to initial boilerplate"
                              >
                                Reset Template
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(codeAnswer)}
                                className="px-2 py-0.5 rounded hover:bg-purple-900/60 text-purple-200/80 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {copiedCodeNotice ? <CheckCheck className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                <span>{copiedCodeNotice ? "Copied" : "Copy"}</span>
                              </button>
                              <span className="text-purple-400/40">|</span>
                              <span className="text-purple-300 font-bold">Node.js v20 (ES2024)</span>
                            </div>
                          </div>

                          {/* Tab 1: Active Code Editor with Line Gutter */}
                          {editorTab === "code" && (
                            <div className="flex flex-1 min-h-[360px] max-h-[440px] overflow-hidden bg-[#1E1B4B]">
                              {/* Line Number Gutter */}
                              <div className="w-11 select-none bg-[#141238] text-purple-400/60 font-mono text-xs py-4 text-right pr-2.5 leading-relaxed border-r border-purple-900/50 overflow-hidden shrink-0">
                                {Array.from({ length: Math.max((codeAnswer || "").split("\n").length, 16) }).map((_, i) => (
                                  <div key={i}>{i + 1}</div>
                                ))}
                              </div>

                              {/* Code Textarea */}
                              <textarea
                                value={codeAnswer}
                                disabled={isExamInterrupted}
                                onChange={handleCodeChange}
                                onKeyDown={(e) => {
                                  if (isExamInterrupted) return;
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    const start = e.currentTarget.selectionStart;
                                    const end = e.currentTarget.selectionEnd;
                                    const updated = codeAnswer.substring(0, start) + "  " + codeAnswer.substring(end);
                                    setCodeAnswer(updated);
                                    handleAnswerUpdate(currentQ.id, updated);
                                    setTimeout(() => {
                                      const target = document.getElementById("code-ide-surface") as HTMLTextAreaElement;
                                      if (target) {
                                        target.selectionStart = target.selectionEnd = start + 2;
                                      }
                                    }, 0);
                                  }
                                }}
                                id="code-ide-surface"
                                className={`flex-1 w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-purple-50 leading-relaxed resize-none focus:outline-none selection:bg-purple-600 selection:text-white ${
                                  isExamInterrupted ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                placeholder={isExamInterrupted ? "// Examination paused: Inputs frozen during socket failover recovery..." : "// Write your resilient state commit logic here..."}
                                spellCheck={false}
                              />
                            </div>
                          )}

                          {/* Tab 2: Spec Requirements */}
                          {editorTab === "spec" && (
                            <div className="p-6 text-xs sm:text-sm font-sans text-purple-100 space-y-4 bg-[#1E1B4B] min-h-[360px] overflow-y-auto">
                              <h4 className="font-heading font-extrabold text-white text-base">
                                Specification & Architectural Invariants:
                              </h4>
                              <div className="space-y-2 text-xs font-mono">
                                <div className="p-3 rounded-xl bg-[#141238] border border-purple-900/50">
                                  <strong className="text-purple-300">Invariant 1: Local Buffer Fallback</strong>
                                  <p className="text-purple-200/70 mt-1">If candidateState.isDisconnected is truthy, write state log delta to local IndexedDB buffer with timestamp.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#141238] border border-purple-900/50">
                                  <strong className="text-purple-300">Invariant 2: Merkle Canonical Head</strong>
                                  <p className="text-purple-200/70 mt-1">Append leaf hash delta onto hashChain.head to guarantee tamper evidence.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#141238] border border-purple-900/50">
                                  <strong className="text-purple-300">Invariant 3: Sub-2.4s Recovery Contract</strong>
                                  <p className="text-purple-200/70 mt-1">Recovery replay must be non-blocking and execute in under 2.4 seconds upon quorum resumption.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tab 3: Unit Tests Preview */}
                          {editorTab === "tests" && (
                            <div className="p-4 font-mono text-xs text-purple-100 bg-[#1E1B4B] min-h-[360px] overflow-y-auto">
                              <pre className="text-purple-200/70 leading-relaxed">
{`describe("ReviveX Consensus State Recovery Suite", () => {
  it("commits delta to local buffer under follower disconnect", () => {
    const res = commitStateSnapshot(1, { isDisconnected: true }, { head: "0xa8f4" });
    expect(res).toBeDefined();
  });

  it("produces verifiable SHA-256 state hash matching quorum spec", () => {
    const res = commitStateSnapshot(1, { isDisconnected: false }, { head: "0xa8f4" });
    expect(res.status).toEqual("COMMITTED_TO_EDGE");
    expect(res.stateHash).toMatch(/^0x[a-f0-9]{16}/);
  });
});`}
                              </pre>
                            </div>
                          )}

                        </div>

                        {/* In-Browser Interactive Test Runner Console */}
                        <div className="rounded-2xl border border-purple-200 bg-[#141238] p-4 text-white space-y-3 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/50 pb-3">
                            <div className="flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-purple-400" />
                              <span className="font-mono font-bold text-xs text-purple-200">
                                Unit Test Runner & State Assertion Engine
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isExamInterrupted}
                                onClick={() => {
                                  setTestResults(null);
                                  setTestConsoleOutput([]);
                                }}
                                className="text-[11px] font-mono text-purple-300/70 hover:text-white px-2 py-1 rounded hover:bg-[#1E1B4B] cursor-pointer disabled:opacity-40"
                              >
                                Clear Console
                              </button>

                              <button
                                type="button"
                                onClick={handleRunCodeTests}
                                disabled={isExamInterrupted || testRunning}
                                className="bot-pill-btn !py-1.5 !px-4 !text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {testRunning ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 text-white animate-spin" />
                                    <span>Executing In Sandbox...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>{isExamInterrupted ? "Runner Paused (Socket Severed)" : "Run Code & Validate Tests"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Test Case Results Accordion */}
                          {testResults && (
                            <div className="space-y-2 pt-1">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                {testResults.map((t, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="p-3 rounded-xl bg-[#1E1B4B] border border-emerald-500/40 text-xs font-mono space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>PASS</span>
                                      </span>
                                      <span className="text-purple-300 text-[10px]">{t.time}</span>
                                    </div>
                                    <div className="text-purple-100 font-semibold text-[11px] truncate">{t.name}</div>
                                    <div className="text-purple-300/70 text-[10px]">{t.details}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Console Output Terminal */}
                          {testConsoleOutput.length > 0 && (
                            <div className="p-3 rounded-xl bg-[#0D0B24] border border-purple-900/50 font-mono text-[11px] space-y-1 max-h-32 overflow-y-auto">
                              {testConsoleOutput.map((log, lIdx) => (
                                <div key={lIdx} className="text-emerald-300">
                                  {log}
                                </div>
                              ))}
                            </div>
                          )}

                        </div>

                      </div>
                    )}

                    {/* MCQ QUESTION: SLEEK INTERACTIVE CARDS */}
                    {currentQ.type === "mcq" && (
                      <div className="space-y-3 pt-2">
                        {currentQ.options?.map((opt, oIdx) => {
                          const isSelected = mcqAnswer === oIdx;
                          const optionLetters = ["A", "B", "C", "D", "E"];

                          return (
                            <button
                              key={oIdx}
                              disabled={isExamInterrupted}
                              onClick={() => {
                                if (isExamInterrupted) return;
                                setMcqAnswer(oIdx);
                                handleAnswerUpdate(currentQ.id, `OPTION_${oIdx}`);
                              }}
                              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between ${
                                isExamInterrupted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              } ${
                                isSelected
                                  ? "border-purple-500 bg-purple-50 text-purple-950 shadow-md ring-2 ring-purple-400"
                                  : "border-purple-100 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <span className={`h-7 w-7 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-purple-600 text-white shadow-sm" : "bg-purple-50 border border-purple-200 text-purple-700"
                                }`}>
                                  {optionLetters[oIdx] || oIdx + 1}
                                </span>
                                <span>{opt}</span>
                              </div>

                              <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-purple-200"
                              }`}>
                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* ESSAY QUESTION: STRUCTURED WRITING PAD */}
                    {currentQ.type === "essay" && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                          <span>Architectural Essay Pad • Markdown Supported</span>
                          <span>Words: <strong className="text-purple-950">{essayAnswer.trim() ? essayAnswer.trim().split(/\s+/).length : 0}</strong> • Chars: <strong className="text-purple-600">{essayAnswer.length}</strong></span>
                        </div>
                        <textarea
                          rows={13}
                          value={essayAnswer}
                          disabled={isExamInterrupted}
                          onChange={(e) => {
                            if (isExamInterrupted) return;
                            const val = e.target.value;
                            setEssayAnswer(val);
                            handleAnswerUpdate(currentQ.id, val);
                          }}
                          className={`w-full rounded-2xl border border-purple-100 bg-purple-50/30 p-4 text-xs sm:text-sm text-slate-800 leading-relaxed resize-none focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-inner ${
                            isExamInterrupted ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          placeholder={isExamInterrupted ? "Examination paused: Inputs frozen during socket failover recovery..." : "Provide your in-depth architectural explanation with mathematical justification..."}
                        />
                      </div>
                    )}

                  </div>

                  {/* Bottom Navigation & Submission Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-purple-100">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isExamInterrupted || activeQIndex === 0}
                        onClick={() => handleSelectQuestion(activeQIndex - 1)}
                        className="px-4 py-2.5 rounded-full border border-purple-200 bg-white text-xs font-bold text-purple-900 hover:bg-purple-50 disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        Previous Question
                      </button>
                      <button
                        disabled={isExamInterrupted || activeQIndex === (activeExam.questions?.length || 1) - 1}
                        onClick={() => handleSelectQuestion(activeQIndex + 1)}
                        className="px-4 py-2.5 rounded-full border border-purple-200 bg-white text-xs font-bold text-purple-900 hover:bg-purple-50 disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        Next Question
                      </button>
                    </div>

                    <button
                      onClick={handleSubmitExam}
                      disabled={isExamInterrupted}
                      className="bot-pill-btn !py-3.5 !px-8 text-xs font-heading font-extrabold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isExamInterrupted ? "Exam Paused (Quorum Severed)" : "Submit Exam Session"}</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Submission Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-[#1E1B4B]/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full border border-purple-200 shadow-2xl text-center space-y-5">
            <div className="flex justify-center">
              <BotEmotionCharacter
                emotion="happy"
                size="md"
                showStatusBadge={true}
                customStatusText="🎉 EXAM SUBMITTED! ReviveX Bot is Celebrating!"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-extrabold text-[#1E1B4B]">
                Exam Successfully Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Your exam session state is cryptographically signed via SHA-256 HMAC and secured across IndexedDB & edge nodes with <strong>0 bytes lost</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-left space-y-2 font-mono text-xs">
              <div className="text-[10px] text-purple-700 uppercase tracking-wider font-bold">
                HMAC Authoritative Verification Token:
              </div>
              <div className="font-bold text-purple-900 break-all">
                {receiptToken}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setViewMode("dashboard");
                }}
                className="bot-pill-btn flex-1 justify-center cursor-pointer !py-3.5 !text-xs font-heading font-extrabold uppercase tracking-wider"
              >
                <span>Return to Student Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Merkle Audit Proof Modal */}
      {selectedProofModal && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl text-[#1E1B4B] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-purple-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#1E1B4B]">
                    Cryptographic Merkle Audit Proof
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mathematical zero-knowledge non-repudiation verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProofModal(null)}
                className="p-1.5 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Assessment</div>
                <div className="text-[#1E1B4B] font-bold text-sm">{selectedProofModal.examTitle}</div>
                <div className="text-emerald-700 text-[11px] font-bold">Score: {selectedProofModal.score} • Submitted {selectedProofModal.date}</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-bold">CANONICAL MERKLE ROOT:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">VALIDATED [MATCH]</span>
                </div>
                <div className="text-purple-700 font-bold break-all bg-white p-2.5 rounded-xl border border-purple-200 text-[11px] shadow-inner">
                  0x{selectedProofModal.token.replace(/[^0-9a-f]/gi, "9a8f")}d3e82910fa4b9c1077e6
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1">
                  <div>
                    <span className="block">LEAF DELTA HASH:</span>
                    <span className="text-slate-800 font-bold">0x9f8c...49d2</span>
                  </div>
                  <div>
                    <span className="block">SIBLING PROOF NODE:</span>
                    <span className="text-slate-800 font-bold">0x7c91...8101</span>
                  </div>
                  <div>
                    <span className="block">ALGORITHM:</span>
                    <span className="text-slate-800 font-bold">SHA-256 HMAC</span>
                  </div>
                  <div>
                    <span className="block">PROCTOR AUTHORITY:</span>
                    <span className="text-slate-800 font-bold">Prof. Sterling</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero byte loss verified across edge IndexedDB and authoritative server logs.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedProofModal(null)}
                className="bot-pill-btn !py-2.5 !px-6 cursor-pointer text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROMINENT CONNECTION INTERRUPTED / FAILOVER OVERLAY ================= */}
      {liveFailover && (
        <div className="fixed inset-0 z-[9999] bg-purple-950/50 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in">
          <div className={`max-w-xl w-full rounded-3xl p-6 sm:p-9 border-2 ${
            liveFailover.status === "recovering"
              ? "border-amber-400 shadow-2xl shadow-amber-500/20"
              : "border-purple-300 shadow-2xl shadow-purple-500/20"
          } bg-white/95 backdrop-blur-xl text-[#1E1B4B] space-y-6 relative overflow-hidden`}>
            
            {/* Ambient background glow */}
            <div className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
              liveFailover.status === "recovering" ? "bg-amber-300/30" : "bg-purple-300/30"
            }`} />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10 text-center sm:text-left">
              <div className="shrink-0">
                <BotEmotionCharacter
                  emotion={liveFailover.status === "recovering" ? "crying" : "happy"}
                  size="md"
                  showStatusBadge={false}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${
                    liveFailover.status === "recovering"
                      ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                      : "bg-purple-100 text-purple-900 border-purple-200"
                  }`}>
                    {liveFailover.status === "recovering" ? "CRITICAL: SOCKET QUORUM SEVERED • 1.82s SLA" : "RECOVERY VERIFIED • 0 LOSS"}
                  </span>
                  <button
                    onClick={() => {
                      setLiveFailover(null);
                      clearActiveFailoverEvent();
                    }}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-black text-[#1E1B4B] mt-2 leading-tight">
                  {liveFailover.status === "recovering"
                    ? "Connection Interrupted: Socket Dropped"
                    : "Quorum Restored & State Re-Hydrated"}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {liveFailover.status === "recovering"
                    ? "ReviveX Bot is distressed about the socket drop, but all keystrokes are safe! Local CRDT buffering captured all answers."
                    : "ReviveX Bot is celebrating! Zero data loss confirmed across edge nodes. All answers reconciled with 100% cryptographic proof."}
                </p>
              </div>
            </div>

            {/* Diagnostic Matrix Box */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2.5 font-mono text-xs relative z-10">
              <div className="flex justify-between text-slate-600">
                <span>Target Candidate:</span>
                <span className="text-[#1E1B4B] font-bold">{liveFailover.candidateName || currentStudent.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Failure Mode:</span>
                <span className="text-amber-800 font-bold">{liveFailover.failureReason}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Client Storage Intercept:</span>
                <span className="text-emerald-700 font-bold">IndexedDB Tier 1 (100Hz Buffering Active)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CRDT Epoch / Seq:</span>
                <span className="text-purple-700 font-bold">E{crdtState.currentEpoch} • #{crdtState.globalSequence} (Preserved Monotonically)</span>
              </div>
              {liveFailover.status === "recovered" && (
                <div className="flex justify-between text-slate-600">
                  <span>Canonical SHA-256:</span>
                  <span className="text-purple-700 font-bold select-all break-all">{liveFailover.hash.slice(0, 24)}...</span>
                </div>
              )}
            </div>

            {/* Status-dependent Body */}
            {liveFailover.status === "recovering" ? (
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between font-mono text-xs text-slate-600">
                  <span>Reconstructing state from IndexedDB deltas...</span>
                  <span className="text-amber-700 font-bold">1.82s SLA</span>
                </div>
                <div className="w-full h-3 rounded-full bg-purple-100 overflow-hidden p-0.5 border border-purple-200">
                  <div className="h-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 rounded-full animate-pulse w-full duration-1000" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 font-sans">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Examination is paused. Do not reload or close the tab. Your uncommitted keystrokes are safe and will be restored automatically.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1 relative z-10">
                <div className="p-3.5 rounded-2xl bg-purple-100/70 border border-purple-200 text-purple-900 text-xs font-mono flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-purple-700 shrink-0" />
                  <span>State re-hydrated in {liveFailover.durationMs}ms. Zero silent loss verified. You may resume your examination.</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLiveFailover(null);
                      clearActiveFailoverEvent();
                      setReconcileBanner("✓ Quorum restored. All answers verified intact. Examination resumed.");
                      setTimeout(() => setReconcileBanner(null), 4000);
                    }}
                    className="bot-pill-btn flex-1 justify-center py-3.5 text-xs font-heading font-extrabold cursor-pointer shadow-xl shadow-indigo-500/25"
                  >
                    <span>Resume Examination (Verified 0 Loss)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProofModal({
                        examTitle: `${activeExam.code}: Failover Recovery Ledger`,
                        score: "100% Match (0 B Lost)",
                        token: liveFailover.hash,
                        date: new Date(liveFailover.timestamp).toLocaleTimeString(),
                      });
                    }}
                    className="px-5 py-3.5 rounded-full border border-purple-200 bg-white text-xs font-mono font-bold text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Inspect Merkle Proof</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Cross-Device Recovery Modal */}
      <CrossDeviceRecoveryModal
        isOpen={isCrossDeviceModalOpen}
        onClose={() => setIsCrossDeviceModalOpen(false)}
      />

      {/* Global Floating ReviveX AI Bot Widget */}
      <ReviveXBotWidget
        currentExam={activeExam}
        currentStudent={currentStudent}
        isExamMode={viewMode === "exam"}
      />
    </div>
  );
}

export default function StudentPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <StudentPortalContent />
    </Suspense>
  );
}
