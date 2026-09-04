// Camada de dados da demonstração de agendamento para barbearias.
import { siteConfig } from "@/lib/site-config"

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
export const barbers: Barber[] = siteConfig.professionals.map((professional) => ({ ...professional, availability: [...professional.availability] }))

export const services: Service[] = siteConfig.services.map((service) => ({ ...service }))

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

export const testimonials: Testimonial[] = []

// All possible time slots (in 30-min steps)
export const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30"
]

export const initialAppointments: Appointment[] = []

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
  { name: "Profissional 1", appointments: 284, revenue: 15620, rating: 4.9 },
  { name: "Profissional 2", appointments: 196, revenue: 11760, rating: 4.8 },
  { name: "Profissional 3", appointments: 342, revenue: 15390, rating: 4.9 },
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
