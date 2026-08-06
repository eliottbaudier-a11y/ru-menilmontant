# Ru de Ménilmontant — site du parcours

Site narratif et interactif retraçant l'histoire du **ru de Ménilmontant** à
travers **8 plaques** disséminées dans Paris. Parcours à scanner (QR code), fiches
détaillées, carte 3D du tracé, compte utilisateur et collection déblocable.

Projet de diplôme **Master 2** — Eliott Baudier · 2026.

## Stack

- **Next.js 16** (App Router) · **TypeScript** · **Tailwind CSS v4**
- **Supabase** (`@supabase/ssr`) — auth email + table `scans`
- **three.js** — carte 3D « Terra Forma » du tracé
- **qrcode** — génération des 8 QR codes
- Déploiement **Vercel**

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés (facultatif au début)
npm run dev                  # http://localhost:3000
```

Le site **fonctionne sans clés** : sans Supabase, la progression est sauvegardée
localement dans le navigateur.

## Variables d'environnement (`.env.local`)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé publique (auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | clé serveur (jamais exposée au navigateur) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | (optionnel) token Mapbox |
| `NEXT_PUBLIC_SITE_URL` | URL publique (pour les QR codes) |

> `.env.local` n'est **jamais** commité (voir `.gitignore`).

## Base de données

Exécuter `supabase/schema.sql` dans le SQL Editor de Supabase (crée la table
`scans` + les politiques RLS).

## QR codes

```bash
npm run qr                                                 # base = NEXT_PUBLIC_SITE_URL ou localhost
node scripts/generate-qr.mjs https://mon-site.vercel.app   # URL définitive
```

Sortie : `public/qr/plaque-1..8.{png,svg}` + `index.json`.

## Déploiement Vercel

1. Pousser le dépôt sur GitHub.
2. Sur [vercel.com](https://vercel.com) → **New Project** → importer le dépôt.
3. Ajouter les variables d'environnement (mêmes que `.env.local`).
4. Deploy. Chaque `git push` redéploie automatiquement.
5. Régénérer les QR codes avec l'URL Vercel définitive.

## Structure

```
src/
  app/
    page.tsx                 accueil (héros, interactif pluie, collection)
    parcours/                carrousel des 8 plaques
    carte/                   carte 3D Terra Forma (three.js)
    le-ru/                   préambule (qu'est-ce qu'un ru)
    galerie/                 inventaire mondial des plaques d'égout
    collection/              compte, images HD, récompense 3D (NFT à venir)
    plaques/[slug]/          fiche narrative (I/II/III) ou page verrouillée (IV→VIII)
    plaque/[n]/              cible des QR → enregistre le scan puis redirige
    (auth)/login, signup     comptes Supabase
  components/                Nav, Footer, Reveal, Roundel, sliders, carte 3D…
  data/plaques.ts            SOURCE DE VÉRITÉ des 8 plaques
  lib/                       fonts, store (progression), clients Supabase
public/
  img/                       images d'archives extraites des maquettes
  plaques/                   rendus des plaques en fonte
  qr/                        QR codes générés
```

## Documentation

Journal de bord code daté dans `Journal_PFE/AAAA-MM-JJ/journal-code.md`.
