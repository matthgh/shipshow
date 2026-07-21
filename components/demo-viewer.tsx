"use client"

import { useState } from "react"
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

const HOTSPOT_COLOR = "oklch(0.52 0.22 255)"

export function DemoViewer({ title, steps }: Props) {
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id ?? "")

  const currentStep = steps.find((s) => s.id === currentStepId) ?? steps[0]
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Nessuno step disponibile.</p>
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
        {/* Outer shell */}
        <div className="relative w-[280px] rounded-[2.8rem] border-[7px] border-foreground/15 bg-foreground/5 shadow-2xl shadow-black/20 overflow-hidden">
          {/* Screen */}
          <div className="relative bg-card" style={{ paddingBottom: "216.67%" }}>
            {/* Screenshot or placeholder */}
            {currentStep.imageUrl && currentStep.imageUrl !== "/placeholder.svg" ? (
              <img
                src={currentStep.imageUrl}
                alt={currentStep.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/40">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                  <div className="size-5 rounded-md bg-muted-foreground/20" />
                </div>
                <p className="text-[10px] text-muted-foreground">{currentStep.label}</p>
              </div>
            )}

            {/* Hotspots */}
            {currentStep.hotspots.map((hs) => (
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
                    className="w-full h-full rounded cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => { if (hs.targetStepId) setCurrentStepId(hs.targetStepId) }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step indicator dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepId(s.id)}
              className={cn(
                "rounded-full transition-all",
                i === currentIndex
                  ? "size-2 bg-primary"
                  : "size-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
              aria-label={s.label}
            />
          ))}
        </div>
      </div>

      {/* Step label + nav */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => { if (currentIndex > 0) setCurrentStepId(steps[currentIndex - 1].id) }}
          disabled={currentIndex === 0}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Precedente
        </button>
        <span className="text-xs font-medium text-foreground px-3 py-1 rounded-full bg-muted">
          {currentStep.label} &middot; {currentIndex + 1} / {steps.length}
        </span>
        <button
          onClick={() => { if (currentIndex < steps.length - 1) setCurrentStepId(steps[currentIndex + 1].id) }}
          disabled={currentIndex === steps.length - 1}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Successivo
        </button>
      </div>

      {/* Branding footer */}
      <p className="text-[11px] text-muted-foreground/50 mt-2">
        Demo creata con{" "}
        <a href="/" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
          ShipShow
        </a>
      </p>
    </div>
  )
}
