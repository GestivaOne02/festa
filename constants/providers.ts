export type ProviderCategory =
  | "Meseros"
  | "Cocineros"
  | "Catering"
  | "Mobiliario"
  | "Lugares";

export interface ProviderService {
  name: string;
  priceHour: number; // COP per hour
  includes: string[];
}

export interface ProviderReview {
  name: string;
  rating: number;
  event: string;
  comment: string;
}

export interface Provider {
  id: string;
  name: string;
  category: ProviderCategory;
  city: string;
  rating: number;
  reviewsCount: number;
  priceFrom: number; // COP per hour (reference)
  yearsExperience: number;
  bio: string;
  capacity: string;
  avatarUrl: string;
  coverUrl: string;
  gallery: string[];
  services: ProviderService[];
  reviews: ProviderReview[];
  availability: {
    days: string;
    hours: string;
  };
  coverage: string[];
}

// Ordered list used to render the filter chips
export const PROVIDER_CATEGORIES: ProviderCategory[] = [
  "Meseros",
  "Cocineros",
  "Catering",
  "Mobiliario",
  "Lugares",
];

// Tailwind classes per category chip (soft bg + strong text, warm family)
export const CATEGORY_STYLES: Record<ProviderCategory, string> = {
  Meseros: "bg-orange-100 text-orange-700",
  Cocineros: "bg-red-100 text-red-700",
  Catering: "bg-amber-100 text-amber-800",
  Mobiliario: "bg-yellow-100 text-yellow-800",
  Lugares: "bg-emerald-100 text-emerald-700",
};

