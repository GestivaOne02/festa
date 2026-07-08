import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proveedores | Fiesta",
  description:
    "Conoce a los profesionales y empresas aliadas de Fiesta: meseros, cocineros, catering, mobiliario y lugares para eventos en Colombia.",
};

export default function ProveedoresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
