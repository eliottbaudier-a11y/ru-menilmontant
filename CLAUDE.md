# Ru de Ménilmontant — Contexte projet
> Fichier lu par Claude Code au début de chaque session. Le garder à jour.

## Le projet en une phrase
Site web narratif et interactif qui retrace l'histoire du **ru (ruisseau) de Ménilmontant** à travers **8 plaques** disséminées dans Paris : parcours à scanner (QR code), fiches détaillées, carte du tracé, compte utilisateur et **collection déblocable** avec rendu 3D des plaques.

## Cadre & échéances
- Projet de diplôme **Master 2** (école de design).
- **Site fonctionnel : fin août 2026** · Dépôt drive école : **10 sept.** · Soutenance : **21 sept.**
- Objectif = démontrer le **concept**, la **démarche de recherche** et l'**univers graphique**. Le site n'a pas besoin d'être 100 % pro/abouti : on privilégie la **qualité d'exécution visuelle** et un **parcours complet et fonctionnel sur les 8 plaques** plutôt que l'exhaustivité.

## Scope figé — ne rien ajouter en dehors de cette liste
- Parcours narratif complet sur l'histoire du ru et des 8 plaques.
- Visuels **forts, animés, à fort impact** (exigence école de design — « ça doit claquer »).
- Compte utilisateur simple : inscription / connexion + **sauvegarde des plaques scannées**.
- Carte interactive du tracé (8 points).
- Page **collection** avec progression / déblocage + **rendu 3D rotatif** des plaques.
- Scan **QR** → fiche de la plaque correspondante.

**HORS SCOPE** : tout le reste (paiement, messagerie, admin complexe, multi-langue, etc.). En cas de doute → ne pas ajouter, demander.

## Stack technique
- **Next.js (App Router)** + **TypeScript** + **Tailwind CSS**
- **Supabase** (Postgres + Auth) via `@supabase/ssr` — auth email + sauvegarde des scans
- **Mapbox GL JS** — carte interactive du tracé
- **Three.js** (`@react-three/fiber` + `@react-three/drei`) *ou* embed **Spline** — 3D des plaques
- **`qrcode`** — génération des 8 QR codes
- **Framer Motion** (+ GSAP si séquences complexes) — animations
- **Vercel** (plan Hobby) — hébergement / déploiement continu

## Direction artistique
- Palette dominante **bleu marine** (tokens définitifs à caler dans `tailwind.config` / `globals.css` — voir assets fournis).
- Numérotation type **« Plaque III / VIII »**.
- Duos **image ancienne / image actuelle** dans les fiches.
- Animations soignées : transitions de page, révélations au scroll, micro-interactions.
- **Mobile-first** : le scan se fait dans la rue → le mobile est la priorité absolue.

## Modèle de données
`src/data/plaques.ts` est la **source de vérité** pour le contenu des 8 plaques (voir ce fichier).
Table Supabase `scans` : relie `user_id` ↔ plaque scannée.

```sql
-- Table des scans (progression utilisateur)
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plaque_slug text not null,
  scanned_at timestamptz not null default now(),
  unique (user_id, plaque_slug)
);
alter table public.scans enable row level security;
create policy "user reads own scans"   on public.scans for select using (auth.uid() = user_id);
create policy "user inserts own scans" on public.scans for insert with check (auth.uid() = user_id);
```

## Arborescence cible (indicative)
```
src/
  app/
    page.tsx                 # accueil / intro narrative
    parcours/page.tsx        # présentation du parcours des 8 plaques
    plaques/[slug]/page.tsx  # fiche détaillée d'une plaque (cible des QR)
    carte/page.tsx           # carte Mapbox du tracé
    collection/page.tsx      # collection + progression + 3D (auth requise)
    (auth)/login, /signup    # comptes
  components/                # composants réutilisables (UI, animations, 3D)
  data/plaques.ts            # contenu des 8 plaques
  lib/supabase/              # clients server/client (@supabase/ssr)
public/
  plaques/                   # images ancienne/actuelle + modèles .glb
  qr/                        # QR générés
```

## Roadmap (référence — ne pas tout coder d'un coup)
- **S1 (30/07–05/08)** : setup Next.js + Tailwind, **déploiement Vercel dès J1**, charte graphique en composants, structuration data 8 plaques, **auth Supabase**.
- **S2 (06–12/08)** : fiches détaillées des 8 plaques, génération + intégration des **8 QR codes**.
- **S3 (13–19/08)** : **carte Mapbox** (8 points), page **collection** + déblocage.
- **S4 (20–26/08)** : **rendu 3D** rotatif, **responsive mobile** complet, **test terrain** (scan réel dans la rue).
- **Marge (27/08–09/09)** : corrections, finitions, polish visuel. **Pas de nouvelle feature.**

