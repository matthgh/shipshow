import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
        <span className="text-2xl font-black tracking-tight text-foreground">
          Ship<span className="text-primary">Show</span>
        </span>

        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-4">
          <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">Controlla la tua email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ti abbiamo inviato un link di conferma. Clicca sul link per attivare il tuo account e iniziare a usare ShipShow.
          </p>
          <Link href="/auth/login" className={cn(buttonVariants({ variant: "outline" }), "mt-2 w-full")}>
            Torna al login
          </Link>
        </div>
      </div>
    </div>
  )
}
