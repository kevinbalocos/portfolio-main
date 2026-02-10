"use client";

import React from "react";

export function FooterSection() {
  const techLinks = [
    { name: "Figma", href: "" },
    { name: "Visual Studio Code", href: "https://code.visualstudio.com/" },
    { name: "Vite", href: "https://vitejs.dev/" },
    { name: "React", href: "https://react.dev/" },
    { name: "TypeScript", href: "https://www.typescriptlang.org/" },
    { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
    { name: "Vercel", href: "https://vercel.com/" },
    { name: "Inter", href: "https://rsms.me/inter/" },
  ];

  return (
    <footer className="w-full bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-white/60 leading-relaxed">
          Loosely vibe-coded in{" "}
          <a
            href={techLinks[1].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            Visual Studio Code
          </a>{" "}
          by yours truly. Built with{" "}
          <a
            href={techLinks[2].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            Vite
          </a>
          ,{" "}
          <a
            href={techLinks[3].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            React
          </a>
          ,{" "}
          <a
            href={techLinks[4].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            TypeScript
          </a>{" "}
          and{" "}
          <a
            href={techLinks[5].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            Tailwind CSS
          </a>
          , deployed with{" "}
          <a
            href={techLinks[6].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            Vercel
          </a>
          . All text is set in the{" "}
          <a
            href={techLinks[7].href}
            className="text-white/80 hover:text-white transition-colors"
          >
            Inter
          </a>{" "}
          typeface.
        </p>
      </div>
    </footer>
  );
}
