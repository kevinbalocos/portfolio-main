"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedSkillCardProps {
  skill: string;
  delay?: number;
  href?: string;
}

export const AnimatedSkillCard: React.FC<AnimatedSkillCardProps> = ({
  skill,
  delay = 0,
  href,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const MotionTag = href ? (motion.a as typeof motion.div) : motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="px-3 py-1.5 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-400/30 text-teal-300 rounded font-mono text-sm relative overflow-hidden cursor-pointer group"
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
    >
      {/* Animated gradient background on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded opacity-0 blur"
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: -1 }}
      />

      <span className="relative z-10">{skill}</span>
    </MotionTag>
  );
};
