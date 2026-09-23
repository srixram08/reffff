"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Line, Ring } from "@react-three/drei";
import * as THREE from "three";

interface RollbackTimeline3DProps {
  isSimulatingFailure: boolean;
  onRollbackComplete?: () => void;
}

export const RollbackTimeline3DContent: React.FC<RollbackTimeline3DProps> = ({
  isSimulatingFailure,
  onRollbackComplete,
}) => {
  const tokenRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const [tokenPos, setTokenPos] = useState<[number, number, number]>([-3, 0, 0]);
  const [status, setStatus] = useState<"normal" | "glitching" | "rolling-back" | "restored">("normal");
  const [ringScale, setRingScale] = useState(0.1);
  const [ringOpacity, setRingOpacity] = useState(0);

  // Checkpoints at x = -3, -1, 1, 3
  const checkpoints = [-3, -1, 1, 3];

  useEffect(() => {
    if (isSimulatingFailure && status === "normal") {
      const t1 = setTimeout(() => {
        setStatus("glitching");

        // After glitching for 600ms, snap back to last valid checkpoint (x = -1)
        const t2 = setTimeout(() => {
          setStatus("rolling-back");
          setTokenPos([-1, 0, 0]); // snap back
          setRingOpacity(1);
          setRingScale(0.2);

          const t3 = setTimeout(() => {
            setStatus("restored");
            if (onRollbackComplete) onRollbackComplete();

            const t4 = setTimeout(() => {
              setStatus("normal");
            }, 1500);
            return () => clearTimeout(t4);
          }, 800);
          return () => clearTimeout(t3);
        }, 600);
        return () => clearTimeout(t2);
      }, 0);

      return () => clearTimeout(t1);
    }
  }, [isSimulatingFailure, status, onRollbackComplete]);

  useFrame((_, delta) => {
    // Continuous travel forward in normal mode
    if (status === "normal" && tokenRef.current) {
      const newX = tokenRef.current.position.x + delta * 1.2;
      if (newX > 3.2) {
        tokenRef.current.position.x = -3;
      } else {
        tokenRef.current.position.x = newX;
      }
    } else if (status === "glitching" && tokenRef.current) {
      // Jitter
      tokenRef.current.position.x += (Math.random() - 0.5) * 0.15;
      tokenRef.current.position.y = (Math.random() - 0.5) * 0.2;
    } else if (status === "rolling-back" && tokenRef.current) {
      tokenRef.current.position.set(-1, 0, 0);
      setRingScale((prev) => Math.min(prev + delta * 4, 2.5));
      setRingOpacity((prev) => Math.max(prev - delta * 1.5, 0));
    } else if (status === "restored" && tokenRef.current) {
      tokenRef.current.position.x += delta * 0.8;
      tokenRef.current.position.y = 0;
    }
  });

  const getTokenColor = () => {
    if (status === "glitching") return "#FF4D4D";
    if (status === "rolling-back") return "#FFB020";
    if (status === "restored") return "#00FF7F";
    return "#00FF7F";
  };

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 5, 5]} intensity={1.5} color="#00FF7F" />

      {/* Main Track Line */}
      <Line
        points={[
          [-4, 0, 0],
          [4, 0, 0],
        ]}
        color="#0A3D24"
        lineWidth={3}
      />

      {/* Checkpoint Nodes */}
      {checkpoints.map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          <Sphere args={[0.15, 16, 16]}>
            <meshBasicMaterial
              color={x === -1 && status === "restored" ? "#00FF7F" : "#00C853"}
            />
          </Sphere>
          {/* Node pulse outer ring */}
          <Ring args={[0.2, 0.25, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#00FF7F" transparent opacity={0.4} />
          </Ring>
        </group>
      ))}

      {/* Traveling Token */}
      <Sphere ref={tokenRef} position={tokenPos} args={[0.25, 32, 32]}>
        <meshStandardMaterial
          color={getTokenColor()}
          emissive={getTokenColor()}
          emissiveIntensity={status === "glitching" ? 1.5 : 0.8}
        />
      </Sphere>

      {/* Shockwave Ripple ring on Rollback */}
      {status === "rolling-back" && (
        <group position={[-1, 0, 0]}>
          <Ring ref={ringRef} args={[ringScale, ringScale + 0.1, 32]} rotation={[0, 0, 0]}>
            <meshBasicMaterial color="#00FF7F" transparent opacity={ringOpacity} />
          </Ring>
        </group>
      )}
    </group>
  );
};
