export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-subtle">
        <div className="flex items-center gap-2 font-medium text-foreground/80">
          <span className="size-6 rounded bg-primary flex items-center justify-center text-xs text-primary-foreground">
            S
          </span>
          ShipShow
        </div>
        <div>© {new Date().getFullYear()} ShipShow. Built for developers who ship.</div>
      </div>
    </footer>
  )
}
