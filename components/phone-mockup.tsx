"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Activity, Dumbbell, BarChart3, Flame, Heart, Zap, TrendingUp, Check } from "lucide-react"

/* ─── Screen definitions ─────────────────────────────────────────── */

function DashboardScreen() {
  const [steps, setSteps] = useState(6140)

  useEffect(() => {
    const t = setInterval(() => setSteps((s) => Math.min(s + Math.floor(Math.random() * 30 + 5), 8240)), 800)
    return () => clearInterval(t)
  }, [])

  const pct = Math.round((steps / 8240) * 100)

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Good morning</p>
          <p className="text-sm font-bold text-foreground">Alex</p>
        </div>
        <div className="size-8 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-primary/30">
          <Activity className="size-4 text-primary" />
        </div>
      </div>

      {/* Steps card */}
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Daily steps</p>
            <p className="text-2xl font-black text-foreground tabular-nums">
              {steps.toLocaleString()}
            </p>
          </div>
          <span className="text-[9px] font-semibold text-primary bg-primary/15 rounded-full px-2 py-0.5">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-primary/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[8px] text-muted-foreground mt-1">{(8240 - steps).toLocaleString()} steps to goal</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Flame, label: "Kcal", val: "482", color: "text-orange-500", bg: "bg-orange-500/10" },
          { icon: Heart, label: "BPM", val: "68", color: "text-rose-500", bg: "bg-rose-500/10" },
          { icon: Zap, label: "Active", val: "38m", color: "text-primary", bg: "bg-primary/10" },
        ].map(({ icon: Icon, label, val, color, bg }) => (
          <div key={label} className={`rounded-xl ${bg} border border-border p-2 flex flex-col items-center gap-1`}>
            <Icon className={`size-3.5 ${color}`} />
            <p className="text-xs font-bold text-foreground">{val}</p>
            <p className="text-[8px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Next workout */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5">
        <div className="size-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Dumbbell className="size-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-foreground">Upper Body</p>
          <p className="text-[8px] text-muted-foreground">6 exercises · 45 min</p>
        </div>
        <ArrowRight className="size-3 text-muted-foreground ml-auto flex-shrink-0" />
      </div>
    </div>
  )
}

function WorkoutScreen() {
  const [done, setDone] = useState<number[]>([])
  const exercises = [
    { name: "Bench Press", sets: "4 × 8", weight: "80 kg" },
    { name: "Pull-ups", sets: "3 × 10", weight: "BW" },
    { name: "Shoulder Press", sets: "3 × 12", weight: "24 kg" },
    { name: "Bicep Curls", sets: "3 × 15", weight: "14 kg" },
    { name: "Tricep Dips", sets: "3 × 12", weight: "BW" },
  ]
  const allDone = done.length === exercises.length

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Upper Body</p>
        <span className={`text-[9px] font-semibold rounded-full px-2 py-0.5 ${allDone ? "bg-green-500/15 text-green-600" : "bg-primary/15 text-primary"}`}>
          {done.length}/{exercises.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(done.length / exercises.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        {exercises.map((ex, i) => {
          const isDone = done.includes(i)
          return (
            <button
              key={ex.name}
              onClick={() => setDone((d) => isDone ? d.filter((x) => x !== i) : [...d, i])}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 transition-all ${
                isDone ? "border-primary/30 bg-primary/8" : "border-border bg-card"
              }`}
            >
              <div className={`size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isDone ? "border-primary bg-primary" : "border-border"
              }`}>
                {isDone && <Check className="size-3 text-white" />}
              </div>
              <div className="text-left min-w-0">
                <p className={`text-[10px] font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{ex.name}</p>
                <p className="text-[8px] text-muted-foreground">{ex.sets} · {ex.weight}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StatsScreen() {
  const bars = [42, 68, 53, 81, 58, 94, 72]
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const today = 5

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Weekly Stats</p>
        <div className="flex items-center gap-1 text-[9px] text-primary font-semibold">
          <TrendingUp className="size-3" />
          <span>+12%</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <p className="text-[9px] text-muted-foreground mb-3">Activity this week</p>
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    i === today
                      ? "oklch(0.52 0.22 255)"
                      : i < today
                      ? "oklch(0.52 0.22 255 / 35%)"
                      : "oklch(0.52 0.22 255 / 15%)",
                }}
              />
              <p className={`text-[7px] ${i === today ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {days[i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Activity, label: "Avg. steps", val: "7,842", sub: "per day", color: "text-primary" },
          { icon: Flame, label: "Calories", val: "3,240", sub: "this week", color: "text-orange-500" },
        ].map(({ icon: Icon, label, val, sub, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-2.5">
            <Icon className={`size-3.5 ${color} mb-1`} />
            <p className="text-[9px] text-muted-foreground">{label}</p>
            <p className="text-sm font-black text-foreground">{val}</p>
            <p className="text-[8px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Personal best */}
      <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/8 p-2.5">
        <BarChart3 className="size-4 text-primary flex-shrink-0" />
        <div>
          <p className="text-[9px] font-semibold text-foreground">New personal best!</p>
          <p className="text-[8px] text-muted-foreground">10,421 steps on Saturday</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Screen registry ────────────────────────────────────────────── */

const screens = [
  { id: "home", label: "Home", component: DashboardScreen },
  { id: "workout", label: "Workout", component: WorkoutScreen },
  { id: "stats", label: "Stats", component: StatsScreen },
]

/* ─── Phone shell ────────────────────────────────────────────────── */

export function PhoneMockup() {
  const [active, setActive] = useState(0)
  const Screen = screens[active].component

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-75 pointer-events-none" />

      <div className="relative flex flex-col items-center gap-5">
        {/* Version badge */}
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
          <div className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-mono font-medium">v1.3</span>
          <span className="text-xs text-muted-foreground">fitness-app</span>
        </div>

        {/* Phone frame */}
        <div className="relative">
          <div className="w-52 h-[26rem] rounded-[2.5rem] border-2 border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden flex flex-col">
            {/* Status bar */}
            <div className="h-8 bg-card flex items-center justify-between px-5 flex-shrink-0 border-b border-border/50">
              <span className="text-[8px] text-muted-foreground font-semibold">9:41</span>
              <div className="w-14 h-3.5 rounded-full bg-muted border border-border/60" />
              <div className="flex items-end gap-0.5">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className={`w-0.5 rounded-sm ${i < 3 ? "bg-foreground/70" : "bg-border"}`} style={{ height: `${h}px` }} />
                ))}
              </div>
            </div>

            {/* Screen content — scrollable */}
            <div className="flex-1 overflow-hidden bg-background">
              <Screen />
            </div>

            {/* Bottom nav */}
            <div className="h-12 bg-card border-t border-border flex items-center justify-around px-2 flex-shrink-0">
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
                    i === active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {i === 0 && <Activity className="size-3.5" />}
                  {i === 1 && <Dumbbell className="size-3.5" />}
                  {i === 2 && <BarChart3 className="size-3.5" />}
                  <span className="text-[8px] font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Next arrow */}
          {active < screens.length - 1 && (
            <button
              onClick={() => setActive((a) => Math.min(a + 1, screens.length - 1))}
              className="absolute -right-11 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-colors"
              aria-label="Next screen"
            >
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Share link pill */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 max-w-[13rem]">
          <div className="size-4 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] text-primary font-black">S</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono truncate">shipshow.app/demo/fitapp</span>
        </div>
      </div>
    </div>
  )
}
