"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface EvervaultCardProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

const Icon = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

interface EvervaultCardContentProps {
  text?: string;
}

const EvervaultCardContent: React.FC<EvervaultCardContentProps> = ({
  text = "",
}) => {
  const letters = Array.from(text);
  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {letters.map((letter, index) => (
        <motion.div
          key={index}
          ref={(el) => {
            letterRefs.current[index] = el;
          }}
          className="text-xl font-bold text-white/30"
          whileHover={{
            color: "rgba(255, 255, 255, 1)",
            scale: 1.2,
          }}
          transition={{ duration: 0.3 }}
        >
          {letter}
        </motion.div>
      ))}
    </div>
  );
};

export const EvervaultCard: React.FC<EvervaultCardProps> = ({
  text,
  className = "",
  children,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotateX: isHovered ? mousePosition.y : 0,
        rotateY: isHovered ? mousePosition.x : 0,
      }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ perspective: 1000 }}
      className={`relative w-full h-full ${className}`}
    >
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-blue-500/20 rounded-2xl pointer-events-none"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {children || (text && <EvervaultCardContent text={text} />)}
    </motion.div>
  );
};

export { Icon };
