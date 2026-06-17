"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary flex items-center justify-center">
            <Zap className="size-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">ShipShow</span>
        </div>

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
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Sign in
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start free
          </Button>
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
            <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
              Sign in
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground">
              Start free
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
