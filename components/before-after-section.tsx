import { X, Check, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BeforeAfterSection() {
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm text-primary font-medium mb-3 tracking-wider uppercase">The difference</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Stop writing. Start showing.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
            See what changes when you replace text explanations with a ShipShow demo link.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <div className="rounded-2xl border border-destructive/20 bg-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-destructive/15 border border-destructive/25 flex items-center justify-center">
                <X className="size-3.5 text-destructive/70" />
              </div>
              <span className="text-sm font-semibold text-foreground">Before ShipShow</span>
            </div>

            <div className="rounded-xl bg-muted/50 border border-border p-4 flex flex-col gap-3">
              {/* Fake Slack message */}
              <div className="flex gap-2">
                <div className="size-6 rounded bg-secondary flex-shrink-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-muted-foreground">A</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-foreground font-semibold">Alex Kim</span>
                  <div className="rounded-lg bg-secondary/70 p-2.5 max-w-[220px]">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Hey! So the new onboarding flow — tap the blue button on screen 2, then you should see the modal pop up, but only if you&apos;re logged out. If you&apos;re logged in it skips to screen 4. Oh and the back arrow on screen 3 is broken on Android, I&apos;ll fix in the next push. The bottom nav also moved so let me know if you can&apos;t find settings... 📱
                    </p>
                  </div>
                </div>
              </div>
              {/* Attachments */}
              <div className="flex gap-2 pl-8">
                {["screen1.png", "screen2.png", "screen4.png", "+3"].map((f) => (
                  <div key={f} className="rounded border border-border bg-card px-2 py-1">
                    <p className="text-[8px] text-muted-foreground font-mono truncate max-w-[50px]">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs text-destructive/70 border border-destructive/20 bg-destructive/5">
                Confusing for clients
              </Badge>
              <Badge variant="secondary" className="text-xs text-destructive/70 border border-destructive/20 bg-destructive/5">
                Time-consuming
              </Badge>
              <Badge variant="secondary" className="text-xs text-destructive/70 border border-destructive/20 bg-destructive/5">
                Easy to misunderstand
              </Badge>
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-primary/25 bg-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Check className="size-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">After ShipShow</span>
            </div>

            <div className="rounded-xl bg-muted/50 border border-border p-4 flex flex-col gap-3">
              {/* Fake Slack message */}
              <div className="flex gap-2">
                <div className="size-6 rounded bg-secondary flex-shrink-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-muted-foreground">A</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-foreground font-semibold">Alex Kim</span>
                  <div className="rounded-lg bg-secondary/70 p-2.5 max-w-[220px]">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Here&apos;s the new onboarding flow 👇
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo link card */}
              <div className="ml-8 rounded-xl border border-primary/25 bg-primary/5 p-3 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/20 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">S</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground">ShipShow Demo</p>
                  <p className="text-xs text-foreground font-mono truncate">fitness-app-v1-3</p>
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5">3 screens · Interactive</p>
                </div>
                <ExternalLink className="size-3.5 text-primary flex-shrink-0" />
              </div>
            </div>

            <div className="mt-auto font-mono text-sm border border-primary/25 bg-primary/5 rounded-xl px-4 py-3">
              <span className="text-muted-foreground">shipshow.app/demo/</span>
              <span className="text-primary">fitness-app-v1-3</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs text-primary/80 border border-primary/20 bg-primary/5">
                Instantly clear
              </Badge>
              <Badge variant="secondary" className="text-xs text-primary/80 border border-primary/20 bg-primary/5">
                Under 5 minutes
              </Badge>
              <Badge variant="secondary" className="text-xs text-primary/80 border border-primary/20 bg-primary/5">
                No friction
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
