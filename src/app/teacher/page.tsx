"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  BookOpen,
  Users,
  ShieldCheck,
  Zap,
  Clock,
  FileCode,
  CheckCircle2,
  Sliders,
  Send,
  Layers,
  Sparkles,
  Calendar,
  Lock,
  Database,
  Trash2,
  ArrowRight,
  LogOut,
  UserPlus,
  GraduationCap,
  Award,
  X
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { DotField } from "@/components/ui/DotField";
import {
  Exam,
  ExamQuestion,
  SecurityProtocol,
  StudentProfile,
  getStoredExams,
  saveExam,
  getStoredStudents,
  saveStudent,
  STUDENTS_DATA
} from "@/lib/examStore";
import { ReviveXBotWidget } from "@/components/ui/ReviveXBotWidget";

export default function TeacherPortalPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Record<string, StudentProfile>>(STUDENTS_DATA);
  const [activeTab, setActiveTab] = useState<"manage" | "create" | "students">("manage");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentUniversity, setNewStudentUniversity] = useState("Stanford University");
  const [newStudentDepartment, setNewStudentDepartment] = useState("Computer Science & Distributed Systems");
  const [newStudentGpa, setNewStudentGpa] = useState("9.95 CGPA (3.99/4.00)");
  const [newStudentEnrolledExams, setNewStudentEnrolledExams] = useState<string[]>(["EXAM-CS448"]);

  // New Exam Form State
  const [examTitle, setExamTitle] = useState("");
  const [courseCode, setCourseCode] = useState("CS-580");
  const [subject, setSubject] = useState("Distributed Systems");
  const [duration, setDuration] = useState("90 Minutes");
  const [examDate, setExamDate] = useState("Today (Live)");
  const [examStatus, setExamStatus] = useState<"ongoing" | "upcoming">("ongoing");
  const [totalPoints, setTotalPoints] = useState(100);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([
    "STU-84920",
    "STU-84921",
    "STU-84922"
  ]);

  // Protocol Settings
  const [protocol, setProtocol] = useState<SecurityProtocol>({
    telemetryRate: "100Hz",
    browserLockdown: "Strict",
    aiRiskSensitivity: "Balanced (0.75)",
    rollbackSla: "2.4s Guaranteed",
    cryptography: "SHA-256 Merkle Chain",
    autoSaveInterval: "10ms Delta"
  });

  // Dynamic Questions State
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 1,
      title: "Question 1: Fault-Tolerant Distributed State Logging",
      type: "code",
      points: 50,
      prompt: "Implement an atomic state log replication function that guarantees zero silent byte loss under unexpected socket failure.",
      codeTemplate: `function replicateStateLog(logEntry, activeQuorum) {\n  // Buffer 100Hz local telemetry to IndexedDB\n  return { status: "COMMITTED", stateHash: "0x9a8f4c21e0b7" };\n}`
    },
    {
      id: 2,
      title: "Question 2: Cryptographic State Proofs",
      type: "mcq",
      points: 50,
      prompt: "What mathematical structure prevents retrospective answer modification in ReviveX?",
      options: [
        "Unsigned HTTP cookies",
        "SHA-256 State Delta Merkle Hash Chaining",
        "Client-side LocalStorage cache",
        "Manual proctor spreadsheet logs"
      ],
      correctOption: 1
    }
  ]);

  useEffect(() => {
    setExams(getStoredExams());
    setStudents(getStoredStudents());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      triggerToast("Please enter candidate full name");
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `STU-${randomSuffix}`;
    const codeNum = Math.floor(100 + Math.random() * 900);
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const candNumber = `CN-2026-${codeNum}${letter}`;

    const names = newStudentName.trim().split(" ");
    const initials = names.map(n => n[0]).join("").substring(0, 2).toUpperCase();

    const createdStudent: StudentProfile = {
      id: newId,
      name: newStudentName.trim(),
      candidateNumber: candNumber,
      email: newStudentEmail.trim() || `${names[0].toLowerCase()}.${(names[1] || "stu").toLowerCase()}@${newStudentUniversity.toLowerCase().replace(/[^a-z]/g, "")}.edu`,
      university: newStudentUniversity,
      department: newStudentDepartment,
      gpa: newStudentGpa,
      avatarInitials: initials,
      enrolledExams: newStudentEnrolledExams.length > 0 ? newStudentEnrolledExams : ["EXAM-CS448"],
      completedExams: [
        {
          examId: "EXAM-CS301",
          examTitle: "Distributed Consensus Protocols",
          score: "99 / 100",
          submittedDate: "2026-08-28",
          receiptToken: `REVIVEX-0x${Math.random().toString(16).substring(2, 10)}-VERIFIED`,
          status: "Verified (0 Loss)"
        }
      ]
    };

    saveStudent(createdStudent);
    const updated = getStoredStudents();
    setStudents(updated);
    setAssignedStudentIds(prev => [...prev, newId]);

    // Also assign student to the selected exams in exam store
    const currentExams = getStoredExams();
    let examsUpdated = false;
    currentExams.forEach((ex) => {
      if (createdStudent.enrolledExams.includes(ex.id) && !ex.assignedStudents.includes(newId)) {
        ex.assignedStudents.push(newId);
        examsUpdated = true;
      }
    });
    if (examsUpdated) {
      localStorage.setItem("revivex_exams", JSON.stringify(currentExams));
      setExams(currentExams);
    }

    setIsEnrollModalOpen(false);
    triggerToast(`Candidate ${createdStudent.name} (${createdStudent.candidateNumber}) successfully enrolled!`);

    // Reset Form
    setNewStudentName("");
    setNewStudentEmail("");
  };

  const handlePublishExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) {
      triggerToast("Please enter an exam title.");
      return;
    }

    const newExam: Exam = {
      id: `EXAM-${courseCode.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now().toString().slice(-4)}`,
      code: courseCode,
      title: examTitle,
      subject,
      instructor: "Prof. Robert Sterling",
      date: examDate,
      time: "Scheduled Session",
      duration,
      status: examStatus,
      totalPoints,
      assignedStudents: assignedStudentIds,
      protocol,
      questions
    };

    saveExam(newExam);
    setExams(getStoredExams());
    triggerToast(`Exam "${examTitle}" published & assigned to ${assignedStudentIds.length} candidate(s)!`);
    setActiveTab("manage");

    // Reset Form
    setExamTitle("");
  };

  const toggleStudentAssignment = (stuId: string) => {
    if (assignedStudentIds.includes(stuId)) {
      setAssignedStudentIds(assignedStudentIds.filter((id) => id !== stuId));
    } else {
      setAssignedStudentIds([...assignedStudentIds, stuId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-[#EFEAFF] to-[#FAF8FF] text-[#1E1B4B] flex flex-col font-sans relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-200/40 via-purple-200/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md text-[#1E1B4B] px-4 py-3.5 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Link>
            <div className="h-4 w-px bg-purple-200" />
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 flex items-center justify-center text-base">
                🤖
              </div>
              <div>
                <span className="font-heading font-extrabold text-base text-[#1E1B4B] block leading-none">
                  Teacher Assessment & Protocol Studio
                </span>
                <span className="text-[10px] font-mono text-purple-600 font-semibold">
                  Instructor: Prof. Robert Sterling (Chair of Systems & Computing)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="bot-pill-btn !py-1.5 !px-3.5 !text-xs flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-purple-600 hover:border-purple-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6 relative z-10">
        
        {/* Top Header & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-purple-700 uppercase tracking-wider">
              FACULTY ASSESSMENT MANAGEMENT
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mt-0.5">
              Examination Creation & Student Roster Orchestration
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap rounded-full bg-purple-100/70 p-1 gap-1 border border-purple-200">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "manage"
                  ? "bg-[#1E1B4B] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#1E1B4B]"
              }`}
            >
              Manage Tests ({exams.length})
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-full font-heading text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "students"
                  ? "bg-[#1E1B4B] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#1E1B4B]"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Enrolled Candidates ({Object.keys(students).length})</span>
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-full font-heading text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "create"
                  ? "bot-pill-btn !py-2 !px-4"
                  : "text-slate-600 hover:text-[#1E1B4B]"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Test</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: MANAGE EXISTING EXAMS ================= */}
        {activeTab === "manage" && (
          <div className="space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">{exams.length} Exams</div>
                  <div className="text-xs font-semibold text-slate-500">Published Under Faculty</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("students")}
                className="card-modern !p-5 flex items-center gap-4 cursor-pointer hover:border-purple-400 transition-all"
                title="Click to view full student roster & enroll candidates"
              >
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#1E1B4B]">
                    {Object.keys(students).length} Candidates
                  </div>
                  <div className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                    <span>Enrolled (Active Roster)</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-purple-700">100% Verified</div>
                  <div className="text-xs font-semibold text-slate-500">SHA-256 Ledger Integrity</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-purple-700">1.8s SLA</div>
                  <div className="text-xs font-semibold text-slate-500">State Rollback Guarantee</div>
                </div>
              </div>
            </div>

            {/* Active Tests List */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B]">
                  <Layers className="h-5 w-5 text-purple-600" />
                  <span>Configured Examinations Directory</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-purple-600" />
                    <span>Enroll Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("create")}
                    className="bot-pill-btn !py-2 !px-4 !text-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Assessment</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-5 rounded-2xl border border-purple-100 bg-[#FAF8FF] space-y-4 shadow-sm hover:border-purple-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {exam.code} • {exam.subject}
                        </span>
                        <h4 className="font-heading text-lg font-bold text-[#1E1B4B] mt-2 line-clamp-2">
                          {exam.title}
                        </h4>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shrink-0 ${
                          exam.status === "ongoing"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-purple-50/50 text-slate-500 border border-purple-100"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-500 space-y-1.5 border-t border-purple-100 pt-3">
                      <div className="flex justify-between">
                        <span>Duration / Points:</span>
                        <span className="font-bold text-[#1E1B4B]">{exam.duration} • {exam.totalPoints} Pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions Count:</span>
                        <span className="font-bold text-[#1E1B4B]">{exam.questions.length} Questions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned Roster:</span>
                        <span className="font-bold text-purple-700">{exam.assignedStudents.length} Students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resilience Protocol:</span>
                        <span className="font-bold text-[#1E1B4B]">{exam.protocol.telemetryRate} • {exam.protocol.rollbackSla}</span>
                      </div>
                    </div>

                    {/* Assigned Student Avatars */}
                    <div className="pt-2 border-t border-[#E1E8F0] flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        {exam.assignedStudents.map((stuId) => {
                          const stu = students[stuId] || STUDENTS_DATA[stuId];
                          return (
                            <div
                              key={stuId}
                              title={stu?.name || stuId}
                              className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm"
                            >
                              {stu?.avatarInitials || "ST"}
                            </div>
                          );
                        })}
                      </div>

                      <Link
                        href="/student"
                        className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                      >
                        <span>Preview in Pod</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: ENROLLED CANDIDATES ROSTER ================= */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B]">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <span>Candidate Cohort Roster ({Object.keys(students).length} Students)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage candidate enrollment, verify academic standing, and grant examination pod access.
                  </p>
                </div>
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="bot-pill-btn !py-2.5 !px-5 !text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Enroll New Student Candidate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.values(students).map((stu) => (
                  <div key={stu.id} className="p-5 rounded-2xl border border-purple-100 bg-[#FAF8FF] space-y-4 shadow-sm hover:border-purple-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#1E1B4B] text-white font-bold flex items-center justify-center text-sm shadow-md">
                          {stu.avatarInitials}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-base text-[#1E1B4B]">{stu.name}</h4>
                          <span className="text-[11px] font-mono text-purple-700 font-bold">{stu.candidateNumber}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                        {stu.gpa}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-500 space-y-1.5 border-t border-purple-100 pt-3">
                      <div>Institution: <strong className="text-[#1E1B4B]">{stu.university}</strong></div>
                      <div>Department: <strong className="text-[#1E1B4B]">{stu.department}</strong></div>
                      <div>Enrolled Tests: <strong className="text-purple-700">{stu.enrolledExams.length} Exams Assigned</strong></div>
                      <div>Completed Tests: <strong className="text-[#1E1B4B]">{stu.completedExams.length} Submissions</strong></div>
                    </div>

                    <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                      <Link
                        href={`/student?id=${stu.id}`}
                        className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                      >
                        <span>Impersonate Exam View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified Identity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CREATE & ASSIGN NEW TEST ================= */}
        {activeTab === "create" && (
          <form onSubmit={handlePublishExam} className="space-y-6">
            
            {/* Step 1: Basic Information */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-4">
                <Sliders className="h-5 w-5 text-purple-600" />
                <span>Step 1: Exam Metadata & Schedule</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus & Raft State Machine Replication"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs sm:text-sm text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs sm:text-sm text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Academic Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs sm:text-sm text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#556B82] uppercase tracking-wider mb-2 font-bold">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="60 Minutes">60 Minutes</option>
                    <option value="90 Minutes">90 Minutes (Standard)</option>
                    <option value="120 Minutes">120 Minutes</option>
                    <option value="180 Minutes">180 Minutes (Comprehensive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Session Status
                  </label>
                  <select
                    value={examStatus}
                    onChange={(e) => setExamStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="ongoing">Ongoing (Live for Students Now)</option>
                    <option value="upcoming">Upcoming (Scheduled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Date & Time Note
                  </label>
                  <input
                    type="text"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs sm:text-sm text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Total Weight (Points)
                  </label>
                  <input
                    type="number"
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(Number(e.target.value))}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs sm:text-sm text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Protocol Settings */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B] border-b border-purple-100 pb-4">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
                <span>Step 2: Resilience & Security Protocols</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Telemetry Stream Frequency
                  </label>
                  <select
                    value={protocol.telemetryRate}
                    onChange={(e) => setProtocol({ ...protocol, telemetryRate: e.target.value as any })}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="50Hz">50Hz (Bandwidth Saver)</option>
                    <option value="100Hz">100Hz (Default - Sub-2.4s SLA)</option>
                    <option value="200Hz">200Hz (Ultra-High Frequency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Browser Lockdown Level
                  </label>
                  <select
                    value={protocol.browserLockdown}
                    onChange={(e) => setProtocol({ ...protocol, browserLockdown: e.target.value as any })}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Strict">Strict (Full Kiosk Mode)</option>
                    <option value="Moderate">Moderate (Tab Warning)</option>
                    <option value="Standard">Standard (Passive Logging)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Cryptography Mode
                  </label>
                  <select
                    value={protocol.cryptography}
                    onChange={(e) => setProtocol({ ...protocol, cryptography: e.target.value as any })}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs font-bold text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="SHA-256 Merkle Chain">SHA-256 Merkle Chain (Standard)</option>
                    <option value="Kyber-1024 Post-Quantum">Kyber-1024 Post-Quantum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Assign to Students Roster */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#1E1B4B]">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Step 3: Student Roster Assignment ({assignedStudentIds.length} Selected)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAssignedStudentIds(Object.keys(students))}
                  className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  Select All Students ({Object.keys(students).length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.values(students).map((stu) => {
                  const isAssigned = assignedStudentIds.includes(stu.id);
                  return (
                    <div
                      key={stu.id}
                      onClick={() => toggleStudentAssignment(stu.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isAssigned
                          ? "border-purple-500 bg-purple-50 shadow-sm ring-1 ring-purple-400"
                          : "border-purple-100 bg-white hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1E1B4B] text-white font-bold flex items-center justify-center text-xs">
                          {stu.avatarInitials}
                        </div>
                        <div>
                          <div className="font-heading font-bold text-sm text-[#1E1B4B]">
                            {stu.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {stu.candidateNumber} • {stu.university.split(" ")[0]}
                          </div>
                        </div>
                      </div>

                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isAssigned ? "bg-purple-600 border-purple-600 text-white" : "border-purple-200"
                      }`}>
                        {isAssigned && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("manage")}
                className="px-6 py-3.5 rounded-full border border-purple-200 bg-white font-heading text-xs font-bold text-slate-600 hover:text-[#1E1B4B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bot-pill-btn !py-3.5 !px-8 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Publish Test & Broadcast to Students</span>
              </button>
            </div>

          </form>
        )}

      </main>

      {/* ================= ENROLL NEW STUDENT MODAL ================= */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-purple-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-[#1E1B4B]">
                    Enroll New Student Candidate
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mint verified cryptographic identity & assign active examinations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-2 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#556B82] uppercase tracking-wider mb-1.5 font-bold">
                  Full Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs sm:text-sm text-[#1E1B4B] focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                    University / Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentUniversity}
                    onChange={(e) => setNewStudentUniversity(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentDepartment}
                    onChange={(e) => setNewStudentDepartment(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                    Target Academic CGPA
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentGpa}
                    onChange={(e) => setNewStudentGpa(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                    Institutional Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Auto-generated if blank"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 p-3 text-xs text-[#1E1B4B] focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                  Assign Initial Examination(s)
                </label>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {exams.map((ex) => {
                    const isChecked = newStudentEnrolledExams.includes(ex.id);
                    return (
                      <label
                        key={ex.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono cursor-pointer ${
                          isChecked ? "bg-purple-50 border-purple-400 text-[#1E1B4B]" : "bg-[#FAF8FF] border-purple-100 text-slate-600"
                        }`}
                      >
                        <span className="font-bold">{ex.code} • {ex.title}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewStudentEnrolledExams(newStudentEnrolledExams.filter(id => id !== ex.id));
                            } else {
                              setNewStudentEnrolledExams([...newStudentEnrolledExams, ex.id]);
                            }
                          }}
                          className="h-4 w-4 text-purple-600 rounded accent-purple-600"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-purple-200 text-xs font-bold text-slate-600 hover:text-[#1E1B4B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bot-pill-btn !py-2.5 !px-6 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mint & Enroll Candidate</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1E1B4B] text-white border border-purple-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-sans text-xs">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Floating ReviveX AI Bot Widget */}
      <ReviveXBotWidget />
    </div>
  );
}
