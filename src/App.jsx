import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import Background from "./components/Background";
import { VisionSection } from "./components/VisionSection";
import { FrameworkSection } from "./components/FrameworkSection";
import { ProgramFormatSection } from "./components/ProgramFormatSection";
import { CurriculumSection } from "./components/CurriculumSection";
import { HighlightsSection } from "./components/HighlightsSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { AchievementsSection } from "./components/AchievementsSection";
import { ImpactSection } from "./components/ImpactSection";
import { PartnershipsSection } from "./components/PartnershipsSection";
import { NextStepsSection } from "./components/NextStepsSection";
import { FinalCTA } from "./components/FinalCTA";
import ScrollEffects from "./components/ScrollEffects";
import { ImmersiveIntelligenceSite } from "./components/ImmersiveIntelligenceSite";
import "./App.css";

const getCurrentPage = () => {
  if (window.location.hash.startsWith("#/founders")) {
    return "leaders";
  }

  if (window.location.hash.startsWith("#/neuro")) {
    return "neuro";
  }

  if (import.meta.env.VITE_DEFAULT_PAGE === "neuro") {
    return "neuro";
  }

  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath.endsWith("/investor")) {
    return "neuro";
  }

  return "leaders";
};

function App() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    const handleRouteChange = () => {
      const nextPage = getCurrentPage();

      setCurrentPage((previousPage) => {
        if (nextPage !== previousPage) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        return nextPage;
      });
    };

    window.addEventListener("hashchange", handleRouteChange);

    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  return (
    <div className="bg-dark-900 text-white relative">
      <Background />
      <ScrollEffects routeKey={currentPage} />
      {currentPage === "leaders" ? (
        <ImmersiveIntelligenceSite />
      ) : (
        <>
          <Header />
          <Hero />
          <VisionSection />
          <FrameworkSection />
          <ProgramFormatSection />
          <CurriculumSection />
          <HighlightsSection />
          <AchievementsSection />
          <ProgramsSection />
          <ImpactSection />
          <PartnershipsSection />
          <NextStepsSection />
          <FinalCTA />
        </>
      )}
    </div>
  );
}

export default App;