export const PROVIDERS: Provider[] = [
  {
    id: "carlos-mendoza",
    name: "Carlos Mendoza",
    category: "Meseros",
    city: "Medellín",
    rating: 4.9,
    reviewsCount: 38,
    priceFrom: 28000,
    yearsExperience: 8,
    bio: "Mesero profesional con 8 años de experiencia en eventos sociales y corporativos. Lidera un equipo de hasta 10 meseros certificados en protocolo, servicio de mesa y coctelería básica. Puntualidad y presentación impecable garantizadas.",
    capacity: "Eventos hasta 200 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Servicio de mesa completo",
        priceHour: 28000,
        includes: [
          "Protocolo y etiqueta de servicio",
          "Uniforme clásico o cálido",
          "Montaje inicial de mesas",
        ],
      },
      {
        name: "Equipo de meseros (4+)",
        priceHour: 25000,
        includes: [
          "Tarifa por mesero desde 4 personas",
          "Coordinador de equipo incluido",
          "Apoyo en limpieza final",
        ],
      },
    ],
    reviews: [
      {
        name: "Camila Restrepo",
        rating: 5,
        event: "Matrimonio en Rionegro",
        comment:
          "Carlos y su equipo fueron impecables. Llegaron antes de la hora, montaron todo y mis invitados quedaron felices con la atención.",
      },
      {
        name: "Jorge Álvarez",
        rating: 5,
        event: "Evento corporativo",
        comment:
          "Muy profesionales, excelente presentación y trato amable. Los volveremos a contratar para el evento de fin de año.",
      },
    ],
    availability: {
      days: "Lunes a domingo",
      hours: "8:00 a.m. – 2:00 a.m.",
    },
    coverage: ["Medellín", "Envigado", "Rionegro", "Oriente antioqueño"],
  },
  {
    id: "laura-gutierrez",
    name: "Laura Gutiérrez",
    category: "Meseros",
    city: "Bogotá",
    rating: 4.8,
    reviewsCount: 24,
    priceFrom: 26000,
    yearsExperience: 5,
    bio: "Especialista en servicio para eventos sociales íntimos y cenas privadas. Formada en hotelería, se destaca por su calidez, discreción y atención al detalle en cada mesa.",
    capacity: "Eventos hasta 80 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Cenas privadas y reuniones",
        priceHour: 26000,
        includes: [
          "Servicio de mesa a la francesa",
          "Manejo de vinos y copas",
          "Presentación formal",
        ],
      },
      {
        name: "Apoyo en fiestas familiares",
        priceHour: 24000,
        includes: [
          "Atención de invitados y pasabocas",
          "Reposición de bebidas",
          "Recogida y organización final",
        ],
      },
    ],
    reviews: [
      {
        name: "Diana Torres",
        rating: 5,
        event: "Cena de aniversario",
        comment:
          "Laura hizo que nuestra cena se sintiera de restaurante cinco estrellas. Súper atenta sin ser invasiva.",
      },
      {
        name: "Felipe Rojas",
        rating: 4,
        event: "Cumpleaños en Chía",
        comment:
          "Muy buen servicio y actitud. Llegó puntual y se encargó de todo para que pudiéramos disfrutar.",
      },
    ],
    availability: {
      days: "Jueves a domingo",
      hours: "10:00 a.m. – 12:00 a.m.",
    },
    coverage: ["Bogotá", "Chía", "Cajicá", "La Calera"],
  },
  {
    id: "ricardo-ospina",
    name: "Chef Ricardo Ospina",
    category: "Cocineros",
    city: "Medellín",
    rating: 5.0,
    reviewsCount: 41,
    priceFrom: 55000,
    yearsExperience: 12,
    bio: "Maestro parrillero y chef de cocina colombiana con 12 años de experiencia. Experto en asados al carbón, lechona y comida típica antioqueña. Lleva su propio equipo de parrilla y trabaja con proveedores locales de carne certificada.",
    capacity: "Eventos hasta 150 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Asado completo al carbón",
        priceHour: 55000,
        includes: [
          "Parrilla y carbón incluidos",
          "Cortes seleccionados y chorizos",
          "Guarniciones típicas (arepa, papa salada)",
        ],
      },
      {
        name: "Chef de cocina típica",
        priceHour: 50000,
        includes: [
          "Bandeja paisa, sancocho o ajiaco",
          "Compra de ingredientes (se cotiza aparte)",
          "Cocina impecable al terminar",
        ],
      },
    ],
    reviews: [
      {
        name: "Andrés Cardona",
        rating: 5,
        event: "Asado familiar de cumpleaños",
        comment:
          "El mejor asado que hemos tenido en la familia. Ricardo maneja los términos de la carne a la perfección y es un tipo muy querido.",
      },
      {
        name: "Sandra Mejía",
        rating: 5,
        event: "Finca en Guarne",
        comment:
          "Contratamos el sancocho para 60 personas y quedó espectacular. Todo a tiempo y la cocina quedó más limpia de lo que estaba.",
      },
      {
        name: "Julián Pérez",
        rating: 5,
        event: "Despedida de empresa",
        comment: "Profesionalismo total. La parrilla fue el alma de la fiesta.",
      },
    ],
    availability: {
      days: "Viernes a domingo y festivos",
      hours: "9:00 a.m. – 10:00 p.m.",
    },
    coverage: ["Medellín", "Guarne", "Rionegro", "El Retiro"],
  },
  {
    id: "valentina-ruiz",
    name: "Chef Valentina Ruiz",
    category: "Cocineros",
    city: "Cali",
    rating: 4.9,
    reviewsCount: 29,
    priceFrom: 48000,
    yearsExperience: 7,
    bio: "Chef profesional especializada en cocina internacional y fusión. Diseña menús personalizados para cenas privadas, showcooking en vivo y estaciones gourmet que sorprenden a los invitados.",
    capacity: "Eventos hasta 60 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Cena privada gourmet",
        priceHour: 48000,
        includes: [
          "Menú de 3 tiempos personalizado",
          "Emplatado tipo restaurante",
          "Maridaje sugerido",
        ],
      },
      {
        name: "Showcooking en vivo",
        priceHour: 60000,
        includes: [
          "Estación de cocina frente a invitados",
          "Pastas frescas, risottos o tacos",
          "Interacción y tips culinarios",
        ],
      },
    ],
    reviews: [
      {
        name: "Manuela Ríos",
        rating: 5,
        event: "Cena de compromiso",
        comment:
          "Valentina convirtió nuestra casa en un restaurante. El menú de fusión que armó fue espectacular y la presentación de lujo.",
      },
      {
        name: "Óscar Domínguez",
        rating: 5,
        event: "Reunión de socios",
        comment:
          "El showcooking fue todo un espectáculo. Los invitados no pararon de hablar de la comida.",
      },
    ],
    availability: {
      days: "Miércoles a domingo",
      hours: "11:00 a.m. – 11:00 p.m.",
    },
    coverage: ["Cali", "Jamundí", "Palmira"],
  },
  {
    id: "sabor-y-fuego",
    name: "Sabor & Fuego Catering",
    category: "Catering",
    city: "Bogotá",
    rating: 4.7,
    reviewsCount: 52,
    priceFrom: 95000,
    yearsExperience: 10,
    bio: "Empresa de catering con 10 años sirviendo eventos sociales y corporativos en Bogotá y la Sabana. Menús completos, estaciones de pasabocas, barras de café y postres, con logística y personal propios.",
    capacity: "Eventos hasta 500 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Buffet completo",
        priceHour: 95000,
        includes: [
          "Menú de plato fuerte + guarniciones",
          "Estación de bebidas",
          "Personal de servicio incluido",
        ],
      },
      {
        name: "Estación de pasabocas",
        priceHour: 70000,
        includes: [
          "Pasabocas fríos y calientes",
          "Opciones vegetarianas",
          "Montaje y menaje incluidos",
        ],
      },
      {
        name: "Barra de café y postres",
        priceHour: 55000,
        includes: [
          "Barista profesional",
          "Postres artesanales variados",
          "Vajilla y decoración de la barra",
        ],
      },
    ],
    reviews: [
      {
        name: "Mariana Silva",
        rating: 5,
        event: "Evento corporativo",
        comment:
          "El catering estuvo delicioso y la logística impecable. Alimentaron a 300 personas sin una sola demora.",
      },
      {
        name: "Ricardo Peña",
        rating: 4,
        event: "Grados de universidad",
        comment:
          "Muy buena comida y presentación. Solo mejoraría la variedad de postres, el resto de 10.",
      },
    ],
    availability: {
      days: "Lunes a domingo",
      hours: "6:00 a.m. – 12:00 a.m.",
    },
    coverage: ["Bogotá", "Chía", "Cota", "Funza", "Mosquera"],
  },
  {
    id: "delicias-de-la-abuela",
    name: "Delicias de la Abuela",
    category: "Catering",
    city: "Envigado",
    rating: 4.8,
    reviewsCount: 33,
    priceFrom: 80000,
    yearsExperience: 15,
    bio: "Cocina tradicional antioqueña hecha con amor de casa. Fiambres, sancochos, tamales y mesas de dulces típicos para fiestas familiares que saben a pueblo y a infancia.",
    capacity: "Eventos hasta 120 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Menú típico completo",
        priceHour: 80000,
        includes: [
          "Sancocho, bandeja o tamales",
          "Arepas y acompañamientos caseros",
          "Servido en la mesa o buffet",
        ],
      },
      {
        name: "Mesa de dulces típicos",
        priceHour: 45000,
        includes: [
          "Natilla, buñuelos y hojuelas",
          "Dulces de guayaba y arequipe",
          "Decoración campesina de la mesa",
        ],
      },
    ],
    reviews: [
      {
        name: "Gloria Cañas",
        rating: 5,
        event: "Fiesta de 80 años",
        comment:
          "La comida sabía exactamente como la hacía mi mamá. Los invitados mayores quedaron encantados y repitieron todos.",
      },
      {
        name: "Esteban Vélez",
        rating: 5,
        event: "Novena navideña",
        comment:
          "La natilla y los buñuelos fueron un éxito total. Servicio muy familiar y cumplido.",
      },
    ],
    availability: {
      days: "Lunes a sábado",
      hours: "7:00 a.m. – 9:00 p.m.",
    },
    coverage: ["Envigado", "Medellín", "Sabaneta", "Itagüí"],
  },
  {
    id: "eventos-y-estilo",
    name: "Eventos & Estilo Mobiliario",
    category: "Mobiliario",
    city: "Medellín",
    rating: 4.6,
    reviewsCount: 47,
    priceFrom: 35000,
    yearsExperience: 9,
    bio: "Alquiler de mobiliario moderno para eventos: salas lounge, mesas cocteleras, sillas tiffany y barras iluminadas. Transporte, montaje y desmontaje incluidos en toda el área metropolitana.",
    capacity: "Montajes hasta 300 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Sala lounge completa",
        priceHour: 35000,
        includes: [
          "Sofás, puffs y mesas de centro",
          "Cojines decorativos a juego",
          "Montaje y desmontaje incluidos",
        ],
      },
      {
        name: "Mesas y sillas de gala",
        priceHour: 28000,
        includes: [
          "Mesas redondas con mantelería",
          "Sillas tiffany o vestidas",
          "Distribución según plano del evento",
        ],
      },
    ],
    reviews: [
      {
        name: "Paula Zapata",
        rating: 5,
        event: "Matrimonio en El Poblado",
        comment:
          "El lounge le dio un toque súper elegante a la recepción. Montaron todo rapidísimo y sin contratiempos.",
      },
      {
        name: "David Restrepo",
        rating: 4,
        event: "Lanzamiento de marca",
        comment:
          "Mobiliario moderno y en excelente estado. El montaje tardó un poco más de lo acordado pero el resultado valió la pena.",
      },
    ],
    availability: {
      days: "Lunes a domingo",
      hours: "24 horas (montajes programados)",
    },
    coverage: ["Medellín", "Bello", "Envigado", "Sabaneta", "Rionegro"],
  },
  {
    id: "rentamuebles-la-70",
    name: "Rentamuebles La 70",
    category: "Mobiliario",
    city: "Bogotá",
    rating: 4.7,
    reviewsCount: 61,
    priceFrom: 30000,
    yearsExperience: 14,
    bio: "Tradición familiar en alquiler de mobiliario y menaje para eventos de todo tamaño. Desde la reunión del barrio hasta bodas de gala: carpas, tablones, sillas rimax y vajilla completa.",
    capacity: "Montajes hasta 400 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Paquete fiesta familiar",
        priceHour: 30000,
        includes: [
          "Tablones, sillas y manteles",
          "Carpa para 50 personas",
          "Entrega y recogida el mismo día",
        ],
      },
      {
        name: "Menaje y vajilla completa",
        priceHour: 22000,
        includes: [
          "Platos, cubiertos y cristalería",
          "Samovares y termos de café",
          "Lavado post-evento incluido",
        ],
      },
    ],
    reviews: [
      {
        name: "Rosa Martínez",
        rating: 5,
        event: "Primera comunión",
        comment:
          "Llevan años atendiendo los eventos de la familia. Siempre cumplidos y con todo en perfecto estado.",
      },
      {
        name: "Héctor Guzmán",
        rating: 4,
        event: "Bazar del conjunto",
        comment:
          "Buen precio y buena atención. La carpa nos salvó del aguacero de esa tarde.",
      },
    ],
    availability: {
      days: "Lunes a domingo",
      hours: "7:00 a.m. – 8:00 p.m.",
    },
    coverage: ["Bogotá", "Soacha", "Chía", "Zipaquirá"],
  },
  {
    id: "finca-la-esperanza",
    name: "Finca La Esperanza",
    category: "Lugares",
    city: "Rionegro",
    rating: 4.9,
    reviewsCount: 27,
    priceFrom: 180000,
    yearsExperience: 6,
    bio: "Finca campestre con vista a las montañas del Oriente antioqueño. Zonas verdes, kiosco con parrilla, piscina climatizada y salón cubierto para 150 personas. Ideal para matrimonios, cumpleaños y retiros de empresa.",
    capacity: "Eventos hasta 150 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Alquiler finca completa",
        priceHour: 180000,
        includes: [
          "Salón cubierto + zonas verdes",
          "Piscina climatizada y kiosco",
          "Parqueadero para 40 vehículos",
        ],
      },
      {
        name: "Solo salón y jardín",
        priceHour: 120000,
        includes: [
          "Salón para 150 personas",
          "Jardín para ceremonia",
          "Sonido ambiente incluido",
        ],
      },
    ],
    reviews: [
      {
        name: "Natalia Henao",
        rating: 5,
        event: "Matrimonio campestre",
        comment:
          "El lugar es un sueño. La vista de las montañas al atardecer hizo que las fotos quedaran de revista.",
      },
      {
        name: "Grupo Empresarial Andino",
        rating: 5,
        event: "Retiro de equipo",
        comment:
          "Espacios amplios, todo muy limpio y los administradores atentos a cada detalle. Repetiremos el próximo año.",
      },
    ],
    availability: {
      days: "Viernes a domingo y festivos",
      hours: "Jornadas de 6 a 12 horas",
    },
    coverage: ["Rionegro", "Llanogrande", "El Retiro", "La Ceja"],
  },
  {
    id: "terraza-nube-9",
    name: "Terraza Nube 9",
    category: "Lugares",
    city: "Medellín",
    rating: 4.8,
    reviewsCount: 19,
    priceFrom: 150000,
    yearsExperience: 4,
    bio: "Rooftop urbano en el corazón de El Poblado con vista panorámica de la ciudad. Terraza al aire libre con pérgola, barra de coctelería y ambiente lounge, perfecta para celebraciones modernas y eventos de marca.",
    capacity: "Eventos hasta 100 personas",
    avatarUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
    ],
    services: [
      {
        name: "Terraza completa",
        priceHour: 150000,
        includes: [
          "Vista panorámica 360°",
          "Barra equipada y luces ambiente",
          "Sonido profesional incluido",
        ],
      },
      {
        name: "Zona lounge privada",
        priceHour: 90000,
        includes: [
          "Área privada para 40 personas",
          "Mobiliario lounge incluido",
          "Servicio de barra opcional",
        ],
      },
    ],
    reviews: [
      {
        name: "Susana Gil",
        rating: 5,
        event: "Cumpleaños número 30",
        comment:
          "La vista de noche es espectacular. El equipo del lugar nos ayudó con todo el montaje y la fiesta fue un éxito.",
      },
      {
        name: "Agencia Naranja Ltda.",
        rating: 4,
        event: "Lanzamiento de producto",
        comment:
          "Locación moderna y fotogénica, perfecta para el evento. El acceso en ascensor se congestiona un poco en hora pico.",
      },
    ],
    availability: {
      days: "Miércoles a sábado",
      hours: "4:00 p.m. – 2:00 a.m.",
    },
    coverage: ["Medellín – El Poblado"],
  },
];

// Helper used by the detail page
export function getProviderById(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

// COP currency formatter shared across the section
export function formatCOP(num: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(num);
}
