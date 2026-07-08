export interface Service {
  id: string;
  title: string;
  priceHour: number; // Approximate cost in COP
  unit: string;
  description: string;
  features: string[];
  imageUrl: string;
}

export const SERVICES: Service[] = [
  {
    id: "waiters",
    title: "Meseros por Horas",
    priceHour: 25000, // COP per hour per waiter
    unit: "mesero / hora",
    description: "Personal capacitado, amable y uniformado para servir comidas, bebidas y atender a tus invitados con el más alto estándar.",
    features: [
      "Protocolo y servicio de mesa",
      "Uniforme impecable (cálido o clásico)",
      "Atención ágil de principio a fin",
      "Montaje inicial y apoyo en limpieza final"
    ],
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "chefs",
    title: "Cocineros Profesionales",
    priceHour: 45000, // COP per hour per chef
    unit: "cocinero / hora",
    description: "Expertos culinarios para preparar platillos exquisitos al instante en tu evento, desde asados hasta alta cocina.",
    features: [
      "Preparación y emplatado profesional",
      "Control de higiene y calidad",
      "Gestión ágil de tiempos de cocina",
      "Chef de asado, comida típica o internacional"
    ],
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "utensils",
    title: "Utensilios y Vajilla",
    priceHour: 1500, // COP per guest / hour
    unit: "invitado / hora",
    description: "Alquiler de platos, cubiertos premium, copas de cristal y mantelería fina. Todo impecable y listo para lucir.",
    features: [
      "Vajilla de porcelana resistente",
      "Cristalería reluciente para todo tipo de copas",
      "Cubiertos de acero inoxidable pulidos",
      "Lavado post-evento incluido"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "furniture",
    title: "Mesas y Mobiliario",
    priceHour: 8000, // COP per item / hour average
    unit: "mueble / hora",
    description: "Mesas redondas, tablones, sillas cocteleras, salas lounge y estructuras decorativas para acomodar a tus invitados.",
    features: [
      "Sillas ergonómicas y vestidas",
      "Mesas de madera rústica o de gala",
      "Mobiliario tipo coctel y lounge moderno",
      "Resistencia y transporte seguro incluido"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "spaces",
    title: "Lugares para Eventos",
    priceHour: 150000, // COP per hour
    unit: "hora alquiler",
    description: "Salones boutique, fincas campestres y terrazas con espectaculares vistas, reservados por el tiempo exacto de tu fiesta.",
    features: [
      "Ubicaciones exclusivas y accesibles",
      "Espacios cerrados y al aire libre",
      "Capacidad flexible (desde 20 a 300 personas)",
      "Permisos y parqueadero privado"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "catering",
    title: "Comida y Catering",
    priceHour: 15000, // COP per guest
    unit: "plato / invitado",
    description: "Menús variados y deliciosos diseñados a tu gusto. Pasabocas, platos fuertes y estaciones de postres espectaculares.",
    features: [
      "Ingredientes frescos y locales",
      "Opciones veganas, vegetarianas y sin gluten",
      "Presentación moderna y apetitosa",
      "Estaciones de bebidas y coctelería personalizada"
    ],
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop"
  }
];
