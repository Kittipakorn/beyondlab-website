import { AboutTutors } from "./components/beyondlab/AboutTutors";
import { BuildGrid } from "./components/beyondlab/BuildGrid";
import { Community } from "./components/beyondlab/Community";
import { FinalCta } from "./components/beyondlab/FinalCta";
import { Hero } from "./components/beyondlab/Hero";
import { InteractiveTerminal } from "./components/beyondlab/InteractiveTerminal";
import { ProjectShowcase } from "./components/beyondlab/ProjectShowcase";
import { Roadmap } from "./components/beyondlab/Roadmap";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutTutors />
      <BuildGrid />
      <Roadmap />
      <ProjectShowcase />
      <InteractiveTerminal />
      <Community />
      <FinalCta />
    </>
  );
}
