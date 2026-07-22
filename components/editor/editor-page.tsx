"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { Step, Hotspot, HotspotType } from "@/lib/editor-types"
import { EditorToolbar } from "./editor-toolbar"
import { StepsSidebar } from "./steps-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { toast } from "sonner"

let hotspotCounter = 100

// Convert DB rows → editor Step shape
function dbToSteps(dbSteps: Array<{
  id: string
  label: string
  image_url: string
  order_index: number
  hotspots: Array<{
    id: string
    type: string
    x_pct: number
    y_pct: number
    width_pct: number
    height_pct: number
    target_step_id: string | null
    placeholder: string | null
    label: string
  }>
}>): Step[] {
  return dbSteps
    .sort((a, b) => a.order_index - b.order_index)
    .map((s) => ({
      id: s.id,
      label: s.label,
      imageUrl: s.image_url || "/placeholder.svg",
      hotspots: (s.hotspots ?? []).map((h) => ({
        id: h.id,
        type: (h.type ?? "navigate") as HotspotType,
        x: h.x_pct,
        y: h.y_pct,
        width: h.width_pct,
        height: h.height_pct,
        targetStepId: h.target_step_id,
        placeholder: h.placeholder ?? undefined,
        label: h.label,
      })),
    }))
}

const BLANK_STEPS: Step[] = [
  {
    id: `step-${Date.now()}`,
    label: "Step 1",
    imageUrl: "/placeholder.svg",
    hotspots: [],
  },
]

type Props = {
  demoId?: string
}

