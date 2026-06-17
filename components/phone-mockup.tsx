"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle, Dumbbell, Flame, Heart, Activity } from "lucide-react"

const screens = [
  {
    id: "home",
    label: "Dashboard",
    bg: "from-primary/20 to-background",
    content: (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Good morning,</p>
            <p className="text-sm font-semibold text-foreground">Alex 👋</p>
          </div>
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Activity className="size-4 text-primary" />
          </div>
        </div>
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Today&apos;s goal</p>
          <p className="text-lg font-bold text-foreground">8,240 <span className="text-xs font-normal text-muted-foreground">steps</span></p>
          <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">74% complete</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Flame, label: "Calories", val: "420", color: "text-orange-400" },
            { icon: Heart, label: "Heart rate", val: "72", color: "text-rose-400" },
            { icon: Dumbbell, label: "Workouts", val: "3", color: "text-primary" },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="rounded-lg bg-card border border-border p-2 flex flex-col items-center gap-1">
              <Icon className={`size-3 ${color}`} />
              <p className="text-sm font-semibold text-foreground">{val}</p>
              <p className="text-[8px] text-muted-foreground leading-none text-center">{label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "workout",
    label: "Workout",
    bg: "from-primary/10 to-background",
    content: (
      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-foreground">Today&apos;s Workout</p>
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center gap-2">
          <Dumbbell className="size-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">Upper Body</p>
            <p className="text-[9px] text-muted-foreground">6 exercises · 45 min</p>
          </div>
          <CheckCircle className="size-4 text-primary ml-auto" />
        </div>
        {["Bench Press", "Pull-ups", "Shoulder Press", "Bicep Curls"].map((ex) => (
          <div key={ex} className="flex items-center justify-between py-1.5 border-b border-border/50">
            <p className="text-xs text-foreground">{ex}</p>
            <p className="text-[9px] text-muted-foreground">3 × 12</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "stats",
    label: "Stats",
    bg: "from-primary/10 to-background",
    content: (
      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-foreground">Weekly Stats</p>
        <div className="flex items-end gap-1 h-20">
          {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="rounded-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 5 ? "oklch(0.65 0.2 255)" : "oklch(0.65 0.2 255 / 30%)",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <p key={i} className="text-[8px] text-muted-foreground flex-1 text-center">{d}</p>
          ))}
        </div>
        <div className="rounded-xl bg-card border border-border p-3">
          <p className="text-[9px] text-muted-foreground">Weekly avg. steps</p>
          <p className="text-lg font-bold text-foreground">7,842</p>
          <p className="text-[9px] text-primary">↑ 12% vs last week</p>
        </div>
      </div>
    ),
  },
]

export function PhoneMockup() {
  const [active, setActive] = useState(0)

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-75" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Version badge */}
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
          <div className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-mono font-medium">v1.3</span>
          <span className="text-xs text-muted-foreground">fitness-app</span>
        </div>

        {/* Phone frame */}
        <div className="relative">
          <div className="w-52 h-96 rounded-[2.5rem] border-2 border-border bg-card overflow-hidden shadow-2xl shadow-primary/10">
            {/* Status bar */}
            <div className="h-8 bg-background/60 flex items-center justify-between px-5 flex-shrink-0">
              <span className="text-[8px] text-muted-foreground font-medium">9:41</span>
              <div className="w-16 h-4 rounded-full bg-card/80 border border-border/40" />
              <div className="flex gap-1">
                {[1, 2, 3].map((b) => (
                  <div key={b} className="w-1 rounded-sm bg-foreground/60" style={{ height: `${b * 3 + 2}px` }} />
                ))}
              </div>
            </div>

            {/* Screen content */}
            <div className={`flex-1 bg-gradient-to-b ${screens[active].bg} overflow-hidden`} style={{ height: "calc(100% - 2rem - 3rem)" }}>
              {screens[active].content}
            </div>

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-card/90 border-t border-border flex items-center justify-around px-4">
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`text-[9px] font-medium transition-colors px-2 py-1 rounded ${
                    i === active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clickable flow indicator */}
          {active < screens.length - 1 && (
            <button
              onClick={() => setActive((a) => Math.min(a + 1, screens.length - 1))}
              className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-primary/20 border border-primary/40 px-2.5 py-1.5 text-primary hover:bg-primary/30 transition-colors"
              aria-label="Next screen"
            >
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Share link */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 max-w-xs">
          <div className="size-4 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] text-primary font-bold">S</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono truncate">shipshow.app/demo/fitness-app-v1-3</span>
        </div>
      </div>
    </div>
  )
}
