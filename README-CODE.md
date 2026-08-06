# Ru de Ménilmontant — passage au code (Claude Code)

Tout est prêt. Suis ces étapes une par une. Ça prend ~10 min de mise en place, ensuite Claude Code code tout seul.

## 1. Installer les outils (une fois)
1. **Node.js** (si pas déjà installé) : https://nodejs.org → version **LTS** → installe.
2. **Claude Code** : ouvre un terminal et tape :
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   (doc officielle : https://docs.claude.com/claude-code)

## 2. Préparer le dossier du projet
1. Crée un dossier `ru-menilmontant` quelque part (ex. Bureau).
2. Décompresse ce kit **dedans** (tu dois voir `CLAUDE.md`, `rendus-plaques/`, `.env.local.example`).
3. Crée un sous-dossier `maquettes/` et **décompresse `version-mobile.zip` dedans** (toutes les pages HTML du site servent de référence visuelle à Claude Code).

## 3. Mettre tes clés Supabase
1. Renomme `.env.local.example` en **`.env.local`**.
2. Ouvre-le, colle tes 3 valeurs Supabase (Project URL, clé anon, clé service_role).
   → Ce fichier reste **hors git**, tu ne le partages jamais.

## 4. Lancer Claude Code
1. Dans le terminal, place-toi dans le dossier :
   ```
   cd chemin/vers/ru-menilmontant
   ```
2. Lance :
   ```
   claude
   ```
3. Connecte ton compte (il te guide au 1er lancement).

## 5. Copie-colle CE message à Claude Code
Colle exactement ceci comme premier message :

---
Lis `CLAUDE.md` et le dossier `maquettes/`. Construis le vrai site **Next.js (App Router) + TypeScript + Tailwind** à partir de ces maquettes, en suivant le plan de `CLAUDE.md`. Fais tout en autonomie, commits fréquents, journal de bord code daté, ne committe jamais `.env.local`.

Ordre :
1. Initialise Next.js + Tailwind ici et **déploie sur Vercel dès le début** (relie mon GitHub + Vercel, page vide en ligne).
2. Recrée la charte en composants (couleurs `#2D308C` / `#1B1D5E` / `#F3F1EA` / `#63D0DE`, typos Anton / Barlow Semi Condensed / Spectral) + layout global + nav.
3. `src/data/plaques.ts` : les 8 plaques (source de vérité).
4. **Supabase** : inscription / connexion + table `scans` (le SQL est dans `CLAUDE.md`).
5. Porte les pages : accueil, plaques **1/2/3** (avec l'objet plaque de fonte + effet trait bleu au survol — utilise les images de `rendus-plaques/`), Le Ru, Galerie, Ma Collection (téléchargement HD + NFT plus tard), carte 3D (Three.js), et une page **verrouillée** pour les plaques 4→7 (totem + pluie au survol).
6. **QR codes** : paquet `qrcode`, génère les 8 pointant vers `/plaque/[n]` une fois l'URL Vercel connue (je n'ai besoin que des 4 premiers pour commencer).
7. Responsive mobile complet.

Le NFT : on le fera plus tard, laisse un placeholder. Demande-moi seulement si tu es bloqué sur une décision ou s'il te manque un accès.
---

## Notes
- Les maquettes contiennent les images en base64 ; Claude Code peut les extraire, ou te demander les fichiers sources si besoin.
- Si Claude Code a besoin d'un accès (GitHub/Vercel), il te le dira — tu autorises, tu ne colles jamais de clé dans le chat.
- Tu peux le laisser tourner : il code, teste, corrige et te fait un récap. Le soir tu regardes et tu dis « ok / pas ok ».
