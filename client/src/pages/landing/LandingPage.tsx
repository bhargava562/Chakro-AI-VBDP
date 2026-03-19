import { GlassNavbar } from './GlassNavbar';
import { HeroSection } from './HeroSection';
import { SolutionSection } from './SolutionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { CTASection } from './CTASection';
import { FooterSection } from './FooterSection';

export function LandingPage() {
  return (
    <div className="dark">
      <GlassNavbar />
      <HeroSection />
      <div id="agents">
        <SolutionSection />
      </div>
      <div id="security">
        <HowItWorksSection />
      </div>
      <CTASection />
      <FooterSection />
    </div>
  );
}
