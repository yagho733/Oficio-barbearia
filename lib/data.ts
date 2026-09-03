// Strongly-typed data layer for the American Barber platform

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
  service: string
  date: string // YYYY-MM-DD
  time: string // e.g., "10:00 AM"
  duration: string // e.g., "45 min"
  price: number
  status: "confirmed" | "pending" | "cancelled"
}

export interface TimeBlock {
  id: string
  barberId: string
  date: string // YYYY-MM-DD
  time: string // e.g. "10:00 AM"
  duration: string // e.g. "30 min" or "full_day"
  type: "offline" | "break"
}

// Initial Mock Databases
export const barbers: Barber[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    specialty: "Classic Cuts & Hot Towel Shaves",
    experience: "12 years",
    rating: 4.9,
    reviews: 284,
    image: "/barbers/marcus.jpg",
    bio: "Master barber specializing in classic American cuts and traditional hot towel shaves.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "2",
    name: "David Williams",
    specialty: "Modern Fades & Designs",
    experience: "8 years",
    rating: 4.8,
    reviews: 196,
    image: "/barbers/david.jpg",
    bio: "Expert in modern fades, creative designs, and contemporary styling.",
    availability: ["Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "3",
    name: "James Thompson",
    specialty: "Beard Grooming & Styling",
    experience: "15 years",
    rating: 4.9,
    reviews: 342,
    image: "/barbers/james.jpg",
    bio: "Beard specialist with expertise in shaping, styling, and maintenance.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "4",
    name: "Michael Brown",
    specialty: "Precision Cuts & Texturing",
    experience: "10 years",
    rating: 4.7,
    reviews: 167,
    image: "/barbers/michael.jpg",
    bio: "Known for precision cuts and advanced texturing techniques.",
    availability: ["Mon", "Tue", "Thu", "Sat"],
  },
]

export const services: Service[] = [
  {
    id: "1",
    name: "Classic Haircut",
    description: "Traditional scissor cut with hot towel finish and styling",
    duration: "45 min",
    price: 45,
    category: "haircut",
  },
  {
    id: "2",
    name: "Executive Cut",
    description: "Premium cut with scalp massage, hot towel, and premium styling",
    duration: "60 min",
    price: 65,
    category: "haircut",
  },
  {
    id: "3",
    name: "Precision Fade",
    description: "Modern fade with detailed line work and styling",
    duration: "45 min",
    price: 50,
    category: "haircut",
  },
  {
    id: "4",
    name: "Hot Towel Shave",
    description: "Traditional straight razor shave with hot towels and aftercare",
    duration: "40 min",
    price: 40,
    category: "shave",
  },
  {
    id: "5",
    name: "Beard Trim & Shape",
    description: "Professional beard trimming, shaping, and conditioning",
    duration: "30 min",
    price: 30,
    category: "beard",
  },
  {
    id: "6",
    name: "Royal Treatment",
    description: "Complete package: haircut, hot shave, beard trim, and facial",
    duration: "120 min",
    price: 150,
    category: "package",
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Pomade",
    description: "Strong hold, high shine pomade for classic styles",
    price: 28,
    image: "/products/pomade.jpg",
    category: "styling",
  },
  {
    id: "2",
    name: "Beard Oil",
    description: "Nourishing blend of argan and jojoba oils",
    price: 32,
    image: "/products/beard-oil.jpg",
    category: "beard",
  },
  {
    id: "3",
    name: "Matte Clay",
    description: "Medium hold, matte finish for textured looks",
    price: 26,
    image: "/products/clay.jpg",
    category: "styling",
  },
  {
    id: "4",
    name: "Aftershave Balm",
    description: "Soothing balm with aloe vera and vitamin E",
    price: 24,
    image: "/products/aftershave.jpg",
    category: "shave",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Robert Chen",
    role: "Executive",
    content: "The best barbershop experience I've ever had. Marcus understands exactly what I need every time.",
    rating: 5,
    image: "/testimonials/robert.jpg",
  },
  {
    id: "2",
    name: "Thomas Wright",
    role: "Attorney",
    content: "Professional, punctual, and premium quality. This is what a real barbershop should be.",
    rating: 5,
    image: "/testimonials/thomas.jpg",
  },
  {
    id: "3",
    name: "Daniel Martinez",
    role: "Entrepreneur",
    content: "The Royal Treatment is worth every penny. I leave feeling like a new man every time.",
    rating: 5,
    image: "/testimonials/daniel.jpg",
  },
]

