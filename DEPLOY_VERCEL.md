# Deploiement Vercel (GoLivra)

## Prerequis
- Compte Vercel
- Projet pousse sur GitHub/GitLab/Bitbucket

## Etapes
1. Importer le repository dans Vercel.
2. Vercel detecte automatiquement la configuration via `vercel.json`.
3. Lancer le deploiement.

## Configuration utilisee
- Build command: `npm run build`
- Output directory: `dist/client`
- Rewrites: toutes les routes vers `index.html` (SPA routing)

## Verification
- Ouvrir l'URL de production.
- Tester la navigation interne (`/solution`, `/marche`, `/modele`, etc.).
- Tester le formulaire d'avis WhatsApp et le menu hamburger mobile.
