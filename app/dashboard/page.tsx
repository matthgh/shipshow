import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { DashboardClient } from "@/components/dashboard-client"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) redirect("/auth/login")

  const supabase = createServiceClient()
  const { data: demos } = await supabase
    .from("demos")
    .select("id, title, status, share_slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight text-foreground">
            Ship<span className="text-primary">Show</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit" className="text-xs">
                Sign out
              </Button>
            </form>
            <Link href="/editor" className={cn(buttonVariants({ size: "sm" }), "text-xs gap-1.5")}>
              + New demo
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
          <h1 className="text-2xl font-bold text-foreground">Your demos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {demos?.length ?? 0} {demos?.length === 1 ? "demo" : "demos"}
          </p>
          </div>
        </div>

        <DashboardClient demos={demos ?? []} />
      </main>
    </div>
  )
}
