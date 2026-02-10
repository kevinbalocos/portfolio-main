"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface SparklesProps {
  children?: React.ReactNode;
  className?: string;
  particleColor?: string;
  particleSize?: number;
  sparkleCount?: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  children,
  className = "",
  particleColor = "#FFFFFF",
  particleSize = 2,
  sparkleCount = 50,
}) => {
  const [sparks, setSparks] = React.useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSparks: Spark[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      newSparks.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * particleSize + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 0.5,
      });
    }
    setSparks(newSparks);
  }, [sparkleCount, particleSize]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particleColor,
              width: spark.size,
              height: spark.size,
              left: `${spark.x}%`,
              top: `${spark.y}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [1, 0],
            }}
            transition={{
              duration: spark.duration,
              delay: spark.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
};

export const SparklesCore: React.FC<{
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number;
}> = ({
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 1200,
  className = "",
  particleColor = "#FFFFFF",
  speed = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = React.useState<Spark[]>([]);

  useEffect(() => {
    const particleCount = Math.floor(
      (particleDensity * window.innerWidth * window.innerHeight) / 100000,
    );
    const newParticles: Spark[] = [];

    for (let i = 0; i < Math.min(particleCount, 200); i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: (Math.random() * 3 + 2) / speed,
        delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
  }, [particleDensity, minSize, maxSize, speed]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ background }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particleColor,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, -50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
