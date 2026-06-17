import { Upload, Layers, Share2 } from "lucide-react"

const steps = [
  {
    icon: Upload,
    number: "1",
    title: "Upload your app screens",
    description:
      "Drag and drop your screenshots or export directly from Figma, Sketch, or your simulator. Any image format works.",
    hint: "Supports PNG, JPG, WebP",
  },
  {
    icon: Layers,
    number: "2",
    title: "Define the navigation flow",
    description:
      "Draw clickable hotspots on each screen and connect them to the next. Build multi-step flows in just a few clicks.",
    hint: "No coding required",
  },
  {
    icon: Share2,
    number: "3",
    title: "Generate a shareable demo link",
    description:
      "Hit publish and get a unique URL. Share it anywhere — Slack, email, Notion, or embed it in your client portal.",
    hint: "shipshow.app/demo/your-app",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm text-primary font-medium mb-3 tracking-wider uppercase">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            From screens to shareable demo in minutes.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ icon: Icon, number, title, description, hint }) => (
            <div
              key={number}
              className="relative rounded-2xl border border-border bg-card p-8 flex flex-col gap-5 group hover:border-primary/30 transition-colors"
            >
              {/* Step number */}
              <div className="absolute top-6 right-6 text-4xl font-black text-foreground/5 group-hover:text-foreground/8 transition-colors select-none">
                {number}
              </div>

              <div className="size-12 rounded-xl border border-primary/25 bg-primary/10 flex items-center justify-center">
                <Icon className="size-6 text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <span className="text-xs text-primary/70 font-mono">{hint}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
