const PROBLEMS = [
  {
    emoji: "📷",
    title: "Screenshots",
    body: "Static images miss context and interaction. Clients still don\u2019t understand the flow.",
  },
  {
    emoji: "🎥",
    title: "Videos (Loom etc.)",
    body: "Hours of recording + editing. They still can\u2019t click anything themselves.",
  },
  {
    emoji: "📱",
    title: "APK / TestFlight",
    body: "Install friction, expired builds, device limits. Many never even open it.",
  },
  {
    emoji: "💬",
    title: "Long Slack threads",
    body: "\u201CTap the blue button on screen 2\u2026 only if logged out\u2026\u201D \u2192 confusion guaranteed.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-20 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Explaining app updates is painfully slow
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            The old ways still dominate — and they waste everyone&apos;s time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEMS.map((problem) => (
            <div key={problem.title} className="bg-card border border-border rounded-2xl p-6">
              <div className="text-3xl mb-4" aria-hidden>
                {problem.emoji}
              </div>
              <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
