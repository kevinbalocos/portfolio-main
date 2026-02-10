import { ThreeDProvider } from "@/contexts/ThreeDContext";
import { Navbar } from "@/components/ui/Navbar";
import { SplineSceneBasic } from "@/components/ui/introduction/Introduction-Bot";
import { AboutSection } from "@/components/ui/sections/AboutSection";
import { ExperienceSection } from "@/components/ui/sections/ExperienceSection";
import { ProjectsSection } from "@/components/ui/sections/ProjectsSection";
import { FooterSection } from "@/components/ui/sections/FooterSection";
import { PortfolioQuickLinks } from "@/components/ui/PortfolioQuickLinks";

export default function App() {
  return (
    <ThreeDProvider>
      <div className="w-full bg-black">
        <Navbar />

        {/* Home Section */}
        <div id="home">
          <SplineSceneBasic />
        </div>

        {/* About Section */}
        <AboutSection />

        {/* Experience Section */}
        <ExperienceSection />

        {/* Projects Section */}
        <ProjectsSection />

        <FooterSection />
        <PortfolioQuickLinks />
      </div>
    </ThreeDProvider>
  );
}
