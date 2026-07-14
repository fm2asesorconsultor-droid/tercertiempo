"use client"

import { useActionState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { subscribeAction, type NewsletterFormState } from "@/lib/actions/newsletter"

const initialState: NewsletterFormState = {}

type Props = {
  source: "FOOTER" | "NEWSLETTER_SECTION"
  variant: "hero" | "footer"
}

export function NewsletterForm({ source, variant }: Props) {
  const action = subscribeAction.bind(null, source)
  const [state, formAction, isPending] = useActionState(action, initialState)

  if (state.success) {
    return (
      <p className={variant === "hero" ? "text-white font-bold" : "text-sm text-success"}>
        ¡Gracias por suscribirte! 🎉
      </p>
    )
  }

  if (variant === "hero") {
    return (
      <div>
        <form action={formAction} className="flex w-full gap-2 bg-black/30 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-2xl">
          <Input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            className="flex-1 bg-white/95 text-black border-0 focus-visible:ring-2 focus-visible:ring-black placeholder:text-zinc-600 font-medium"
            required
          />
          <Button type="submit" disabled={isPending} variant="default" className="bg-black text-white hover:bg-zinc-800 shrink-0 font-bold border border-zinc-700">
            <span className="hidden sm:inline mr-2">{isPending ? "ENVIANDO..." : "SUSCRIBIRME"}</span>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {state.error && <p className="mt-2 text-sm text-white bg-black/40 rounded px-3 py-1.5 inline-block">{state.error}</p>}
      </div>
    )
  }

  return (
    <div>
      <form action={formAction} className="flex space-x-2">
        <Input
          type="email"
          name="email"
          placeholder="Tu correo electrónico"
          className="max-w-[200px]"
          required
        />
        <Button type="submit" size="icon" disabled={isPending}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Suscribirse</span>
        </Button>
      </form>
      {state.error && <p className="mt-2 text-xs text-danger">{state.error}</p>}
    </div>
  )
}
