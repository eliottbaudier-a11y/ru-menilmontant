"use client";

import styles from "./qr.module.css";

export default function PrintButton() {
  return (
    <button className={`cta solid ${styles.print}`} onClick={() => window.print()}>
      Imprimer les QR codes ↧
    </button>
  );
}
