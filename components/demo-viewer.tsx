"use client"

import { useState, useEffect, useRef } from "react"
import type { HotspotType } from "@/lib/editor-types"
import { cn } from "@/lib/utils"

type Hotspot = {
  id: string
  type: HotspotType
  x: number; y: number; width: number; height: number
  targetStepId: string | null
  placeholder?: string
  label: string
}

type Step = {
  id: string
  label: string
  imageUrl: string
  hotspots: Hotspot[]
}

type Props = {
  title: string
  steps: Step[]
}

export function DemoViewer({ title, steps }: Props) {
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id ?? "")
  const [prevStepId, setPrevStepId] = useState<string | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentStep = steps.find((s) => s.id === currentStepId) ?? steps[0]
  const prevStep = prevStepId ? steps.find((s) => s.id === prevStepId) : null
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)

  const navigateTo = (stepId: string) => {
    if (stepId === currentStepId || transitioning) return
    const nextIndex = steps.findIndex((s) => s.id === stepId)
    setDirection(nextIndex >= currentIndex ? "forward" : "backward")
    setPrevStepId(currentStepId)
    setCurrentStepId(stepId)
    setTransitioning(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setPrevStepId(null)
      setTransitioning(false)
    }, 380)
  }

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">No steps available.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-primary/15 flex items-center justify-center">
            <div className="size-2.5 rounded-sm bg-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">ShipShow</span>
        </div>
        <h1 className="text-base font-medium text-muted-foreground">{title}</h1>
      </div>

      {/* Phone frame */}
      <div className="relative">
        <div className="relative w-[280px] rounded-[2.8rem] border-[7px] border-foreground/15 bg-foreground/5 shadow-2xl shadow-black/20 overflow-hidden">
          {/* Screen — clipping container */}
          <div className="relative bg-card overflow-hidden" style={{ paddingBottom: "216.67%" }}>

            {/* Outgoing screen (slides out) */}
            {transitioning && prevStep && (
              <div
                key={`prev-${prevStep.id}`}
                className={cn(
                  "absolute inset-0 w-full h-full",
                  direction === "forward"
                    ? "animate-slide-out-left"
                    : "animate-slide-out-right"
                )}
              >
                <ScreenContent step={prevStep} onNavigate={() => {}} />
              </div>
            )}

            {/* Incoming screen (slides in) */}
            <div
              key={`curr-${currentStep.id}`}
              className={cn(
                "absolute inset-0 w-full h-full",
                transitioning
                  ? direction === "forward"
                    ? "animate-slide-in-right"
                    : "animate-slide-in-left"
                  : ""
              )}
            >
              <ScreenContent step={currentStep} onNavigate={navigateTo} />
            </div>

          </div>
        </div>

        {/* Step indicator dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => navigateTo(s.id)}
              className={cn(
                "rounded-full transition-all duration-200",
                i === currentIndex
                  ? "w-4 h-2 bg-primary"
                  : "size-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
              aria-label={s.label}
            />
          ))}
        </div>
      </div>

      {/* Step label + nav */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => { if (currentIndex > 0) navigateTo(steps[currentIndex - 1].id) }}
          disabled={currentIndex === 0}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Previous
        </button>
        <span className="text-xs font-medium text-foreground px-3 py-1 rounded-full bg-muted">
          {currentStep.label} &middot; {currentIndex + 1} / {steps.length}
        </span>
        <button
          onClick={() => { if (currentIndex < steps.length - 1) navigateTo(steps[currentIndex + 1].id) }}
          disabled={currentIndex === steps.length - 1}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Branding footer */}
      <p className="text-[11px] text-muted-foreground/50 mt-2">
        Built with{" "}
        <a href="/" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
          ShipShow
        </a>
      </p>
    </div>
  )
}

// Extracted screen content to avoid code duplication between current/prev
function ScreenContent({ step, onNavigate }: { step: Step; onNavigate: (id: string) => void }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      {step.imageUrl && step.imageUrl !== "/placeholder.svg" ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={step.imageUrl}
          alt={step.label}
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/40">
          <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
            <div className="size-5 rounded-md bg-muted-foreground/20" />
          </div>
          <p className="text-[10px] text-muted-foreground">{step.label}</p>
        </div>
      )}

      {/* Hotspots */}
      {step.hotspots.map((hs) => (
        <div
          key={hs.id}
          className="absolute"
          style={{ left: `${hs.x}%`, top: `${hs.y}%`, width: `${hs.width}%`, height: `${hs.height}%` }}
        >
          {hs.type === "text_input" ? (
            <input
              type="text"
              placeholder={hs.placeholder ?? ""}
              className="w-full h-full rounded border border-border/60 bg-transparent text-[10px] px-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          ) : (
            <div
              className="w-full h-full rounded cursor-pointer active:bg-white/20 transition-colors"
              style={{ WebkitTapHighlightColor: "transparent" }}
              onClick={() => { if (hs.targetStepId) onNavigate(hs.targetStepId) }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
