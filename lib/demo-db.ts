// Supabase DB types mirroring the schema
export type DbDemo = {
  id: string
  title: string
  share_slug: string | null
  status: 'draft' | 'published'
  created_at: string
}

export type DbStep = {
  id: string
  demo_id: string
  order_index: number
  label: string
  image_url: string
}

export type DbHotspot = {
  id: string
  step_id: string
  type: 'navigate' | 'text_input'
  x_pct: number
  y_pct: number
  width_pct: number
  height_pct: number
  target_step_id: string | null
  placeholder: string | null
  label: string
}

// Full demo shape returned to the client
export type DemoWithSteps = DbDemo & {
  steps: (DbStep & { hotspots: DbHotspot[] })[]
}
