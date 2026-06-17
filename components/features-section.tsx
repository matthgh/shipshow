import { MousePointer2, Link2, History, MessageSquare, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: MousePointer2,
    title: "Interactive app demos",
    description: "Build tap-through prototypes from real screenshots. Clients interact with your app — no install needed.",
    highlight: true,
  },
  {
    icon: Link2,
    title: "Shareable links",
    description: "Every demo gets a unique URL. Share with anyone, embed anywhere. No account required to view.",
    highlight: false,
  },
  {
    icon: History,
    title: "Version history",
    description: "Keep every update organized like a changelog. Compare v1.2 vs v1.3 side-by-side.",
    highlight: false,
  },
  {
    icon: MessageSquare,
    title: "Client feedback",
    description: "Stakeholders can drop comments directly on screens. No more decoding vague Slack messages.",
    highlight: false,
  },
  {
    icon: Zap,
    title: "Fast setup",
    description: "Upload screens, draw hotspots, publish. Most teams have their first demo live in under 5 minutes.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Private by default",
    description: "Password-protect demos or restrict them to specific email addresses. Your work stays yours.",
    highlight: false,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm text-primary font-medium mb-3 tracking-wider uppercase">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Everything you need to ship faster.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Built for developers who value clarity and speed — not another Figma-heavy design tool.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description, highlight }) => (
            <div
              key={title}
              className={`rounded-xl border p-6 flex flex-col gap-4 transition-colors hover:border-primary/30 ${
                highlight
                  ? "border-primary/25 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`size-10 rounded-lg flex items-center justify-center ${
                  highlight
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-secondary border border-border"
                }`}
              >
                <Icon className={`size-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
