"use client"

import { X, Trash2 } from "lucide-react"
import type { Hotspot, Step } from "@/lib/editor-types"
import { cn } from "@/lib/utils"

type Props = {
  hotspot: Hotspot
  steps: Step[]
  currentStepId: string
  onUpdateTarget: (hotspotId: string, targetStepId: string | null) => void
  onDelete: (hotspotId: string) => void
  onClose: () => void
  /** Position in % relative to image container, used to place the popover */
  anchorX: number
  anchorY: number
}

export function HotspotPopover({
  hotspot,
  steps,
  currentStepId,
  onUpdateTarget,
  onDelete,
  onClose,
  anchorX,
  anchorY,
}: Props) {
  const availableSteps = steps.filter((s) => s.id !== currentStepId)

  // Flip popover left/right & up/down to stay in bounds
  const flipX = anchorX > 60
  const flipY = anchorY > 55

  return (
    <div
      className={cn(
        "absolute z-30 w-52 bg-popover border border-border rounded-xl shadow-lg shadow-black/10 p-3 flex flex-col gap-2.5",
        flipX ? "right-[calc(100%-var(--x))]" : "left-[var(--x)]",
        flipY ? "bottom-[calc(100%-var(--y))]" : "top-[var(--y)]"
      )}
      style={{
        // Position relative to the image container
        left: flipX ? "auto" : `${Math.min(anchorX + 2, 50)}%`,
        right: flipX ? `${Math.max(100 - anchorX - 2, 10)}%` : "auto",
        top: flipY ? "auto" : `${Math.min(anchorY + hotspot.height + 1, 80)}%`,
        bottom: flipY ? `${Math.max(100 - anchorY - 1, 10)}%` : "auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">Hotspot</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Chiudi"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Label */}
      <div className="text-[10px] text-muted-foreground truncate">
        ID: <span className="font-mono">{hotspot.id}</span>
      </div>

      {/* Target step select */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Va a
        </label>
        <select
          value={hotspot.targetStepId ?? ""}
          onChange={(e) => onUpdateTarget(hotspot.id, e.target.value || null)}
          className="w-full text-xs bg-muted border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">— nessuno —</option>
          {availableSteps.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Delete */}
      <button
        onClick={() => { onDelete(hotspot.id); onClose() }}
        className="flex items-center gap-1.5 text-[11px] text-destructive hover:text-destructive/80 transition-colors mt-0.5"
      >
        <Trash2 className="size-3" />
        Elimina hotspot
      </button>
    </div>
  )
}
