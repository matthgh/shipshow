import { VideoOff, GitCommitHorizontal } from "lucide-react"

const blocks = [
  {
    icon: VideoOff,
    title: "vs. a video",
    body: "A video shows what changed. ShipShow lets people actually try it. No scrubbing through a timeline looking for the part that matters — they click through the update themselves, at their own pace.",
  },
  {
    icon: GitCommitHorizontal,
    title: "vs. a commit log",
    body: "A commit log tells your team what changed in the code. It tells your users, your client, or your follower nothing. ShipShow shows the actual experience — the thing they'll care about — without them needing to read a diff or install a build.",
  },
]

export function VsSection() {
  return (
    <section className="py-24 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Not another Loom link.
          </h2>
        </div>

        {/* Two blocks */}
        <div className="grid md:grid-cols-2 gap-6">
          {blocks.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-5"
            >
              <div className="size-12 rounded-xl border border-primary/25 bg-primary/10 flex items-center justify-center">
                <Icon className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p className="mt-12 text-center text-xl sm:text-2xl font-semibold text-foreground text-balance">
          One link. They click, they get it. That&apos;s it.
        </p>
      </div>
    </section>
  )
}
