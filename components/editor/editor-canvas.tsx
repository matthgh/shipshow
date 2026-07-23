"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { ImagePlus } from "lucide-react"
import type { Hotspot, HotspotType, Step } from "@/lib/editor-types"
import { HotspotPopover } from "./hotspot-popover"
import { cn } from "@/lib/utils"

type DrawingRect = { startX: number; startY: number; endX: number; endY: number }

type Props = {
  step: Step
  steps: Step[]
  mode: "edit" | "preview"
  guided?: boolean
  onAddHotspot: (hotspot: Omit<Hotspot, "id" | "label">) => void
  onUpdateTarget: (hotspotId: string, targetStepId: string | null) => void
  onUpdateType: (hotspotId: string, type: HotspotType, placeholder?: string) => void
  onDeleteHotspot: (hotspotId: string) => void
  onNavigate: (stepId: string) => void
  onImageUpload: (stepId: string, url: string) => void
}

const HOTSPOT_COLOR = "oklch(0.52 0.22 255)"

function pct(px: number, total: number) {
  return Math.max(0, Math.min(100, (px / total) * 100))
}

export function EditorCanvas({
  step,
  steps,
  mode,
  guided = false,
  onAddHotspot,
  onUpdateTarget,
  onUpdateType,
  onDeleteHotspot,
  onNavigate,
  onImageUpload,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState<DrawingRect | null>(null)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const isDrawing = useRef(false)

  useEffect(() => { setMounted(true) }, [])

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
    <>
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
            {/* Screenshot or placeholder */}
            {step.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={step.imageUrl}
                alt={step.label}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted pointer-events-none">
                <ImagePlus className="size-8 text-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/50 font-medium">No image</span>
              </div>
            )}

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
                      if (isSelected) {
                        setSelectedHotspot(null)
                        setPopoverAnchor(null)
                      } else {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                        setPopoverAnchor({ x: rect.left, y: rect.bottom, w: rect.width, h: rect.height })
                        setSelectedHotspot(hs)
                      }
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
                            : guided
                              ? "border border-primary/70 bg-primary/5 animate-guided-pulse-input cursor-text"
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
                            if (isSelected) {
                              setSelectedHotspot(null)
                              setPopoverAnchor(null)
                            } else {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                              setPopoverAnchor({ x: rect.left, y: rect.bottom, w: rect.width, h: rect.height })
                              setSelectedHotspot(hs)
                            }
                          }
                        }}
                      />
                      {/* Label badge in edit mode */}
                      {mode === "edit" && (
                        <span
                          className="absolute -top-5 left-0 text-[9px] font-medium px-1 py-0.5 rounded whitespace-nowrap"
                          style={{ backgroundColor: TEXT_COLOR, color: "white" }}
                        >
                          Text · {hs.label || hs.placeholder || "—"}
                        </span>
                      )}
                    </>
                  ) : (
                    /* Navigate hotspot */
                    <>
                      <div
                        className={cn(
                          "w-full h-full rounded transition-all relative",
                          mode === "edit"
                            ? "border-2 border-dashed cursor-pointer"
                            : guided
                              ? "border-2 border-primary/70 bg-primary/10 animate-guided-pulse cursor-pointer"
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
                      >
                        {/* Indicator dot in guided preview mode */}
                        {mode === "preview" && guided && (
                          <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-primary shadow-md flex items-center justify-center pointer-events-none">
                            <span className="size-1.5 rounded-full bg-primary-foreground" />
                          </span>
                        )}
                      </div>
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

            {/* Popover is rendered via portal — see below */}
          </div>
        </div>

        {/* Mode hint */}
        <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
          {mode === "edit"
            ? "Drag to create a hotspot · Click a hotspot to configure it"
            : "Click hotspots to navigate between steps"}
        </p>
      </div>
    </main>

    {/* Portal: renders popover above all clipping ancestors */}
    {mounted && selectedHotspot && mode === "edit" && popoverAnchor &&
      createPortal(
        <HotspotPopover
          hotspot={selectedHotspot}
          steps={steps}
          currentStepId={step.id}
          anchorRect={popoverAnchor}
          onUpdateTarget={(id, targetId) => {
            onUpdateTarget(id, targetId)
            setSelectedHotspot((prev) => prev ? { ...prev, targetStepId: targetId } : null)
          }}
          onUpdateType={(id, type, placeholder) => {
            onUpdateType(id, type, placeholder)
            setSelectedHotspot((prev) => prev ? { ...prev, type, placeholder } : null)
          }}
          onDelete={(id) => {
            onDeleteHotspot(id)
            setSelectedHotspot(null)
            setPopoverAnchor(null)
          }}
          onClose={() => {
            setSelectedHotspot(null)
            setPopoverAnchor(null)
          }}
        />,
        document.body
      )
    }
    </>
  )
}
