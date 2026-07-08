export interface Service {
  id: string;
  title: string;
  priceHour: number; // Cost / rate
  unit: string;      // e.g. "mesero / hora"
  description: string;
  features: string[];
  imageUrl: string;
}

// Array vacío para servir como plantilla (template). Añadir los servicios del negocio aquí.
export const SERVICES: Service[] = [];

