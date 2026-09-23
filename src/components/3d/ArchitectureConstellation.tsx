"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Line, Text } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
}

const NODES: NodeData[] = [
  { id: "client", label: "Client Device", position: [-3, 1.2, 0], color: "#7C3AED" },
  { id: "edge", label: "Edge Cache Layer", position: [-1.5, -0.8, 0], color: "#6366F1" },
  { id: "ai", label: "AI Risk ML Engine", position: [0, 1.5, 0], color: "#A855F7" },
  { id: "twin", label: "Digital Twin Store", position: [1.5, -0.8, 0], color: "#8B5CF6" },
  { id: "rollback", label: "Rollback Engine", position: [3, 1.2, 0], color: "#9333EA" },
  { id: "audit", label: "Audit Hash Chain", position: [0, -1.8, 0], color: "#4F46E5" },
];

const CONNECTIONS: [string, string][] = [
  ["client", "edge"],
  ["edge", "ai"],
  ["ai", "twin"],
  ["twin", "rollback"],
  ["rollback", "audit"],
  ["client", "twin"],
  ["edge", "audit"],
];

export const ArchitectureConstellationContent: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#8B5CF6" />

      {/* Connecting Lines */}
      {CONNECTIONS.map(([fromId, toId], idx) => {
        const fromNode = NODES.find((n) => n.id === fromId);
        const toNode = NODES.find((n) => n.id === toId);
        if (!fromNode || !toNode) return null;

        const isHighlighted =
          hoveredNode === fromId || hoveredNode === toId;

        return (
          <Line
            key={idx}
            points={[fromNode.position, toNode.position]}
            color={isHighlighted ? "#A855F7" : "#C4B5FD"}
            lineWidth={isHighlighted ? 3 : 1.5}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <group
            key={node.id}
            position={node.position}
            onPointerOver={() => setHoveredNode(node.id)}
            onPointerOut={() => setHoveredNode(null)}
          >
            <Sphere args={[isHovered ? 0.35 : 0.25, 32, 32]}>
              <meshStandardMaterial
                color={isHovered ? "#C084FC" : node.color}
                emissive={isHovered ? "#7C3AED" : node.color}
                emissiveIntensity={isHovered ? 1.4 : 0.6}
              />
            </Sphere>

            {/* 3D Label */}
            <Text
              position={[0, 0.45, 0]}
              fontSize={0.22}
              color={isHovered ? "#7C3AED" : "#1E1B4B"}
              anchorX="center"
              anchorY="middle"
            >
              {node.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
