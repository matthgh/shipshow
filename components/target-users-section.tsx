const AUDIENCES = [
  {
    title: "Freelance developers",
    body: "Impress clients with interactive previews. Fewer revision rounds, faster payments.",
  },
  {
    title: "Digital agencies",
    body: "Standardize how the team shares progress. Keep clients in the loop without eating dev time.",
  },
  {
    title: "Startup teams",
    body: "Show investors and stakeholders the latest build without TestFlight or device provisioning.",
  },
  {
    title: "Indie builders",
    body: "Build in public, share milestones, get early feedback. Turn your dev log into living demos.",
  },
]

export function TargetUsersSection() {
  return (
    <section id="who" className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-14 max-w-2xl text-balance">
          Built for every mobile builder
        </h2>

        {/* Quiet editorial entries marked by a rule, not enclosed in boxes. */}
        <div className="grid sm:grid-cols-2 gap-y-10 gap-x-16 max-w-4xl">
          {AUDIENCES.map((audience) => (
            <div key={audience.title} className="border-l-2 border-primary/40 pl-5">
              <h3 className="font-semibold mb-2">{audience.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {audience.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
