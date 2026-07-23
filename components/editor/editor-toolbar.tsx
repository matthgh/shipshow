"use client"

import { Eye, Pencil, Upload, ChevronLeft, ImagePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Props = {
  projectName: string
  mode: "edit" | "preview"
  onModeChange: (mode: "edit" | "preview") => void
  onPublish: () => void
  isSaving?: boolean
  onUploadClick?: () => void
  isUploading?: boolean
  hasImage?: boolean
}

export function EditorToolbar({ projectName, mode, onModeChange, onPublish, isSaving, onUploadClick, isUploading, hasImage }: Props) {
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
