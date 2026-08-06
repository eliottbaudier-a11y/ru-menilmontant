import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PlaqueSlider from "@/components/PlaqueSlider";

export const metadata: Metadata = {
  title: "Le Parcours",
  description:
    "Le cours du ru de Ménilmontant en 8 plaques, de la source à l'embouchure. Chaque plaque se débloque en la scannant sur le terrain.",
};

export default function ParcoursPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <PlaqueSlider />
      </main>
      <Footer />
    </>
  );
}
