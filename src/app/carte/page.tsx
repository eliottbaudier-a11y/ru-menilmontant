import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Map3D from "@/components/Map3D";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "La Carte",
  description:
    "Le ru de Ménilmontant spatialisé en volume, façon Terra Forma : relief, sol en coupe et cours d'eau enfoui, des hauteurs de Ménilmontant à la Seine.",
};

export default function CartePage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--encre)", paddingTop: 110, paddingBottom: 90 }}>
        <Reveal style={{ textAlign: "center", padding: "0 6vw", marginBottom: 34 }}>
          <div className="eyebrow center eau">La carte</div>
          <h1 className="display" style={{ fontSize: "clamp(30px,5vw,64px)" }}>
            Le ru dans Paris, en volume
          </h1>
          <p style={{ maxWidth: 680, margin: "12px auto 0", opacity: 0.82 }}>
            Tournez la ville (glisser gauche-droite, haut-bas), survolez une plaque pour la
            situer, des hauteurs de Ménilmontant jusqu&apos;à la Seine, le relief et le cours
            d&apos;eau enfoui, en coupe.
          </p>
        </Reveal>
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: "0 clamp(16px,5vw,70px)" }}>
          <Map3D />
        </div>
      </main>
      <Footer />
    </>
  );
}
