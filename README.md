<div align="center">

<img src="./public/img/icon/icon.png" alt="PulseScope Logo" width="100" />

# PulseScope

**A modern music analytics & discovery platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

[![Live on Vercel](https://img.shields.io/badge/Live%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://pulsescope.vercel.app)

</div>

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Lancer le projet](#-lancer-le-projet)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)

---

## 🔭 Aperçu

**PulseScope** est une application web full-stack de découverte et d'analyse musicale, intégrant l'API Spotify pour explorer des tendances, visualiser des données audio et interagir avec un catalogue musical enrichi.

---

## 🛠 Stack technique

### Frontend

| Technologie | Version | Description |
|---|---|---|
| [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)](https://nextjs.org/) | 16.2.4 | Framework React full-stack (App Router) |
| [![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/) | 19 | Bibliothèque UI |
| [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) | 5 | Typage statique |
| [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) | 4 | Styles utilitaires |
| [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/) | 12 | Animations |
| [![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js)](https://threejs.org/) | 0.184 | Rendu 3D WebGL |
| [![Recharts](https://img.shields.io/badge/Recharts-22b5bf?logo=chartdotjs&logoColor=white)](https://recharts.org/) | 3 | Visualisation de données |
| [![Lucide](https://img.shields.io/badge/Lucide_React-F56565?logo=lucide&logoColor=white)](https://lucide.dev/) | 1.8 | Icônes |

### Backend & Base de données

| Technologie | Version | Description |
|---|---|---|
| [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/) | 7 | ORM / migrations |
| [![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL_17-00E599?logo=neon&logoColor=black)](https://neon.tech/) | — | Base de données PostgreSQL 17 serverless |
| [![NextAuth.js](https://img.shields.io/badge/NextAuth.js-black?logo=auth0&logoColor=white)](https://next-auth.js.org/) | 5 beta | Authentification OAuth |

### APIs & Services

| Service | Statut | Description |
|---|---|---|
| [![Spotify](https://img.shields.io/badge/Spotify_API-1DB954?logo=spotify&logoColor=white)](https://developer.spotify.com/documentation/web-api) | 🚧 En cours | Données musicales, playlists, analyses audio |
| [![YouTube](https://img.shields.io/badge/YouTube_Data_API-FF0000?logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3) | ✅ Actif | Recherche vidéo, métadonnées, lecture intégrée |
| [![Taddy](https://img.shields.io/badge/Taddy_API-6C47FF?logo=podcast&logoColor=white)](https://taddy.org/) | ✅ Actif | Données podcasts, épisodes, recherche audio |

### Outils de développement

| Outil | Version | Description |
|---|---|---|
| [![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/) | — | Gestionnaire de paquets |
| [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/) | 9 | Linting |
| [![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query) | 5 | Gestion du state serveur |

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **[Node.js](https://nodejs.org/)** ≥ 20
- **[pnpm](https://pnpm.io/)** ≥ 9
- Un compte **[NeonDB](https://neon.tech/)** (PostgreSQL 17 serverless)
- Un compte **[Spotify Developer](https://developer.spotify.com/dashboard)**
- Un compte **[Google Cloud](https://console.cloud.google.com/)** (YouTube Data API v3)
- Un compte **[Taddy](https://taddy.org/)**

---

## 📦 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/pulsescope.git
cd pulsescope

# 2. Installer les dépendances
pnpm install

# 3. Générer le client Prisma
pnpm prisma generate

# 4. Appliquer les migrations
pnpm prisma migrate dev
```

---

## 🔐 Variables d'environnement

Créez un fichier `.env` à la racine du projet (voir `.env.example`) :

```env
# Base de données — NeonDB PostgreSQL 17
DATABASE_URL="postgresql://user:password@ep-xxxx.eu-central-1.aws.neon.tech/pulsescope?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="votre-secret-nextauth"
NEXTAUTH_URL="http://localhost:3000"

# Spotify OAuth 🚧
SPOTIFY_CLIENT_ID="votre-client-id-spotify"
SPOTIFY_CLIENT_SECRET="votre-client-secret-spotify"

# YouTube Data API v3
YOUTUBE_API_KEY="votre-cle-youtube"

# Taddy API
TADDY_API_KEY="votre-cle-taddy"
TADDY_USER_ID="votre-user-id-taddy"

# HUGGINGFACE
HUGGINGFACE_API_KEY="votre-clé-huggingface"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-client-id-google"
GOOGLE_CLIENT_SECRET="votre-client-secret-google"
```

---

## 🚀 Lancer le projet

```bash
# Développement
pnpm dev

# Production
pnpm build
pnpm start

# Linting
pnpm lint
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🗂 Structure du projet

```
pulsescope/
├── app/                        # Routes Next.js (App Router)
│   ├── (auth)/                 # Pages d'authentification
│   ├── (dashboard)/            # Pages accessibles via la navbar
│   │   ├── dashboard/          # Tableau de bord connecté
│   │   ├── demo/               # Démonstration limitée
│   │   ├── explore/            # Recherche avancée (protégée)
│   │   ├── profile/            # Profil utilisateur
│   │   ├── test/               # Test des APIs (toutes sources)
│   │   ├── watch/[id]/         # Lecture vidéo YouTube
│   │   └── layout.tsx          # Layout avec navbar + chatbot
│   ├── about/                  # Page "À propos"
│   ├── api/                    # Routes API (auth, spotify, taddy, chat, etc.)
│   ├── page.tsx                # Page d'accueil
│   └── layout.tsx              # Layout racine (fond 3D, footer)
│
├── components/                 # Composants réutilisables
│   ├── chatbot/                # Chatbot assistant
│   ├── common/                 # Navbar verticale, footer, header
│   ├── explore/                # Filtres, suggestions
│   ├── feeds/                  # YouTube, Spotify, Taddy, Reddit
│   ├── ui/                     # ThreeBackground, Loading, ErrorMessage
│   ├── videos/                 # Lecteur vidéo et suggestions
│   └── dashboard/              # Contenu et graphiques du dashboard
├── hooks/                      # Hooks personnalisés (useChatbot)
├── lib/                        # Configuration NextAuth, Prisma, utils
├── services/                   # Appels aux APIs externes
├── types/                      # Types TypeScript globaux
├── prisma/                     # Schéma Prisma
├── public/                     # Ressources statiques
└── style/                      # Styles globaux (Tailwind)
├── next.config.ts              # Configuration Next.js
├── .env.example                # Variables d'environnement
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── LICENSE
├── tailwind.config.ts
└── README.md
```

---

## ☁️ Déploiement

PulseScope est déployé en production sur **[Vercel](https://vercel.com/)**.

> N'oubliez pas de configurer toutes vos variables d'environnement dans le dashboard Vercel avant le déploiement.

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

---

<div align="center">

Made with ❤️ — [Next.js](https://nextjs.org/) · [TailwindCSS](https://tailwindcss.com/docs/installation/framework-guides/nextjs) · [Three.js](https://threejs.org) · [Prisma](https://www.prisma.io/) · [Spotify API](https://developer.spotify.com/) · [YouTube API](https://developers.google.com/youtube/v3) · [Taddy](https://taddy.org/)

</div>