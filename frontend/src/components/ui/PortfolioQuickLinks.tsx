"use client";

import { useState } from "react";
import { CardStack, type CardStackItem } from "@/components/card-stack";
import portfolioV1 from "@/components/attachments/portfolio-v1.png";
import dcsi from "@/components/attachments/DCSI.png";
import recordsManagement from "@/components/attachments/Records-Management.png";

export function PortfolioQuickLinks() {
  const [open, setOpen] = useState(false);

  const items: CardStackItem[] = [
    {
      id: 1,
      title: "Portfolio V1",
      description: "double press me",
      href: "https://piesway-v1.vercel.app/",
      imageSrc: portfolioV1,
    },
    {
      id: 2,
      title: "Portfolio V2",
      description: "double press me",
      href: "walapa",
      imageSrc: dcsi,
    },
    {
      id: 3,
      title: "Portfolio V3",
      description: "double press me",
      href: "walapa",
      imageSrc: recordsManagement,
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {open && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
          <div className="pointer-events-auto w-[520px] sm:w-[640px] rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 shadow-2xl">
            <CardStack
              items={items}
              cardWidth={460}
              cardHeight={300}
              maxVisible={5}
              overlap={0.52}
              spreadDeg={40}
              activeScale={1.05}
              inactiveScale={0.92}
              showDots
            />
          </div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle portfolio quick links"
          onClick={() => setOpen((v) => !v)}
          className="group relative grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-teal-400/80 via-cyan-400/70 to-blue-500/80 text-black shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex flex-col items-center leading-none">
            
            <span className="text-[11px] font-semibold tracking-[0.2em]">
              {open ? "CLOSE" : "OPEN"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
