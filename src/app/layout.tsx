import type { Metadata, Viewport } from "next";
import { anton, barlow, spectral } from "@/lib/fonts";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ru de Ménilmontant · Les ruisseaux oubliés de Paris",
    template: "%s · Ru de Ménilmontant",
  },
  description:
    "Sous vos pas, une rivière a disparu. Suivez ses huit plaques gravées pour faire ressurgir le ru de Ménilmontant, de Belleville à la Seine.",
  openGraph: {
    title: "Ru de Ménilmontant · Les ruisseaux oubliés de Paris",
    description:
      "Un parcours narratif en 8 plaques à travers Paris. Scannez, découvrez, complétez la collection.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#2d308c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${barlow.variable} ${spectral.variable}`}
    >
      <body>
        <div className="grain" aria-hidden="true" />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
