import { ContributionGraph } from "@/components/contribution-graph";
import Footer from "@/components/Footer";
import Certifications from "@/components/landing/Certifications";
import Experience from "@/components/landing/Experience";
import Header from "@/components/landing/header";
import Projects from "@/components/landing/Projects";
import Skills from "@/components/landing/Skills";

export default function LandingPage() {
  return (
    <main className="mt-2 rounded-lg border-gray-700 p-5 md:border">
      <Header />
      <ContributionGraph />
      <Experience />
      <Skills />
      <Certifications />
      <Projects />
      <Footer />
    </main>
  );
}
