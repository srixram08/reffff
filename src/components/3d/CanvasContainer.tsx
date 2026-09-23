"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

interface CanvasContainerProps {
  children: React.ReactNode;
  fallbackSvg?: React.ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  children,
  fallbackSvg,
  className = "h-[400px] w-full",
  camera = { position: [0, 0, 5], fov: 60 },
}) => {
  const [useFallback, setUseFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);

      // Check prefers-reduced-motion
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setUseFallback(true);
        return;
      }

      // Check WebGL availability
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          setUseFallback(true);
        }
      } catch {
        setUseFallback(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-[#0A3D24] bg-[#0B120E]/50 ${className}`}>
        <div className="flex items-center gap-2 font-mono text-xs text-[#00FF7F]">
          <span className="h-2 w-2 rounded-full bg-[#00FF7F] animate-ping" />
          INITIALIZING WEBGL DIGITAL TWIN CORE...
        </div>
      </div>
    );
  }

  if (useFallback && fallbackSvg) {
    return <div className={`relative ${className}`}>{fallbackSvg}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={camera}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        {children}
      </Canvas>
    </div>
  );
};
