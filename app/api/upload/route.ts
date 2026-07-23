import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const stepId = formData.get("stepId") as string | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!stepId) return NextResponse.json({ error: "No stepId provided" }, { status: 400 })

    const supabase = await createClient()

    const ext = file.name.split(".").pop() ?? "png"
    const path = `steps/${stepId}/${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
      .from("screenshots")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: publicUrl } = supabase.storage
      .from("screenshots")
      .getPublicUrl(path)

    // Only update the DB if the stepId looks like a real UUID (not a temp client ID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stepId)
    if (isUUID) {
      await supabase
        .from("steps")
        .update({ image_url: publicUrl.publicUrl })
        .eq("id", stepId)
    }

    return NextResponse.json({ url: publicUrl.publicUrl })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
