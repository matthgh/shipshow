import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BeforeAfterSection } from "@/components/before-after-section"
import { FeaturesSection } from "@/components/features-section"
import { TargetUsersSection } from "@/components/target-users-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <BeforeAfterSection />
      <FeaturesSection />
      <TargetUsersSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
