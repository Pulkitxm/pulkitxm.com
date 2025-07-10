import { ContributionGraph } from "@/components/ContributionGraph";
import Aboutme from "@/components/landing/Aboutme";
import Certifications from "@/components/landing/Certifications";
import Experience from "@/components/landing/Experience";
import HeroSection from "@/components/landing/hero-section";
import Projects from "@/components/landing/Projects";
import Skills from "@/components/landing/Skills";
import SpecialHighlights from "@/components/landing/SpeciaHighlights";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ContributionGraph />
      <Aboutme />
      <Experience />
      <Skills />
      <Certifications />
      <Projects />
      <SpecialHighlights />
    </>
  );
}
