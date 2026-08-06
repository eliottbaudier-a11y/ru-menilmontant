# Journal de bord — CODE · 6 août 2026

> Passage des maquettes HTML au **vrai site Next.js**. Ce document explique, en
> clair, ce qui a été construit et **pourquoi** — pour pouvoir le ré-expliquer au jury.

---

## 1. Ce qui a été fait aujourd'hui (résumé)

Le site complet est passé de maquettes HTML statiques à une **application Next.js**
fonctionnelle, avec :

- La **charte graphique** (couleurs, typos, grain, animations) recodée en composants réutilisables.
- Les **8 plaques** centralisées dans un seul fichier « source de vérité ».
- Les **fiches narratives** I / II / III (one-page, cible des QR codes).
- Les **pages verrouillées** IV → VIII (totem + pluie au survol, « à révéler »).
- L'**accueil** (héros animé, interactif « la pluie révèle le ru », collection).
- Le **parcours** (carrousel), la **carte 3D** (Terra Forma), **Le Ru**, la **galerie**, **Ma Collection**.
- Un **compte utilisateur** (inscription / connexion) + sauvegarde des scans.
- Les **8 QR codes** générés automatiquement.

Tout est **déployable** ; il reste 2 branchements externes à faire côté Eliott
(GitHub/Vercel + clés Supabase) — détaillés à la fin.

---

## 2. Décisions techniques et pourquoi

### a) Next.js (App Router) + TypeScript + Tailwind v4
Choix imposé par le cahier des charges. **Next.js** permet des URL propres
(`/plaques/le-marais`), le pré-rendu des pages (rapidité + référencement), et un
déploiement Vercel en un clic. **TypeScript** évite les erreurs bêtes (une plaque
mal nommée est détectée avant la mise en ligne). **Tailwind** pour aller vite sur
la mise en page, complété par du CSS « sur-mesure » pour reproduire fidèlement les
animations des maquettes.

### b) `src/data/plaques.ts` = une seule source de vérité
**Pourquoi :** tout le site (accueil, parcours, carte, collection, fiches) lit les
**mêmes** données. Si on corrige le nom d'une plaque ou une coordonnée à un seul
endroit, ça se met à jour **partout**. On évite les incohérences. Le contenu
rédactionnel complet des plaques I/II/III y est stocké ; IV→VIII n'ont que leurs
métadonnées (le texte viendra plus tard).

### c) Extraction des images des maquettes
Les maquettes contenaient les images d'archives « en dur » (encodées dans le HTML).
Un petit script les a **extraites** vers `public/img/` pour que le vrai site les
affiche proprement (optimisées par Next.js). Les rendus 3D de plaques fournis
(`rendus-plaques/`) servent pour l'objet en fonte et la récompense.

### d) Le modèle « on débloque en scannant »
Conforme à la logique validée le 31/07 :
- Les fiches de plaque ne sont **atteignables que par scan** (via un QR → `/plaque/[n]`).
- Arriver sur une fiche **enregistre le scan** (progression).
- Les plaques non scannées apparaissent **verrouillées** (silhouette + « à révéler »).
- Pour la **démo/soutenance**, les plaques I/II/III sont débloquées d'entrée
  (3/8), exactement comme dans les maquettes — ça rend le site « vivant » sans
  avoir à scanner physiquement.

### e) Sauvegarde de la progression : compte **ou** appareil
**Pourquoi ce double système :** un visiteur sans compte doit quand même voir sa
progression. Donc :
- **Connecté** → les scans sont sauvegardés dans la base **Supabase** (retrouvés
  sur tout appareil).
- **Non connecté** → sauvegardés **localement** dans le navigateur (localStorage).
- À la connexion, les deux **fusionnent**.

Astuce importante : le site **fonctionne même sans les clés Supabase** (elles ne
sont pas encore branchées). Il bascule automatiquement sur la sauvegarde locale.
On ne reste jamais bloqué.

### f) La carte 3D « Terra Forma »
La carte est un **vrai rendu 3D** (three.js) : le relief de Paris en volume, le sol
en coupe (strates), le cours d'eau enfoui qui serpente, les 8 plaques posées
dessus. On tourne la ville à la souris/au doigt, on survole une plaque pour la
situer. C'est la direction « coupe géologique / souterrain » demandée.

### g) Les QR codes
Un script (`npm run qr`) génère les **8 QR codes** (PNG haute résolution + SVG pour
l'impression), qui pointent vers `/plaque/1` … `/plaque/8`. À **relancer une fois
l'URL Vercel connue** pour obtenir les QR définitifs à imprimer.

---

## 3. Points d'attention / limites assumées (honnêteté jury)

- **Clés Supabase manquantes :** le fichier `.env.local` fourni était en réalité un
  **PDF** (pas des clés). Les comptes en ligne s'activeront dès qu'Eliott collera
  ses vraies clés. En attendant, la progression marche en local.
- **Plaques IV→VIII :** pages « à révéler » (contenu narratif pas encore rédigé),
  c'est volontaire et cohérent avec le scope.
- **Micro-animations & roundels :** repris des maquettes, encore « provisoires »
  (à re-travailler, comme noté le 31/07).
- **NFT :** placeholder (récompense 3D rotative en place, le NFT viendra plus tard).

---

## 4. Ce qu'il reste à brancher (côté Eliott, une seule fois)

1. **GitHub + Vercel** — pousser le dépôt sur GitHub, l'importer dans Vercel
   (déploiement automatique à chaque commit).
2. **`.env.local`** — y coller : `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, et
   (optionnel) `NEXT_PUBLIC_MAPBOX_TOKEN`. Modèle dans `.env.example`.
3. **Base Supabase** — exécuter `supabase/schema.sql` (crée la table `scans`).
4. **QR définitifs** — `node scripts/generate-qr.mjs https://<url-vercel>`.

---

## 5. Vérifications faites

- `npm run build` : **OK** (19 routes, les 8 fiches pré-générées, 0 erreur TypeScript).
- Navigation testée : accueil, fiches I–III, page verrouillée IV, parcours, carte,
  Le Ru, galerie, collection — toutes en **200**.
- **Mobile** (375 px) : pas de débordement horizontal notable (le mobile est la
  priorité — c'est là que le scan a lieu dans la rue).

*— Journal rédigé automatiquement par l'assistant de code, pour archivage quotidien.*
