import { Code2, Building2, Rocket, Palette } from "lucide-react"

const users = [
  {
    icon: Code2,
    title: "Freelance developers",
    description:
      "Impress clients with interactive previews before delivery. Reduce revision rounds and get paid faster.",
    tags: ["React Native", "Flutter", "SwiftUI"],
  },
  {
    icon: Building2,
    title: "Digital agencies",
    description:
      "Standardize how your team shares app progress. Keep clients in the loop without eating into dev time.",
    tags: ["Client work", "Sprints", "Approvals"],
  },
  {
    icon: Rocket,
    title: "Startup teams",
    description:
      "Show investors and stakeholders the latest build without provisioning devices or managing TestFlight.",
    tags: ["Investors", "PMs", "Stakeholders"],
  },
  {
    icon: Palette,
    title: "Indie app builders",
    description:
      "Build in public, share milestones, get feedback early. Turn your dev log into a living demo.",
    tags: ["Indie hackers", "Build in public", "Beta users"],
  },
]

export function TargetUsersSection() {
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm text-primary font-medium mb-3 tracking-wider uppercase">Who it&apos;s for</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Built for every mobile builder.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Whether you&apos;re solo or on a team, ShipShow fits your workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map(({ icon: Icon, title, description, tags }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/25 transition-colors group"
            >
              <div className="size-12 rounded-xl border border-border bg-secondary flex items-center justify-center group-hover:border-primary/25 group-hover:bg-primary/10 transition-colors">
                <Icon className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-muted-foreground/70 bg-secondary rounded-md px-2 py-0.5 border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
