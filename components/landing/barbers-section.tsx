import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { barbers } from "@/lib/data"

const teamImage = "https://images.pexels.com/photos/19225142/pexels-photo-19225142/free-photo-of-barber-standing-in-his-shop-in-front-of-a-chair.jpeg?auto=compress&dpr=1&h=1200&w=1000"

export function BarbersSection() {
  return (
    <section id="barbers" className="bg-background py-20 sm:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Equipe</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Profissionais com estilos diferentes</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Escolha quem combina com o resultado que você procura e consulte os horários disponíveis.
            </p>
            <div className="relative mt-8 aspect-[4/5] overflow-hidden">
              <img src={teamImage} alt="Profissional da barbearia" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="self-end border-t border-border">
            {barbers.slice(0, 3).map((barber, index) => (
              <article key={barber.id} className="grid gap-4 border-b border-border py-7 sm:grid-cols-[4rem_1fr] sm:items-start sm:gap-6">
                <span className="font-heading text-3xl text-primary">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold">{barber.name}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{barber.specialty}</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{barber.bio}</p>
                </div>
              </article>
            ))}
            <Link href="/booking" className="mt-8 inline-flex h-13 items-center justify-center bg-foreground px-6 text-sm font-semibold text-background hover:bg-foreground/90">
              Escolher profissional <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
