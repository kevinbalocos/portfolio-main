"use client";

import React from "react";
import { Component as LuminaInteractiveList } from "@/components/lumina-interactive-list";

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full min-h-screen bg-black">
      <LuminaInteractiveList />
    </section>
  );
}
