import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiesta | Servicios Profesionales para Eventos por Horas",
  description: "Alquila meseros, cocineros, menaje, mobiliario y catering por horas en Colombia. Arma tu fiesta a tu medida con personal e infraestructura de alta calidad.",
  keywords: ["fiestas por horas", "alquiler de meseros", "alquiler de cocineros", "catering colombia", "vajilla eventos", "mobiliario fiestas"],
  openGraph: {
    title: "Fiesta | Servicios Profesionales para Eventos por Horas",
    description: "Alquila meseros, cocineros, vajilla y catering por horas en Colombia. Cotiza tu fiesta online.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
