```md
<div align="center">
  <img src="public/img/icon/favicon.png" alt="PulseScope logo" width="100" />
  <h1>PulseScope</h1>
  <p>
    <em>Explorez les tendances audio‑visuelles en temps réel.</em>
  </p>
  <p>
    <a href="https://pulse-scope-mg.vercel.app">Démo en ligne</a>
    ·
    <a href="https://github.com/ton-utilisateur/pulsescope">Code source</a>
    ·
    <a href="https://github.com/ton-utilisateur/pulsescope/issues">Signaler un bug</a>
  </p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-000000?logo=three.js)](https://threejs.org/)
[![YouTube Data API](https://img.shields.io/badge/YouTube-Data%20API-red?logo=youtube)](https://developers.google.com/youtube/v3)
[![Taddy](https://img.shields.io/badge/Taddy-Podcast%20API-purple)](https://taddy.org/)
[![Spotify](https://img.shields.io/badge/Spotify-Web%20API-1DB954?logo=spotify)](https://developer.spotify.com/) *(recherche suspendue – Premium requis)*

</div>

---

## 🌟 Fonctionnalités

- **Recherche multi‑source** : YouTube, podcasts (Taddy) en simultané.
- **Tableau de bord connecté** : statistiques de tendances et graphiques de popularité.
- **Exploration avancée** : suggestions automatiques, filtres par API, tendances en direct.
- **Animations 3D immersives** : fonds dynamiques générés avec Three.js.
- **Authentification sécurisée** : connexion par email / mot de passe ou Google, via NextAuth.js.
- **Chatbot assistant** : aide intégrée (propulsé par Hugging Face API).
- **Profil utilisateur** : consultation des informations personnelles.
- **Mode sombre intégral** et design glassmorphique.

---

## 📦 Technologies

| Catégorie           | Outils                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | React 19, Next.js 16 (App Router), Tailwind CSS 4, Framer Motion                                                                |
| **Backend**         | Next.js Route Handlers, Prisma 7, PostgreSQL (Neon), NextAuth v5                                                                 |
| **APIs externes**   | YouTube Data API v3, Taddy GraphQL API, Spotify Web API (partiellement), Hugging Face Inference, ListenNotes (alternative)   |
| **Visualisation**   | Recharts, Lucide React (icônes)                                                                                                |
| **3D**              | Three.js                                                                                                                        |
| **Langage**         | TypeScript                                                                                                                      |
| **Déploiement**     | Vercel                                                                                                                          |

---

## 📁 Structure du projet

```
pulsescope/
├── app/                       # Routes Next.js (App Router)
│   ├── (auth)/                # Pages d'authentification
│   ├── (dashboard)/           # Pages accessibles via la navbar
│   │   ├── dashboard/         # Tableau de bord connecté
│   │   ├── demo/              # Démonstration limitée
│   │   ├── explore/           # Recherche avancée (protégée)
│   │   ├── profile/           # Profil utilisateur
│   │   ├── test/              # Test des APIs (toutes sources)
│   │   ├── watch/[id]/        # Lecture vidéo YouTube
│   │   └── layout.tsx         # Layout avec navbar + chatbot
│   ├── about/                 # Page "À propos"
│   ├── api/                   # Routes API (auth, spotify, taddy, chat, etc.)
|   ├── page.tsx               # Page d'accueil
│   └── layout.tsx             # Layout racine (fond 3D, footer)
|   
├── components/                # Composants réutilisables
│   ├── chatbot/               # Chatbot assistant
│   ├── common/                # Navbar verticale, footer, header
│   ├── explore/               # Filtres, suggestions
│   ├── feeds/                 # YouTube, Spotify, Taddy, Reddit
│   ├── ui/                    # ThreeBackground, Loading, ErrorMessage
│   ├── videos/                # Lecteur vidéo et suggestions
│   └── dashboard/             # Contenu et graphiques du dashboard
├── hooks/                     # Hooks personnalisés (useChatbot)
├── lib/                       # Configuration NextAuth, Prisma, utils
├── services/                  # Appels aux APIs externes
├── types/                     # Types TypeScript globaux
├── prisma/                    # Schéma Prisma
├── public/                    # Ressources statiques
└── style/                     # Styles globaux (Tailwind)
```

---

## 🚀 Lancement rapide

### Prérequis

- **Node.js** >= 20  
- **pnpm** (recommandé) ou npm/yarn  
- Un compte sur les plateformes suivantes :
  - [Google Cloud Console](https://console.cloud.google.com/) (YouTube Data API + OAuth)
  - [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
  - [Taddy](https://taddy.org/developers)
  - [Hugging Face](https://huggingface.co/) (pour le chatbot)
  - Une base de données PostgreSQL (par exemple [Neon](https://neon.tech/))

### Variables d’environnement

Renommez le fichier `.env.example` en `.env` et renseignez les variables :

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
TADDY_API_KEY=...
TADDY_USER_ID=...
HUGGINGFACE_API_KEY=...
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Installation

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push   # ou prisma migrate dev pour une migration
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🔧 Utilisation

- **Sans connexion** : pages d’accueil, démo, test des APIs, à propos.
- **Avec connexion** : tableau de bord personnalisé, page "Explorer", profil utilisateur.
- Le **chatbot** est accessible depuis le bouton flottant en bas à droite.
- La **navbar verticale** regroupe la navigation principale.

---

## 📈 Roadmap / Améliorations futures

- [ ] Réactivation de la recherche Spotify (abonnement Premium requis)
- [ ] Analyse des sentiments des commentaires YouTube
- [ ] Notifications sur des mots‑clés suivis
- [ ] Export de rapports (PDF, CSV)

---

## 🤝 Contribution

Les contributions sont bienvenues !  
Merci de suivre les étapes classiques : fork, branche, PR.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Créé avec ❤️ par l’équipe PulseScope** — *Parce que chaque tendance mérite d’être découverte.*
```