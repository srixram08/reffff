"use client";

export interface ExamQuestion {
  id: number;
  title: string;
  type: "code" | "mcq" | "essay";
  prompt: string;
  points: number;
  codeTemplate?: string;
  options?: string[];
  correctOption?: number;
}

export interface SecurityProtocol {
  telemetryRate: "100Hz" | "50Hz" | "200Hz";
  browserLockdown: "Strict" | "Moderate" | "Standard";
  aiRiskSensitivity: "High (0.90)" | "Balanced (0.75)" | "Permissive (0.60)";
  rollbackSla: "2.4s Guaranteed" | "1.8s Ultra-Fast";
  cryptography: "SHA-256 Merkle Chain" | "Kyber-1024 Post-Quantum";
  autoSaveInterval: "10ms Delta" | "50ms Delta";
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  subject: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  status: "ongoing" | "upcoming" | "completed";
  totalPoints: number;
  assignedStudents: string[]; // student IDs
  protocol: SecurityProtocol;
  questions: ExamQuestion[];
}

export interface StudentProfile {
  id: string;
  name: string;
  candidateNumber: string;
  email: string;
  university: string;
  department: string;
  gpa: string;
  avatarInitials: string;
  enrolledExams: string[]; // Exam IDs
  completedExams: Array<{
    examId: string;
    examTitle: string;
    score: string;
    submittedDate: string;
    receiptToken: string;
    status: "Verified (0 Loss)";
  }>;
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  department: string;
  university: string;
  createdExams: string[];
}

// 3 PRE-CONFIGURED STUDENT PROFILES
export const STUDENTS_DATA: Record<string, StudentProfile> = {
  "STU-84920": {
    id: "STU-84920",
    name: "Alex Chen",
    candidateNumber: "CN-2026-881A",
    email: "alex.chen@stanford.edu",
    university: "Stanford University",
    department: "Computer Science & Distributed Systems",
    gpa: "9.95 CGPA (3.99/4.00)",
    avatarInitials: "AC",
    enrolledExams: ["EXAM-CS448", "EXAM-PHYS301", "EXAM-SEC502"],
    completedExams: [
      {
        examId: "EXAM-CS301",
        examTitle: "Consensus Protocols & Fault Tolerance",
        score: "98 / 100",
        submittedDate: "2026-08-20",
        receiptToken: "REVIVEX-0xa8f492c10b7e49d2-VERIFIED",
        status: "Verified (0 Loss)",
      },
      {
        examId: "EXAM-ALG202",
        examTitle: "Advanced Algorithms & Graph Theory",
        score: "96 / 100",
        submittedDate: "2026-07-14",
        receiptToken: "REVIVEX-0x7c91b4e29a3f8101-VERIFIED",
        status: "Verified (0 Loss)",
      }
    ]
  },
  "STU-84921": {
    id: "STU-84921",
    name: "Sarah Jenkins",
    candidateNumber: "CN-2026-902B",
    email: "sarah.j@mit.edu",
    university: "Massachusetts Institute of Technology",
    department: "Physics & Quantum Information",
    gpa: "9.92 CGPA (3.98/4.00)",
    avatarInitials: "SJ",
    enrolledExams: ["EXAM-PHYS301", "EXAM-CS448"],
    completedExams: [
      {
        examId: "EXAM-QNT101",
        examTitle: "Quantum Mechanics & Superposition",
        score: "97 / 100",
        submittedDate: "2026-08-18",
        receiptToken: "REVIVEX-0x4b8e21a9c3d4f5e6-VERIFIED",
        status: "Verified (0 Loss)",
      }
    ]
  },
  "STU-84922": {
    id: "STU-84922",
    name: "Marcus Vance",
    candidateNumber: "CN-2026-744C",
    email: "marcus.v@berkeley.edu",
    university: "UC Berkeley",
    department: "Applied Cryptography & Security",
    gpa: "9.98 CGPA (4.00/4.00)",
    avatarInitials: "MV",
    enrolledExams: ["EXAM-SEC502", "EXAM-CS448", "EXAM-PHYS301"],
    completedExams: [
      {
        examId: "EXAM-CRYPTO1",
        examTitle: "Zero-Knowledge Proofs & Elliptic Curves",
        score: "100 / 100",
        submittedDate: "2026-08-22",
        receiptToken: "REVIVEX-0x1d4a8e9f2c3b5a7e-VERIFIED",
        status: "Verified (0 Loss)",
      }
    ]
  }
};

