import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"
import { PhoneMockup } from "./phone-mockup"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0 0 0) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial glow behind content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6">
            <Badge
              variant="secondary"
              className="w-fit rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
            >
              <span className="size-1.5 rounded-full bg-primary inline-block mr-2 animate-pulse" />
              Now in beta — free to try
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
              Show every update of your app with a simple{" "}
              <span className="text-primary">link.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              ShipShow turns your app changes into interactive, shareable demos.
              No APKs. No videos. Just a link.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg"
              >
                Start free
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary rounded-lg"
              >
                <Play className="size-4" data-icon="inline-start" />
                View demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {["A", "J", "M", "K", "T"].map((initial, i) => (
                  <div
                    key={i}
                    className="size-7 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[9px] font-semibold text-muted-foreground"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">2,000+</span> developers already using it
              </p>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
