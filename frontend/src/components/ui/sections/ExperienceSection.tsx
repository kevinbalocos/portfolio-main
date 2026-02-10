"use client";

import React from "react";
import {
  Briefcase,
  Code,
  Building2,
  Database,
  LayoutGrid,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";

export function ExperienceSection() {
  const experiences = [
    {
      id: 1,
      company: "Datalink Creative Solution Inc.",
      position: "Software Engineer/System Analyst",
      duration: "July,2025 - Jan,2026",
      bullets: [
        "Developed a paperless CRM platform to centralise customer data, transactions, and internal records",
        "Built responsive and user-friendly front-end interfaces for staff and administrators",
        "Implemented back-end functionalities, including authentication, data processing, and business logic",
        "Designed and managed the database structure to ensure organised, secure, and efficient data storage",
        "Created a records management system for a client to digitally store, track, and retrieve important documents",
        "Improved operational efficiency by reducing manual paperwork and streamlining data access",
        "Developed standard procedures for testing and validating software",
        "Engaged in client consultations to gather precise requirements, ensuring the delivery of customised software solutions",
      ],
      icon: Code,
      relatedIds: [2, 3],
    },
    {
      id: 2,
      company: "Freelancing",
      position: "Client Base",
      duration: "2025 - Present",
      bullets: [
        "Built and maintained a diverse portfolio of web applications for multiple clients across various industries",
        "Designed and developed custom software solutions tailored to meet specific client needs and business goals",
        "Collaborated closely with clients to understand their unique needs and translate them into effective software solutions",
      ],
      icon: Briefcase,
      relatedIds: [1, 3, 4],
    },
    {
      id: 3,
      company: "Everlasting Roofing Center",
      position: "Web Developer",
      duration: "july,2024-march,2025",
      bullets: [
        "Designed and built a website to showcase roofing products and services",
        "Structured product categories for faster browsing and inquiry",
        "Delivered a responsive, mobile-first layout for customer access",
      ],
      icon: Building2,
      relatedIds: [2, 4],
    },
    {
      id: 4,
      company: "Customer Relationship Management",
      position: "Full-Stack Project",
      duration: "september,2025-january,2026",
      bullets: [
        "Implemented client profiles, deal tracking, and internal notes",
        "Built role-based access for staff and administrators",
        "Optimized workflows with centralized records and search",
      ],
      icon: Database,
      relatedIds: [1, 2, 5],
    },
    {
      id: 5,
      company: "Records Management",
      position: "Web App",
      duration: "august,2025-september,2025",
      bullets: [
        "Created a digital archive for document storage and retrieval",
        "Implemented tagging and filters for fast lookup",
        "Improved data organization and audit readiness",
      ],
      icon: LayoutGrid,
      relatedIds: [4],
    },
  ];

  return (
    <section
      id="experience"
      className="w-full min-h-screen bg-black relative overflow-hidden"
    >
      <BackgroundPathsLayer />
      <RadialOrbitalTimeline
        timelineData={experiences.map((exp) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          duration: exp.duration,
          bullets: exp.bullets,
          icon: exp.icon,
          relatedIds: exp.relatedIds,
        }))}
      />
    </section>
  );
}
