export type ProviderCategory =
  | "Meseros"
  | "Cocineros"
  | "Catering"
  | "Mobiliario"
  | "Lugares";

export type ProviderService = {
  name: string;
  priceHour: number; // COP per hour
  includes: Array<string>;
};

export type ProviderReview = {
  name: string;
  rating: number;
  event: string;
  comment: string;
};

export type Provider = {
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
  gallery: Array<string>;
  services: Array<ProviderService>;
  reviews: Array<ProviderReview>;
  availability: {
    days: string;
    hours: string;
  };
  coverage: Array<string>;
};

// Ordered list used to render the filter chips
export const PROVIDER_CATEGORIES: Array<ProviderCategory> = [
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

export function formatCOP(num: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function mapDbProductToProvider(p: any): Provider {
  let settings: {
    city?: string;
    yearsExperience?: number;
    description?: string;
    bio?: string;
    capacity?: string;
    avatarUrl?: string;
    coverUrl?: string;
    gallery?: Array<string>;
    services?: Array<ProviderService>;
    reviews?: Array<ProviderReview>;
    availability?: { days: string; hours: string };
    coverage?: Array<string>;
    features?: Array<string>;
  } = {};
  
  try {
    settings = JSON.parse(p.description || "{}");
  } catch (e) {
    settings = { description: p.description || "" };
  }

  // Derive category based on product details
  const dbCat = String(p.category || "").toLowerCase();
  const nameLower = String(p.name || "").toLowerCase();
  let category: ProviderCategory = "Meseros";
  
  if (nameLower.includes("mesero")) {
    category = "Meseros";
  } else if (nameLower.includes("cocinero") || nameLower.includes("chef")) {
    category = "Cocineros";
  } else if (nameLower.includes("catering") || nameLower.includes("comida") || dbCat.includes("aliment")) {
    category = "Catering";
  } else if (nameLower.includes("mesa") || nameLower.includes("mobiliario") || nameLower.includes("silla") || dbCat.includes("mobil")) {
    category = "Mobiliario";
  } else if (nameLower.includes("lugar") || nameLower.includes("salon") || nameLower.includes("espacio") || nameLower.includes("finca") || dbCat.includes("lugar")) {
    category = "Lugares";
  } else {
    if (dbCat.includes("servici")) category = "Meseros";
    else if (dbCat.includes("comid")) category = "Catering";
    else if (dbCat.includes("mueb") || dbCat.includes("mobili")) category = "Mobiliario";
    else if (dbCat.includes("lugar") || dbCat.includes("salon")) category = "Lugares";
  }

  // Map reviews and rating
  const reviews: Array<ProviderReview> = settings.reviews || [];
  let rating = 4.8;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc: number, r: ProviderReview) => acc + Number(r.rating || 5), 0);
    rating = Number((sum / reviews.length).toFixed(1));
  }
  
  const priceFrom = Number(p.price || 0);

  // Map services list
  const services: Array<ProviderService> = settings.services || [
    {
      name: `Servicio general de ${p.name}`,
      priceHour: priceFrom,
      includes: settings.features || ["Atención profesional", "Puntualidad garantizada", "Servicio verificado"]
    }
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop";
  const defaultCover = "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1200&auto=format&fit=crop";

  return {
    id: String(p.id),
    name: String(p.name),
    category,
    city: settings.city || "Medellín",
    rating,
    reviewsCount: reviews.length || 12,
    priceFrom,
    yearsExperience: settings.yearsExperience || 5,
    bio: settings.description || settings.bio || `Servicio calificado de ${p.name} para todo tipo de eventos y celebraciones.`,
    capacity: settings.capacity || "Apto para todo tipo de eventos",
    avatarUrl: p.image_url || settings.avatarUrl || defaultAvatar,
    coverUrl: p.image_url || settings.coverUrl || defaultCover,
    gallery: settings.gallery || (p.image_url ? [p.image_url] : [defaultCover]),
    services,
    reviews,
    availability: settings.availability || {
      days: "Lunes a Sábado",
      hours: "08:00 - 22:00"
    },
    coverage: settings.coverage || ["Medellín", "Área Metropolitana"]
  };
}
