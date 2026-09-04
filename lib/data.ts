// Camada de dados da demonstração de agendamento para barbearias.

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "barber" | "admin"
}

export interface Barber {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  image: string
  bio: string
  availability: string[] // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
}

export interface Service {
  id: string
  name: string
  description: string
  duration: string // format: "45 min"
  price: number
  category: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image: string
}

export interface Appointment {
  id: string
  customerId: string
  customerName: string
  customerPhone?: string
  barberId: string
  barberName: string
  barber?: string
  service: string
  date: string // YYYY-MM-DD
  time: string // e.g., "10:00 AM"
  duration: string // e.g., "45 min"
  price: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
}

export interface TimeBlock {
  id: string
  barberId: string
  date: string // YYYY-MM-DD
  time: string // e.g. "10:00 AM"
  duration: string // e.g. "30 min" or "full_day"
  type: "offline" | "break"
}

export const APPOINTMENTS_STORAGE_KEY = "barbershop_demo_appointments_v2"
export const BLOCKS_STORAGE_KEY = "barbershop_demo_blocks_v2"
export const APPOINTMENTS_CHANGED_EVENT = "barbershop-demo:appointments-changed"

// Initial Mock Databases
export const barbers: Barber[] = [
  {
    id: "1",
    name: "Rafael Costa",
    specialty: "Cortes clássicos e tesoura",
    experience: "9 anos",
    rating: 4.9,
    reviews: 126,
    image: "/barbers/marcus.jpg",
    bio: "Especialista em cortes clássicos, acabamento na tesoura e consultoria de estilo.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "2",
    name: "Lucas Martins",
    specialty: "Degradê e cortes modernos",
    experience: "6 anos",
    rating: 4.8,
    reviews: 94,
    image: "/barbers/david.jpg",
    bio: "Foco em degradês limpos, cortes atuais e finalizações que valorizam o formato do rosto.",
    availability: ["Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "3",
    name: "Diego Almeida",
    specialty: "Barba e visagismo masculino",
    experience: "11 anos",
    rating: 4.9,
    reviews: 158,
    image: "/barbers/james.jpg",
    bio: "Especialista em desenho de barba, toalha quente e cuidados para manutenção em casa.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "4",
    name: "Bruno Nunes",
    specialty: "Textura e acabamento",
    experience: "7 anos",
    rating: 4.7,
    reviews: 87,
    image: "/barbers/michael.jpg",
    bio: "Trabalha textura, movimento e acabamento para cortes práticos no dia a dia.",
    availability: ["Mon", "Tue", "Thu", "Sat"],
  },
]

export const services: Service[] = [
  {
    id: "1",
    name: "Corte clássico",
    description: "Corte personalizado com lavagem, acabamento e finalização",
    duration: "45 min",
    price: 55,
    category: "haircut",
  },
  {
    id: "2",
    name: "Corte executivo",
    description: "Corte completo com lavagem, massagem capilar e finalização",
    duration: "60 min",
    price: 65,
    category: "haircut",
  },
  {
    id: "3",
    name: "Degradê de precisão",
    description: "Degradê com transição limpa, contorno e finalização",
    duration: "45 min",
    price: 60,
    category: "haircut",
  },
  {
    id: "4",
    name: "Barba com toalha quente",
    description: "Modelagem, navalha, toalha quente e hidratação",
    duration: "40 min",
    price: 45,
    category: "shave",
  },
  {
    id: "5",
    name: "Barba express",
    description: "Aparo, alinhamento e acabamento do contorno",
    duration: "30 min",
    price: 35,
    category: "beard",
  },
  {
    id: "6",
    name: "Experiência completa",
    description: "Corte, barba com toalha quente e cuidado facial",
    duration: "90 min",
    price: 120,
    category: "package",
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Pomada modeladora",
    description: "Fixação firme e acabamento natural",
    price: 49,
    image: "/products/pomade.jpg",
    category: "styling",
  },
  {
    id: "2",
    name: "Óleo para barba",
    description: "Hidratação e maciez sem aspecto oleoso",
    price: 42,
    image: "/products/beard-oil.jpg",
    category: "beard",
  },
  {
    id: "3",
    name: "Cera efeito matte",
    description: "Fixação média para penteados com textura",
    price: 45,
    image: "/products/clay.jpg",
    category: "styling",
  },
  {
    id: "4",
    name: "Balm pós-barba",
    description: "Ação calmante e refrescante para a pele",
    price: 39,
    image: "/products/aftershave.jpg",
    category: "shave",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "André Ferreira",
    role: "Cliente",
    content: "Atendimento no horário, conversa clara e um acabamento muito bem feito.",
    rating: 5,
    image: "/testimonials/robert.jpg",
  },
  {
    id: "2",
    name: "Marcos Oliveira",
    role: "Cliente",
    content: "O agendamento foi simples e o profissional entendeu exatamente o corte que eu queria.",
    rating: 5,
    image: "/testimonials/thomas.jpg",
  },
  {
    id: "3",
    name: "Felipe Santos",
    role: "Cliente",
    content: "Ambiente organizado, serviço cuidadoso e uma experiência que dá vontade de voltar.",
    rating: 5,
    image: "/testimonials/daniel.jpg",
  },
]

// All possible time slots (in 30-min steps)
export const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30"
]

