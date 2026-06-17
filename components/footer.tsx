import { Separator } from "@/components/ui/separator"
import { Zap } from "lucide-react"

const links = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Developers: ["Docs", "API", "Integrations", "Status"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security"],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="size-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-semibold text-foreground tracking-tight">ShipShow</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Interactive app demos via a simple link. Built for mobile developers.
            </p>
            <div className="flex gap-3 mt-2">
              {["Twitter", "GitHub", "Discord"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{category}</p>
              {items.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        <Separator className="bg-border mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShipShow, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
