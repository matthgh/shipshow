import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BeforeAfterSection } from "@/components/before-after-section"
import { FeaturesSection } from "@/components/features-section"
import { TargetUsersSection } from "@/components/target-users-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    // `landing` scopes the marketing palette (see globals.css); Inter is the
    // landing typeface while the rest of the app stays on Geist.
    <div className="landing font-[family-name:var(--font-inter)] bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <BeforeAfterSection />
        <FeaturesSection />
        <TargetUsersSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
