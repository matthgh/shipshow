import { Camera, MessageSquare, Smartphone, Video } from "lucide-react"

const PROBLEMS = [
  {
    icon: Camera,
    title: "Screenshots",
    body: "Static images miss context and interaction. Clients still don\u2019t understand the flow.",
    cost: "No interaction",
  },
  {
    icon: Video,
    title: "Videos (Loom etc.)",
    body: "Hours of recording and editing. They still can\u2019t click anything themselves.",
    cost: "Hours of editing",
  },
  {
    icon: Smartphone,
    title: "APK / TestFlight",
    body: "Install friction, expired builds, device limits. Many never even open it.",
    cost: "Install friction",
  },
  {
    icon: MessageSquare,
    title: "Long Slack threads",
    body: "\u201CTap the blue button on screen 2\u2026 only if logged out\u2026\u201D and confusion is guaranteed.",
    cost: "Endless back-and-forth",
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-card/50">
      {/* Asymmetric layout: the heading holds the left rail while the list of
          failing methods scrolls past it, so this section doesn't read as
          "another centered grid of boxes" like the rest of the page. */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,22rem)_1fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Explaining app updates is painfully slow
          </h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            The old ways still dominate — and every one of them costs someone hours.
          </p>
        </div>

        {/* A hairline-divided ledger instead of cards. */}
        <ul className="divide-y divide-border border-t border-border">
          {PROBLEMS.map(({ icon: Icon, title, body, cost }) => (
            <li
              key={title}
              className="group flex items-start gap-5 py-7 transition-colors hover:bg-card/60"
            >
              <Icon
                className="size-5 mt-0.5 shrink-0 text-subtle transition-colors group-hover:text-foreground"
                aria-hidden
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{body}</p>
              </div>
              <span className="hidden sm:block shrink-0 text-xs font-medium text-subtle whitespace-nowrap pt-0.5">
                {cost}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
