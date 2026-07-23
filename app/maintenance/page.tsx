import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Maintenance — ShipShow",
  description: "ShipShow is currently undergoing scheduled maintenance.",
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Animated status dot */}
      <div className="flex items-center gap-2 mb-8">
        <span className="relative flex size-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2.5 bg-yellow-500" />
        </span>
        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">
          Maintenance
        </span>
      </div>

      <h1 className="text-3xl font-semibold text-foreground text-center text-balance mb-3">
        We&apos;ll be right back
      </h1>
      <p className="text-muted-foreground text-center text-balance max-w-sm mb-10">
        ShipShow is undergoing scheduled maintenance. We&apos;re working to improve
        your experience and will be back shortly.
      </p>

      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
