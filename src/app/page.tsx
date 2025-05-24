import { ContributionGraph } from "@/components/ContributionGraph";
import Footer from "@/components/Footer";
import Aboutme from "@/components/landing/Aboutme";
import Certifications from "@/components/landing/Certifications";
import Experience from "@/components/landing/Experience";
import Header from "@/components/landing/header";
import Projects from "@/components/landing/Projects";
import Skills from "@/components/landing/Skills";
import SpecialHighlights from "@/components/landing/SpeciaHighlights";

export default function LandingPage() {
  return (
    <main className="mt-2">
      <Header />
      <ContributionGraph />
      <Aboutme />
      <Experience />
      <Skills />
      <Certifications />
      <Projects />
      <SpecialHighlights />
      <Footer />
    </main>
  );
}
