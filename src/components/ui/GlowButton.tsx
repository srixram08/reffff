"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "warning" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  id?: string;
}

export const GlowButton = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  icon,
  disabled = false,
  type = "button",
  id,
}: GlowButtonProps) => {
  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "px-4 py-2 text-xs font-semibold",
    md: "px-6 py-2.5 text-sm font-bold",
    lg: "px-7 py-3 text-base font-bold",
  };

  const variantClasses: Record<"primary" | "secondary" | "danger" | "warning" | "outline", string> = {
    primary:
      "bg-[#2E5B28] text-white shadow-md hover:bg-[#23461E] border border-[#2E5B28]",
    secondary:
      "bg-[#E8F3E7] text-[#2E5B28] border border-[#D6E5D4] hover:border-[#2E5B28] hover:bg-[#D6E5D4]",
    danger:
      "bg-[#DC2626] text-white border border-[#DC2626] hover:bg-[#B91C1C]",
    warning:
      "bg-[#D97706] text-white border border-[#D97706] hover:bg-[#B45309]",
    outline:
      "bg-white text-[#2E5B28] border border-[#D6E5D4] hover:border-[#2E5B28] hover:bg-[#E8F3E7]",
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-sans tracking-wide transition-all duration-200 cursor-pointer select-none ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed shadow-none" : ""
      } ${className}`}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      <span className="leading-normal">{children}</span>
    </motion.button>
  );
};
