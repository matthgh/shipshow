"use client"

import { useState } from "react"
import { X, Trash2 } from "lucide-react"
import type { Hotspot, HotspotType, Step } from "@/lib/editor-types"
import { cn } from "@/lib/utils"

type Props = {
  hotspot: Hotspot
  steps: Step[]
  currentStepId: string
  onUpdateTarget: (hotspotId: string, targetStepId: string | null) => void
  onUpdateType: (hotspotId: string, type: HotspotType, placeholder?: string) => void
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
  onUpdateType,
  onDelete,
  onClose,
  anchorX,
  anchorY,
}: Props) {
  const availableSteps = steps.filter((s) => s.id !== currentStepId)
  const [placeholder, setPlaceholder] = useState(hotspot.placeholder ?? "")

  // Flip popover left/right & up/down to stay in bounds
  const flipX = anchorX > 60
  const flipY = anchorY > 55

  const type = hotspot.type ?? "navigate"

  return (
    <div
      className={cn(
        "absolute z-30 w-56 bg-popover border border-border rounded-xl shadow-lg shadow-black/10 p-3 flex flex-col gap-2.5",
      )}
      style={{
        left: flipX ? "auto" : `${Math.min(anchorX + 2, 45)}%`,
        right: flipX ? `${Math.max(100 - anchorX - 2, 10)}%` : "auto",
        top: flipY ? "auto" : `${Math.min(anchorY + hotspot.height + 1, 75)}%`,
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

      {/* Type segmented control */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Tipo di interazione
        </span>
        <div className="flex rounded-md border border-border overflow-hidden text-[11px] font-medium">
          {(["navigate", "text_input"] as HotspotType[]).map((t) => (
            <button
              key={t}
              onClick={() => onUpdateType(hotspot.id, t, t === "text_input" ? placeholder : undefined)}
              className={cn(
                "flex-1 py-1 transition-colors",
                type === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "navigate" ? "Naviga" : "Testo"}
            </button>
          ))}
        </div>
      </div>

      {/* Navigate: target step select */}
      {type === "navigate" && (
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
      )}

      {/* Text input: placeholder field */}
      {type === "text_input" && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Placeholder
          </label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => {
              setPlaceholder(e.target.value)
              onUpdateType(hotspot.id, "text_input", e.target.value)
            }}
            placeholder="es. Inserisci il tuo peso"
            className="w-full text-xs bg-muted border border-border rounded-md px-2 py-1.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

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
