"use client"

import { Plus } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Step } from "@/lib/editor-types"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Props = {
  steps: Step[]
  activeStepId: string
  onSelectStep: (id: string) => void
  onReorder: (steps: Step[]) => void
  onAddStep: () => void
  onRenameStep: (id: string, label: string) => void
}

function SortableStep({
  step,
  index,
  isActive,
  onSelect,
  onRename,
}: {
  step: Step
  index: number
  isActive: boolean
  onSelect: () => void
  onRename: (label: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(step.label)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep draft in sync if label changes externally
  useEffect(() => { setDraft(step.label) }, [step.label])

  // Focus input when entering edit mode
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = () => {
    const trimmed = draft.trim() || step.label
    setDraft(trimmed)
    onRename(trimmed)
    setEditing(false)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col items-center gap-1.5 select-none",
        isDragging && "opacity-40"
      )}
    >
      {/* Thumbnail — drag handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={onSelect}
        className={cn(
          "w-full aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all bg-muted cursor-pointer",
          isActive ? "border-primary shadow-md shadow-primary/20" : "border-transparent hover:border-border"
        )}
      >
        {step.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={step.imageUrl} alt={step.label} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <span className="text-2xl font-bold text-muted-foreground/40">{index + 1}</span>
          </div>
        )}
      </div>

      {/* Label — double-click to edit */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") { setDraft(step.label); setEditing(false) }
          }}
          className="w-full text-[10px] text-center font-medium bg-muted border border-primary rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          title="Doppio click per rinominare"
          className="text-[10px] text-muted-foreground font-medium truncate w-full text-center cursor-text hover:text-foreground transition-colors"
        >
          {step.label}
        </span>
      )}
    </div>
  )
}

export function StepsSidebar({ steps, activeStepId, onSelectStep, onReorder, onAddStep, onRenameStep }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id)
      const newIndex = steps.findIndex((s) => s.id === over.id)
      onReorder(arrayMove(steps, oldIndex, newIndex))
    }
  }

  return (
    <aside className="w-[140px] shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {steps.map((step, i) => (
              <SortableStep
                key={step.id}
                step={step}
                index={i}
                isActive={step.id === activeStepId}
                onSelect={() => onSelectStep(step.id)}
                onRename={(label) => onRenameStep(step.id, label)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Add step button */}
        <button
          onClick={onAddStep}
          className="w-full aspect-[9/16] rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center group"
          aria-label="Aggiungi step"
        >
          <Plus className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </aside>
  )
}
