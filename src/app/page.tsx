import { AboutTutors } from "./components/beyondlab/AboutTutors";
import { BuildGrid } from "./components/beyondlab/BuildGrid";
import { Community } from "./components/beyondlab/Community";
import { FinalCta } from "./components/beyondlab/FinalCta";
import { Hero } from "./components/beyondlab/Hero";
import { InteractiveTerminal } from "./components/beyondlab/InteractiveTerminal";
import { ProjectShowcase } from "./components/beyondlab/ProjectShowcase";
import { ServicesSection } from "./components/beyondlab/ServicesSection";
import { ReviewsMarquee } from "./components/beyondlab/ReviewsMarquee";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutTutors />
      <ReviewsMarquee />
      <ServicesSection />
      <BuildGrid />
      <ProjectShowcase />
      <InteractiveTerminal />
      <Community />
      <FinalCta />
    </>
  );
}
