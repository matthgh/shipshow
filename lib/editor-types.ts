export type Hotspot = {
  id: string
  x: number       // % from left
  y: number       // % from top
  width: number   // % width
  height: number  // % height
  targetStepId: string | null
  label: string
}

export type Step = {
  id: string
  label: string
  imageUrl: string
  hotspots: Hotspot[]
}

const COLORS = [
  "oklch(0.52 0.22 255)",  // blue (primary)
  "oklch(0.60 0.20 145)",  // green
  "oklch(0.65 0.22 35)",   // orange
  "oklch(0.58 0.22 0)",    // red
]

export const HOTSPOT_COLORS = COLORS

// Placeholder screens — colored rectangles with labels rendered as data URIs
function makeScreenDataUri(bg: string, title: string, subtitle: string): string {
  // We use a real placeholder.svg-style URL from the public dir + query params
  return `/placeholder-screen.svg?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&bg=${encodeURIComponent(bg)}`
}

export const MOCK_STEPS: Step[] = [
  {
    id: "step-1",
    label: "Login",
    imageUrl: "/placeholder.svg",
    hotspots: [
      {
        id: "hs-1",
        x: 15,
        y: 62,
        width: 70,
        height: 8,
        targetStepId: "step-2",
        label: "Accedi",
      },
    ],
  },
  {
    id: "step-2",
    label: "Dashboard",
    imageUrl: "/placeholder.svg",
    hotspots: [
      {
        id: "hs-2",
        x: 10,
        y: 30,
        width: 38,
        height: 18,
        targetStepId: "step-3",
        label: "Vai Workout",
      },
      {
        id: "hs-3",
        x: 52,
        y: 30,
        width: 38,
        height: 18,
        targetStepId: "step-4",
        label: "Vai Profilo",
      },
    ],
  },
  {
    id: "step-3",
    label: "Workout",
    imageUrl: "/placeholder.svg",
    hotspots: [
      {
        id: "hs-4",
        x: 15,
        y: 80,
        width: 70,
        height: 8,
        targetStepId: "step-2",
        label: "Torna Dashboard",
      },
    ],
  },
  {
    id: "step-4",
    label: "Profilo",
    imageUrl: "/placeholder.svg",
    hotspots: [
      {
        id: "hs-5",
        x: 15,
        y: 80,
        width: 70,
        height: 8,
        targetStepId: "step-2",
        label: "Torna Dashboard",
      },
    ],
  },
]