export const initialAppointments: Appointment[] = [
  {
    id: "1",
    customerId: "c1",
    customerName: "João Silva",
    customerPhone: "+5553999999999",
    barberId: "1",
    barberName: "Rafael Costa",
    barber: "Rafael Costa",
    service: "Corte clássico",
    date: "2026-06-05",
    time: "10:00",
    duration: "45 min",
    price: 45,
    status: "confirmed",
  },
  {
    id: "2",
    customerId: "c2",
    customerName: "Matheus Lima",
    customerPhone: "+5553988888888",
    barberId: "1",
    barberName: "Rafael Costa",
    barber: "Rafael Costa",
    service: "Barba com toalha quente",
    date: "2026-06-05",
    time: "11:30",
    duration: "40 min",
    price: 40,
    status: "confirmed",
  },
  {
    id: "3",
    customerId: "c3",
    customerName: "Carlos Souza",
    customerPhone: "+5553977777777",
    barberId: "2",
    barberName: "Lucas Martins",
    barber: "Lucas Martins",
    service: "Degradê de precisão",
    date: "2026-06-05",
    time: "14:00",
    duration: "45 min",
    price: 50,
    status: "pending",
  },
]

// Default statistics
export const dashboardStats = {
  todayAppointments: 12,
  weeklyRevenue: 4250,
  monthlyRevenue: 18500,
  totalCustomers: 1284,
  averageRating: 4.8,
  completedAppointments: 156,
  cancelledAppointments: 8,
  newCustomers: 23,
}

export const revenueData = [
  { month: "Jan", revenue: 15200 },
  { month: "Fev", revenue: 16800 },
  { month: "Mar", revenue: 17500 },
  { month: "Abr", revenue: 18200 },
  { month: "Mai", revenue: 19100 },
  { month: "Jun", revenue: 18500 },
]

export const servicePerformance = [
  { name: "Corte clássico", bookings: 245, revenue: 13475 },
  { name: "Corte executivo", bookings: 128, revenue: 8320 },
  { name: "Degradê", bookings: 189, revenue: 11340 },
  { name: "Barba com toalha quente", bookings: 156, revenue: 7020 },
  { name: "Barba express", bookings: 201, revenue: 7035 },
  { name: "Experiência completa", bookings: 67, revenue: 8040 },
]

export const barberPerformance = [
  { name: "Rafael Costa", appointments: 284, revenue: 15620, rating: 4.9 },
  { name: "Lucas Martins", appointments: 196, revenue: 11760, rating: 4.8 },
  { name: "Diego Almeida", appointments: 342, revenue: 15390, rating: 4.9 },
  { name: "Bruno Nunes", appointments: 167, revenue: 9185, rating: 4.7 },
]

