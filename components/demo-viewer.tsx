"use client"

import { useState, useEffect, useRef } from "react"
import type { HotspotType } from "@/lib/editor-types"
import { cn } from "@/lib/utils"
import { Compass } from "lucide-react"

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
  defaultGuided?: boolean
}

export function DemoViewer({ title, steps, defaultGuided = false }: Props) {
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id ?? "")
  const [prevStepId, setPrevStepId] = useState<string | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [guided, setGuided] = useState(defaultGuided)

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
        <div className="relative w-[280px] rounded-[2.5rem] border-[6px] border-foreground/10 bg-foreground/5 shadow-2xl shadow-black/20 overflow-hidden">
          {/* Screen — image drives the height naturally, hotspots are absolute on top */}
          <div className="relative bg-card overflow-hidden">

            {/* Outgoing screen — absolute so it doesn't affect height */}
            {transitioning && prevStep && (
              <div
                key={`prev-${prevStep.id}`}
                className={cn(
                  "absolute inset-0 w-full h-full z-10",
                  direction === "forward" ? "animate-slide-out-left" : "animate-slide-out-right"
                )}
              >
                <ScreenContent step={prevStep} guided={guided} onNavigate={() => {}} />
              </div>
            )}

            {/* Current screen — no extra wrapper, ScreenContent is direct child */}
            <ScreenContent
              key={`curr-${currentStep.id}`}
              step={currentStep}
              guided={guided}
              onNavigate={navigateTo}
              animClass={transitioning ? (direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left") : ""}
            />

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

      {/* Step label + nav + guided toggle */}
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

      {/* Guided mode toggle */}
      <button
        onClick={() => setGuided((g) => !g)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
          guided
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/80"
        )}
        title={guided ? "Disable guided mode" : "Enable guided mode"}
      >
        <Compass className="size-3" />
        {guided ? "Guided mode on" : "Guided mode off"}
      </button>

      {/* Branding footer */}
      <p className="text-[11px] text-muted-foreground/50">
        Built with{" "}
        <a href="/" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
          ShipShow
        </a>
      </p>
    </div>
  )
}

function ScreenContent({
  step,
  guided,
  onNavigate,
  animClass = "",
}: {
  step: Step
  guided: boolean
  onNavigate: (id: string) => void
  animClass?: string
}) {
  const [aspect, setAspect] = useState<string>("9/16")

  return (
    // Container uses the same dynamic aspectRatio as EditorCanvas so % coords align exactly
    <div
      className={cn("relative overflow-hidden", animClass)}
      style={{ aspectRatio: aspect }}
    >
      {step.imageUrl && step.imageUrl !== "/placeholder.svg" ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={step.imageUrl}
          alt={step.label}
          className="absolute inset-0 w-full h-full object-fill"
          crossOrigin="anonymous"
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget
            if (w && h) setAspect(`${w}/${h}`)
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/40">
          <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
            <div className="size-5 rounded-md bg-muted-foreground/20" />
          </div>
          <p className="text-[10px] text-muted-foreground">{step.label}</p>
        </div>
      )}

      {/* Hotspots — absolute over the image, same coordinate space as EditorCanvas */}
      {step.hotspots.map((hs) => (
        <HotspotOverlay
          key={hs.id}
          hotspot={hs}
          guided={guided}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}

function HotspotOverlay({
  hotspot: hs,
  guided,
  onNavigate,
}: {
  hotspot: Hotspot
  guided: boolean
  onNavigate: (id: string) => void
}) {
  if (hs.type === "text_input") {
    return (
      <div
        className="absolute"
        style={{ left: `${hs.x}%`, top: `${hs.y}%`, width: `${hs.width}%`, height: `${hs.height}%` }}
      >
        <input
          type="text"
          placeholder={hs.placeholder ?? ""}
          className={cn(
            "w-full h-full rounded border text-[10px] px-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all",
            guided
              ? "border-primary/70 bg-primary/5 focus:ring-1 focus:ring-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.15)] animate-guided-pulse-input"
              : "border-border/60 bg-transparent focus:border-ring focus:ring-1 focus:ring-ring"
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "absolute rounded cursor-pointer transition-all duration-150 group",
        guided
          ? "border-2 border-primary/70 bg-primary/10 shadow-[0_0_0_3px_hsl(var(--primary)/0.2),inset_0_0_0_1px_hsl(var(--primary)/0.3)] animate-guided-pulse"
          : "active:bg-white/20"
      )}
      style={{
        left: `${hs.x}%`,
        top: `${hs.y}%`,
        width: `${hs.width}%`,
        height: `${hs.height}%`,
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={() => { if (hs.targetStepId) onNavigate(hs.targetStepId) }}
    >
      {/* Touch indicator dot visible in guided mode */}
      {guided && (
        <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-primary shadow-md flex items-center justify-center">
          <span className="size-1.5 rounded-full bg-primary-foreground" />
        </span>
      )}
    </div>
  )
}
