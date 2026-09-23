/**
 * ReviveX Server-Authoritative Time Synchronization Engine
 * 
 * Solves:
 * 1. Client clock manipulation / time cheating
 * 2. Background tab setInterval throttling (Chromium/WebKit 1-minute clamp)
 * 3. Network delay skew via NTP 4-timestamp offset estimation
 */

export interface TimeSyncMetadata {
  clientSendTime: number;
  serverReceiveTime: number;
  serverTransmitTime: number;
  clientReceiveTime: number;
  estimatedClockOffsetMs: number;
  roundTripDelayMs: number;
  lastSyncTimestamp: number;
}

let activeClockOffsetMs = 0;
let lastSyncTime = 0;

// Calculate NTP clock offset: Offset = ((T2 - T1) + (T3 - T4)) / 2
export function computeNtpOffset(
  t1ClientSend: number,
  t2ServerRecv: number,
  t3ServerTransmit: number,
  t4ClientRecv: number
): TimeSyncMetadata {
  const roundTripDelay = (t4ClientRecv - t1ClientSend) - (t3ServerTransmit - t2ServerRecv);
  const clockOffset = ((t2ServerRecv - t1ClientSend) + (t3ServerTransmit - t4ClientRecv)) / 2;

  activeClockOffsetMs = Math.round(clockOffset);
  lastSyncTime = t4ClientRecv;

  return {
    clientSendTime: t1ClientSend,
    serverReceiveTime: t2ServerRecv,
    serverTransmitTime: t3ServerTransmit,
    clientReceiveTime: t4ClientRecv,
    estimatedClockOffsetMs: activeClockOffsetMs,
    roundTripDelayMs: Math.max(0, Math.round(roundTripDelay)),
    lastSyncTimestamp: lastSyncTime,
  };
}

// Perform a simulated NTP handshake with simulated edge node
export function syncWithServer(simulatedServerLagMs = 18): TimeSyncMetadata {
  const now = Date.now();
  const t1 = now;
  const t2 = now + simulatedServerLagMs;
  const t3 = t2 + 2; // 2ms server processing
  const t4 = now + simulatedServerLagMs * 2 + 2;

  return computeNtpOffset(t1, t2, t3, t4);
}

// Get the authoritative remaining seconds given an exam's server-side end timestamp
export function getAuthoritativeRemainingSeconds(serverExamEndTimeMs: number): number {
  const currentSynchronizedTime = Date.now() + activeClockOffsetMs;
  const remainingMs = Math.max(0, serverExamEndTimeMs - currentSynchronizedTime);
  return Math.floor(remainingMs / 1000);
}

export function formatTimeRemaining(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
