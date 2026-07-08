import type { Metadata } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-nunito-sans",
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
    <html lang="es" className={`${fredoka.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
