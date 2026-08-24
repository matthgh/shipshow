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
    body: "Show investors & stakeholders the latest build without TestFlight or device provisioning.",
  },
  {
    title: "Indie builders",
    body: "Build in public, share milestones, get early feedback. Turn your dev log into living demos.",
  },
]

export function TargetUsersSection() {
  return (
    <section id="who" className="py-20 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Built for every mobile builder
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCES.map((audience) => (
            <div key={audience.title} className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold mb-2">{audience.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{audience.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
