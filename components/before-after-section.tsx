export function BeforeAfterSection() {
  return (
    <section className="py-20 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Stop writing. Start showing.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div
            className="bg-background border rounded-2xl p-6"
            style={{ borderColor: "color-mix(in oklab, var(--destructive) 28%, transparent)" }}
          >
            <div className="text-sm font-medium mb-4" style={{ color: "var(--destructive)" }}>
              Before ShipShow
            </div>
            <div className="bg-card rounded-xl p-4 text-sm font-mono text-foreground/80">
              <ChatAvatarRow>
                <p className="mt-1 leading-relaxed">
                  Hey! So the new onboarding — tap the blue button on screen 2, then the modal pops
                  up only if logged out. If logged in it skips to screen 4. Oh and the back arrow on
                  screen 3 is broken on Android… + screenshots attached
                </p>
              </ChatAvatarRow>
            </div>
            <p className="mt-4 text-sm text-subtle">
              Confusing · Time-consuming · Easy to misunderstand
            </p>
          </div>

          {/* After */}
          <div
            className="bg-background border rounded-2xl p-6"
            style={{ borderColor: "color-mix(in oklab, var(--success) 28%, transparent)" }}
          >
            <div className="text-sm font-medium mb-4" style={{ color: "var(--success)" }}>
              After ShipShow
            </div>
            <div className="bg-card rounded-xl p-4 text-sm font-mono text-foreground/80">
              <ChatAvatarRow>
                <p className="mt-1">Here&apos;s the new onboarding flow 👇</p>
                {/* Unfurled demo link card */}
                <div
                  className="mt-3 rounded-lg p-3 flex items-center gap-3 border"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--primary) 20%, transparent)",
                    borderColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
                  }}
                >
                  <div className="size-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                    S
                  </div>
                  <div>
                    <div className="font-medium text-foreground">ShipShow Demo</div>
                    <div className="text-xs text-muted-foreground">
                      fitness-app-v1.3 · 3 screens · Interactive
                    </div>
                  </div>
                </div>
              </ChatAvatarRow>
            </div>
            <p className="mt-4 text-sm text-subtle">
              Instantly clear · Under 5 minutes · Zero friction
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Shared avatar + name wrapper for the two mock chat messages. */
function ChatAvatarRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="size-8 rounded-full bg-border flex items-center justify-center text-xs shrink-0">
        A
      </div>
      <div>
        <div className="font-medium text-foreground">Alex Kim</div>
        {children}
      </div>
    </div>
  )
}