// All possible time slots (in 30-min steps)
export const timeSlots = [
  "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
]

export const initialAppointments: Appointment[] = [
  {
    id: "1",
    customerId: "c1",
    customerName: "John Smith",
    customerPhone: "+5553999999999",
    barberId: "1",
    barberName: "Marcus Johnson",
    service: "Classic Haircut",
    date: "2026-06-05",
    time: "10:00 AM",
    duration: "45 min",
    price: 45,
    status: "confirmed",
  },
  {
    id: "2",
    customerId: "c2",
    customerName: "Mike Davis",
    customerPhone: "+5553988888888",
    barberId: "1",
    barberName: "Marcus Johnson",
    service: "Hot Towel Shave",
    date: "2026-06-05",
    time: "11:30 AM",
    duration: "40 min",
    price: 40,
    status: "confirmed",
  },
  {
    id: "3",
    customerId: "c3",
    customerName: "Chris Wilson",
    customerPhone: "+5553977777777",
    barberId: "2",
    barberName: "David Williams",
    service: "Precision Fade",
    date: "2026-06-05",
    time: "02:00 PM",
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
  { month: "Feb", revenue: 16800 },
  { month: "Mar", revenue: 17500 },
  { month: "Apr", revenue: 18200 },
  { month: "May", revenue: 19100 },
  { month: "Jun", revenue: 18500 },
]

export const servicePerformance = [
  { name: "Classic Haircut", bookings: 245, revenue: 11025 },
  { name: "Executive Cut", bookings: 128, revenue: 8320 },
  { name: "Precision Fade", bookings: 189, revenue: 9450 },
  { name: "Hot Towel Shave", bookings: 156, revenue: 6240 },
  { name: "Beard Trim", bookings: 201, revenue: 6030 },
  { name: "Royal Treatment", bookings: 67, revenue: 10050 },
]

export const barberPerformance = [
  { name: "Marcus Johnson", appointments: 284, revenue: 12780, rating: 4.9 },
  { name: "David Williams", appointments: 196, revenue: 9800, rating: 4.8 },
  { name: "James Thompson", appointments: 342, revenue: 13680, rating: 4.9 },
  { name: "Michael Brown", appointments: 167, revenue: 7515, rating: 4.7 },
]

// Keep compatibility with files importing standard list directly
export const appointments = initialAppointments

// LocalStorage helpers to support complete interactivity on client-side
const IS_SERVER = typeof window === "undefined"

export function getStoredAppointments(): Appointment[] {
  if (IS_SERVER) return initialAppointments
  const stored = localStorage.getItem("american_barber_appointments")
  if (!stored) {
    localStorage.setItem("american_barber_appointments", JSON.stringify(initialAppointments))
    return initialAppointments
  }
  return JSON.parse(stored)
}

export function saveAppointment(app: Omit<Appointment, "id" | "status">): Appointment {
  const list = getStoredAppointments()
  const newApp: Appointment = {
    ...app,
    id: Math.random().toString(36).substring(2, 9),
    status: "confirmed"
  }
  const updated = [newApp, ...list]
  if (!IS_SERVER) {
    localStorage.setItem("american_barber_appointments", JSON.stringify(updated))
  }
  return newApp
}

export function getStoredBlocks(): TimeBlock[] {
  if (IS_SERVER) return []
  const stored = localStorage.getItem("american_barber_blocks")
  return stored ? JSON.parse(stored) : []
}

export function addBarberBlock(block: Omit<TimeBlock, "id">): TimeBlock {
  const blocks = getStoredBlocks()
  const newBlock: TimeBlock = {
    ...block,
    id: Math.random().toString(36).substring(2, 9),
  }
  const updated = [...blocks, newBlock]
  if (!IS_SERVER) {
    localStorage.setItem("american_barber_blocks", JSON.stringify(updated))
  }
  return newBlock
}

export function removeBarberBlock(id: string): void {
  const blocks = getStoredBlocks()
  const updated = blocks.filter(b => b.id !== id)
  if (!IS_SERVER) {
    localStorage.setItem("american_barber_blocks", JSON.stringify(updated))
  }
}

