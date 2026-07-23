"use client"

import { Eye, Pencil, Upload, ChevronLeft, ImagePlus, Loader2, Compass } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Props = {
  projectName: string
  onRenameProject: (name: string) => void
  mode: "edit" | "preview"
  onModeChange: (mode: "edit" | "preview") => void
  guided: boolean
  onGuidedChange: (v: boolean) => void
  onPublish: () => void
  isSaving?: boolean
  onUploadClick?: () => void
  isUploading?: boolean
  hasImage?: boolean
}

export function EditorToolbar({ projectName, onRenameProject, mode, onModeChange, guided, onGuidedChange, onPublish, isSaving, onUploadClick, isUploading, hasImage }: Props) {
  const [editingName, setEditingName] = useState(false)
  const [draft, setDraft] = useState(projectName)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep draft in sync when projectName changes externally (e.g. on load)
  useEffect(() => { if (!editingName) setDraft(projectName) }, [projectName, editingName])

  useEffect(() => {
    if (editingName) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editingName])

  const commitRename = () => {
    const trimmed = draft.trim() || projectName
    setDraft(trimmed)
    onRenameProject(trimmed)
    setEditingName(false)
  }

  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border bg-card z-10">
      {/* Left: back + project name */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to home"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-primary/15 flex items-center justify-center">
            <div className="size-2.5 rounded-sm bg-primary" />
          </div>
          {editingName ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                if (e.key === "Enter") commitRename()
                if (e.key === "Escape") { setDraft(projectName); setEditingName(false) }
              }}
              className="text-sm font-medium bg-muted border border-primary rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-primary max-w-48 w-48"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              title="Click to rename"
              className="text-sm font-medium truncate max-w-48 hover:text-primary transition-colors text-left"
            >
              {projectName}
            </button>
          )}
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
            Edit
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
            Preview
          </button>
        </div>

        {mode === "preview" && (
          <button
            onClick={() => onGuidedChange(!guided)}
            title={guided ? "Disable guided mode" : "Enable guided mode"}
            className={cn(
              "flex items-center gap-1.5 h-7 px-3 rounded-md border text-xs font-medium transition-all",
              guided
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
            )}
          >
            <Compass className="size-3" />
            Guided
          </button>
        )}

        {mode === "edit" && onUploadClick && (
          <Button
            size="sm"
            variant="outline"
            onClick={onUploadClick}
            disabled={isUploading}
            className="gap-1.5 text-xs h-7 px-3"
          >
            {isUploading
              ? <Loader2 className="size-3 animate-spin" data-icon="inline-start" />
              : <ImagePlus className="size-3" data-icon="inline-start" />
            }
            {isUploading ? "Uploading..." : hasImage ? "Change image" : "Upload image"}
          </Button>
        )}

        <Button size="sm" onClick={onPublish} disabled={isSaving} className="gap-1.5 text-xs h-7 px-3">
          {isSaving
            ? <span className="size-3 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" data-icon="inline-start" />
            : <Upload className="size-3" data-icon="inline-start" />
          }
          {isSaving ? "Saving..." : "Publish"}
        </Button>
      </div>
    </header>
  )
}