// INITIAL EXAMS REPOSITORY
export const INITIAL_EXAMS: Exam[] = [
  {
    id: "EXAM-CS448",
    code: "CS-448",
    title: "Advanced Distributed Systems & Consensus Recovery",
    subject: "Computer Science",
    instructor: "Prof. Robert Sterling",
    date: "Today (Live)",
    time: "Ongoing Session",
    duration: "90 Minutes",
    status: "ongoing",
    totalPoints: 100,
    assignedStudents: ["STU-84920", "STU-84921", "STU-84922"],
    protocol: {
      telemetryRate: "100Hz",
      browserLockdown: "Strict",
      aiRiskSensitivity: "Balanced (0.75)",
      rollbackSla: "2.4s Guaranteed",
      cryptography: "SHA-256 Merkle Chain",
      autoSaveInterval: "10ms Delta"
    },
    questions: [
      {
        id: 1,
        title: "Question 1: Raft Consensus State Recovery Implementation",
        type: "code",
        points: 40,
        prompt: "Implement a crash-resilient state log commit function that guarantees zero silent data loss upon unannounced follower disconnection.",
        codeTemplate: `// ReviveX State Recovery Log Commit
function commitStateSnapshot(logIndex, candidateState, hashChain) {
  // TODO: Buffer 100Hz local telemetry to IndexedDB
  const localBuffer = [];
  if (candidateState.isDisconnected) {
    return localBuffer.append({ logIndex, hash: hashChain.head });
  }
  return { status: "COMMITTED_TO_EDGE", stateHash: "0xa8f492c10b7e49d2" };
}`
      },
      {
        id: 2,
        title: "Question 2: Cryptographic Hash Chain Validation",
        type: "mcq",
        points: 30,
        prompt: "Which mechanism in ReviveX guarantees non-repudiation and zero byte loss during abrupt socket termination?",
        options: [
          "Periodic HTTP polling every 30 seconds",
          "100Hz Telemetry Stream with SHA-256 State Delta Hash Chaining",
          "Client-side LocalStorage unencrypted JSON caching",
          "Manual proctor refresh upon candidate request"
        ],
        correctOption: 1
      },
      {
        id: 3,
        title: "Question 3: Digital Twin Shadow Synchronization",
        type: "essay",
        points: 30,
        prompt: "Explain how ReviveX's edge node shadow copy enables seamless 2.4-second recovery when a candidate's browser process crashes unexpectedly."
      }
    ]
  },
  {
    id: "EXAM-PHYS301",
    code: "PHYS-301",
    title: "Quantum Information Theory & Error Correction",
    subject: "Quantum Physics",
    instructor: "Prof. Elena Rostova",
    date: "Tomorrow, 10:00 AM EST",
    time: "10:00 AM – 12:00 PM",
    duration: "120 Minutes",
    status: "upcoming",
    totalPoints: 100,
    assignedStudents: ["STU-84920", "STU-84921", "STU-84922"],
    protocol: {
      telemetryRate: "100Hz",
      browserLockdown: "Strict",
      aiRiskSensitivity: "High (0.90)",
      rollbackSla: "2.4s Guaranteed",
      cryptography: "Kyber-1024 Post-Quantum",
      autoSaveInterval: "10ms Delta"
    },
    questions: [
      {
        id: 1,
        title: "Question 1: Shor's Surface Code Stabilizers",
        type: "mcq",
        points: 35,
        prompt: "What is the primary threshold error rate for surface code fault-tolerant quantum computing under depolarizing noise?",
        options: ["~1%", "~0.01%", "~10%", "~0.001%"],
        correctOption: 0
      },
      {
        id: 2,
        title: "Question 2: Quantum State Tomography Simulator",
        type: "code",
        points: 65,
        prompt: "Write a quantum density matrix calculation validating fidelity under Kraus error operators.",
        codeTemplate: `function calculateDensityMatrix(stateVector, krausOperators) {
  // Compute rho = sum(K_i * rho * K_i_dagger)
  return { fidelity: 0.9994, purity: 1.0 };
}`
      }
    ]
  },
  {
    id: "EXAM-SEC502",
    code: "SEC-502",
    title: "Post-Quantum Cryptography & Zero-Knowledge Verification",
    subject: "Cybersecurity",
    instructor: "Dr. Eleanor Vance",
    date: "Friday, 2:00 PM EST",
    time: "2:00 PM – 3:30 PM",
    duration: "90 Minutes",
    status: "upcoming",
    totalPoints: 100,
    assignedStudents: ["STU-84920", "STU-84922"],
    protocol: {
      telemetryRate: "200Hz",
      browserLockdown: "Strict",
      aiRiskSensitivity: "High (0.90)",
      rollbackSla: "1.8s Ultra-Fast",
      cryptography: "Kyber-1024 Post-Quantum",
      autoSaveInterval: "10ms Delta"
    },
    questions: [
      {
        id: 1,
        title: "Question 1: Lattice-Based Key Encapsulation",
        type: "essay",
        points: 50,
        prompt: "Detail the mathematical foundation of Learning With Errors (LWE) and why it resists polynomial-time quantum attacks."
      },
      {
        id: 2,
        title: "Question 2: Merkle Tree Hash Validator",
        type: "code",
        points: 50,
        prompt: "Implement a SHA-256 Merkle path verification algorithm that validates leaf inclusion in O(log N) time.",
        codeTemplate: `function verifyMerkleProof(leafHash, proofPath, expectedRoot) {
  let current = leafHash;
  for (const sibling of proofPath) {
    current = hashPair(current, sibling);
  }
  return current === expectedRoot;
}`
      }
    ]
  }
];