export function EditorPage({ demoId: initialDemoId }: Props) {
  const [demoId, setDemoId] = useState<string | null>(initialDemoId ?? null)
  const [title, setTitle] = useState("Nuova Demo")
  const [steps, setSteps] = useState<Step[]>(BLANK_STEPS)
  const [activeStepId, setActiveStepId] = useState<string>(BLANK_STEPS[0].id)
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [loading, setLoading] = useState(!!initialDemoId)
  const [saving, setSaving] = useState(false)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load existing demo on mount
  useEffect(() => {
    if (!initialDemoId) return
    setLoading(true)
    fetch(`/api/demos/${initialDemoId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error("Demo non trovata"); return }
        setTitle(data.title ?? "Nuova Demo")
        const loaded = dbToSteps(data.steps ?? [])
        const s = loaded.length ? loaded : BLANK_STEPS
        setSteps(s)
        setActiveStepId(s[0].id)
      })
      .catch(() => toast.error("Errore nel caricamento"))
      .finally(() => setLoading(false))
  }, [initialDemoId])

  // Auto-save after 1.5s of inactivity
  const scheduleSave = useCallback((updatedSteps: Step[], updatedTitle: string, id: string) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      fetch(`/api/demos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, status: "draft", share_slug: null, steps: updatedSteps }),
      }).catch(() => {/* silent */})
    }, 1500)
  }, [])

  const ensureDemoExists = useCallback(async (): Promise<string | null> => {
    if (demoId) return demoId
    const res = await fetch("/api/demos", { method: "POST" })
    const data = await res.json()
    if (data.error) { toast.error("Errore nella creazione della demo"); return null }
    setDemoId(data.id)
    // Update URL without full navigation
    window.history.replaceState(null, "", `/editor?id=${data.id}`)
    return data.id
  }, [demoId])

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0]

  const handleReorder = useCallback((reordered: Step[]) => {
    setSteps(reordered)
    ensureDemoExists().then((id) => { if (id) scheduleSave(reordered, title, id) })
  }, [ensureDemoExists, scheduleSave, title])

  const handleAddStep = useCallback(async () => {
    const id = await ensureDemoExists()
    if (!id) return
    const newStep: Step = {
      id: `step-${Date.now()}`,
      label: `Step ${steps.length + 1}`,
      imageUrl: "/placeholder.svg",
      hotspots: [],
    }
    setSteps((prev) => {
      const next = [...prev, newStep]
      scheduleSave(next, title, id)
      return next
    })
    setActiveStepId(newStep.id)
  }, [steps.length, ensureDemoExists, scheduleSave, title])

  const handleAddHotspot = useCallback(
    async (data: Omit<Hotspot, "id" | "label">) => {
      const id = await ensureDemoExists()
      if (!id) return
      hotspotCounter++
      const newHotspot: Hotspot = { ...data, id: `hs-${hotspotCounter}`, label: "" }
      setSteps((prev) => {
        const next = prev.map((s) =>
          s.id === activeStepId ? { ...s, hotspots: [...s.hotspots, newHotspot] } : s
        )
        scheduleSave(next, title, id)
        return next
      })
    },
    [activeStepId, ensureDemoExists, scheduleSave, title]
  )

  const handleUpdateTarget = useCallback(
    (hotspotId: string, targetStepId: string | null) => {
      setSteps((prev) => {
        const next = prev.map((s) =>
          s.id === activeStepId
            ? { ...s, hotspots: s.hotspots.map((h) => h.id === hotspotId ? { ...h, targetStepId } : h) }
            : s
        )
        if (demoId) scheduleSave(next, title, demoId)
        return next
      })
    },
    [activeStepId, demoId, scheduleSave, title]
  )

  const handleUpdateType = useCallback(
    (hotspotId: string, type: HotspotType, placeholder?: string) => {
      setSteps((prev) => {
        const next = prev.map((s) =>
          s.id === activeStepId
            ? {
                ...s,
                hotspots: s.hotspots.map((h) =>
                  h.id === hotspotId
                    ? { ...h, type, targetStepId: type === "text_input" ? null : h.targetStepId, placeholder }
                    : h
                ),
              }
            : s
        )
        if (demoId) scheduleSave(next, title, demoId)
        return next
      })
    },
    [activeStepId, demoId, scheduleSave, title]
  )

  const handleDeleteHotspot = useCallback(
    (hotspotId: string) => {
      setSteps((prev) => {
        const next = prev.map((s) =>
          s.id === activeStepId
            ? { ...s, hotspots: s.hotspots.filter((h) => h.id !== hotspotId) }
            : s
        )
        if (demoId) scheduleSave(next, title, demoId)
        return next
      })
    },
    [activeStepId, demoId, scheduleSave, title]
  )

  const handleNavigate = useCallback((stepId: string) => {
    setActiveStepId(stepId)
  }, [])

  const handleImageUpload = useCallback((stepId: string, url: string) => {
    setSteps((prev) => {
      const next = prev.map((s) => s.id === stepId ? { ...s, imageUrl: url } : s)
      if (demoId) scheduleSave(next, title, demoId)
      return next
    })
  }, [demoId, scheduleSave, title])

  const handlePublish = useCallback(async () => {
    setSaving(true)
    try {
      const id = await ensureDemoExists()
      if (!id) return

      // Generate a slug if not set
      const slug = `demo-${id.slice(0, 8)}`
      const res = await fetch(`/api/demos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "published", share_slug: slug, steps }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const shareUrl = `${window.location.origin}/d/${slug}`
      await navigator.clipboard.writeText(shareUrl).catch(() => {/* no clipboard permission */})
      toast.success("Demo pubblicata!", { description: `Link copiato: ${shareUrl}` })
    } catch (e) {
      toast.error("Errore nella pubblicazione", { description: String(e) })
    } finally {
      setSaving(false)
    }
  }, [ensureDemoExists, steps, title])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Caricamento demo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <EditorToolbar
        projectName={title}
        mode={mode}
        onModeChange={setMode}
        onPublish={handlePublish}
        isSaving={saving}
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
          onUpdateType={handleUpdateType}
          onDeleteHotspot={handleDeleteHotspot}
          onNavigate={handleNavigate}
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  )
}
