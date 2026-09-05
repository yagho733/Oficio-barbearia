export const siteConfig = {
  business: {
    name: "Ofício",
    descriptor: "Barbearia",
    city: "Pelotas — RS",
    phone: "Atendimento direto pelo WhatsApp",
    whatsapp: "5553999563554",
    instagram: "Definido na personalização",
    address: "Centro, Pelotas — RS",
  },
  hours: [
    { days: "Terça a sexta", time: "09h às 20h" },
    { days: "Sábado", time: "09h às 18h" },
    { days: "Domingo e segunda", time: "Fechado" },
  ],
  services: [
    { id: "1", name: "Corte clássico", description: "Corte personalizado, acabamento e finalização", duration: "45 min", price: 55, category: "haircut" },
    { id: "2", name: "Corte executivo", description: "Corte completo com lavagem e finalização", duration: "60 min", price: 65, category: "haircut" },
    { id: "3", name: "Degradê de precisão", description: "Transição limpa, contorno e finalização", duration: "45 min", price: 60, category: "haircut" },
    { id: "4", name: "Barba com toalha quente", description: "Modelagem, navalha, toalha quente e hidratação", duration: "40 min", price: 45, category: "shave" },
    { id: "5", name: "Barba express", description: "Aparo, alinhamento e acabamento do contorno", duration: "30 min", price: 35, category: "beard" },
    { id: "6", name: "Corte e barba", description: "Atendimento completo com corte e barba", duration: "90 min", price: 100, category: "package" },
  ],
  professionals: [
    {
      id: "1", name: "Rafael", specialty: "Cortes clássicos e tesoura", experience: "9 anos", rating: 4.9, reviews: 126,
      image: "/placeholder-user.jpg", bio: "Especialista em cortes clássicos, acabamento na tesoura e orientação de estilo.",
      availability: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    {
      id: "2", name: "Lucas", specialty: "Degradê e cortes modernos", experience: "6 anos", rating: 4.8, reviews: 94,
      image: "/placeholder-user.jpg", bio: "Foco em degradês limpos, cortes atuais e finalizações adequadas ao formato do rosto.",
      availability: ["Wed", "Thu", "Fri", "Sat"],
    },
    {
      id: "3", name: "Diego", specialty: "Barba e visagismo masculino", experience: "11 anos", rating: 4.9, reviews: 158,
      image: "/placeholder-user.jpg", bio: "Especialista em desenho de barba, toalha quente e cuidados para manutenção em casa.",
      availability: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    },
  ],
  presentation: {
    demo: true,
    note: "Marca e informações demonstrativas. A versão final recebe os dados reais da barbearia.",
  },
} as const

export const whatsappUrl = siteConfig.business.whatsapp
  ? `https://wa.me/${siteConfig.business.whatsapp}?text=Ol%C3%A1%2C%20vi%20a%20demonstra%C3%A7%C3%A3o%20do%20site%20e%20gostaria%20de%20falar%20sobre%20um%20projeto%20para%20minha%20barbearia.`
  : "/booking"

export const ownerWhatsappUrl = siteConfig.business.whatsapp
  ? `https://wa.me/${siteConfig.business.whatsapp}?text=Ol%C3%A1%2C%20vi%20a%20demonstra%C3%A7%C3%A3o%20do%20site%20e%20gostaria%20de%20falar%20sobre%20um%20projeto%20para%20minha%20barbearia.`
  : "/booking"
