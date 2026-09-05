const craftImage = "https://images.unsplash.com/photo-1657105052497-f996284ffff8?auto=format&fit=crop&fm=jpg&q=82&w=1600"

const details = [
  { number: "01", title: "Acabamento cuidadoso", text: "Cada serviço inclui orientação de finalização para manter o resultado no dia a dia." },
  { number: "02", title: "Atendimento no horário", text: "A agenda organiza o fluxo da casa e reserva o tempo certo para cada cliente." },
  { number: "03", title: "Processo bem definido", text: "Ferramentas higienizadas, produtos selecionados e atenção do início ao fim." },
]

export function ProductsSection() {
  return (
    <section id="experience" className="border-y border-border bg-background text-foreground">
      <div className="container mx-auto grid lg:grid-cols-2">
        <div data-reveal className="relative min-h-[430px] overflow-hidden sm:min-h-[520px] lg:min-h-[680px]">
          <img src={craftImage} alt="Barbeiro realizando um corte com atenção" className="absolute inset-0 h-full w-full object-cover brightness-[0.74] saturate-[0.75]" />
        </div>

        <div data-reveal className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-14 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">A experiência</p>
          <h2 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
            Técnica, conversa clara e tempo para fazer direito.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
            Um atendimento direto, com o estilo definido antes do primeiro corte e sem correria entre um cliente e outro.
          </p>

          <div className="mt-10 border-t border-border">
            {details.map(({ number, title, text }) => (
              <div key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-border py-6">
                <span className="font-heading text-lg text-primary">{number}</span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
