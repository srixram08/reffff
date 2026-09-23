// Student AI Knowledge & Q&A Assistant Engine for ReviveX
// Comprehensive intelligent answers for exam subjects, platform resilience, rules, schedules, and guidance

import { Exam, StudentProfile, STUDENTS_DATA, INITIAL_EXAMS } from "./examStore";

export interface BotQuickPrompt {
  id: string;
  category: "exam" | "tech" | "schedule" | "rules";
  label: string;
  query: string;
  icon?: string;
}

export const QUICK_PROMPTS: BotQuickPrompt[] = [
  {
    id: "p1",
    category: "schedule",
    label: "⏰ Test Reminders & Schedule",
    query: "When is my next exam and what are my upcoming test reminders?"
  },
  {
    id: "p2",
    category: "exam",
    label: "💡 Raft Consensus Hint (Q1)",
    query: "Explain Raft consensus state recovery and log commit for Question 1"
  },
  {
    id: "p3",
    category: "tech",
    label: "🛡️ How 100Hz Offline Save Works",
    query: "How does ReviveX protect my answers if my Wi-Fi suddenly disconnects?"
  },
  {
    id: "p4",
    category: "rules",
    label: "🚨 Anti-Cheat & Proctoring Rules",
    query: "What actions trigger anti-cheat warnings during the exam?"
  },
  {
    id: "p5",
    category: "schedule",
    label: "🎓 My Student Profile & GPA",
    query: "Show my student record, GPA, and verified past exam receipts"
  },
  {
    id: "p6",
    category: "exam",
    label: "⚛️ Quantum Physics Formula Help",
    query: "Explain Shor code stabilizers and Kraus operators for PHYS-301"
  }
];

export interface BotResponsePayload {
  text: string;
  actionType?: "navigate" | "reminder" | "test_wifi" | "show_merkle" | "calm_down";
  actionLabel?: string;
  actionData?: unknown;
}

