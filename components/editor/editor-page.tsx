"use client"

import { useState, useCallback } from "react"
import { MOCK_STEPS } from "@/lib/editor-types"
import type { Step, Hotspot } from "@/lib/editor-types"
import { EditorToolbar } from "./editor-toolbar"
import { StepsSidebar } from "./steps-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { toast } from "sonner"

let hotspotCounter = 100

export function EditorPage() {
  const [steps, setSteps] = useState<Step[]>(MOCK_STEPS)
  const [activeStepId, setActiveStepId] = useState<string>(MOCK_STEPS[0].id)
  const [mode, setMode] = useState<"edit" | "preview">("edit")

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0]

  const handleReorder = useCallback((reordered: Step[]) => {
    setSteps(reordered)
  }, [])

  const handleAddStep = useCallback(() => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      label: `Step ${steps.length + 1}`,
      imageUrl: "/placeholder.svg",
      hotspots: [],
    }
    setSteps((prev) => [...prev, newStep])
    setActiveStepId(newStep.id)
  }, [steps.length])

  const handleAddHotspot = useCallback(
    (data: Omit<Hotspot, "id" | "label">) => {
      hotspotCounter++
      const newHotspot: Hotspot = {
        ...data,
        id: `hs-${hotspotCounter}`,
        label: "",
      }
      setSteps((prev) =>
        prev.map((s) =>
          s.id === activeStepId
            ? { ...s, hotspots: [...s.hotspots, newHotspot] }
            : s
        )
      )
    },
    [activeStepId]
  )

  const handleUpdateTarget = useCallback(
    (hotspotId: string, targetStepId: string | null) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === activeStepId
            ? {
                ...s,
                hotspots: s.hotspots.map((h) =>
                  h.id === hotspotId ? { ...h, targetStepId } : h
                ),
              }
            : s
        )
      )
    },
    [activeStepId]
  )

  const handleDeleteHotspot = useCallback(
    (hotspotId: string) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === activeStepId
            ? { ...s, hotspots: s.hotspots.filter((h) => h.id !== hotspotId) }
            : s
        )
      )
    },
    [activeStepId]
  )

  const handleNavigate = useCallback((stepId: string) => {
    setActiveStepId(stepId)
  }, [])

  const handlePublish = useCallback(() => {
    toast.success("Demo pubblicata!", {
      description: "Il link è stato copiato negli appunti.",
    })
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <EditorToolbar
        projectName="v1.2 — Workout tracking"
        mode={mode}
        onModeChange={setMode}
        onPublish={handlePublish}
      />
      <div className="flex flex-1 overflow-hidden">
        <StepsSidebar
          steps={steps}
          activeStepId={activeStepId}
          onSelectStep={setActiveStepId}
          onReorder={handleReorder}
          onAddStep={handleAddStep}
        />
        <EditorCanvas
          step={activeStep}
          steps={steps}
          mode={mode}
          onAddHotspot={handleAddHotspot}
          onUpdateTarget={handleUpdateTarget}
          onDeleteHotspot={handleDeleteHotspot}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  )
}
