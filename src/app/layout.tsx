import type { Metadata, Viewport } from "next";
import { anton, barlow, spectral } from "@/lib/fonts";
import { AppProvider } from "@/lib/store";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: { google: "D0xWXH72EjHPGpDfJbCBEeKAewy5zfXv7FaNzbGF2tQ" },
  title: {
    default: "Ru de Ménilmontant · Le ruisseau oublié de Paris",
    template: "%s · Ru de Ménilmontant",
  },
  description:
    "Le ru de Ménilmontant, ou ruisseau de Ménilmontant : le cours d'eau enfoui de Paris devenu le Grand Égout. Un parcours en 8 plaques gravées, de Belleville à la Seine.",
  keywords: [
    "ru de Ménilmontant",
    "ruisseau de Ménilmontant",
    "Ménilmontant",
    "Grand Égout",
    "rivière enfouie Paris",
    "cours d'eau disparu Paris",
    "ruisseau oublié Paris",
    "Belleville ruisseau",
    "égouts de Paris histoire",
    "hydrographie Paris",
    "Terra Forma",
    "Eliott Baudier",
  ],
  authors: [{ name: "Eliott Baudier" }],
  creator: "Eliott Baudier",
  applicationName: "Ru de Ménilmontant",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Ru de Ménilmontant · Le ruisseau oublié de Paris",
    description:
      "Le ruisseau enfoui de Paris devenu le Grand Égout. Un parcours narratif en 8 plaques gravées, de Belleville à la Seine.",
    url: SITE_URL,
    siteName: "Ru de Ménilmontant",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ru de Ménilmontant · Le ruisseau oublié de Paris",
    description:
      "Le ruisseau enfoui de Paris, en 8 plaques gravées de Belleville à la Seine.",
  },
  category: "history",
};

export const viewport: Viewport = {
  themeColor: "#2d308c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ru de Ménilmontant",
  alternateName: [
    "Ruisseau de Ménilmontant",
    "Le Ru de Ménilmontant",
    "Grand Égout de Ménilmontant",
  ],
  url: SITE_URL,
  inLanguage: "fr-FR",
  description:
    "Le ru de Ménilmontant, ruisseau enfoui de Paris devenu le Grand Égout. Un parcours narratif en 8 plaques gravées, de Belleville à la Seine.",
  author: { "@type": "Person", name: "Eliott Baudier" },
  about: {
    "@type": "Place",
    name: "Ru de Ménilmontant",
    description:
      "Ancien ruisseau de Paris, né sur les hauteurs de Belleville et de Ménilmontant, canalisé sous le nom de Grand Égout puis enfoui vers 1823.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${barlow.variable} ${spectral.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grain" aria-hidden="true" />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
