import { Anton, Barlow_Semi_Condensed, Spectral } from "next/font/google";

/** Display condensé lourd — titres « ça doit claquer » */
export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

/** Corps de texte étroit / technique */
export const barlow = Barlow_Semi_Condensed({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

/** Serif — sous-titres, labels de carte */
export const spectral = Spectral({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});
