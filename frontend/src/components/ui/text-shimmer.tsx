"use client";

import type React from "react";
import { motion } from "framer-motion";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const TextShimmer: React.FC<TextShimmerProps> = ({
  children,
  className = "",
  duration = 2,
}) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      style={{
        background:
          "linear-gradient(90deg, currentColor 0%, rgba(255,255,255,0.5) 50%, currentColor 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
      animate={{
        backgroundPosition: ["200% 0%", "-200% 0%"],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
};
