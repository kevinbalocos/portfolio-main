"use client";

import { motion } from "framer-motion";
import profileImage from "@/components/attachments/profile-portfolio.png";
import { SparklesCore } from "@/components/ui/Sparkles";
import { EvervaultCard } from "@/components/ui/sections/ABOUT/evervault-card";
import { AnimatedBackground } from "@/components/ui/sections/ABOUT/animated-background";
import { AnimatedSkillCard } from "@/components/ui/sections/ABOUT/animated-skill-card";

export function AboutSection() {
  return (
    <section
      id="about"
      className="w-full min-h-screen bg-gradient-to-b from-black via-slate-900 to-black relative flex items-center justify-center overflow-hidden py-24 pt-40"
    >
      {/* Animated Background */}
      <AnimatedBackground className="opacity-30" />

      {/* Sparkles effect */}
      <div className="absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticles-about"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#14B8A6"
          speed={0.5}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header with animation */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-teal-400 font-mono text-sm">About</span>
            <motion.div
              className="h-px bg-teal-400/30 flex-1 max-w-12"
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            A bit about me.
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Image Section with Evervault Card */}
          <motion.div
            className="lg:col-span-1 flex justify-center lg:justify-start sticky top-32"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              {/* Enhanced Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-teal-500/40 to-blue-500/40 rounded-2xl blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(20, 184, 166, 0.3)",
                    "0 0 40px rgba(20, 184, 166, 0.6)",
                    "0 0 20px rgba(20, 184, 166, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              {/* Image with enhanced border */}
              <EvervaultCard className="relative w-72 h-80 rounded-2xl overflow-hidden border-2 border-teal-400/30 group-hover:border-teal-400/60 transition-colors duration-300">
                <div className="relative w-full h-full">
                  <img
                    src={profileImage}
                    alt="Kevin Calalo - Profile"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Overlay shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    animate={{
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </EvervaultCard>
            </div>
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                Hey there! I'm{" "}
                <motion.span className="text-teal-400 font-bold">
                  Kevin Calalo
                </motion.span>
                , a passionate Full Stack Developer and System Analyst with a
                deep love for creating elegant solutions to complex problems.
              </p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Beyond my professional work, I'm a continuous learner who stays
                updated with the latest technologies and best practices in
                full-stack development. I specialize in React, Node.js, and
                modern database systems, and I'm always excited about exploring
                3D web experiences and interactive design.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                When I'm not coding, you can find me in any fps/rts games, or
                enjoying a good cup of coffee while thinking about the next big
                idea.
              </motion.p>
            </div>

            {/* Skills Highlight with animations */}
            <motion.div
              className="pt-4 border-t border-teal-400/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="text-teal-400 font-mono text-sm mb-4">
                Technologies I work with:
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "React", href: "https://react.dev" },
                  {
                    label: "TypeScript",
                    href: "https://www.typescriptlang.org",
                  },
                  { label: "Node.js", href: "https://nodejs.org" },
                  { label: "PostgreSQL", href: "https://www.postgresql.org" },
                  { label: "Full Stack" },
                  { label: "System Design" },
                  { label: "UI/UX" },
                  { label: "Problem Solving" },
                  { label: "tailwindcss", href: "https://tailwindcss.com" },
                  { label: "Codeigniter", href: "https://codeigniter.com" },
                  { label: "Three.js", href: "https://threejs.org" },
                  { label: "Next.js", href: "https://nextjs.org" },
                  { label: "Git", href: "https://git-scm.com" },
                  { label: "Docker", href: "https://www.docker.com" },
                  { label: "AWS", href: "https://aws.amazon.com" },
                  { label: "PHP", href: "https://www.php.net" },
                  { label: "MySQL", href: "https://www.mysql.com" },
                  { label: "REST APIs" },
                  { label: "Inter", href: "https://rsms.me/inter" },
                  { label: "Shadcn UI", href: "https://ui.shadcn.com" },
                  { label: "Lucide", href: "https://lucide.dev" },
                  { label: "MongoDB", href: "https://www.mongodb.com" },
                  { label: "socket.io", href: "https://socket.io" },
                ].map((skill, index) => (
                  <AnimatedSkillCard
                    key={skill.label}
                    skill={skill.label}
                    href={skill.href}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
