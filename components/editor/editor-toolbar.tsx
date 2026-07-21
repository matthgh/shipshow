"use client"

import { Eye, Pencil, Upload, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Props = {
  projectName: string
  mode: "edit" | "preview"
  onModeChange: (mode: "edit" | "preview") => void
  onPublish: () => void
}

export function EditorToolbar({ projectName, mode, onModeChange, onPublish }: Props) {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border bg-card z-10">
      {/* Left: back + project name */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Torna alla home"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-primary/15 flex items-center justify-center">
            <div className="size-2.5 rounded-sm bg-primary" />
          </div>
          <span className="text-sm font-medium truncate max-w-48">{projectName}</span>
        </div>
      </div>

      {/* Right: mode toggle + publish */}
      <div className="flex items-center gap-2">
        {/* Segmented control */}
        <div className="flex items-center rounded-lg border border-border bg-muted p-0.5 gap-0.5">
          <button
            onClick={() => onModeChange("edit")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
              mode === "edit"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Pencil className="size-3" />
            Modifica
          </button>
          <button
            onClick={() => onModeChange("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
              mode === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="size-3" />
            Anteprima
          </button>
        </div>

        <Button size="sm" onClick={onPublish} className="gap-1.5 text-xs h-7 px-3">
          <Upload className="size-3" data-icon="inline-start" />
          Pubblica
        </Button>
      </div>
    </header>
  )
}
