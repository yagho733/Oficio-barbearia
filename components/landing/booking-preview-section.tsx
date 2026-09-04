import Link from "next/link"
import { ArrowRight } from "lucide-react"

const steps = [
  { number: "01", title: "Serviço", text: "Escolha o atendimento e confira valor e duração." },
  { number: "02", title: "Profissional", text: "Selecione o barbeiro de acordo com a sua preferência." },
  { number: "03", title: "Horário", text: "Veja somente os horários livres e confirme a reserva." },
]

export function BookingPreviewSection() {
  return (
    <section id="booking-demo" className="border-y border-border bg-card py-20 sm:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="eyebrow">Agendamento online</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Marque sem trocar mensagens</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            O processo leva poucos passos e mostra apenas os horários compatíveis com cada serviço.
          </p>
        </div>

        <div className="mt-12 grid border-l border-t border-border md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="border-b border-r border-border p-6 sm:p-8">
              <span className="font-heading text-3xl text-primary">{step.number}</span>
              <h3 className="mt-7 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Esta demonstração salva a reserva apenas neste navegador. A versão comercial utiliza banco de dados compartilhado.
          </p>
          <Link href="/booking" className="inline-flex h-14 shrink-0 items-center justify-center bg-primary px-7 font-semibold text-primary-foreground hover:bg-primary/90">
            Testar agendamento <ArrowRight className="ml-3 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
