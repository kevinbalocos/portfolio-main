"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  download?: string | boolean;
  target?: string;
  rel?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  href,
  onClick,
  download,
  target,
  rel,
  variant = "primary",
  className = "",
}) => {
  const isPrimary = variant === "primary";
  const [isHovered, setIsHovered] = useState(false);

  const MotionComponent: React.ElementType = href ? motion.a : motion.button;

  return (
    <div className="relative">
      <MotionComponent
        {...(href
          ? { href, download, target, rel }
          : { onClick, type: "button" })}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        className={`relative px-6 py-3 font-semibold rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400/70 overflow-hidden ${
          isPrimary
            ? "bg-teal-500/20 border border-teal-400 text-teal-400"
            : "text-teal-400 border-b-2 border-teal-400 bg-transparent"
        } ${className}`}
      >
        {isHovered && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        )}

        <motion.span
          className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded opacity-0 blur pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: -1 }}
        />

        <span className="relative z-10">{children}</span>
      </MotionComponent>
    </div>
  );
};
