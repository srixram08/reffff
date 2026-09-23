// Anti-Cheat & Proctoring Engine for ReviveX
// Actively monitors tab switching, window defocus, cursor wandering, copy-paste, and DevTools attempts

import { botAudio } from "./botAudio";

export interface ProctorViolation {
  id: string;
  timestamp: string;
  type: "tab_switch" | "window_blur" | "cursor_leave" | "clipboard_tamper" | "devtools_attempt" | "context_menu";
  title: string;
  description: string;
  severity: "high" | "critical" | "warning";
  strikeNumber: number;
}

export type ViolationListener = (violation: ProctorViolation) => void;

class ProctorMonitorEngine {
  private isEnabled: boolean = false;
  private strikes: number = 0;
  private maxStrikes: number = 3;
  private violations: ProctorViolation[] = [];
  private listeners: Set<ViolationListener> = new Set();
  private lastViolationTime: number = 0;
  private cooldownMs: number = 2500; // prevent rapid duplicate spamming within 2.5s

  constructor() {
    if (typeof window !== "undefined") {
      this.attachListeners();
    }
  }

  public subscribe(listener: ViolationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setMonitoringEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public isMonitoring(): boolean {
    return this.isEnabled;
  }

  public getStrikes(): number {
    return this.strikes;
  }

  public getMaxStrikes(): number {
    return this.maxStrikes;
  }

  public getViolations(): ProctorViolation[] {
    return [...this.violations];
  }

  public resetViolations() {
    this.strikes = 0;
    this.violations = [];
    this.lastViolationTime = 0;
  }

  private recordViolation(
    type: ProctorViolation["type"],
    title: string,
    description: string,
    severity: ProctorViolation["severity"] = "high"
  ) {
    if (!this.isEnabled) return;

    const now = Date.now();
    // Debounce to prevent cascading double events (e.g. blur + visibilitychange firing together)
    if (now - this.lastViolationTime < this.cooldownMs) {
      return;
    }
    this.lastViolationTime = now;

    this.strikes = Math.min(this.maxStrikes, this.strikes + 1);

    const violation: ProctorViolation = {
      id: `VIOL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      title,
      description,
      severity,
      strikeNumber: this.strikes
    };

    this.violations.unshift(violation);

    // Play warning siren
    botAudio.playWarningBeep();

    // Broadcast to listeners
    this.listeners.forEach((listener) => {
      try {
        listener(violation);
      } catch (err) {
        console.error("Proctor listener error:", err);
      }
    });

    // Also persist into session security log
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("revivex_proctor_log");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(violation);
        sessionStorage.setItem("revivex_proctor_log", JSON.stringify(list.slice(0, 50)));
        window.dispatchEvent(new CustomEvent("revivex_violation_event", { detail: violation }));
      } catch {
        // ignore
      }
    }
  }

  private attachListeners() {
    if (typeof window === "undefined") return;

    // 1. Tab Switching (Page Visibility API)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isEnabled) {
        this.recordViolation(
          "tab_switch",
          "Unauthorized Tab Switch",
          "Browser tab switched to background. All actions are logged to Merkle security chain.",
          "critical"
        );
      }
    });

    // 2. Window Blur (Alt-Tab, multi-window sneak)
    window.addEventListener("blur", () => {
      if (this.isEnabled) {
        this.recordViolation(
          "window_blur",
          "Focus Lost / Window Defocused",
          "Candidate navigated away from active exam window or switched application.",
          "high"
        );
      }
    });

    // 3. Cursor Leaving Browser Boundaries (sneaking to second monitor)
    document.addEventListener("mouseleave", () => {
      if (this.isEnabled) {
        this.recordViolation(
          "cursor_leave",
          "Mouse Left Exam Boundary",
          "Cursor drifted outside active browser view area.",
          "warning"
        );
      }
    });

    // 4. Clipboard Tampering (unauthorized copy/paste)
    document.addEventListener("copy", (e) => {
      if (this.isEnabled) {
        // Allow copy only if inside permitted elements or notify
        this.recordViolation(
          "clipboard_tamper",
          "Clipboard Copy Intercepted",
          "Question content or exam code copy attempted during proctored session.",
          "high"
        );
      }
    });

    document.addEventListener("paste", (e) => {
      if (this.isEnabled) {
        this.recordViolation(
          "clipboard_tamper",
          "External Paste Attempted",
          "External text insertion detected. Keystrokes are verified against CRDT state history.",
          "high"
        );
      }
    });

    // 5. Inspect Element / DevTools Hotkeys & Right-Click
    window.addEventListener("keydown", (e) => {
      if (!this.isEnabled) return;

      // F12 or Ctrl+Shift+I or Ctrl+Shift+J or Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U"))
      ) {
        e.preventDefault();
        this.recordViolation(
          "devtools_attempt",
          "Developer Tools / Source Inspection Blocked",
          "Attempted inspection shortcut intercepted by ReviveX Autonomous Proctor.",
          "critical"
        );
      }
    });

    // Prevent unauthorized right clicks in strict exam mode
    window.addEventListener("contextmenu", (e) => {
      if (this.isEnabled) {
        e.preventDefault();
        this.recordViolation(
          "context_menu",
          "Right-Click Context Menu Blocked",
          "Context menu inspect blocked to preserve academic integrity.",
          "warning"
        );
      }
    });
  }
}

export const proctorMonitor = new ProctorMonitorEngine();
