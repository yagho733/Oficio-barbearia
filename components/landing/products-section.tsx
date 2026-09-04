import { Clock3, ShieldCheck, Sparkles } from "lucide-react"

const craftImage = "https://images.unsplash.com/photo-1657105052497-f996284ffff8?auto=format&fit=crop&fm=jpg&q=82&w=1600"

const details = [
  { icon: Sparkles, title: "Acabamento cuidadoso", text: "Cada serviço inclui orientação de finalização para manter o resultado no dia a dia." },
  { icon: Clock3, title: "Atendimento no horário", text: "A agenda organiza o fluxo da casa e reserva o tempo certo para cada cliente." },
  { icon: ShieldCheck, title: "Processo bem definido", text: "Ferramentas higienizadas, produtos selecionados e atenção do início ao fim." },
]

export function ProductsSection() {
  return (
    <section id="experience" className="bg-foreground text-background">
      <div className="container mx-auto grid lg:grid-cols-2">
        <div className="relative min-h-[480px] lg:min-h-[680px]">
          <img src={craftImage} alt="Barbeiro realizando um corte com atenção" className="absolute inset-0 h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-14 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">A experiência</p>
          <h2 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
            Técnica, conversa clara e tempo para fazer direito.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-background/65">
            Um atendimento direto, com o estilo definido antes do primeiro corte e sem correria entre um cliente e outro.
          </p>

          <div className="mt-10 border-t border-background/15">
            {details.map(({ icon: Icon, title, text }) => (
              <div key={title} className="grid grid-cols-[auto_1fr] gap-4 border-b border-background/15 py-6">
                <Icon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-background/60">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
