import Mascot from "./Mascot";
import styles from "./Footer.module.css";

/**
 * Pied de page réutilisable. `paper` pour les pages à fond clair (fiches plaque),
 * sinon fond encre. `note` permet d'ajouter une ligne contextuelle (n° de plaque…).
 */
export default function Footer({
  paper = false,
  note,
}: {
  paper?: boolean;
  note?: string;
}) {
  return (
    <footer className={`${styles.footer} ${paper ? styles.paper : ""}`}>
      <div className={`${styles.big} display`}>Re-signaler l&apos;eau enfouie.</div>

      <div className={styles.sig}>
        <Mascot className={styles.perso} color={paper ? "var(--bleu)" : "var(--papier)"} />
        <div>
          <div style={{ fontWeight: 500 }}>Ru de Ménilmontant</div>
          <div style={{ opacity: 0.7 }}>Les ruisseaux oubliés de Paris</div>
        </div>
      </div>

      <div>
        {note && <div style={{ marginBottom: 6 }}>{note}</div>}
        <span style={{ opacity: 0.55, fontSize: 11 }}>
          Images : archives BnF / Gallica &amp; collections — usage pédagogique
        </span>
      </div>

      <div>
        Projet de diplôme · M2
        <br />
        Eliott Baudier · 2026
      </div>
    </footer>
  );
}