## Règles de collaboration
- D'abord un **parcours complet et fonctionnel** sur les 8 plaques, ensuite les fioritures visuelles.
- **Déployer tôt et souvent** sur Vercel (éviter l'effet tunnel).
- Commits **fréquents et atomiques**, messages clairs.
- **Ne jamais committer les clés** : `.env.local` est hors git.
- Demander avant d'ajouter une dépendance lourde ou une feature hors scope.
- TypeScript strict, composants réutilisables, code lisible.

---

## MISE À JOUR 31/07/2026 — décisions validées (identité + UX)

### Identité graphique — VALIDÉE (ne plus la remettre en cause)
- **Couleur primaire : `#2D308C`** (bleu indigo, extrait exact du dossier). Profondeur : `#1B1D5E`. Papier : `#F3F1EA`. Accent eau (révélation) : `#63D0DE`.
- Le site alterne **fonds bleus pleins** et **sections papier blanc cassé** (comme le dossier InDesign).
- **Typographies : VALIDÉES.** Display condensé lourd (type « RECHERCHES » → équivalent web **Anton**) ; corps de texte étroit / technique / justifié (équivalent web **Barlow Semi Condensed**, light) ; sous-titres en italique.
- Direction artistique : **Terra Forma** (Aït-Touati / Arènes / Grégoire, préface Latour) + le dossier graphique d'Eliott. Cartographie en **coupe**, vues **souterraines**, **isolignes**, le sol comme matière, « descente » sous le bitume.

### Ce qui doit évoluer (retours d'Eliott sur la maquette v1)
- **Plus « pétant » visuellement** : garder couleurs + typos, mais pousser les **visuels** et la **façon d'amener l'histoire** (images fortes des cours d'eau, animations, vidéo à venir — assets pas encore dispo).
- **La carte / le tracé** : partir du tracé minimaliste (validé comme base) mais aller vers quelque chose de **beaucoup plus poussé, façon Terra Forma** (coupe géologique, souterrain, isolignes, échelle de profondeur).
- **Les micro-animations latérales des plaques** : à refaire, plus travaillées.
- **Graphisme final des 8 plaques (roundels)** : provisoire, à remodeler.

### Navigation & parcours — MODÈLE VALIDÉ (important)
- Le point d'entrée réel est le **scan d'un QR** sur une plaque physique → arrivée **directe sur la page de CETTE plaque**, conçue comme une **one-page** (long scroll narratif dédié).
- Les **autres plaques ne sont pas librement accessibles** : on ne débloque une page de plaque qu'en la scannant. Mais **toutes sont visibles sur la page d'accueil** (aperçu / silhouette / « verrouillé »), ce qui donne envie de compléter le parcours.
- La **page d'accueil** = vue d'ensemble du flux (les 8 plaques = le cours du ru), l'histoire du ru, la carte, et l'état de la collection.
- La **collection** se remplit au fil des scans ; 8/8 → déblocage (image d'archive + rendu 3D de la plaque).
- Conséquence technique : route `plaques/[slug]` accessible via scan (query/token), état de déblocage stocké côté Supabase (table `scans`) + fallback local pour visiteur non connecté.

### Réalisation physique de l'objet (précision 31/07)
- La **peinture hydrochromique** reste l'**idée d'origine / le concept**, mais n'est PAS la réalisation retenue pour le diplôme.
- L'objet réalisé = une **gravure creusée dans le béton** (le tracé du ru + la cartographie de Paris incisés dans la matière ; l'eau de pluie se loge dans les creux et révèle le dessin).
- Un **prototype en béton** d'une plaque est fabriqué pour la soutenance.
- Conséquence côté site : parler de « gravure béton » / « prototype béton », l'hydrochromie étant présentée comme l'intention initiale.

### Page d'accueil — structure ALLÉGÉE (validée 31/07)
- L'accueil ne contient PAS le détail de l'histoire / de la plaque. Il reste léger : **hero (titre + image cinématique)** → **animation interactive** (« la pluie révèle le ru », révélation hydrochromique au curseur) → **collection** → **footer**.
- Les **onglets de nav restent en haut** et donnent accès aux pages dédiées (Le Ru / Le Parcours / La Carte / Ma Collection). Le contenu détaillé vit sur ces pages et sur les pages de plaque (one-page, atteintes par scan).

### Rituel de travail (validé avec Eliott)
- **À chaque grosse avancée** : expliquer en clair ce qui a été fait (pour que ce soit ré-explicable au jury).
- **Dossier de documentation daté chaque jour** : `Journal_PFE/AAAA-MM-JJ/` contenant captures d'écran du site + captures des lignes de code importantes + un récap `.md`. Eliott le récupère chaque soir et l'archive à la date du jour.

---

## Rituel — Journal de bord CODE (à partir de la phase Next.js)
À chaque session de code, tenir un **compte rendu quotidien** (journal de bord) des **grosses actions** : ce qui a été construit/modifié, les décisions techniques et le **pourquoi** de chaque choix. Rédigé en clair et pédagogique, pour qu'Eliott puisse le **ré-expliquer au jury** à la soutenance. Le déposer daté (ex. `Journal_PFE/AAAA-MM-JJ/journal-code.md`) en plus des captures d'écran/lignes de code importantes.
