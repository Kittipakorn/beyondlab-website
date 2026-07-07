import { BuildGrid } from "./components/beyondlab/BuildGrid";
import { Community } from "./components/beyondlab/Community";
import { FinalCta } from "./components/beyondlab/FinalCta";
import { Hero } from "./components/beyondlab/Hero";
import { InteractiveTerminal } from "./components/beyondlab/InteractiveTerminal";
import { Navbar } from "./components/beyondlab/Navbar";
import { ProjectShowcase } from "./components/beyondlab/ProjectShowcase";
import { Roadmap } from "./components/beyondlab/Roadmap";
import { SocialProof } from "./components/beyondlab/SocialProof";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-[#111111]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(17,17,17,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <Navbar />
      <Hero />
      <SocialProof />
      <BuildGrid />
      <Roadmap />
      <ProjectShowcase />
      <InteractiveTerminal />
      <Community />
      <FinalCta />
    </main>
  );
}