// Keep compatibility with files importing standard list directly
export const appointments = initialAppointments

// Armazenamento local usado apenas nesta demonstração. Em um projeto vendido,
// estas funções são substituídas por uma API e um banco de dados compartilhado.
const IS_SERVER = typeof window === "undefined"

export function getStoredAppointments(): Appointment[] {
  if (IS_SERVER) return initialAppointments
  const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initialAppointments))
    return initialAppointments
  }
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : initialAppointments
  } catch {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initialAppointments))
    return initialAppointments
  }
}

export function replaceStoredAppointments(list: Appointment[]): void {
  if (IS_SERVER) return
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(APPOINTMENTS_CHANGED_EVENT))
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export const durationToMinutes = (duration: string) => {
  const minutes = Number.parseInt(duration, 10)
  return Number.isFinite(minutes) ? minutes : 30
}

const periodsOverlap = (startA: number, endA: number, startB: number, endB: number) =>
  startA < endB && endA > startB

export function isTimeSlotAvailable({
  barberId,
  date,
  time,
  duration,
  appointments = getStoredAppointments(),
  blocks = getStoredBlocks(),
}: {
  barberId: string
  date: string
  time: string
  duration: string
  appointments?: Appointment[]
  blocks?: TimeBlock[]
}): boolean {
  const requestedStart = timeToMinutes(time)
  const requestedEnd = requestedStart + durationToMinutes(duration)

  const conflictsWithAppointment = appointments.some((appointment) => {
    if (appointment.barberId !== barberId || appointment.date !== date || appointment.status === "cancelled") {
      return false
    }
    const existingStart = timeToMinutes(appointment.time)
    const existingEnd = existingStart + durationToMinutes(appointment.duration)
    return periodsOverlap(requestedStart, requestedEnd, existingStart, existingEnd)
  })

  if (conflictsWithAppointment) return false

  return !blocks.some((block) => {
    if (block.barberId !== barberId || block.date !== date) return false
    if (block.duration === "full_day") return true
    const blockStart = timeToMinutes(block.time)
    const blockEnd = blockStart + durationToMinutes(block.duration)
    return periodsOverlap(requestedStart, requestedEnd, blockStart, blockEnd)
  })
}

export class AppointmentConflictError extends Error {
  constructor() {
    super("Este horário acabou de ser reservado. Escolha outro horário disponível.")
    this.name = "AppointmentConflictError"
  }
}

export function saveAppointment(app: Omit<Appointment, "id" | "status">): Appointment {
  const list = getStoredAppointments()
  if (!isTimeSlotAvailable({
    barberId: app.barberId,
    date: app.date,
    time: app.time,
    duration: app.duration,
    appointments: list,
  })) {
    throw new AppointmentConflictError()
  }
  const newApp: Appointment = {
    ...app,
    barber: app.barberName,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    status: "confirmed"
  }
  const updated = [newApp, ...list]
  replaceStoredAppointments(updated)
  return newApp
}

export function getStoredBlocks(): TimeBlock[] {
  if (IS_SERVER) return []
  const stored = localStorage.getItem(BLOCKS_STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addBarberBlock(block: Omit<TimeBlock, "id">): TimeBlock {
  const blocks = getStoredBlocks()
  const newBlock: TimeBlock = {
    ...block,
    id: Math.random().toString(36).substring(2, 9),
  }
  const updated = [...blocks, newBlock]
  if (!IS_SERVER) {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(APPOINTMENTS_CHANGED_EVENT))
  }
  return newBlock
}

export function removeBarberBlock(id: string): void {
  const blocks = getStoredBlocks()
  const updated = blocks.filter(b => b.id !== id)
  if (!IS_SERVER) {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(APPOINTMENTS_CHANGED_EVENT))
  }
}
