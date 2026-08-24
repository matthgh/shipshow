import Link from "next/link"

// A real published demo, so "Try live demo" lands on an actual interactive demo.
const LIVE_DEMO_HREF = "/d/demo-339daa95"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span
              className="size-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--success)" }}
            />
            Now in beta · Free to try
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-balance">
            Stop explaining updates.
            <br />
            <span className="gradient-text">Let clients try them.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 leading-relaxed text-pretty">
            ShipShow turns your app screens into interactive demos.{" "}
            <br className="hidden md:block" />
            One link. No APKs. No videos. No installs. Clients click through the real experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="bg-primary hover:bg-accent text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-primary/25"
            >
              Create your first demo — free
            </Link>
            <Link
              href={LIVE_DEMO_HREF}
              className="bg-secondary hover:bg-border text-secondary-foreground font-medium px-8 py-4 rounded-xl text-lg transition-colors border border-border"
            >
              Try live demo →
            </Link>
          </div>

          <p className="mt-6 text-sm text-subtle">
            Joined by 2,000+ developers · No credit card required
          </p>
        </div>

        <ProductPreview />
      </div>
    </section>
  )
}

/** Browser-chrome mock framing a sample app screen. */
function ProductPreview() {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-3xl blur-2xl"
        style={{
          background:
            "linear-gradient(to right, color-mix(in oklab, var(--primary) 20%, transparent), color-mix(in oklab, #9333ea 20%, transparent))",
        }}
      />
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Fake browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/80">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full" style={{ backgroundColor: "#ef4444cc" }} />
            <div className="size-3 rounded-full" style={{ backgroundColor: "#eab308cc" }} />
            <div className="size-3 rounded-full" style={{ backgroundColor: "#22c55ecc" }} />
          </div>
          <div className="flex-1 text-center text-sm text-subtle font-mono">
            shipshow.app/demo/fitness-app-v1.3
          </div>
        </div>

        {/* Sample app screen */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-card to-background text-center">
          <div className="inline-block bg-secondary rounded-2xl p-6 shadow-xl border border-border max-w-sm">
            <div className="text-left flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">Good morning, Alex</div>
              <div className="text-3xl font-bold">6,140</div>
              <div className="text-sm text-muted-foreground">Daily steps · 75% of goal</div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm pt-2">
                {[
                  { value: "482", label: "Kcal" },
                  { value: "68", label: "BPM" },
                  { value: "38m", label: "Active" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-semibold">{stat.value}</div>
                    <div className="text-subtle text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-subtle">
            ↑ Interactive demo — clients can actually tap through your flows
          </p>
        </div>
      </div>
    </div>
  )
}
