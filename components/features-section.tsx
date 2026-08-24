import { History, Link2, Lock, MessageCircle, MousePointerClick, Zap } from "lucide-react"

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Interactive demos",
    body: "Build real tap-through prototypes from screenshots. Clients experience the update themselves.",
  },
  {
    icon: Link2,
    title: "Shareable links",
    body: "A unique URL for every demo. Share it anywhere. No account needed to view.",
  },
  {
    icon: History,
    title: "Version history",
    body: "Keep every update organized. Compare versions side by side like a visual changelog.",
  },
  {
    icon: MessageCircle,
    title: "Client feedback",
    body: "Stakeholders drop comments directly on screens. No more decoding vague messages.",
  },
  {
    icon: Zap,
    title: "Fast setup",
    body: "Most teams publish their first demo in under five minutes.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Password-protect or restrict demos. Your work stays yours.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Everything you need to ship faster
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Built for developers who value clarity and speed — not another heavy design tool.
          </p>
        </div>

        {/* One continuous grid divided by hairlines, so it reads as a single
            spec sheet instead of six detached cards floating on the page. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group border-b border-r border-border p-8 transition-colors hover:bg-card/60"
            >
              <Icon
                className="size-5 text-subtle mb-5 transition-colors group-hover:text-primary"
                aria-hidden
              />
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
