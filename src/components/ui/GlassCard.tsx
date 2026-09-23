"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  glowOnHover?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  enableTilt = false,
  glowOnHover = true,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rX = -((y - centerY) / centerY) * 8; // max 8 deg tilt
      const rY = ((x - centerX) / centerX) * 8;
      setRotateX(rX);
      setRotateY(rY);
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden rounded-xl border border-[#0A3D24] bg-[#0B120E]/80 backdrop-blur-md p-6 text-[#E8FCEF] transition-all duration-300 ${
        glowOnHover ? "hover:border-[#00FF7F]/40 hover:shadow-[0_0_25px_rgba(0,255,127,0.15)]" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Dynamic Cursor Light Overlay */}
      {glowOnHover && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 255, 127, 0.12), transparent 40%)`,
          }}
        />
      )}
      
      {/* HUD Corner Tech Accents */}
      <div className="pointer-events-none absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-[#00FF7F]/40" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-[#00FF7F]/40" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
