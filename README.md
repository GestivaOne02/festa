# Fiesta - Landing Page (Next.js 14 App Router)

Landing page animada y responsiva para **Fiesta**, una plataforma colombiana de alquiler de servicios para eventos por horas (meseros, cocineros, vajilla, mobiliario, locaciones y catering).

Este proyecto ha sido desarrollado bajo los estrictos estándares de la skill de inteligencia de diseño **UI/UX Pro Max**.

---

## Características de Diseño UI/UX

*   **Identidad Visual Cálida**: Paleta de colores basada en tonos naranjas y amarillos festivos, con fondos en color crema suave (`bg-brand-cream`) y textos en marrón chocolate oscuro (`text-brand-dark`), evitando colores fríos o planos.
*   **Elemento Firma**: Logotipo en SVG animado de un mesero balanceando una bandeja con bebidas en hover (`Logo.tsx`).
*   **Cotizador Interactivo en Tiempo Real**: Calculadora interactiva (`Configurator.tsx`) donde el usuario puede arrastrar controles de duración e invitados, activar o desactivar servicios, y ver un desglose detallado con el total estimado en COP.
*   **Animaciones Coreografiadas**: Implementadas con **Framer Motion** para dar fluidez al scroll, micro-interacciones a los botones y transiciones al menú móvil.
*   **Ruta de Login**: Página de inicio de sesión (`/login`) completamente estilizada bajo la misma identidad visual, preparada con handlers comentados para futura integración.

---

## Requisitos Previos

Asegúrate de tener instalado en tu sistema local:
*   [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
*   [npm](https://www.npmjs.com/) (incluido con Node.js)

---

## Cómo Correr el Proyecto

Sigue estos pasos en la terminal de tu computadora:

1.  **Instalar dependencias**:
    Descarga e instala las librerías necesarias del proyecto (Next.js, Tailwind, Framer Motion, Lucide icons, etc.):
    ```bash
    npm install
    ```

2.  **Iniciar el servidor de desarrollo**:
    Levanta el servidor local:
    ```bash
    npm run dev
    ```

3.  **Visualizar la página**:
    Abre tu navegador y entra a:
    [http://localhost:3000](http://localhost:3000)

---

## Estructura del Proyecto

*   `app/` - Enrutador de Next.js (App Router).
    *   `layout.tsx` - Layout global configurando metatags y fuentes de Google (`Fredoka` y `Nunito Sans`).
    *   `globals.css` - Inicialización de Tailwind CSS, tipografías y barra de desplazamiento estilizada.
    *   `page.tsx` - Página principal (landing page).
    *   `login/page.tsx` - Formulario de inicio de sesión (ruta `/login`).
*   `components/` - Componentes modulares de la interfaz.
    *   `ui/Logo.tsx` - Componente de logotipo SVG animado.
    *   `Navbar.tsx` - Barra de navegación interactiva y adaptativa para móvil.
    *   `Hero.tsx` - Banner principal con animaciones coreografiadas.
    *   `Configurator.tsx` - Calculadora interactiva del presupuesto de la fiesta.
    *   `Services.tsx` - Grid con tarjetas de servicios individuales y efectos hover.
    *   `HowItWorks.tsx` - Explicación secuencial en pasos con animaciones de scroll.
    *   `Gallery.tsx` - Galería de imágenes de alta definición de eventos.
    *   `Testimonials.tsx` - Testimonios de clientes reales con calificaciones de estrellas.
    *   `Footer.tsx` - Pie de página detallado con enlaces e información de contacto.
*   `constants/` - Colecciones de datos.
    *   `services.ts` - Archivo con los datos, descripciones, tarifas y links de imágenes de cada servicio.
*   `tailwind.config.ts` - Configuración de tokens de colores de marca y tipografías.
*   `next.config.mjs` - Configuración de Next.js que permite cargar de forma segura imágenes de Unsplash y Pexels.
