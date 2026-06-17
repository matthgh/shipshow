import { ImageOff, Video, Package, MessageSquareOff } from "lucide-react"

const problems = [
  {
    icon: ImageOff,
    title: "Screenshots are unclear",
    description: "Static images miss interaction context. Clients can't understand the flow from a grid of PNGs.",
  },
  {
    icon: Video,
    title: "Videos take too long",
    description: "Recording, editing, exporting — it eats hours. And they still can't click through it themselves.",
  },
  {
    icon: Package,
    title: "APK / TestFlight is friction",
    description: "Install steps, device restrictions, expired builds. Clients give up before they even see your work.",
  },
  {
    icon: MessageSquareOff,
    title: "Clients get confused on calls",
    description: "Screen sharing an in-progress app leads to misunderstandings and longer feedback loops.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 border-t border-border relative overflow-hidden">
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.015] bg-foreground" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm text-primary font-medium mb-3 tracking-wider uppercase">The problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Explaining app updates is too slow.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The way developers share app progress hasn&apos;t changed. It&apos;s still screenshots and long Slack threads.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-border/60 transition-colors"
            >
              <div className="size-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <Icon className="size-5 text-destructive/70" />
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