export function answerStudentQuestion(
  query: string,
  context?: {
    student?: StudentProfile;
    activeExam?: Exam;
    timeRemainingFormatted?: string;
    strikes?: number;
  }
): BotResponsePayload {
  const q = query.toLowerCase().trim();
  const student = context?.student;
  const exam = context?.activeExam || INITIAL_EXAMS[0];

  // 1. TEST REMINDERS & SCHEDULE
  if (
    q.includes("reminder") ||
    q.includes("schedule") ||
    q.includes("upcoming") ||
    q.includes("when is my test") ||
    q.includes("when is my exam") ||
    q.includes("next test") ||
    q.includes("next exam")
  ) {
    const title = student ? `Upcoming Test Reminders for ${student.name}` : `Upcoming Platform Exam Schedule`;
    return {
      text: `📅 **${title}**:\n\n` +
        `• **CS-448: Distributed Systems & Consensus**\n  Status: 🔴 **LIVE NOW** (In-session)\n  Instructor: Prof. Robert Sterling\n\n` +
        `• **PHYS-301: Quantum Information & Error Correction**\n  Date: **Tomorrow, 10:00 AM EST** (120 Mins)\n  Focus: Surface codes & Kraus density matrices\n\n` +
        `• **SEC-502: Post-Quantum Cryptography & ZK**\n  Date: **Friday, 2:00 PM EST** (90 Mins)\n  Focus: Lattice LWE & Merkle inclusion proofs\n\n` +
        (student ? `🔔 *ReviveX will alert you 15 minutes before upcoming start times!*` : `🔔 *Sign in through the Student Pod to sync your personal exam timetable!*`),
      actionType: "reminder",
      actionLabel: student ? "Set Exam Countdown Reminder" : "Go to Student Login"
    };
  }

  // 2. ANTI-CHEAT / PROCTORING & SNEAK WARNINGS
  if (
    q.includes("cheat") ||
    q.includes("sneak") ||
    q.includes("warn") ||
    q.includes("proctor") ||
    q.includes("rule") ||
    q.includes("strike") ||
    q.includes("tab switch")
  ) {
    const currentStrikes = context?.strikes ?? 0;
    return {
      text: `🛡️ **ReviveX Autonomous Proctoring System Rules**:\n\n` +
        `1. **No Tab Switching**: Leaving this tab or minimizing the browser triggers an automatic strike.\n` +
        `2. **Window Boundary Detection**: Your cursor must stay within the active examination pod.\n` +
        `3. **Clipboard Protection**: Copying exam questions or pasting unauthorized external code is flagged.\n` +
        `4. **Developer Tools Lock**: F12, Inspect Element, and right-click menus are locked and logged.\n\n` +
        `⚠️ **Strike Policy**: 3 strikes will escalate the incident to your instructor (Prof. Robert Sterling) with cryptographic audit evidence.\n\n` +
        `*Current Strikes for this session*: **${currentStrikes} / 3**. Stay focused on the test and you'll do great!`,
      actionType: "navigate",
      actionLabel: "View Proctoring Audit Log"
    };
  }

  // 3. RAFT CONSENSUS / CS448 / QUESTION 1
  if (
    q.includes("raft") ||
    q.includes("consensus") ||
    q.includes("question 1") ||
    q.includes("q1") ||
    q.includes("follower") ||
    q.includes("log index")
  ) {
    return {
      text: `💡 **CS-448 Question 1: Raft Consensus Recovery Hint**:\n\n` +
        `In Raft, when a follower unannouncely disconnects, you must guarantee:\n` +
        `1. **Zero Silent Data Loss**: Buffer candidate state entries into local storage (IndexedDB) with monotonic log index.\n` +
        `2. **Merkle Hash Chaining**: Append each state delta with the prior hash \`hashChain.head\` to prevent log tampering.\n` +
        `3. **Commit Barrier**: When disconnected, mark status as \`BUFFERED_OFFLINE\`; once re-established, replay state deltas to the leader in order.\n\n` +
        `*Formula*: $$\\text{Hash}_{i} = \\text{SHA-256}(\\text{Hash}_{i-1} \\parallel \\text{LogEntry}_{i})$$`,
      actionType: "navigate",
      actionLabel: "Open Question 1"
    };
  }

  // 4. QUESTION 2 / MERKLE TREE / CRYPTO VALIDATION
  if (
    q.includes("merkle") ||
    q.includes("question 2") ||
    q.includes("q2") ||
    q.includes("hash chain") ||
    q.includes("proof")
  ) {
    return {
      text: `🔐 **Question 2 & Merkle Cryptography Explanation**:\n\n` +
        `ReviveX computes a continuous SHA-256 Merkle root of your keystroke stream.\n\n` +
        `• **Leaf nodes**: Represent individual 10ms telemetry deltas.\n` +
        `• **Proof path**: A sequence of sibling hashes allowing anyone to verify your answer was recorded at that exact timestamp in $O(\\log N)$ time without exposing private answers.\n` +
        `• **Non-repudiation**: Neither the university nor network glitches can alter your submitted code without invalidating the Merkle root!`,
      actionType: "show_merkle",
      actionLabel: "Inspect Live Merkle Hash Chain"
    };
  }

  // 5. QUESTION 3 / DIGITAL TWIN SHADOW SYNC / ESSAY
  if (
    q.includes("question 3") ||
    q.includes("q3") ||
    q.includes("digital twin") ||
    q.includes("shadow") ||
    q.includes("essay")
  ) {
    return {
      text: `🤖 **Question 3 Essay Framework: Digital Twin Shadow Copy**:\n\n` +
        `ReviveX maintains an active **Digital Twin Shadow Worker** on the edge cloud.\n\n` +
        `Key points to include in your answer:\n` +
        `• **Dual Ingestion**: Keystrokes are processed both in the client IndexedDB and the edge shadow node simultaneously.\n` +
        `• **CRDT Merge Engine**: State conflicts during network splits resolve autonomously using state-vector clocks.\n` +
        `• **Sub-2.4s Recovery**: If your browser or OS crashes, launching a new session instantly hydrates from the nearest edge shadow twin with zero lost characters!`,
      actionType: "navigate",
      actionLabel: "Jump to Question 3"
    };
  }

  // 6. QUANTUM PHYSICS / PHYS-301
  if (
    q.includes("quantum") ||
    q.includes("phys-301") ||
    q.includes("shor") ||
    q.includes("kraus") ||
    q.includes("stabilizer")
  ) {
    return {
      text: `⚛️ **PHYS-301 Quantum Error Correction Reference**:\n\n` +
        `• **Shor's 9-Qubit Code**: Encodes 1 logical qubit into 9 physical qubits, correcting arbitrary single-qubit errors (bit-flip $X$, phase-flip $Z$, or both $Y$).\n` +
        `• **Kraus Operators**: Under open quantum system dynamics, density matrix evolution is given by:\n` +
        `$$\\rho(t) = \\sum_k K_k \\rho(0) K_k^\\dagger, \\quad \\sum_k K_k^\\dagger K_k = I$$\n` +
        `• **Threshold Theorem**: Fault-tolerant surface codes allow universal computation when physical error rates stay below $\\sim 1\\%$.`,
      actionType: "reminder",
      actionLabel: "Add Quantum Review to Schedule"
    };
  }

  // 7. POST-QUANTUM CRYPTOGRAPHY / SEC-502 / LWE
  if (
    q.includes("lattice") ||
    q.includes("sec-502") ||
    q.includes("lwe") ||
    q.includes("post-quantum") ||
    q.includes("kyber")
  ) {
    return {
      text: `🛡️ **SEC-502 Post-Quantum Cryptography Notes**:\n\n` +
        `• **Learning With Errors (LWE)**: Relies on the hardness of finding short vectors in high-dimensional lattices (e.g. Shortest Vector Problem, SVP).\n` +
        `• **Quantum Immunity**: Unlike RSA and ECC which are solved in polynomial time by Shor's algorithm, lattice-based problems have no known polynomial-time quantum solutions.\n` +
        `• **Kyber-1024**: ReviveX's post-quantum protocol for securing exam submission receipts against future quantum decryption.`,
      actionType: "reminder",
      actionLabel: "View SEC-502 Syllabus"
    };
  }

  // 8. 100HZ TELEMETRY & WI-FI DISCONNECT / OFFLINE BUFFER
  if (
    q.includes("100hz") ||
    q.includes("telemetry") ||
    q.includes("wifi") ||
    q.includes("disconnect") ||
    q.includes("network") ||
    q.includes("offline") ||
    q.includes("save")
  ) {
    return {
      text: `⚡ **How ReviveX 100Hz Local Resilience Protects You**:\n\n` +
        `1. **Zero Cloud Dependency While Typing**: Every keystroke writes in <1.2ms to your browser's persistent IndexedDB storage.\n` +
        `2. **If Wi-Fi drops**: Nothing is lost! The bot alerts you with offline status, but you can keep coding without interruption.\n` +
        `3. **Automatic Re-sync**: When internet returns, all buffered state deltas re-synchronize in under 180ms with 0 byte loss guaranteed!`,
      actionType: "test_wifi",
      actionLabel: "Simulate Network Drop (Cry & Recover)"
    };
  }

  // 9. STUDENT RECORD & GPA
  if (
    q.includes("gpa") ||
    q.includes("profile") ||
    q.includes("record") ||
    q.includes("grade") ||
    q.includes("score") ||
    q.includes("alex chen")
  ) {
    if (!student) {
      return {
        text: `🎓 **Academic Transcript & GPA**:\n\nYou are currently browsing as a guest! Sign in through the **Student Pod** (e.g. Alex Chen - STU-84920) to view your verified academic records, 9.95 CGPA, and cryptographic Merkle proof receipts.`,
        actionType: "navigate",
        actionLabel: "Go to Student Login"
      };
    }
    return {
      text: `🎓 **Verified Academic Transcript for ${student.name}**:\n\n` +
        `• **Candidate ID**: ${student.candidateNumber} (${student.id})\n` +
        `• **Institution**: ${student.university}\n` +
        `• **Department**: ${student.department}\n` +
        `• **Cumulative GPA**: **${student.gpa}** (Top 1% Class Standing)\n\n` +
        `📜 **Completed Exam Proofs**:\n` +
        `1. **CS-301 Consensus Protocols**: 98 / 100 (Receipt: Verified)\n` +
        `2. **ALG-202 Advanced Algorithms**: 96 / 100 (Receipt: Verified)\n\n` +
        `*All scores are backed by SHA-256 Merkle root verification receipts.*`,
      actionType: "show_merkle",
      actionLabel: "View Tamper-Evident Ledger"
    };
  }

  // 10. TIME REMAINING & TEST DURATION
  if (
    q.includes("time") ||
    q.includes("how long") ||
    q.includes("remaining") ||
    q.includes("duration") ||
    q.includes("timer")
  ) {
    const timeStr = context?.timeRemainingFormatted || "74:18";
    return {
      text: `⏱️ **Exam Timer Status**:\n\n` +
        `• **Active Exam**: ${exam.code} (${exam.title})\n` +
        `• **Time Remaining**: **${timeStr}**\n` +
        `• **Total Duration**: ${exam.duration}\n\n` +
        `💡 *Recommendation*: Allocate ~25 minutes to Question 1, 15 minutes to Question 2, and 20 minutes to Question 3, leaving 10 minutes for final review.`,
      actionType: "reminder",
      actionLabel: "Set 10-Minute Alert"
    };
  }

  // 11. SWITCH DEVICE / LAPTOP RECOVERY
  if (
    q.includes("switch") ||
    q.includes("laptop") ||
    q.includes("device") ||
    q.includes("crash") ||
    q.includes("dead battery")
  ) {
    return {
      text: `🔄 **Instant Cross-Device Migration Guide**:\n\n` +
        `If your laptop battery dies or computer crashes during the exam:\n\n` +
        `1. Open ReviveX on any secondary laptop, phone, or tablet.\n` +
        `2. Click **Cross-Device Recovery** and enter your Student ID (\`${student.id}\`).\n` +
        `3. Enter your instant 6-digit recovery OTP.\n` +
        `4. Your exact editor state and timer restore in **< 2.4 seconds with zero lost characters**!`,
      actionType: "navigate",
      actionLabel: "Open Cross-Device Migration Modal"
    };
  }

  // 12. STRESS RELIEF & CALMING BREATH
  if (
    q.includes("nervous") ||
    q.includes("stress") ||
    q.includes("anxious") ||
    q.includes("calm") ||
    q.includes("scared") ||
    q.includes("breathe")
  ) {
    return {
      text: `🌿 **Take a Deep Breath, ${student.name.split(" ")[0]}!**\n\n` +
        `You've prepared well for this. ReviveX is actively guarding your exam session—even if your internet blips or computer restarts, you will not lose a single word.\n\n` +
        `🧘 **Quick 4-7-8 Centering Exercise**:\n` +
        `1. Inhale deeply through your nose for **4 seconds**.\n` +
        `2. Hold your breath gently for **7 seconds**.\n` +
        `3. Exhale smoothly through your mouth for **8 seconds**.\n\n` +
        `*You've got this! ReviveX Bot is right here watching your back.*`,
      actionType: "calm_down",
      actionLabel: "Take a 30-Second Refresh"
    };
  }

  // 13. DEFAULT INTELLIGENT HELPFUL FALLBACK
  return {
    text: `🤖 **ReviveX Student Guardian at your service!**\n\n` +
      `I can help you with:\n` +
      `• **Academic Concepts**: Raft Consensus, Shor Quantum Codes, Lattice Cryptography, Merkle Proofs.\n` +
      `• **Exam Security**: Anti-cheat rules, tab switch alerts, proctoring guidelines.\n` +
      `• **Schedule & Reminders**: Upcoming test dates, countdown alerts, syllabus topics.\n` +
      `• **Platform Protection**: 100Hz local buffer, Wi-Fi crash recovery, cross-device resume.\n\n` +
      `Feel free to click any suggestion below or ask me any question!`,
    actionType: "reminder",
    actionLabel: "Show Exam Schedule"
  };
}
