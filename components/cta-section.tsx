import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-32 border-t border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0 0 0) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
          <Zap className="size-3.5 text-primary" fill="currentColor" />
          <span className="text-xs text-primary font-medium">Free to start. No credit card.</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-[1.1] mb-6">
          Stop explaining.
          <br />
          <span className="text-primary">Start showing.</span>
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          Create your first interactive demo in under 5 minutes. Your clients will wonder why you didn&apos;t do this sooner.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg text-base px-8"
          >
            Create your first demo
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary rounded-lg text-base"
          >
            View live example
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-sm text-muted-foreground/60">
          Joined by 2,000+ developers. No APKs. No videos. Just a link.
        </p>
      </div>
    </section>
  )
}
