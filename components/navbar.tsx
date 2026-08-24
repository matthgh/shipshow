"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Who it\u2019s for", href: "#who" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Signed-in visitors go straight into the product instead of the signup flow.
  const ctaHref = user ? "/dashboard" : "/auth/sign-up"
  const ctaLabel = user ? "Dashboard \u2192" : "Start free \u2192"

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm">
            S
          </span>
          ShipShow
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href={ctaHref}
          className="hidden md:inline-block bg-primary hover:bg-accent text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {ctaLabel}
        </Link>

        <button
          type="button"
          className="md:hidden text-muted-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={ctaHref}
            className="bg-primary hover:bg-accent text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg text-center transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </nav>
  )
}
