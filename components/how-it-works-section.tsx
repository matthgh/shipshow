const STEPS = [
  {
    number: "01",
    title: "Upload your screens",
    body: "Drag & drop screenshots from your simulator, Figma exports, or any PNG/JPG/WebP.",
  },
  {
    number: "02",
    title: "Connect the flows",
    body: "Draw hotspots and link screens together. Build the exact user journey in a few clicks.",
  },
  {
    number: "03",
    title: "Share one link",
    body: "Hit publish → get a unique URL. Send it anywhere. No login required for viewers.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            From screens to shareable demo in minutes
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Three simple steps. No design tools required.
          </p>
        </div>

        {/* pt-6 leaves room for the numeral that overhangs each card's top edge */}
        <div className="grid md:grid-cols-3 gap-8 pt-6">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              {/* Oversized step numeral peeking out above the card. Sits on top
                  so it reads against the card, matching the reference design. */}
              <div
                className="text-6xl font-black text-secondary absolute -top-4 -left-2 select-none z-10"
                aria-hidden
              >
                {step.number}
              </div>
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full">
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
