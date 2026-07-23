import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
        <span className="text-2xl font-black tracking-tight text-foreground">
          Ship<span className="text-primary">Show</span>
        </span>
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-foreground">Errore di autenticazione</h1>
          <p className="text-sm text-muted-foreground">
            Qualcosa e&apos; andato storto durante l&apos;autenticazione. Riprova.
          </p>
          <Link href="/auth/login" className={cn(buttonVariants(), "w-full mt-2")}>
            Torna al login
          </Link>
        </div>
      </div>
    </div>
  )
}
