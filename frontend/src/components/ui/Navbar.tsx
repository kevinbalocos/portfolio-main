"use client";

import React, { useState, useEffect } from "react";
import { useThreeD } from "@/contexts/ThreeDContext";

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const { is3DEnabled, toggle3D, setIsHoveringToggle } = useThreeD();

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "experience",
        "skills",
        "projects",
   
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const emitBotShake = (
    active: boolean,
    message = "please no",
    opts?: { ampPx?: number; freqHz?: number; bob?: number },
  ) => {
    try {
      const ev = new CustomEvent("bot-shake", {
        detail: { active, message, ...(opts ?? {}) },
      });
      window.dispatchEvent(ev);
    } catch {
      // fallback for older envs
      (window as any).dispatchEvent({
        type: "bot-shake",
        detail: { active, message, ...(opts ?? {}) },
      });
    }
  };

  // When hovered and the button currently shows "3D ON", activate a small fast shake.
  const handle3DHoverEnter = () => {
    if (is3DEnabled) {
      // More noticeable left-right amplitude (20px), medium frequency -> strong "no" shake
      emitBotShake(true, "please no", { ampPx: 50, freqHz: 5, bob: 4 });
    }
  };
  const handle3DHoverLeave = () => {
    emitBotShake(false);
    // Emit thank you event when hover ends
    try {
      const ev = new CustomEvent("thank-you", { detail: {} });
      window.dispatchEvent(ev);
    } catch {
      (window as any).dispatchEvent({ type: "thank-you", detail: {} });
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
 
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-black/40 backdrop-blur-md border-b border-white/5 shadow-2xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 group">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
            >
              <div className="relative w-8 h-7 rounded-md bg-gradient-to-br from-teal-400 to-cyan-400 shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center">
                <div className="absolute inset-0.5 rounded-md bg-black/20"></div>
                <span className="relative text-white font-bold text-xs">
                  KC
                </span>
              </div>
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
                  activeSection === id
                    ? "text-teal-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              // Toggle still toggles 3D — clicking should also cancel any shake.
              onClick={() => {
                emitBotShake(false);
                toggle3D();
              }}
              onMouseEnter={handle3DHoverEnter}
              onMouseLeave={handle3DHoverLeave}
              onFocus={handle3DHoverEnter}
              onBlur={handle3DHoverLeave}
              aria-pressed={is3DEnabled}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center w-4 h-4">
                {is3DEnabled ? (
                  <svg
                    className="w-4 h-4 text-teal-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold w-[50px]">
                {is3DEnabled ? "3D ON" : "3D OFF"}
              </span>
            </button>

           
          </div>
        </div>
      </div>
    </nav>
  );
}