// In-Memory Global State Helpers
export function getStoredExams(): Exam[] {
  if (typeof window === "undefined") return INITIAL_EXAMS;
  const saved = localStorage.getItem("revivex_exams");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_EXAMS;
    }
  }
  return INITIAL_EXAMS;
}

export function saveExam(newExam: Exam): void {
  if (typeof window === "undefined") return;
  const exams = getStoredExams();
  const index = exams.findIndex((e) => e.id === newExam.id);
  if (index >= 0) {
    exams[index] = newExam;
  } else {
    exams.unshift(newExam);
  }
  localStorage.setItem("revivex_exams", JSON.stringify(exams));
}

// Student Storage & Persistence Helpers
export function getStoredStudents(): Record<string, StudentProfile> {
  if (typeof window === "undefined") return STUDENTS_DATA;
  const saved = localStorage.getItem("revivex_students");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const merged: Record<string, StudentProfile> = { ...parsed };
      // Guarantee updated high CGPA and records for core candidates
      for (const id of Object.keys(STUDENTS_DATA)) {
        if (!merged[id]) {
          merged[id] = STUDENTS_DATA[id];
        } else {
          merged[id] = {
            ...merged[id],
            gpa: STUDENTS_DATA[id].gpa,
            completedExams: STUDENTS_DATA[id].completedExams
          };
        }
      }
      return merged;
    } catch {
      return STUDENTS_DATA;
    }
  }
  return STUDENTS_DATA;
}

export function saveStudent(newStudent: StudentProfile): void {
  if (typeof window === "undefined") return;
  const students = getStoredStudents();
  students[newStudent.id] = newStudent;
  localStorage.setItem("revivex_students", JSON.stringify(students));
  // Dispatch custom storage event for live tab synchronization
  window.dispatchEvent(new Event("storage"));
}

export function getStudentProfile(studentId: string): StudentProfile {
  const allStudents = getStoredStudents();
  return allStudents[studentId] || allStudents["STU-84920"] || STUDENTS_DATA["STU-84920"];
}

