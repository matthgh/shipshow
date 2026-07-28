import { VideoOff, GitCommitHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

const comparisons = [
  {
    icon: VideoOff,
    label: "vs. a video",
    slug: "LOOM / SCREEN RECORD",
    problem: "Shows what changed.",
    answer: "ShipShow lets people actually try it.",
    body: "No scrubbing through a timeline looking for the part that matters — they click through the update themselves, at their own pace.",
    accent: false,
  },
  {
    icon: GitCommitHorizontal,
    label: "vs. a commit log",
    slug: "GIT / CHANGELOG",
    problem: "Tells devs what changed in code.",
    answer: "ShipShow shows the actual experience.",
    body: "It tells your users, your client, or your follower nothing. ShipShow shows the thing they'll care about — without them needing to read a diff or install a build.",
    accent: false,
  },
]

export function VsSection() {
  return (
    <section className="relative border-t border-border bg-[oklch(0.08_0_0)] py-28 overflow-hidden">

      {/* Faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">

        {/* Top label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <X className="size-3 text-destructive" strokeWidth={3} />
            The alternatives
          </span>
        </div>

        {/* Hero heading */}
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight text-balance leading-[1.05] mb-16">
          Not another<br />
          <span className="text-muted-foreground/50 line-through decoration-destructive/70 decoration-[3px]">Loom link.</span>
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {comparisons.map(({ icon: Icon, label, slug, problem, answer, body }) => (
            <div
              key={label}
              className="group relative rounded-2xl border border-border bg-card p-8 flex flex-col gap-6 overflow-hidden hover:border-primary/30 transition-colors duration-300"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg border border-border bg-muted/60 flex items-center justify-center">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-0.5">{slug}</p>
                    <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                  </div>
                </div>
                {/* Crossed out pill */}
                <span className="inline-flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[10px] font-semibold text-destructive/80 uppercase tracking-wider">
                  <X className="size-2.5" strokeWidth={3} />
                  Not enough
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Problem vs answer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold mb-2">What it does</p>
                  <p className="text-sm text-muted-foreground leading-snug">{problem}</p>
                </div>
                <div className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-2">ShipShow does</p>
                  <p className="text-sm text-foreground font-medium leading-snug">{answer}</p>
                </div>
              </div>

              {/* Body copy */}
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="h-px w-16 bg-border" />
          <p className="text-2xl sm:text-3xl font-semibold text-foreground text-balance max-w-lg">
            One link. They click, they get it.{" "}
            <span className="text-primary">That&apos;s it.</span>
          </p>
          <p className="text-sm text-muted-foreground">No install. No account. No context doc to write.</p>
        </div>

      </div>
    </section>
  )
}
