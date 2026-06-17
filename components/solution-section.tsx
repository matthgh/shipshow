import { Upload, MousePointer, Link } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload your screens",
    description:
      "Import app screenshots or frames directly. Works with Figma exports, simulator screenshots, or any PNG/JPG.",
  },
  {
    icon: MousePointer,
    step: "02",
    title: "Connect interactions",
    description:
      "Define tap zones and link screens together. Build the exact flow your update introduces — in minutes.",
  },
  {
    icon: Link,
    step: "03",
    title: "Generate a shareable link",
    description:
      "One click creates a shareable URL. Send it to clients, stakeholders, or anyone — no login required to view.",
  },
]

export function SolutionSection() {
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <p className="text-sm text-primary font-medium mb-3 tracking-wider uppercase">The solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-6">
              Turn updates into interactive demos.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
              ShipShow lets you build a clickable prototype from your actual app screens — no design tools needed.
              Clients experience the update themselves, just like using the real app.
            </p>

            <div className="flex flex-col gap-8">
              {steps.map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex-shrink-0 size-10 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono mb-1">{step}</p>
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual flow diagram */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-3xl" />
            <div className="relative flex flex-col gap-3 w-full max-w-sm">
              {steps.map(({ icon: Icon, step, title }, i) => (
                <div key={step}>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                    <div className="size-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-mono">{step}</p>
                      <p className="text-sm font-medium text-foreground truncate">{title}</p>
                    </div>
                    <div className="size-5 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                      <div className="size-2 rounded-full bg-primary" />
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="w-px h-4 bg-border" />
                    </div>
                  )}
                </div>
              ))}

              {/* Result card */}
              <div className="mt-1 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Your demo is ready</p>
                <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2">
                  <div className="size-4 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] text-primary font-bold">S</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    shipshow.app/demo/my-app-v2-1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
