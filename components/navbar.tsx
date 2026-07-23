"use client"

import { useState, useEffect } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary flex items-center justify-center">
            <Zap className="size-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">ShipShow</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {["Features", "How it works", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground")}>
                Dashboard
              </Link>
              <Link href="/editor" className={cn(buttonVariants({ size: "sm" }), "bg-primary text-primary-foreground hover:bg-primary/90")}>
                + Nuova demo
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground")}>
                Accedi
              </Link>
              <Link href="/auth/sign-up" className={cn(buttonVariants({ size: "sm" }), "bg-primary text-primary-foreground hover:bg-primary/90")}>
                Inizia gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-muted-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {["Features", "How it works", "Pricing", "Docs"].map((item) => (
            <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {user ? (
              <>
                <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}>
                  Dashboard
                </Link>
                <Link href="/editor" className={cn(buttonVariants({ size: "sm" }))}>
                  + Nuova demo
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start text-muted-foreground")}>
                  Accedi
                </Link>
                <Link href="/auth/sign-up" className={cn(buttonVariants({ size: "sm" }), "bg-primary text-primary-foreground")}>
                  Inizia gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
