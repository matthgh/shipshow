const FEATURES = [
  {
    title: "Interactive demos",
    body: "Build real tap-through prototypes from screenshots. Clients experience the update themselves.",
  },
  {
    title: "Shareable links",
    body: "Unique URL for every demo. Share anywhere. No account needed to view.",
  },
  {
    title: "Version history",
    body: "Keep every update organized. Compare versions side-by-side like a visual changelog.",
  },
  {
    title: "Client feedback",
    body: "Stakeholders drop comments directly on screens. No more decoding vague messages.",
  },
  {
    title: "Fast setup",
    body: "Most teams publish their first demo in under 5 minutes.",
  },
  {
    title: "Private by default",
    body: "Password-protect or restrict demos. Your work stays yours.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Everything you need to ship faster
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Built for developers who value clarity and speed — not another heavy design tool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
