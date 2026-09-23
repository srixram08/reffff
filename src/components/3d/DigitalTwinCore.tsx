"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface CoreProps {
  isGlitching?: boolean;
}

const ParticleCloud: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 150 particle positions in a sphere shell deterministically
  const particles = React.useMemo(() => {
    const coords = new Float32Array(150 * 3);
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    let seed = 42;
    for (let i = 0; i < 150; i++) {
      const u = pseudoRandom(seed++);
      const v = pseudoRandom(seed++);
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.2 + pseudoRandom(seed++) * 0.6; // sphere radius 2.2 to 2.8

      coords[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      coords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      coords[i * 3 + 2] = r * Math.cos(phi);
    }
    return coords;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
      pointsRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00FF7F"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
};

export const DigitalTwinCoreContent: React.FC<CoreProps> = ({ isGlitching = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isGlitching ? 1.5 : 0.25);
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y -= delta * 0.4;
      innerMeshRef.current.rotation.z += delta * 0.2;
    }
  });

  const wireframeColor = isGlitching ? "#FF4D4D" : "#00FF7F";
  const innerColor = isGlitching ? "#FFB020" : "#00C853";

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={wireframeColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00FF7F" />

      {/* Outer Wireframe Icosahedron Core */}
      <Icosahedron ref={meshRef} args={[1.8, 2]}>
        <meshBasicMaterial
          wireframe
          color={wireframeColor}
          transparent
          opacity={0.7}
        />
      </Icosahedron>

      {/* Inner Glowing Core */}
      <Icosahedron ref={innerMeshRef} args={[1.0, 1]}>
        <meshStandardMaterial
          color={innerColor}
          emissive={innerColor}
          emissiveIntensity={isGlitching ? 1.2 : 0.6}
          roughness={0.2}
          wireframe
        />
      </Icosahedron>

      {/* Orbiting Particle Telemetry Nodes */}
      <ParticleCloud />
    </group>
  );
};
