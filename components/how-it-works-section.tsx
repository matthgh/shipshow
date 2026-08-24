const STEPS = [
  {
    number: "1",
    title: "Upload your screens",
    body: "Drag and drop screenshots from your simulator, Figma exports, or any PNG/JPG/WebP.",
  },
  {
    number: "2",
    title: "Connect the flows",
    body: "Draw hotspots and link screens together. Build the exact user journey in a few clicks.",
  },
  {
    number: "3",
    title: "Share one link",
    body: "Hit publish and get a unique URL. Send it anywhere. No login required for viewers.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            From screens to shareable demo in minutes
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Three steps, one link. No design tools required.
          </p>
        </div>

        {/* A connected rail rather than three bordered cards: the line makes the
            sequence itself the visual, so the numbers are load-bearing. */}
        <ol className="grid md:grid-cols-3 gap-12 md:gap-10">
          {STEPS.map((step, i) => (
            <li key={step.number} className="relative">
              {i < STEPS.length - 1 && (
                <span
                  className="hidden md:block absolute top-5 left-12 -right-10 h-px bg-border"
                  aria-hidden
                />
              )}
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground">
                {step.number}
              </span>
              <h3 className="font-semibold text-xl mt-6 mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
