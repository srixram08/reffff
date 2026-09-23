/**
 * ReviveX Circuit Breaker & Capacity Control Engine
 * 
 * Solves:
 * 1. The Thundering-Herd Problem during mass venue network dropouts
 * 2. Cascading backend overload when 500+ sessions simultaneously escalate to CRITICAL
 * 3. Provides randomized exponential backoff with full jitter
 * 4. Graceful tiered degradation (full container shadow -> in-memory delta mirror)
 */

export interface CapacityStatus {
  totalActiveSessions: number;
  criticalSessions: number;
  shadowSessionQuota: number;       // Max full shadow pods allowed (e.g. 50)
  activeShadowSessions: number;
  circuitState: "CLOSED" | "HALF_OPEN" | "OPEN";
  isBackpressureActive: boolean;
  activeTier: "FULL_CONTAINER" | "REDIS_DELTA_MIRROR" | "CLIENT_AUTONOMOUS";
}

export class ReconnectionCircuitBreaker {
  private baseDelayMs: number;
  private maxDelayMs: number;
  private currentAttempt: number;

  constructor(baseDelayMs = 500, maxDelayMs = 15000) {
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
    this.currentAttempt = 0;
  }

  // Full Jitter Backoff formula: Sleep = rand(0, min(M, T0 * 2^attempt))
  public getNextBackoffMs(): number {
    this.currentAttempt++;
    const exponentialCap = Math.min(this.maxDelayMs, this.baseDelayMs * Math.pow(2, this.currentAttempt));
    const jitteredWait = Math.floor(Math.random() * exponentialCap);
    return Math.max(100, jitteredWait);
  }

  public reset(): void {
    this.currentAttempt = 0;
  }
}

// Global server capacity simulator for 1,000 students
let simulatedCapacity: CapacityStatus = {
  totalActiveSessions: 1240,
  criticalSessions: 14,
  shadowSessionQuota: 60, // Maximum 60 concurrent full shadow pods
  activeShadowSessions: 14,
  circuitState: "CLOSED",
  isBackpressureActive: false,
  activeTier: "FULL_CONTAINER",
};

export function getCapacityMetrics(): CapacityStatus {
  return { ...simulatedCapacity };
}

// Evaluate whether a session escalation can receive a full shadow or must degrade
export function requestShadowAllocation(candidateId: string): {
  allocatedTier: "FULL_CONTAINER" | "REDIS_DELTA_MIRROR" | "CLIENT_AUTONOMOUS";
  message: string;
} {
  if (simulatedCapacity.activeShadowSessions < simulatedCapacity.shadowSessionQuota) {
    simulatedCapacity.activeShadowSessions++;
    return {
      allocatedTier: "FULL_CONTAINER",
      message: "Allocated dedicated edge shadow replica pod.",
    };
  }

  // Quota exceeded: Trigger graceful backpressure tier
  simulatedCapacity.isBackpressureActive = true;
  simulatedCapacity.circuitState = "HALF_OPEN";

  return {
    allocatedTier: "REDIS_DELTA_MIRROR",
    message: "Global shadow quota reached. Allocated lightweight compressed delta mirror.",
  };
}

export function releaseShadowAllocation(): void {
  if (simulatedCapacity.activeShadowSessions > 0) {
    simulatedCapacity.activeShadowSessions--;
  }
  if (simulatedCapacity.activeShadowSessions < simulatedCapacity.shadowSessionQuota) {
    simulatedCapacity.isBackpressureActive = false;
    simulatedCapacity.circuitState = "CLOSED";
  }
}
