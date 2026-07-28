"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, ExternalLink, Clock, Sparkles } from "lucide-react"

type Demo = {
  id: string
  title: string
  status: string
  share_slug: string | null
  created_at: string
  is_example: boolean
}

export function DashboardClient({ demos: initial }: { demos: Demo[] }) {
  const router = useRouter()
  const [demos, setDemos] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this demo? This action cannot be undone.")) return
    setDeleting(id)
    await fetch(`/api/demos/${id}`, { method: "DELETE" })
    setDemos((prev) => prev.filter((d) => d.id !== id))
    setDeleting(null)
  }

  if (demos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
          <Pencil className="size-7 text-muted-foreground/40" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No demos yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first interactive demo</p>
        </div>
        <Link href="/editor" className={cn(buttonVariants(), "mt-2")}>
          Create demo
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {demos.map((demo) => (
        <div
          key={demo.id}
          className={cn(
            "bg-card border rounded-xl px-5 py-4 flex items-center gap-4 transition-colors",
            demo.is_example
              ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
              : "border-border hover:border-primary/30"
          )}
        >
          {/* Example badge or status badge */}
          {demo.is_example ? (
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400">
              <Sparkles className="size-2.5" />
              Example
            </span>
          ) : (
            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              demo.status === "published"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {demo.status === "published" ? "Published" : "Draft"}
            </span>
          )}

          {/* Title */}
          <span className="flex-1 font-medium text-foreground truncate">{demo.title}</span>

          {/* Date */}
          <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="size-3" />
            {new Date(demo.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {demo.status === "published" && demo.share_slug && (
              <Link
                href={`/d/${demo.share_slug}`}
                target="_blank"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
              >
                <ExternalLink className="size-3.5" />
                <span className="sr-only">Open demo</span>
              </Link>
            )}
            <Link
              href={`/editor?id=${demo.id}`}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
            >
              <Pencil className="size-3.5" />
              <span className="sr-only">Edit</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(demo.id)}
              disabled={deleting === demo.id}
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
