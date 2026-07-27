import { createServiceClient } from "@/lib/supabase/service"
import { notFound } from "next/navigation"
import { DemoViewer } from "@/components/demo-viewer"
import type { Metadata } from "next"
import type { HotspotType } from "@/lib/editor-types"

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ guided?: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase.from("demos").select("title").eq("share_slug", slug).single()
  return {
    title: data?.title ? `${data.title} — ShipShow` : "Demo — ShipShow",
    description: "Interactive demo created with ShipShow.",
  }
}

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params
  const { guided } = await searchParams
  const supabase = createServiceClient()

  const { data: demo } = await supabase
    .from("demos")
    .select("*")
    .eq("share_slug", slug)
    .eq("status", "published")
    .single()

  if (!demo) notFound()

  // Increment view count — fire and forget, never block the render
  supabase.rpc('increment_demo_views', { demo_id: demo.id }).then()

  const { data: steps } = await supabase
    .from("steps")
    .select("*, hotspots!hotspots_step_id_fkey(*)")
    .eq("demo_id", demo.id)
    .order("order_index", { ascending: true })

  const viewerSteps = (steps ?? []).map((s) => ({
    id: s.id,
    label: s.label,
    imageUrl: s.image_url || "/placeholder.svg",
    hotspots: (s.hotspots ?? []).map((h: {
      id: string; type: string
      x_pct: number; y_pct: number; width_pct: number; height_pct: number
      target_step_id: string | null; placeholder: string | null; label: string
    }) => ({
      id: h.id,
      type: (h.type ?? "navigate") as HotspotType,
      x: h.x_pct, y: h.y_pct, width: h.width_pct, height: h.height_pct,
      targetStepId: h.target_step_id,
      placeholder: h.placeholder ?? undefined,
      label: h.label,
    })),
  }))

  return <DemoViewer title={demo.title} steps={viewerSteps} defaultGuided={guided === "1"} />
}
