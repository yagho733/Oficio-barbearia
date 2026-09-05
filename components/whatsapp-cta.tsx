import { MessageCircle } from "lucide-react"
import { ownerWhatsappUrl } from "@/lib/site-config"

export function WhatsappCta() {
  return (
    <a
      href={ownerWhatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Solicitar um site para sua barbearia pelo WhatsApp"
      className="whatsapp-cta fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 inline-flex min-h-14 items-center justify-center gap-3 border border-white/15 bg-[#25d366] px-5 text-sm font-bold text-[#07150c] shadow-[0_16px_45px_rgba(0,0,0,0.42)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366] sm:left-auto sm:right-5 sm:max-w-none"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span>Quero um site para minha barbearia</span>
    </a>
  )
}
