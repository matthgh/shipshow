"use client"

import { useRef, useState, useCallback } from "react"
import type { Hotspot, HotspotType, Step } from "@/lib/editor-types"
import { HotspotPopover } from "./hotspot-popover"
import { cn } from "@/lib/utils"

type DrawingRect = { startX: number; startY: number; endX: number; endY: number }

type Props = {
  step: Step
  steps: Step[]
  mode: "edit" | "preview"
  onAddHotspot: (hotspot: Omit<Hotspot, "id" | "label">) => void
  onUpdateTarget: (hotspotId: string, targetStepId: string | null) => void
  onUpdateType: (hotspotId: string, type: HotspotType, placeholder?: string) => void
  onDeleteHotspot: (hotspotId: string) => void
  onNavigate: (stepId: string) => void
}

const HOTSPOT_COLOR = "oklch(0.52 0.22 255)"

function pct(px: number, total: number) {
  return Math.max(0, Math.min(100, (px / total) * 100))
}

export function EditorCanvas({
  step,
  steps,
  mode,
  onAddHotspot,
  onUpdateTarget,
  onUpdateType,
  onDeleteHotspot,
  onNavigate,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState<DrawingRect | null>(null)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const isDrawing = useRef(false)

  // --- Drawing handlers (edit mode only) ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== "edit") return
      if ((e.target as HTMLElement).closest("[data-hotspot]")) return
      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      isDrawing.current = true
      setSelectedHotspot(null)
      setDrawing({ startX: x, startY: y, endX: x, endY: y })
    },
    [mode]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current || !drawing) return
    const rect = containerRef.current!.getBoundingClientRect()
    setDrawing((d) =>
      d ? { ...d, endX: e.clientX - rect.left, endY: e.clientY - rect.top } : null
    )
  }, [drawing])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current || !drawing || !containerRef.current) return
    isDrawing.current = false
    const rect = containerRef.current.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const x = Math.min(drawing.startX, drawing.endX)
    const y = Math.min(drawing.startY, drawing.endY)
    const width = Math.abs(drawing.endX - drawing.startX)
    const height = Math.abs(drawing.endY - drawing.startY)
    // Ignore tiny accidental clicks
    if (width < 8 || height < 8) { setDrawing(null); return }
    onAddHotspot({
      x: pct(x, w),
      y: pct(y, h),
      width: pct(width, w),
      height: pct(height, h),
      type: "navigate",
      targetStepId: null,
    })
    setDrawing(null)
  }, [drawing, onAddHotspot])

  // Rect from drawing state (in px)
  const drawingStyle = drawing
    ? {
        left: Math.min(drawing.startX, drawing.endX),
        top: Math.min(drawing.startY, drawing.endY),
        width: Math.abs(drawing.endX - drawing.startX),
        height: Math.abs(drawing.endY - drawing.startY),
      }
    : null

  return (
    <main className="flex-1 flex items-center justify-center bg-muted/40 overflow-hidden p-8 select-none">
      {/* Phone frame */}
      <div className="relative flex flex-col" style={{ width: 280 }}>
        {/* Step label */}
        <div className="mb-3 text-center">
          <span className="text-xs font-medium text-muted-foreground">{step.label}</span>
        </div>

        {/* Phone shell */}
        <div className="relative rounded-[2.5rem] border-[6px] border-foreground/10 bg-foreground/5 shadow-2xl shadow-black/20 overflow-hidden">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-foreground/10 z-10" />

          {/* Screen — this is the image container for hotspot coordinates */}
          <div
            ref={containerRef}
            className={cn(
              "relative overflow-hidden bg-background",
              mode === "edit" && "cursor-crosshair"
            )}
            style={{ aspectRatio: "9/16" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { if (isDrawing.current) handleMouseUp() }}
          >
            {/* Screenshot / placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-muted pointer-events-none">
              <span className="text-5xl font-black text-foreground/10">{step.label.slice(0, 2).toUpperCase()}</span>
              <span className="text-[10px] text-muted-foreground/60 font-mono">{step.imageUrl}</span>
            </div>

            {/* Existing hotspots */}
            {step.hotspots.map((hs) => {
              const isSelected = selectedHotspot?.id === hs.id
              const isTextInput = hs.type === "text_input"
              const TEXT_COLOR = "oklch(0.55 0.18 145)" // green for text_input

              return (
                <div
                  key={hs.id}
                  data-hotspot="true"
                  className="absolute"
                  style={{
                    left: `${hs.x}%`,
                    top: `${hs.y}%`,
                    width: `${hs.width}%`,
                    height: `${hs.height}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (mode === "preview") {
                      if (!isTextInput && hs.targetStepId) onNavigate(hs.targetStepId)
                    } else {
                      setSelectedHotspot(isSelected ? null : hs)
                    }
                  }}
                >
                  {/* Text input hotspot */}
                  {isTextInput ? (
                    <>
                      <input
                        type="text"
                        placeholder={hs.placeholder ?? ""}
                        disabled={mode === "edit"}
                        className={cn(
                          "w-full h-full rounded bg-transparent text-[11px] px-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
                          mode === "edit"
                            ? "border-2 border-dashed cursor-pointer select-none"
                            : "border border-border/60 focus:border-ring focus:ring-1 focus:ring-ring cursor-text"
                        )}
                        style={
                          mode === "edit"
                            ? {
                                borderColor: isSelected ? TEXT_COLOR : `${TEXT_COLOR}`,
                                backgroundColor: isSelected
                                  ? "oklch(0.55 0.18 145 / 20%)"
                                  : "oklch(0.55 0.18 145 / 8%)",
                              }
                            : undefined
                        }
                        onClick={(e) => {
                          if (mode === "edit") {
                            e.stopPropagation()
                            setSelectedHotspot(isSelected ? null : hs)
                          }
                        }}
                      />
                      {/* Label badge in edit mode */}
                      {mode === "edit" && (
                        <span
                          className="absolute -top-5 left-0 text-[9px] font-medium px-1 py-0.5 rounded whitespace-nowrap"
                          style={{ backgroundColor: TEXT_COLOR, color: "white" }}
                        >
                          Testo · {hs.label || hs.placeholder || "—"}
                        </span>
                      )}
                    </>
                  ) : (
                    /* Navigate hotspot */
                    <>
                      <div
                        className={cn(
                          "w-full h-full rounded transition-all",
                          mode === "edit"
                            ? "border-2 border-dashed cursor-pointer"
                            : "bg-transparent hover:bg-white/10 cursor-pointer"
                        )}
                        style={
                          mode === "edit"
                            ? {
                                borderColor: HOTSPOT_COLOR,
                                backgroundColor: isSelected
                                  ? "oklch(0.52 0.22 255 / 20%)"
                                  : "oklch(0.52 0.22 255 / 10%)",
                              }
                            : undefined
                        }
                      />
                      {/* Label in edit mode */}
                      {mode === "edit" && (
                        <span
                          className="absolute -top-5 left-0 text-[9px] font-medium px-1 py-0.5 rounded whitespace-nowrap"
                          style={{ backgroundColor: HOTSPOT_COLOR, color: "white" }}
                        >
                          {steps.find((s) => s.id === hs.targetStepId)?.label ?? "—"}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}

            {/* Active drawing rect */}
            {drawingStyle && (
              <div
                className="absolute pointer-events-none rounded border-2 border-dashed"
                style={{
                  ...drawingStyle,
                  borderColor: HOTSPOT_COLOR,
                  backgroundColor: "oklch(0.52 0.22 255 / 15%)",
                }}
              />
            )}

            {/* Hotspot popover */}
            {selectedHotspot && mode === "edit" && (
              <HotspotPopover
                hotspot={selectedHotspot}
                steps={steps}
                currentStepId={step.id}
                onUpdateTarget={(id, targetId) => {
                  onUpdateTarget(id, targetId)
                  setSelectedHotspot((prev) =>
                    prev ? { ...prev, targetStepId: targetId } : null
                  )
                }}
                onUpdateType={(id, type, placeholder) => {
                  onUpdateType(id, type, placeholder)
                  setSelectedHotspot((prev) =>
                    prev ? { ...prev, type, placeholder } : null
                  )
                }}
                onDelete={(id) => {
                  onDeleteHotspot(id)
                  setSelectedHotspot(null)
                }}
                onClose={() => setSelectedHotspot(null)}
                anchorX={selectedHotspot.x}
                anchorY={selectedHotspot.y}
              />
            )}
          </div>
        </div>

        {/* Mode hint */}
        <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
          {mode === "edit"
            ? "Trascina per creare un hotspot · Clicca su un hotspot per configurarlo"
            : "Clicca sugli hotspot per navigare tra gli step"}
        </p>
      </div>
    </main>
  )
}
