import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { UserSegments } from "@/components/UserSegments";
import { Trust } from "@/components/Trust";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <UserSegments />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
