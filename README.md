```markdown
# PulseScope 🚀

*Explorez les tendances audio‑visuelles en temps réel.*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-8b5cf6?logo=next.js)](https://next-auth.js.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
[![YouTube API](https://img.shields.io/badge/API-YouTube-red?logo=youtube)](https://developers.google.com/youtube)
[![Spotify API](https://img.shields.io/badge/API-Spotify-1DB954?logo=spotify)](https://developer.spotify.com/)
[![Taddy API](https://img.shields.io/badge/API-Taddy-purple)](https://taddy.org/developers)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=three.js)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Animation-Framer%20Motion-ff0055?logo=framer)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-22b5bf)](https://recharts.org/)

---

PulseScope agrège les données de YouTube, Spotify et des podcasts (via Taddy) pour offrir une vision claire des sujets émergents.  
Créeurs de contenu, marketeurs, analystes : gardez une longueur d’avance.

## ✨ Fonctionnalités

- 🔍 **Recherche multi‑source** : un mot‑clé interroge simultanément YouTube et Taddy (podcasts).
- 📊 **Tendances en direct** : vidéos YouTube les plus populaires en France, podcasts tendance.
- 🎨 **Interface immersive** : fond 3D animé (Three.js), animations fluides (Framer Motion).
- 🧠 **Suggestions intelligentes** : générées à partir des titres tendance YouTube.
- 👤 **Authentification** : connexion par email ou Google (NextAuth.js + Prisma).
- 📈 **Dashboard personnalisé** : courbes de popularité (Recharts), cartes de statistiques.
- 🤖 **Chatbot IA** : assistant intégré pour guider les utilisateurs (API Hugging Face).
- 📱 **Responsive** : adapté mobile, tablette, desktop.

## 🛠️ Technologies

| Catégorie          | Outils                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| **Frontend**       | Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion      |
| **Backend**        | Next.js API Routes, Prisma ORM, PostgreSQL                             |
| **Authentification** | NextAuth.js (Credentials + Google OAuth)                             |
| **APIs externes**  | YouTube Data API, Spotify Web API, Taddy GraphQL API                   |
| **Visualisation**  | Recharts, Three.js, Lucide Icons                                      |
| **Déploiement**    | Vercel (recommandé), Docker                                           |

## 📦 Installation

Prérequis : Node.js 20+, pnpm, un compte [YouTube Data API](https://console.cloud.google.com/), [Spotify Developer](https://developer.spotify.com/dashboard), [Taddy](https://taddy.org/developers), [Hugging Face](https://huggingface.co/settings/tokens) (pour le chatbot).

```bash
git clone https://github.com/votre-compte/pulsescope.git
cd pulsescope
pnpm install
```

Copiez `.env.example` en `.env` et remplissez les variables :

```env
# Base de données
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# YouTube
NEXT_PUBLIC_YOUTUBE_API_KEY="..."

# Spotify
SPOTIFY_CLIENT_ID="..."
SPOTIFY_CLIENT_SECRET="..."

# Taddy
TADDY_API_KEY="..."
TADDY_USER_ID="..."

# Hugging Face (chatbot)
HUGGINGFACE_API_KEY="..."
```

Générez le client Prisma et poussez le schéma :

```bash
npx prisma generate
npx prisma db push
```

Lancez le serveur de développement :

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 📁 Structure du projet

```
pulsescope/
├── app/                    # Routes Next.js (App Router)
│   ├── (auth)/             # Pages d'authentification
│   ├── (dashboard)/        # Pages du tableau de bord
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── demo/
│   │   ├── test/
│   │   ├── watch/[id]/
│   │   └── profile/
│   ├── about/
│   └── api/                # Routes API
|   └── layout.tsx
|   └── page.tsx
├── components/             # Composants React réutilisables
│   ├── common/             # Navbar, Footer, etc.
│   ├── dashboard/          # SearchBar, StatsCards
│   ├── explore/            # Filtres, Suggestions
│   ├── feeds/              # YouTube, Spotify, Taddy
│   ├── chatbot/            # Assistant IA
│   └── ui/                 # ThreeBackground, ErrorMessage, etc.
├── services/               # Appels aux APIs externes
├── lib/                    # Prisma, NextAuth, utilitaires
├── hooks/                  # Hooks personnalisés
├── types/                  # Types TypeScript globaux
├── prisma/                 # Schéma Prisma
├── public/                 # Images, favicons
└── style/                  # Fichiers CSS globaux
```

## 🚀 Déploiement

Le projet est optimisé pour [Vercel](https://vercel.com). Connectez votre dépôt, ajoutez les variables d’environnement identiques à `.env`, et déployez.

## 📄 Licence

MIT © PulseScope

---

**Prêt à explorer les tendances ?** Lancez-vous dès maintenant.
```