import Experience from "@/components/landing/Experience";
import Header from "@/components/landing/header";

export default function LandingPage() {
  return (
    <div className="mt-2 rounded-lg border border-gray-700 p-5">
      <Header />
      <Experience />
    </div>
  );
}
