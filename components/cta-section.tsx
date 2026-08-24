import Link from "next/link"

export function CtaSection() {
  return (
    <section id="cta" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-balance">
          Free to start.
          <br />
          No credit card.
        </h2>

        <p className="text-xl text-muted-foreground mb-10 text-pretty">
          Create your first interactive demo in under 5 minutes.
          <br />
          Your clients will wonder why you didn&apos;t do this sooner.
        </p>

        <Link
          href="/auth/sign-up"
          className="inline-block bg-primary hover:bg-accent text-primary-foreground font-semibold px-10 py-5 rounded-xl text-lg transition-colors shadow-xl shadow-primary/30"
        >
          Create your first demo →
        </Link>

        <p className="mt-8 text-sm text-subtle">
          Joined by 2,000+ developers · No APKs. No videos. Just a link.
        </p>
      </div>
    </section>
  )
}
